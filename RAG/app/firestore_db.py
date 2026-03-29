"""
Firebase Firestore integration for structured user data.

Stores / reads:
  - User profile metadata (name, created_at, last_seen)
  - Domain scores (per-domain quiz/coding scores)
  - Progress tracking (topics completed, streak, total_xp)

This complements the vector memory store (ChromaDB) which holds
semantic/qualitative insights about the learner.

SETUP:
  1. Download your Firebase service account JSON from the Firebase Console:
     Project Settings → Service Accounts → Generate new private key
  2. Set the env var:  FIREBASE_CREDENTIALS=/path/to/serviceAccount.json
  3. pip install firebase-admin  (already in requirements.txt)

If credentials are not configured, all functions degrade gracefully with
a logged warning and return safe defaults — the rest of the system keeps
working without Firestore.
"""

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)

# ── Lazy init so app starts even without credentials configured ───────────────
_db = None
_init_attempted = False


def _get_db():
    """Lazy Firestore client — only initialised once, fails gracefully."""
    global _db, _init_attempted
    if _init_attempted:
        return _db
    _init_attempted = True

    creds_path = os.environ.get("FIREBASE_CREDENTIALS")
    if not creds_path:
        logger.warning(
            "FIREBASE_CREDENTIALS env var not set. "
            "Firestore features will be disabled. "
            "Set it to your serviceAccount.json path to enable."
        )
        return None

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            cred = credentials.Certificate(creds_path)
            firebase_admin.initialize_app(cred)

        _db = firestore.client()
        logger.info("Firestore client initialized successfully.")
    except Exception as exc:
        logger.error("Firestore init failed: %s", exc)
        _db = None

    return _db


# ── Helper ────────────────────────────────────────────────────────────────────

def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _safe_ref(user_id: str):
    """Return Firestore document reference or None if DB unavailable."""
    db = _get_db()
    if db is None:
        return None
    return db.collection("users").document(user_id)


# ── User profile ──────────────────────────────────────────────────────────────

def upsert_user_profile(
    user_id: str,
    name: str | None = None,
    email: str | None = None,
    extra: dict[str, Any] | None = None,
) -> bool:
    """
    Create or update top-level user profile document.
    Returns True on success, False if Firestore is unavailable.
    """
    ref = _safe_ref(user_id)
    if ref is None:
        return False

    payload: dict[str, Any] = {"last_seen": _now_iso()}
    if name:
        payload["name"] = name
    if email:
        payload["email"] = email
    if extra:
        payload.update(extra)

    try:
        doc = ref.get()
        if not doc.exists:
            payload["created_at"] = payload["last_seen"]
            payload["total_xp"] = 0
            payload["streak"] = 0
        ref.set(payload, merge=True)
        return True
    except Exception as exc:
        logger.error("upsert_user_profile failed for %s: %s", user_id, exc)
        return False


def get_user_profile(user_id: str) -> dict[str, Any] | None:
    """Return user profile dict or None if not found / unavailable."""
    ref = _safe_ref(user_id)
    if ref is None:
        return None
    try:
        doc = ref.get()
        return doc.to_dict() if doc.exists else None
    except Exception as exc:
        logger.error("get_user_profile failed for %s: %s", user_id, exc)
        return None


# ── Domain scores ─────────────────────────────────────────────────────────────

def update_domain_score(
    user_id: str,
    domain: str,
    score: float,
    total_questions: int,
    correct: int,
) -> bool:
    """
    Upsert a score record under users/{user_id}/scores/{domain}.
    Keeps running average and historical best.
    """
    ref = _safe_ref(user_id)
    if ref is None:
        return False

    score_ref = ref.collection("scores").document(domain)
    try:
        existing = score_ref.get()
        data = existing.to_dict() if existing.exists else {}

        attempts = data.get("attempts", 0) + 1
        prev_avg = data.get("average_score", 0.0)
        new_avg = ((prev_avg * (attempts - 1)) + score) / attempts
        best = max(data.get("best_score", 0.0), score)

        score_ref.set({
            "domain": domain,
            "average_score": round(new_avg, 2),
            "best_score": round(best, 2),
            "latest_score": round(score, 2),
            "total_questions": total_questions,
            "correct": correct,
            "attempts": attempts,
            "last_updated": _now_iso(),
        }, merge=True)
        return True
    except Exception as exc:
        logger.error("update_domain_score failed for %s/%s: %s", user_id, domain, exc)
        return False


def get_domain_scores(user_id: str) -> dict[str, Any]:
    """Return all domain scores for a user as {domain: score_dict}."""
    ref = _safe_ref(user_id)
    if ref is None:
        return {}
    try:
        docs = ref.collection("scores").stream()
        return {doc.id: doc.to_dict() for doc in docs}
    except Exception as exc:
        logger.error("get_domain_scores failed for %s: %s", user_id, exc)
        return {}


# ── Progress tracking ─────────────────────────────────────────────────────────

def mark_topic_complete(user_id: str, domain: str, topic: str, xp_earned: int = 10) -> bool:
    """
    Record a completed topic and award XP.
    Stores under users/{user_id}/progress/{domain}/topics/{topic}
    """
    ref = _safe_ref(user_id)
    if ref is None:
        return False

    try:
        topic_ref = (
            ref.collection("progress")
               .document(domain)
               .collection("topics")
               .document(topic)
        )
        topic_ref.set({
            "topic": topic,
            "domain": domain,
            "completed_at": _now_iso(),
            "xp_earned": xp_earned,
        })

        # Increment global XP on user profile
        ref.set({"total_xp": _firestore_increment(xp_earned)}, merge=True)
        return True
    except Exception as exc:
        logger.error("mark_topic_complete failed for %s: %s", user_id, exc)
        return False


def _firestore_increment(n: int):
    """Return a Firestore server-side INCREMENT sentinel (avoids read-modify-write)."""
    try:
        from google.cloud.firestore_v1 import Increment
        return Increment(n)
    except ImportError:
        return n   # fallback: overwrite (safe for local dev without real credentials)


def get_progress(user_id: str, domain: str) -> list[dict[str, Any]]:
    """Return list of completed topics for a domain."""
    ref = _safe_ref(user_id)
    if ref is None:
        return []
    try:
        docs = (
            ref.collection("progress")
               .document(domain)
               .collection("topics")
               .stream()
        )
        return [doc.to_dict() for doc in docs]
    except Exception as exc:
        logger.error("get_progress failed for %s/%s: %s", user_id, domain, exc)
        return []


# ── Streak management ─────────────────────────────────────────────────────────

def update_streak(user_id: str) -> int:
    """
    Increment streak if user was active yesterday, reset if gap > 1 day.
    Returns the new streak count.
    """
    ref = _safe_ref(user_id)
    if ref is None:
        return 0
    try:
        doc = ref.get()
        data = doc.to_dict() if doc.exists else {}
        last_seen_str = data.get("last_seen")
        streak = data.get("streak", 0)

        now = datetime.now(timezone.utc)
        if last_seen_str:
            last_seen = datetime.fromisoformat(last_seen_str)
            diff_days = (now.date() - last_seen.date()).days
            if diff_days == 1:
                streak += 1
            elif diff_days > 1:
                streak = 1
            # diff_days == 0 → same day, keep streak unchanged
        else:
            streak = 1

        ref.set({"streak": streak, "last_seen": _now_iso()}, merge=True)
        return streak
    except Exception as exc:
        logger.error("update_streak failed for %s: %s", user_id, exc)
        return 0
