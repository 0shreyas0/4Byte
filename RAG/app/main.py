"""
FastAPI entrypoint: compile endpoint, health, user stats.

Starts SQLite, seeds Chroma if needed, and wires RAG + personalization.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
import os
import sys

# 🔥 Load .env for Groq support
from dotenv import load_dotenv
load_dotenv()

# 🔥🔥🔥 RELOAD INDICATOR - Check your terminal to see if this appears! 🔥🔥🔥
print("\n" + "🚀"*40)
print("🚀🚀🚀 NEURALPATH RAG SERVER V2.0: AI MENTOR ONLINE 🚀🚀🚀")
print("🚀"*40 + "\n", flush=True)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from ai.seed_knowledge import seed_database
from ai.retriever import get_rag_explanation
from app import seed_knowledge
from app.compiler import check_source
from app.db import init_db, record_error
from app.explainer import build_personalized_explanation
from app.models import (
    CompileRequest, CompileResponse,
    UserStatsResponse,
    AnalysisRequest, AnalysisResponse,
    ChatRequest, ChatAPIResponse,
    MemoryStoreRequest, MemoryListResponse, MemoryItem,
    FirestoreProfileRequest, DomainScoreRequest, TopicCompleteRequest,
)
from app.rag import retrieve_for_error
from app.user_profile import (
    compute_common_errors,
    compute_weak_topics,
    get_error_type_counts,
    get_topic_counts,
    last_error_time,
    total_errors,
)
from app.db import get_session_factory
from app.chat_pipeline import run_chat
from app.memory_store import (
    store_memory,
    get_all_memories,
    retrieve_memories,
)
from app.firestore_db import (
    upsert_user_profile,
    get_user_profile,
    update_domain_score,
    get_domain_scores,
    mark_topic_complete,
    get_progress,
    update_streak,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Create SQLite tables and seed Chroma before accepting traffic.

    First boot downloads the embedding model; expect a longer startup once.
    """
    init_db()
    try:
        inserted, skipped = seed_knowledge.run_seed()
        logger.info("Chroma seed: inserted=%s skipped=%s", inserted, skipped)
    except Exception:
        logger.exception("Chroma seed failed (RAG may be empty until fixed)")
    try:
        inserted, skipped = seed_database()
        logger.info("Compiler error RAG seed: inserted=%s skipped=%s", inserted, skipped)
    except Exception:
        logger.exception("Compiler error RAG seed failed")
    yield


