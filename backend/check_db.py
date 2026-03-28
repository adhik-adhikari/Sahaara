"""Verify DATABASE_URL from .env. Run from this folder: python check_db.py"""

from __future__ import annotations

import sys

from sqlalchemy import text


def main() -> int:
    try:
        from app.database import engine
    except Exception as e:
        print("Import failed (run from backend directory):", e, file=sys.stderr)
        return 1

    try:
        with engine.connect() as conn:
            one = conn.execute(text("SELECT 1")).scalar()
            version = conn.execute(text("SELECT version()")).scalar()
    except Exception as e:
        print("Connection FAILED:", e, file=sys.stderr)
        if "getaddrinfo" in str(e).lower() or "11001" in str(e):
            print(
                "Hint: Supabase direct (db.*.supabase.co) is often IPv6-only. In Connect, choose "
                "Method: Session pooler (aws-0-*.pooler.supabase.com:5432) and paste that URI into .env.",
                file=sys.stderr,
            )
        return 1

    print("Connection OK.")
    print("  SELECT 1      =>", one)
    print("  PostgreSQL    =>", (version or "").split(",")[0].strip())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
