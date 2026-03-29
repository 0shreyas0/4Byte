"""
Per-user typed memory store (ChromaDB).

Each memory is a single distilled insight with metadata:
  - user_id   : stable learner identifier
  - domain    : e.g. "DSA", "Python", "C++"
  - topic     : e.g. "loops", "dictionaries", "pointers"
  - type      : "weakness" | "strength" | "preference"
  - content   : one clear descriptive sentence

The collection is separate from the error-knowledge RAG so that
user memories never contaminate the general knowledge base.
"""

from __future__ import annotations

import hashlib
import logging
from dataclasses import dataclass
from pathlib import Path
from threading import RLock
from typing import Any, Literal

import chromadb
from chromadb.utils import embedding_functions

logger = logging.getLogger(__name__)

# ── Config ──────────────────────────────────────────────────────────────────
EMBEDDING_MODEL = "all-MiniLM-L6-v2"          # same model for consistent space
MEMORY_COLLECTION = "user_memories"
MEMORY_CHROMA_DIR = Path(__file__).resolve().parent.parent / "data" / "memory_chroma"

MemoryType = Literal["weakness", "strength", "preference"]

# ── Singletons ───────────────────────────────────────────────────────────────
_lock = RLock()
_client: chromadb.PersistentClient | None = None
_collection = None
_embed_fn = None


def _get_embed_fn():
    global _embed_fn
    with _lock:
        if _embed_fn is None:
            _embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name=EMBEDDING_MODEL
            )
        return _embed_fn


def _get_collection():
    global _client, _collection
    with _lock:
        if _client is None:
            MEMORY_CHROMA_DIR.mkdir(parents=True, exist_ok=True)
            _client = chromadb.PersistentClient(path=str(MEMORY_CHROMA_DIR))
        if _collection is None:
            _collection = _client.get_or_create_collection(
                name=MEMORY_COLLECTION,
                embedding_function=_get_embed_fn(),
                metadata={"description": "Per-user adaptive learning memories"},
            )
        return _collection


# ── Public API ────────────────────────────────────────────────────────────────

@dataclass
class Memory:
    memory_id: str
    user_id: str
    domain: str
    topic: str
    type: MemoryType
    content: str
    distance: float | None = None


def _make_id(user_id: str, domain: str, topic: str, mem_type: str, content: str) -> str:
    """
    Deterministic ID so re-inserting the same memory is a no-op.
    Built from user + domain + topic + type + first-80-chars of content.
    """
    raw = f"{user_id}::{domain}::{topic}::{mem_type}::{content[:80]}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


def store_memory(
    user_id: str,
    domain: str,
    topic: str,
    mem_type: MemoryType,
    content: str,
) -> tuple[bool, str]:
    """
    Insert a memory if it doesn't already exist (content-addressed dedup).

    Returns (inserted: bool, memory_id: str).
    """
    doc_id = _make_id(user_id, domain, topic, mem_type, content)
    col = _get_collection()

    with _lock:
        existing = col.get(ids=[doc_id], include=[])
        if existing.get("ids"):
            logger.debug("Memory already exists, skipping: %s", doc_id)
            return False, doc_id

        col.add(
            ids=[doc_id],
            documents=[content],
            metadatas=[{
                "user_id": user_id,
                "domain": domain,
                "topic": topic,
                "type": mem_type,
            }],
        )
        logger.info("Stored new memory [%s] for user=%s domain=%s topic=%s", mem_type, user_id, domain, topic)
        return True, doc_id


def retrieve_memories(
    user_id: str,
    query: str,
    domain: str | None = None,
    topic: str | None = None,
    mem_type: MemoryType | None = None,
    k: int = 6,
) -> list[Memory]:
    """
    Semantic retrieval of a user's memories filtered by metadata.

    All filters are ANDed together via ChromaDB $and logic.
    """
    col = _get_collection()

    # Build $and / simple where clause
    conditions: list[dict[str, Any]] = [{"user_id": {"$eq": user_id}}]
    if domain:
        conditions.append({"domain": {"$eq": domain}})
    if topic:
        conditions.append({"topic": {"$eq": topic}})
    if mem_type:
        conditions.append({"type": {"$eq": mem_type}})

    where: dict[str, Any] = (
        {"$and": conditions} if len(conditions) > 1 else conditions[0]
    )

    # Guard: ChromaDB raises if collection is empty
    with _lock:
        count = col.count()
        if count == 0:
            return []

        try:
            res = col.query(
                query_texts=[query],
                n_results=min(k, count),
                where=where,
                include=["documents", "distances", "metadatas"],
            )
        except Exception as exc:
            logger.warning("Memory retrieve failed: %s", exc)
            return []

    memories: list[Memory] = []
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    dists = res.get("distances", [[]])[0]

    for i, doc in enumerate(docs):
        meta = metas[i] if i < len(metas) else {}
        dist = float(dists[i]) if i < len(dists) else None
        memories.append(Memory(
            memory_id=res["ids"][0][i] if res.get("ids") else "",
            user_id=meta.get("user_id", user_id),
            domain=meta.get("domain", ""),
            topic=meta.get("topic", ""),
            type=meta.get("type", "weakness"),
            content=doc,
            distance=dist,
        ))

    return memories


def get_all_memories(user_id: str) -> list[Memory]:
    """Fetch every memory stored for a user (no semantic ranking)."""
    col = _get_collection()

    with _lock:
        count = col.count()
        if count == 0:
            return []
        try:
            res = col.get(
                where={"user_id": {"$eq": user_id}},
                include=["documents", "metadatas"],
            )
        except Exception as exc:
            logger.warning("get_all_memories failed: %s", exc)
            return []

    memories: list[Memory] = []
    for i, doc in enumerate(res.get("documents", [])):
        meta = res["metadatas"][i] if res.get("metadatas") else {}
        memories.append(Memory(
            memory_id=res["ids"][i] if res.get("ids") else "",
            user_id=meta.get("user_id", user_id),
            domain=meta.get("domain", ""),
            topic=meta.get("topic", ""),
            type=meta.get("type", "weakness"),
            content=doc,
        ))
    return memories


def summarize_memories_as_context(memories: list[Memory]) -> str:
    """
    Flatten a list of memories into a compact context string for the main LLM.
    Groups by type for readability.
    """
    if not memories:
        return "No prior user memory found."

    groups: dict[str, list[str]] = {"weakness": [], "strength": [], "preference": []}
    for m in memories:
        groups.get(m.type, groups["weakness"]).append(
            f"[{m.domain}/{m.topic}] {m.content}"
        )

    lines: list[str] = []
    if groups["weakness"]:
        lines.append("Known weaknesses:")
        lines.extend(f"  - {w}" for w in groups["weakness"])
    if groups["strength"]:
        lines.append("Known strengths:")
        lines.extend(f"  - {s}" for s in groups["strength"])
    if groups["preference"]:
        lines.append("Learning preferences:")
        lines.extend(f"  - {p}" for p in groups["preference"])

    return "\n".join(lines)
