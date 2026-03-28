"""
Derive weak-topic lists and common error summaries from SQLite history.

Heuristics are intentionally simple and transparent — tune thresholds for your product.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.db import ErrorHistory, get_session_factory


def get_topic_counts(session: Session, user_id: str) -> dict[str, int]:
    rows = session.execute(
        select(ErrorHistory.mapped_topic, func.count().label("c"))
        .where(ErrorHistory.user_id == user_id, ErrorHistory.mapped_topic.isnot(None))
        .group_by(ErrorHistory.mapped_topic)
    ).all()
    return {str(r[0]): int(r[1]) for r in rows if r[0]}


def get_error_type_counts(session: Session, user_id: str) -> dict[str, int]:
    rows = session.execute(
        select(ErrorHistory.error_type, func.count().label("c"))
        .where(ErrorHistory.user_id == user_id)
        .group_by(ErrorHistory.error_type)
    ).all()
    return {str(r[0]): int(r[1]) for r in rows}


def last_error_time(session: Session, user_id: str) -> datetime | None:
    row = session.execute(
        select(ErrorHistory.created_at)
        .where(ErrorHistory.user_id == user_id)
        .order_by(desc(ErrorHistory.created_at))
        .limit(1)
    ).scalar_one_or_none()
    return row


def compute_weak_topics(topic_counts: dict[str, int], min_events: int = 3) -> list[str]:
    """
    Topics that appear often relative to this learner's history.

    Heuristic: any topic with at least `min_events` occurrences, sorted by count desc.
    If total is small, still surface the top topics that repeat at least twice.
    """
    if not topic_counts:
        return []

    total = sum(topic_counts.values())
    items = sorted(topic_counts.items(), key=lambda x: -x[1])

    # Adaptive threshold: repeat mistakes matter more than absolute floor
    weak: list[str] = []
    for topic, count in items:
        if count >= min_events:
            weak.append(topic)
        elif count >= 2 and total <= 5:
            weak.append(topic)

    # Cap list for tutoring focus
    return weak[:5]


def compute_common_errors(session: Session, user_id: str, limit: int = 5) -> list[str]:
    """
    Human-readable strings for frequent error types (with short message samples).
    """
    cnt = func.count().label("cnt")
    stmt = (
        select(ErrorHistory.error_type, ErrorHistory.error_message, cnt)
        .where(ErrorHistory.user_id == user_id)
        .group_by(ErrorHistory.error_type, ErrorHistory.error_message)
        .order_by(desc(cnt))
        .limit(limit)
    )
    rows = session.execute(stmt).all()
    out: list[str] = []
    for et, msg, c in rows:
        short = (msg or "").split("\n")[0][:120]
        out.append(f"{et}: {short} (×{c})")
    return out


def total_errors(session: Session, user_id: str) -> int:
    n = session.execute(
        select(func.count(ErrorHistory.id)).where(ErrorHistory.user_id == user_id)
    ).scalar_one()
    return int(n or 0)
