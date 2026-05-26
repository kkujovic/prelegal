import json
import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from auth import create_token, get_current_user, hash_password, verify_password
from chat import ChatRequest, ChatResponse, chat_completion
from database import (
    create_document,
    get_document,
    get_user_documents,
    init_db,
    update_document_fields,
)
from document_configs import get_config

ROOT = Path(__file__).parent.parent
_catalog: list = []

load_dotenv(ROOT / ".env")


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _catalog
    init_db()
    with open(ROOT / "catalog.json") as f:
        _catalog = json.load(f)
    yield


app = FastAPI(lifespan=lifespan)


# ── Auth endpoints ─────────────────────────────────────────────────────────────

class AuthRequest(BaseModel):
    email: str
    password: str


@app.post("/api/auth/signup")
def signup(req: AuthRequest):
    from database import get_connection
    try:
        with get_connection() as conn:
            cursor = conn.execute(
                "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                (req.email.lower().strip(), hash_password(req.password)),
            )
            conn.commit()
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    token = create_token(user_id, req.email.lower().strip())
    return {"token": token, "email": req.email.lower().strip()}


@app.post("/api/auth/signin")
def signin(req: AuthRequest):
    from database import get_connection
    row = get_connection().execute(
        "SELECT id, email, password_hash FROM users WHERE email = ?",
        (req.email.lower().strip(),),
    ).fetchone()
    if not row or not verify_password(req.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_token(row["id"], row["email"])
    return {"token": token, "email": row["email"]}


@app.get("/api/auth/me")
def me(current_user: Annotated[dict, Depends(get_current_user)]):
    return {"id": int(current_user["sub"]), "email": current_user["email"]}


# ── Document endpoints ─────────────────────────────────────────────────────────

class CreateDocumentRequest(BaseModel):
    document_type: str


@app.get("/api/documents")
def list_documents(current_user: Annotated[dict, Depends(get_current_user)]):
    docs = get_user_documents(int(current_user["sub"]))
    for doc in docs:
        doc["fields"] = json.loads(doc.pop("fields_json"))
    return docs


@app.post("/api/documents")
def create_doc(req: CreateDocumentRequest, current_user: Annotated[dict, Depends(get_current_user)]):
    doc_id = create_document(int(current_user["sub"]), req.document_type)
    return {"id": doc_id, "document_type": req.document_type}


@app.get("/api/documents/{document_id}")
def get_doc(document_id: int, current_user: Annotated[dict, Depends(get_current_user)]):
    doc = get_document(document_id, int(current_user["sub"]))
    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found.")
    doc["fields"] = json.loads(doc.pop("fields_json"))
    return doc


# ── Chat endpoint ──────────────────────────────────────────────────────────────

class ChatAPIRequest(ChatRequest):
    document_id: int | None = None


@app.post("/api/chat", response_model=ChatResponse)
def chat(
    request: ChatAPIRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    try:
        result = chat_completion(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if request.document_id:
        update_document_fields(
            request.document_id,
            int(current_user["sub"]),
            result.updated_fields,
        )
    return result


# ── Catalog / fields endpoints (public) ───────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/catalog")
def catalog():
    return _catalog


@app.get("/api/fields/{document_type:path}")
def fields(document_type: str):
    config = get_config(document_type)
    if config is None:
        raise HTTPException(status_code=404, detail=f"Unknown document type: {document_type}")
    return [
        {"key": f.key, "label": f.label, "description": f.description, "default": f.default}
        for f in config.fields
    ]


# ── Static frontend (production) ──────────────────────────────────────────────

static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")
