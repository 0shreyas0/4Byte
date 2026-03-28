"""
FastAPI entrypoint: compile endpoint, health, user stats.

Starts SQLite, seeds Chroma if needed, and wires RAG + personalization.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
import os
import sys

# 🔥🔥🔥 RELOAD INDICATOR - Check your terminal to see if this appears! 🔥🔥🔥
print("\n" + "🚀"*40)
print("🚀🚀🚀 NEURALPATH RAG SERVER V2.0: AI MENTOR ONLINE 🚀🚀🚀")
print("🚀"*40 + "\n", flush=True)

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from ai.seed_knowledge import seed_database
from ai.retriever import get_rag_explanation
from app import seed_knowledge
from app.compiler import check_source
from app.db import init_db, record_error
from app.explainer import build_personalized_explanation
from app.models import CompileRequest, CompileResponse, UserStatsResponse, AnalysisRequest, AnalysisResponse
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
            "user_stats": "GET /user/{user_id}/stats",
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
