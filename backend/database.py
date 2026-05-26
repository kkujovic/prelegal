import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "prelegal.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                document_type TEXT NOT NULL,
                fields_json TEXT NOT NULL DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        conn.commit()


def create_document(user_id: int, document_type: str) -> int:
    with get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO documents (user_id, document_type) VALUES (?, ?)",
            (user_id, document_type),
        )
        conn.commit()
        return cursor.lastrowid


def update_document_fields(document_id: int, user_id: int, fields: dict) -> None:
    with get_connection() as conn:
        conn.execute(
            """UPDATE documents SET fields_json = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ? AND user_id = ?""",
            (json.dumps(fields), document_id, user_id),
        )
        conn.commit()


def get_user_documents(user_id: int) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            """SELECT id, document_type, fields_json, created_at, updated_at
               FROM documents WHERE user_id = ? ORDER BY updated_at DESC""",
            (user_id,),
        ).fetchall()
        return [dict(r) for r in rows]


def get_document(document_id: int, user_id: int) -> dict | None:
    with get_connection() as conn:
        row = conn.execute(
            """SELECT id, document_type, fields_json, created_at, updated_at
               FROM documents WHERE id = ? AND user_id = ?""",
            (document_id, user_id),
        ).fetchone()
        return dict(row) if row else None
