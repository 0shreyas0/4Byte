"""
ChromaDB vector store + sentence-transformers embeddings.

Uses deterministic document IDs in seeding to avoid duplicate inserts.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from threading import Lock, RLock
from typing import Any

import chromadb
from chromadb.utils import embedding_functions

# Same model name everywhere so query embeddings match stored vectors.
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
COLLECTION_NAME = "python_error_knowledge"
CHROMA_DIR = Path(__file__).resolve().parent.parent / "data" / "chroma"

# Reentrant: get_collection() calls get_chroma_client() while holding this lock.
_lock = RLock()
_client: chromadb.PersistentClient | None = None
_collection = None
_embedding_fn = None

# Chroma's local persistence is not reliably safe under concurrent writers/readers
# from multiple threads; serialize all access (startup seed + request-time query).
_chroma_ops = Lock()


def _get_embedding_function():
    global _embedding_fn
    with _lock:
        if _embedding_fn is None:
            _embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name=EMBEDDING_MODEL,
            )
        return _embedding_fn


def get_chroma_client() -> chromadb.PersistentClient:
    global _client
    with _lock:
        if _client is None:
            CHROMA_DIR.mkdir(parents=True, exist_ok=True)
            _client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        return _client


def get_collection():
    """Singleton collection with shared embedding function."""
    global _collection
    with _lock:
        if _collection is None:
            client = get_chroma_client()
            _collection = client.get_or_create_collection(
                name=COLLECTION_NAME,
                embedding_function=_get_embedding_function(),
                metadata={"description": "Beginner Python error explainers"},
            )
        return _collection


@dataclass
class RetrievedDoc:
    text: str
    topic: str | None
    distance: float | None


def retrieve_for_error(
    query_text: str,
    mapped_topic: str | None,
    error_type: str | None,
    k: int = 4,
) -> list[RetrievedDoc]:
    """
    Retrieve top-k knowledge chunks similar to the current error description.

    Builds a rich query string so the embedding aligns with pedagogy snippets.
    """
    q_parts = [query_text]
    if mapped_topic:
        q_parts.append(f"topic {mapped_topic}")
    if error_type:
        q_parts.append(error_type)
    query = " ".join(q_parts)

    try:
        with _chroma_ops:
            collection = get_collection()
            res = collection.query(
                query_texts=[query],
                n_results=k,
                include=["documents", "distances", "metadatas"],
            )
    except Exception:
        return []

    docs: list[RetrievedDoc] = []
    if not res.get("documents") or not res["documents"][0]:
        return docs

    for i, doc in enumerate(res["documents"][0]):
        meta = (res.get("metadatas") or [[{}]])[0][i] if res.get("metadatas") else {}
        topic = meta.get("topic") if isinstance(meta, dict) else None
        dist = None
        if res.get("distances") and res["distances"][0]:
            dist = float(res["distances"][0][i])
        docs.append(RetrievedDoc(text=doc or "", topic=topic, distance=dist))

    return docs


def seed_documents(
    ids: list[str],
    documents: list[str],
    metadatas: list[dict[str, Any]] | None = None,
) -> tuple[int, int]:
    """
    Insert seed documents with fixed ids. Skips ids that already exist
    (checked per id so we do not rely on Chroma bulk-get behavior).

    Returns (inserted_count, skipped_count).
    """
    new_ids: list[str] = []
    new_docs: list[str] = []
    new_meta: list[dict[str, Any]] = []
    skipped = 0

    with _chroma_ops:
        collection = get_collection()

        for i, doc_id in enumerate(ids):
            try:
                got = collection.get(ids=[doc_id], include=[])
                if got.get("ids"):
                    skipped += 1
                    continue
            except Exception:
                pass
            new_ids.append(doc_id)
            new_docs.append(documents[i])
            if metadatas:
                new_meta.append(dict(metadatas[i]))

        inserted = 0
        if new_ids:
            kwargs: dict[str, Any] = {"ids": new_ids, "documents": new_docs}
            if new_meta:
                kwargs["metadatas"] = new_meta
            collection.add(**kwargs)
            inserted = len(new_ids)

    return inserted, skipped
