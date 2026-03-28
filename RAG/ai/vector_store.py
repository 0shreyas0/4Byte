from __future__ import annotations

from pathlib import Path
from threading import Lock
from typing import Any

import chromadb

from ai.embedder import embed_text

CHROMA_PATH = Path(__file__).resolve().parent.parent / "data" / "chroma_db"
COLLECTION_NAME = "compiler_errors"

_client: chromadb.PersistentClient | None = None
_collection = None
_lock = Lock()


def initialize_db():
    global _client, _collection
    with _lock:
        if _client is None:
            CHROMA_PATH.mkdir(parents=True, exist_ok=True)
            _client = chromadb.PersistentClient(path=str(CHROMA_PATH))
        if _collection is None:
            _collection = _client.get_or_create_collection(name=COLLECTION_NAME)
    return _collection


def add_document(doc_id: str, text: str, metadata: dict[str, Any]):
    collection = initialize_db()
    existing = collection.get(ids=[doc_id], include=[])
    if existing.get("ids"):
        return False

    collection.add(
        ids=[doc_id],
        documents=[text],
        metadatas=[metadata],
        embeddings=[embed_text(text)],
    )
    return True


def query_similar(text: str, top_k: int = 3) -> dict[str, Any]:
    collection = initialize_db()
    count = collection.count()
    if count == 0:
        return {"documents": [[]], "metadatas": [[]], "distances": [[]]}

    return collection.query(
        query_embeddings=[embed_text(text)],
        n_results=min(top_k, count),
        include=["documents", "metadatas", "distances"],
    )
