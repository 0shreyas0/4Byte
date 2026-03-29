"""
/chat endpoint: full ANTIGRAVITY conversational pipeline.

Flow:
  1. Retrieve relevant user memories from ChromaDB (vector DB)
  2. Local LLM (Ollama) compresses memories → User Context string
  3. Main LLM (Ollama llama3 acting as primary intelligence) generates answer
     using the compressed User Context + system persona
  4. Parse any inline MEMORY_UPDATE blocks from the answer
  5. Also run the local LLM memory extractor on the exchange
  6. Return answer, new memories, and context used

All five items from the ANTIGRAVITY system prompt are wired here.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import Any

import ollama

from app.memory_store import Memory, retrieve_memories, summarize_memories_as_context
from app.memory_extractor import (
    extract_memories_from_exchange,
    process_inline_memory_updates,
)

logger = logging.getLogger(__name__)

LOCAL_LLM_MODEL = "llama3"   # Ollama local model (context compression + extraction)
MAIN_LLM_MODEL  = "llama3"   # Swap to groq/openai client here when ready


# ── Context compression (local LLM role) ─────────────────────────────────────

_COMPRESS_PROMPT = """\
You are a context compression module. You receive raw memory snippets about a student.
Compress them into a short, dense paragraph (max 120 words) that a tutor can read
instantly to adapt their teaching style.

Focus on:
- What topics the student struggles with
- What they're good at
- How they prefer to learn

Raw memories:
{raw_memories}

Write ONLY the compressed paragraph. No headers, no bullets, no extra text.
"""


def compress_context(memories: list[Memory]) -> str:
    """
    Use local LLM to compress a list of memories into a dense User Context string.
    Falls back to rule-based summary if LLM is unavailable.
    """
    if not memories:
        return "No prior user memory found."

    flat = summarize_memories_as_context(memories)

    try:
        resp = ollama.generate(
            model=LOCAL_LLM_MODEL,
            prompt=_COMPRESS_PROMPT.format(raw_memories=flat),
            options={"temperature": 0.3, "num_predict": 180},
        )
        compressed = resp.get("response", "").strip()
        if compressed:
            return compressed
    except Exception as exc:
        logger.warning("Context compression LLM failed, using rule-based: %s", exc)

    # Fallback: rule-based flatten
    return flat


# ── Main LLM system prompt (ANTIGRAVITY primary intelligence) ─────────────────

_ANTIGRAVITY_SYSTEM = """\
You are the PRIMARY INTELLIGENCE in a hybrid AI tutoring system called ANTIGRAVITY.

CRITICAL BEHAVIOR RULES:
1. CONTEXT USAGE: Always use User Context to personalize your response. Do NOT ignore it. Do NOT hallucinate extra user traits.
2. ADAPTIVE RESPONSE:
   - If user shows weakness → explain step-by-step, simple, clear
   - If user shows strength → be concise and slightly challenging
   - If preference detected → match that style
3. PRECISION: No fluff. No generic explanations. Focus on actual learning improvement.
4. FOCUS: Stay relevant to the query. Do not mix unrelated domains/topics.

MEMORY UPDATE RULE:
After your answer, if you learned something NEW and useful about the user, append:

MEMORY_UPDATE:
- type: weakness | strength | preference
- domain: <domain>
- topic: <topic>
- content: <single clear sentence>

If NO new insight → output NOTHING after your answer.

GOOD MEMORY: "User struggles with loop termination conditions"
BAD MEMORY:  "User asked a question about loops"
"""

_ANTIGRAVITY_USER_TMPL = """\
User Query:
{query}

User Context:
{context}
"""


# ── Chat pipeline ───────────────────────────────────────────────────────────

@dataclass
class ChatResponse:
    answer: str                          # clean answer (memory blocks stripped)
    user_context_used: str               # compressed context passed to LLM
    new_memories: list[dict[str, Any]]   # memories stored during this turn
    domain: str | None
    topic: str | None


def _strip_memory_blocks(text: str) -> str:
    """Remove MEMORY_UPDATE blocks from the answer shown to the user."""
    return re.sub(
        r"MEMORY_UPDATE\s*:?.*?(?=MEMORY_UPDATE|$)",
        "",
        text,
        flags=re.DOTALL | re.IGNORECASE,
    ).strip()


def run_chat(
    user_id: str,
    query: str,
    domain: str | None = None,
    topic: str | None = None,
) -> ChatResponse:
    """
    Full ANTIGRAVITY chat pipeline.

    Steps:
      1. Retrieve user memories (filtered by domain/topic if given)
      2. Compress memories → User Context (local LLM)
      3. Generate adaptive answer (main LLM)
      4. Parse inline MEMORY_UPDATE blocks
      5. Run local LLM memory extractor for any missed patterns
      6. Return clean answer + metadata
    """

    # ── 1. Retrieve memories ────────────────────────────────────────────────
    memories = retrieve_memories(
        user_id=user_id,
        query=query,
        domain=domain,
        topic=topic,
        k=8,
    )
    logger.info("Retrieved %d memories for user=%s", len(memories), user_id)

    # ── 2. Compress context ─────────────────────────────────────────────────
    compressed_context = compress_context(memories)
    logger.info("Compressed context (%d chars): %s...", len(compressed_context), compressed_context[:80])

    # ── 3. Main LLM generates answer ────────────────────────────────────────
    full_prompt = (
        _ANTIGRAVITY_SYSTEM
        + "\n\n"
        + _ANTIGRAVITY_USER_TMPL.format(query=query, context=compressed_context)
    )

    try:
        resp = ollama.generate(
            model=MAIN_LLM_MODEL,
            prompt=full_prompt,
            options={"temperature": 0.6, "top_p": 0.92, "num_predict": 700},
        )
        raw_answer = resp.get("response", "").strip()
    except Exception as exc:
        logger.error("Main LLM generation failed: %s", exc)
        raw_answer = (
            "I'm having trouble reaching the AI model right now. "
            "Please try again in a moment."
        )

    # ── 4. Parse inline MEMORY_UPDATE blocks ────────────────────────────────
    inline_memories = process_inline_memory_updates(user_id, raw_answer)

    # ── 5. Local LLM memory extractor (catches patterns main LLM missed) ───
    clean_answer = _strip_memory_blocks(raw_answer)
    extracted_memories = extract_memories_from_exchange(user_id, query, clean_answer)

    # Merge (avoid duplicates — both share same store_memory dedup logic)
    all_new: list[dict[str, Any]] = [
        {
            "memory_id": m.memory_id,
            "type": m.type,
            "domain": m.domain,
            "topic": m.topic,
            "content": m.content,
        }
        for m in (inline_memories + extracted_memories)
    ]

    return ChatResponse(
        answer=clean_answer,
        user_context_used=compressed_context,
        new_memories=all_new,
        domain=domain,
        topic=topic,
    )
