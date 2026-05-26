import os
from typing import Literal

from litellm import completion
from pydantic import BaseModel

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a friendly legal assistant helping users create a Mutual Non-Disclosure Agreement (MNDA).

Your job is to collect the information needed to fill in the agreement through natural conversation.
Ask one or two questions at a time. Be concise and helpful. Explain what each field means when asked.

Fields to collect:
- purpose: How the parties intend to use each other's confidential information
- effectiveDate: When the agreement starts (YYYY-MM-DD format; suggest today if not specified)
- mndaTermType: "fixed" (expires after N years) or "indefinite" (continues until terminated)
- mndaTermYears: Number of years (1-10) if mndaTermType is "fixed"
- confidentialityTermType: "fixed" (protected for N years) or "perpetual" (protected forever)
- confidentialityTermYears: Number of years (1-10) if confidentialityTermType is "fixed"
- governingLaw: The US state whose laws govern the agreement (e.g. "Delaware")
- jurisdiction: The courts where disputes are resolved (e.g. "courts in New Castle County, Delaware")
- party1Company, party1Name, party1Title, party1Contact: First party's details
- party2Company, party2Name, party2Title, party2Contact: Second party's details

As users provide information, populate the updated_data with ALL known values including previously collected fields.
Unknown fields stay as empty strings or their defaults. Never lose previously collected data."""


class NDAData(BaseModel):
    purpose: str = "Evaluating whether to enter into a business relationship with the other party."
    effectiveDate: str = ""
    mndaTermType: Literal["fixed", "indefinite"] = "fixed"
    mndaTermYears: str = "1"
    confidentialityTermType: Literal["fixed", "perpetual"] = "fixed"
    confidentialityTermYears: str = "1"
    governingLaw: str = ""
    jurisdiction: str = ""
    party1Company: str = ""
    party1Name: str = ""
    party1Title: str = ""
    party1Contact: str = ""
    party2Company: str = ""
    party2Name: str = ""
    party2Title: str = ""
    party2Contact: str = ""


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_data: NDAData


class ChatResponse(BaseModel):
    reply: str
    updated_data: NDAData


def chat_completion(request: ChatRequest) -> ChatResponse:
    current_json = request.current_data.model_dump_json(indent=2)
    system = f"{SYSTEM_PROMPT}\n\nCurrent NDA data:\n{current_json}"

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
    return ChatResponse.model_validate_json(response.choices[0].message.content)
