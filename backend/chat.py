import json
import os
from typing import Literal

from litellm import completion
from pydantic import BaseModel

from document_configs import get_config, SUPPORTED_DOCUMENT_NAMES

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT_TEMPLATE = """You are a friendly legal assistant helping users create a {doc_name}.

Your job is to collect ALL the information needed to fill in the agreement through natural conversation.
Ask one or two questions at a time. Be concise and helpful. Explain what each field means when asked.

Fields to collect:
{field_list}

Rules:
- You MUST keep asking questions until EVERY field above has a value provided by the user. Do not stop early.
- Fields that have default values (e.g. dates, durations) still need to be confirmed with the user — ask them
  to confirm or change each default. Do not assume defaults are acceptable without asking.
- After each user response, look at the current document data below, identify every field that is still
  empty or still has an unconfirmed default, and ask about those next.
- Only once EVERY field has been explicitly answered or confirmed by the user should you wrap up.
  At that point, confirm the completed document and offer to make any changes.
- Always populate updated_fields with ALL known values including previously collected fields. Never lose data.

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
