import json
import os
from typing import Literal

from litellm import completion
from pydantic import BaseModel

from document_configs import get_config, SUPPORTED_DOCUMENT_NAMES

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT_TEMPLATE = """You are a friendly legal assistant helping users create a {doc_name}.

Your job is to collect the information needed to fill in the agreement through natural conversation.
Ask one or two questions at a time. Be concise and helpful. Explain what each field means when asked.

Fields to collect:
{field_list}

As users provide information, populate updated_fields with ALL known values including previously collected fields.
Unknown fields stay as empty strings. Never lose previously collected data.

If the user asks for a document type you cannot help with, explain that it is not currently supported and offer
the closest available option from this list: {supported_docs}.

Current document data:
{current_fields_json}"""


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    document_type: str
    messages: list[ChatMessage]
    fields: dict[str, str]


class ChatResponse(BaseModel):
    reply: str
    updated_fields: dict[str, str]


def chat_completion(request: ChatRequest) -> ChatResponse:
    config = get_config(request.document_type)
    if config is None:
        return ChatResponse(
            reply=f"I don't have a template for '{request.document_type}'. I can help you with: {', '.join(SUPPORTED_DOCUMENT_NAMES)}. Which would you like?",
            updated_fields=request.fields,
        )

    field_list = "\n".join(
        f"- {f.key}: {f.description}" for f in config.fields
    )
    system = SYSTEM_PROMPT_TEMPLATE.format(
        doc_name=config.name,
        field_list=field_list,
        supported_docs=", ".join(SUPPORTED_DOCUMENT_NAMES),
        current_fields_json=json.dumps(request.fields, indent=2),
    )

    messages = [{"role": "system", "content": system}]
    for msg in request.messages:
        messages.append({"role": msg.role, "content": msg.content})

    response = completion(
        model=MODEL,
        messages=messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=os.environ["OPENROUTER_API_KEY"],
    )
    result = ChatResponse.model_validate_json(response.choices[0].message.content)

    # Merge: keep existing fields for any key the LLM dropped; strip unknown keys.
    valid_keys = {f.key for f in config.fields}
    merged = {**request.fields, **result.updated_fields}
    result.updated_fields = {k: v for k, v in merged.items() if k in valid_keys}
    return result
