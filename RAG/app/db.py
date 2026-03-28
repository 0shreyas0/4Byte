"""
SQLite persistence via SQLAlchemy.

Stores one row per compiler error event for personalization and analytics.
"""

from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import (
    DateTime,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


# Default DB path next to project root; override with env in production if needed.
DB_PATH = Path(__file__).resolve().parent.parent / "data" / "errors.db"


class Base(DeclarativeBase):
    pass


class ErrorHistory(Base):
    """One recorded error event for a user."""

    __tablename__ = "error_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(256), index=True)
    code: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(64), index=True)
    error_type: Mapped[str] = mapped_column(String(128), index=True)
    error_message: Mapped[str] = mapped_column(Text)
    line_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    faulty_line: Mapped[str | None] = mapped_column(Text, nullable=True)
    mapped_topic: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )


_engine = None
_SessionLocal = None


def _ensure_data_dir() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_engine():
    global _engine
    if _engine is None:
        _ensure_data_dir()
        _engine = create_engine(
            f"sqlite:///{DB_PATH}",
            connect_args={"check_same_thread": False},
            echo=False,
        )
    return _engine


def init_db() -> None:
    """Create tables if they do not exist."""
    Base.metadata.create_all(bind=get_engine())


def get_session_factory():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=get_engine(),
        )
    return _SessionLocal


@contextmanager
def session_scope():
    """Provide a transactional scope around a series of operations."""
    SessionLocal = get_session_factory()
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def record_error(
    user_id: str,
    code: str,
    language: str,
    error_type: str,
    error_message: str,
    line_number: int | None,
    faulty_line: str | None,
    mapped_topic: str | None,
) -> None:
    """Insert one error history row."""
    with session_scope() as session:
        row = ErrorHistory(
            user_id=user_id,
            code=code,
            language=language,
            error_type=error_type,
            error_message=error_message,
            line_number=line_number,
            faulty_line=faulty_line,
            mapped_topic=mapped_topic,
        )
        session.add(row)
