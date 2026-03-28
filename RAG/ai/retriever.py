from __future__ import annotations

from typing import Any

from ai.vector_store import query_similar

FALLBACK_EXPLANATION = {
    "meaning": "Python found an error, but the knowledge base does not have a close match yet.",
    "why": "This usually happens when the database is empty or the current error pattern is uncommon.",
    "fix": "Read the exact error line carefully, fix one small issue, and run the checker again.",
    "example": "Example: check the line mentioned by Python and compare it with a working version.",
}


def build_query(error_type: str, error_message: str, faulty_line: str | None) -> str:
    line = faulty_line or ""
    return f"Python {error_type} {error_message} in line: {line}".strip()


def retrieve_error_docs(
    error_type: str,
    error_message: str,
    faulty_line: str | None,
) -> list[dict[str, Any]]:
    query = build_query(error_type, error_message, faulty_line)
    results = query_similar(query, top_k=3)

    documents = results.get("documents", [[]])
    metadatas = results.get("metadatas", [[]])

    if not documents or not documents[0]:
        return []

    output: list[dict[str, Any]] = []
    for index, text in enumerate(documents[0]):
        metadata = {}
        if metadatas and metadatas[0] and index < len(metadatas[0]):
            metadata = metadatas[0][index] or {}
        output.append({"text": text, "metadata": metadata})

    return output


def _extract_field(text: str, field_name: str) -> str:
    lines = text.splitlines()
    prefix = f"{field_name}:"
    field_lines: list[str] = []
    capturing = False

    for line in lines:
        if line.startswith(prefix):
            field_lines.append(line[len(prefix):].strip())
            capturing = True
            continue
        if capturing:
            if ": " in line and line.split(": ", 1)[0] in {
                "Language",
                "Error Type",
                "Pattern",
                "Topic",
                "Meaning",
                "Why",
                "Fix",
                "Wrong Example",
                "Correct Example",
            }:
                break
            field_lines.append(line.rstrip())

    return "\n".join(field_lines).strip()


def _extract_explanation_from_doc(text: str) -> dict[str, str]:
    correct_example = _extract_field(text, "Correct Example")
    return {
        "meaning": _extract_field(text, "Meaning") or FALLBACK_EXPLANATION["meaning"],
        "why": _extract_field(text, "Why") or FALLBACK_EXPLANATION["why"],
        "fix": _extract_field(text, "Fix") or FALLBACK_EXPLANATION["fix"],
        "example": correct_example or FALLBACK_EXPLANATION["example"],
    }


def get_rag_explanation(
    error_type: str,
    error_message: str,
    faulty_line: str | None,
) -> dict[str, Any]:
    docs = retrieve_error_docs(error_type, error_message, faulty_line)
    if not docs:
        return {
            "documents": [],
            "explanation": FALLBACK_EXPLANATION,
        }

    return {
        "documents": docs,
        "explanation": _extract_explanation_from_doc(docs[0]["text"]),
    }
