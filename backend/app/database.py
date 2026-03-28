from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


def _prepare_database_url(url: str) -> str:
    """Use Psycopg 3 with SQLAlchemy; require SSL for Supabase (direct + pooler)."""
    if url.startswith("sqlite"):
        return url
    out = url
    scheme, _, rest = out.partition("://")
    if scheme in ("postgresql", "postgres") and "+psycopg" not in scheme:
        out = "postgresql+psycopg://" + rest
    # Direct db.* is IPv6-only; pooler.* supports IPv4 (session mode for long-lived apps).
    if ("supabase.co" in out or "pooler.supabase.com" in out) and "sslmode=" not in out:
        out += "&sslmode=require" if "?" in out else "?sslmode=require"
    return out


_prepared_url = _prepare_database_url(settings.database_url)
connect_args = {"check_same_thread": False} if _prepared_url.startswith("sqlite") else {}
_engine_kwargs = {"connect_args": connect_args}
if not _prepared_url.startswith("sqlite"):
    _engine_kwargs["pool_pre_ping"] = True

engine = create_engine(_prepared_url, **_engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
