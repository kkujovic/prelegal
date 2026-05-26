import json
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from chat import ChatRequest, ChatResponse, chat_completion
from database import init_db

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


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/catalog")
def catalog():
    return _catalog


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        return chat_completion(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    # API routes above must be defined before this catch-all static mount
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")
