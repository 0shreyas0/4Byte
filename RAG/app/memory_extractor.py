"""
Memory extraction layer (Local LLM role in ANTIGRAVITY architecture).

After the main LLM generates a response, this module:
  1. Asks Ollama to detect any new learnable insight in the exchange.
  2. Parses structured MEMORY_UPDATE blocks from the LLM output.
  3. Stores confirmed memories into the typed ChromaDB memory store.

The local LLM call is intentionally lightweight — it only needs to
decide: "Did we learn something new about this user? If so, what?"
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import Any

import ollama

from app.memory_store import Memory, MemoryType, store_memory

logger = logging.getLogger(__name__)

OLLAMA_MODEL = "llama3"

# ── Data classes ──────────────────────────────────────────────────────────────

@dataclass
class MemoryUpdate:
    mem_type: MemoryType
    domain: str
    topic: str
    content: str


# ── Extraction helpers ────────────────────────────────────────────────────────

_TYPE_PATTERN = re.compile(r"(?i)type\s*:\s*(weakness|strength|preference)")
_DOMAIN_PATTERN = re.compile(r"(?i)domain\s*:\s*(.+)")
_TOPIC_PATTERN = re.compile(r"(?i)topic\s*:\s*(.+)")
_CONTENT_PATTERN = re.compile(r"(?i)content\s*:\s*(.+)")


def _parse_memory_blocks(text: str) -> list[MemoryUpdate]:
    """
    Parse one or more MEMORY_UPDATE blocks from an LLM response.

    Expected format (flexible — handles missing bullets / extra whitespace):

        MEMORY_UPDATE:
        - type: weakness
        - domain: Python
        - topic: loops
        - content: User struggles with off-by-one errors in for loops.
    """
    updates: list[MemoryUpdate] = []

    # Split on MEMORY_UPDATE marker so each block is processed independently
    blocks = re.split(r"(?i)MEMORY_UPDATE\s*:?", text)
    for block in blocks[1:]:          # skip everything before the first marker
        # Grab the next 8 lines to avoid consuming unrelated content
        chunk_lines = block.strip().splitlines()[:8]
        chunk = "\n".join(chunk_lines)

        t_match = _TYPE_PATTERN.search(chunk)
        d_match = _DOMAIN_PATTERN.search(chunk)
        top_match = _TOPIC_PATTERN.search(chunk)
        c_match = _CONTENT_PATTERN.search(chunk)

        if not (t_match and d_match and top_match and c_match):
            logger.debug("Incomplete MEMORY_UPDATE block, skipping: %s", chunk[:120])
            continue

        raw_type = t_match.group(1).strip().lower()
        if raw_type not in ("weakness", "strength", "preference"):
            raw_type = "weakness"

        updates.append(MemoryUpdate(
            mem_type=raw_type,          # type: ignore[arg-type]
            domain=d_match.group(1).strip(),
            topic=top_match.group(1).strip(),
            content=c_match.group(1).strip(),
        ))

    return updates


# ── LLM-assisted memory extraction ───────────────────────────────────────────

_EXTRACTION_PROMPT_TMPL = """\
You are a memory extraction module in an AI tutoring system.

Read the following student-tutor exchange and determine whether it reveals
a NEW, meaningful insight about the student's learning (a weakness, strength,
or preference). If yes, output ONE MEMORY_UPDATE block. If no, output nothing.

--- EXCHANGE ---
User query: {query}
Tutor answer (excerpt): {answer_excerpt}

--- OUTPUT RULES ---
* Only output if there is a clear, specific, non-trivial insight.
* Do NOT store "user asked a question about X" — that is too generic.
* GOOD: "User confuses list indexing with dictionary key lookup."
* BAD:  "User asked about lists."

If you decide to output a memory, use EXACTLY this format:

MEMORY_UPDATE:
- type: weakness | strength | preference
- domain: <domain name, e.g. Python / DSA / C++>
- topic: <specific topic, e.g. loops / recursion / pointers>
- content: <one clear sentence describing the insight>

Otherwise output: NO_UPDATE
"""


def extract_memories_from_exchange(
    user_id: str,
    query: str,
    answer: str,
) -> list[Memory]:
    """
    Ask the local LLM to decide if the exchange reveals new user insights.

    Returns a list of Memory objects that were successfully stored.
    """
    prompt = _EXTRACTION_PROMPT_TMPL.format(
        query=query,
        answer_excerpt=answer[:800],          # cap to avoid huge prompts
    )

    try:
        resp = ollama.generate(
            model=OLLAMA_MODEL,
            prompt=prompt,
            options={"temperature": 0.2, "top_p": 0.85},
        )
        raw = resp.get("response", "")
        logger.debug("Memory extractor raw output: %s", raw[:300])
    except Exception as exc:
        logger.warning("Memory extraction LLM call failed: %s", exc)
        return []

    if "NO_UPDATE" in raw.upper():
        return []

    updates = _parse_memory_blocks(raw)
    stored_memories: list[Memory] = []

    for upd in updates:
        inserted, mem_id = store_memory(
            user_id=user_id,
            domain=upd.domain,
            topic=upd.topic,
            mem_type=upd.mem_type,
            content=upd.content,
        )
        if inserted:
            stored_memories.append(Memory(
                memory_id=mem_id,
                user_id=user_id,
                domain=upd.domain,
                topic=upd.topic,
                type=upd.mem_type,
                content=upd.content,
            ))
            logger.info("New memory stored: [%s] %s — %s", upd.mem_type, upd.topic, upd.content)

    return stored_memories


# ── Inline parser (used when main LLM already emits MEMORY_UPDATE) ──────────

def process_inline_memory_updates(
    user_id: str,
    llm_response_text: str,
) -> list[Memory]:
    """
    Parse and store MEMORY_UPDATE blocks that appear inside the main LLM
    response (the main model can emit them directly per the system prompt).

    Returns list of newly-stored Memory objects.
    """
    updates = _parse_memory_blocks(llm_response_text)
    stored: list[Memory] = []

    for upd in updates:
        inserted, mem_id = store_memory(
            user_id=user_id,
            domain=upd.domain,
            topic=upd.topic,
            mem_type=upd.mem_type,
            content=upd.content,
        )
        if inserted:
            stored.append(Memory(
                memory_id=mem_id,
                user_id=user_id,
                domain=upd.domain,
                topic=upd.topic,
                type=upd.mem_type,
                content=upd.content,
            ))

    return stored