app = FastAPI(
    title="Personalized Compiler Error Explainer",
    description="Python MVP with RAG + per-user weak-topic profiles.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Importing this module (e.g. `TestClient` without lifespan context) still needs tables.
init_db()


@app.get("/")
def root():
    """Service info and quick links for humans and health checks."""
    return {
        "service": "Personalized Compiler Error Explainer",
        "status": "ok",
        "mvp_language": "python",
        "endpoints": {
            "compile": "POST /compile",
            "chat": "POST /chat",
            "memory": "GET /memory/{user_id}",
            "user_stats": "GET /user/{user_id}/stats",
            "user_profile": "GET /user/{user_id}/profile",
            "analyze": "POST /analyze/performance",
        },
    }


def _profile_snapshot(user_id: str) -> tuple[list[str], list[str]]:
    """Current weak topics and common error strings for one user."""
    SessionLocal = get_session_factory()
    session = SessionLocal()
    try:
        tc = get_topic_counts(session, user_id)
        weak = compute_weak_topics(tc)
        common = compute_common_errors(session, user_id, limit=5)
        return weak, common
    finally:
        session.close()


@app.post("/compile", response_model=CompileResponse)
def compile_and_explain(req: CompileRequest) -> CompileResponse:
    """
    Check code for the requested language, persist errors, and return tutoring JSON.

    Python uses `compile()` only — user code is never executed here.
    """
    result = check_source(req.language, req.code)

    if result.success:
        weak_topics, common_errors_list = _profile_snapshot(req.user_id)
        return CompileResponse(
            success=True,
            explanation=(
                "Nice! Python could read your code without a syntax error. "
                "If something still behaves wrong when you run the program, you can extend "
                "this project later with a safe runtime checker."
            ),
            suggestions=[
                "Run your script locally when you are ready.",
                "Add print lines to see values while you learn.",
            ],
            rag_explanation={},
            rag_docs=[],
            weak_topics=weak_topics,
            common_errors=common_errors_list,
        )

    try:
        record_error(
            user_id=req.user_id,
            code=req.code,
            language=req.language.value,
            error_type=result.error_type or "Unknown",
            error_message=result.raw_error or "",
            line_number=result.line_number,
            faulty_line=result.faulty_line,
            mapped_topic=result.mapped_topic,
        )
        # 🟢 NEW: Automatic memory saving for the "Secretary"
        if result.error_type and result.mapped_topic:
            store_memory(
                user_id=req.user_id,
                domain=req.language.value,
                topic=result.mapped_topic,
                mem_type="weakness",
                content=f"User triggered a {result.error_type} in {result.mapped_topic}: '{result.raw_error}'",
            )
    except Exception as e:
        logger.exception("Failed to record error history: %s", e)

    weak_topics, common_errors_list = _profile_snapshot(req.user_id)

    query_for_rag = " ".join(
        filter(
            None,
            [
                result.error_type,
                result.raw_error,
                result.mapped_topic,
                result.faulty_line,
            ],
        )
    )
    try:
        retrieved = retrieve_for_error(
            query_for_rag,
            result.mapped_topic,
            result.error_type,
            k=4,
        )
    except Exception as e:
        logger.warning("RAG retrieve failed: %s", e)
        retrieved = []

    rag_docs = get_rag_explanation(
        result.error_type or "UnknownError",
        result.raw_error or "",
        result.faulty_line,
    )

    explanation, suggestions = build_personalized_explanation(
        result,
        retrieved,
        weak_topics,
        common_errors_list,
    )

    return CompileResponse(
        success=False,
        line_number=result.line_number,
        error_type=result.error_type,
        raw_error=result.raw_error,
        faulty_line=result.faulty_line,
        explanation=explanation,
        rag_explanation=rag_docs["explanation"],
        rag_docs=rag_docs["documents"],
        suggestions=suggestions,
        weak_topics=weak_topics,
        common_errors=common_errors_list,
    )


@app.get("/user/{user_id}/stats", response_model=UserStatsResponse)
def user_stats(user_id: str) -> UserStatsResponse:
    """Aggregate error history for dashboards or adaptive hints."""
    if not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id must be non-empty")

    SessionLocal = get_session_factory()
    session = SessionLocal()
    try:
        tc = get_topic_counts(session, user_id)
        etc = get_error_type_counts(session, user_id)
        weak = compute_weak_topics(tc)
        common = compute_common_errors(session, user_id, limit=8)
        n = total_errors(session, user_id)
        last_at = last_error_time(session, user_id)
    finally:
        session.close()

    return UserStatsResponse(
        user_id=user_id,
        total_errors_recorded=n,
        weak_topics=weak,
        common_errors=common,
        topic_counts=tc,
        error_type_counts=etc,
        last_error_at=last_at,
    )


@app.post("/analyze/performance", response_model=AnalysisResponse)
async def analyze_performance_endpoint(req: AnalysisRequest):
    """
    Generate a high-level executive summary and learning path strategy using Ollama.
    """
    try:
        from app.explainer import generate_learning_summary
        summary, reasoning, detailed = await generate_learning_summary(
            req.domain, 
            req.weak_topics, 
            req.micro_gaps, 
            req.root_cause,
            req.results
        )
        return AnalysisResponse(
            summary=summary,
            reasoning_chain=reasoning,
            detailed_report=detailed
        )
    except Exception as e:
        logger.exception("Performance analysis generation failed: %s", e)
        return AnalysisResponse(
            summary="Our AI identified several key areas for improvement. Focus on your root cause to unlock further topics.",
            reasoning_chain=["Data collected", "Patterns identified", "Personalizing output"]
        )


@app.exception_handler(Exception)
async def global_handler(request, exc):
    logger.exception("Unhandled: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )


# ───────────────────────────────────────────────────────────────────────────────
#  ANTIGRAVITY — Chat, Memory, Firestore
# ───────────────────────────────────────────────────────────────────────────────


@app.post("/chat", response_model=ChatAPIResponse)
async def chat_endpoint(req: ChatRequest) -> ChatAPIResponse:
    """
    Full ANTIGRAVITY conversational pipeline.

    1. Retrieves typed user memories from ChromaDB (filtered by domain/topic)
    2. Local LLM compresses memories → User Context
    3. Main LLM generates adaptive, personalised answer
    4. Extracts MEMORY_UPDATE blocks (inline + LLM-assisted)
    5. Stores new memories back into ChromaDB
    """
    result = run_chat(
        user_id=req.user_id,
        query=req.query,
        domain=req.domain,
        topic=req.topic,
    )

    # Also update Firestore last_seen
    upsert_user_profile(req.user_id)
    update_streak(req.user_id)

    new_mem_items = [
        MemoryItem(**m) for m in result.new_memories
    ]

    return ChatAPIResponse(
        answer=result.answer,
        user_context_used=result.user_context_used,
        new_memories=new_mem_items,
        domain=result.domain,
        topic=result.topic,
    )


# ── Memory CRUD ──────────────────────────────────────────────────────────────

@app.post("/memory", status_code=201)
def store_memory_endpoint(req: MemoryStoreRequest):
    """
    Manually insert a typed memory for a user.
    Useful for seeding initial profiles or admin corrections.
    """
    inserted, mem_id = store_memory(
        user_id=req.user_id,
        domain=req.domain,
        topic=req.topic,
        mem_type=req.type,      # type: ignore[arg-type]
        content=req.content,
    )
    return {"inserted": inserted, "memory_id": mem_id}


@app.get("/memory/{user_id}", response_model=MemoryListResponse)
def list_memories(
    user_id: str,
    domain: str | None = None,
    topic: str | None = None,
    mem_type: str | None = None,
    query: str = "general learning profile",
) -> MemoryListResponse:
    """
    Retrieve user memories.
    
    Use query + domain/topic/mem_type to filter semantically or by metadata.
    """
    if domain or topic or mem_type:
        raw = retrieve_memories(
            user_id=user_id,
            query=query,
            domain=domain,
            topic=topic,
            mem_type=mem_type,      # type: ignore[arg-type]
            k=20,
        )
    else:
        raw = get_all_memories(user_id)

    items = [
        MemoryItem(
            memory_id=m.memory_id,
            type=m.type,
            domain=m.domain,
            topic=m.topic,
            content=m.content,
            distance=m.distance,
        )
        for m in raw
    ]
    return MemoryListResponse(user_id=user_id, memories=items, total=len(items))


# ── Firestore User Profile ──────────────────────────────────────────────────

@app.post("/user/profile")
def create_or_update_profile(req: FirestoreProfileRequest):
    """Create or update a user's Firestore profile (name, email, last_seen)."""
    ok = upsert_user_profile(
        user_id=req.user_id,
        name=req.name,
        email=req.email,
    )
    if not ok:
        raise HTTPException(
            status_code=503,
            detail="Firestore unavailable. Set FIREBASE_CREDENTIALS env var.",
        )
    streak = update_streak(req.user_id)
    return {"status": "ok", "streak": streak}


@app.get("/user/{user_id}/profile")
def get_profile(user_id: str):
    """Fetch a user's Firestore profile, scores, and progress summary."""
    profile = get_user_profile(user_id)
    scores = get_domain_scores(user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="User profile not found in Firestore.")
    return {"profile": profile, "domain_scores": scores}


@app.post("/user/score")
def record_score(req: DomainScoreRequest):
    """Save a quiz or coding score for a domain."""
    ok = update_domain_score(
        user_id=req.user_id,
        domain=req.domain,
        score=req.score,
        total_questions=req.total_questions,
        correct=req.correct,
    )
    if not ok:
        raise HTTPException(status_code=503, detail="Firestore unavailable.")
    return {"status": "ok", "domain": req.domain, "score": req.score}


@app.post("/user/topic-complete")
def complete_topic(req: TopicCompleteRequest):
    """Mark a learning topic as completed and award XP."""
    ok = mark_topic_complete(
        user_id=req.user_id,
        domain=req.domain,
        topic=req.topic,
        xp_earned=req.xp_earned,
    )
    if not ok:
        raise HTTPException(status_code=503, detail="Firestore unavailable.")
    completed = get_progress(req.user_id, req.domain)
    return {
        "status": "ok",
        "topic": req.topic,
        "xp_earned": req.xp_earned,
        "total_completed_in_domain": len(completed),
    }
