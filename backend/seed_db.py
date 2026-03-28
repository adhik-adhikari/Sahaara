"""
Create ORM tables (if missing) and insert mock journal + mood rows.

Uses DATABASE_URL from .env. Run from the backend folder:

  python seed_db.py

Journal rows use fixed IDs (mock_seed_*) — re-running updates them via merge.
Mood rows are inserted only when mood_check_ins is empty (avoids duplicates).
"""

from __future__ import annotations

import sys

from sqlalchemy import func, select

from app import models  # noqa: F401 — register metadata
from app.database import Base, SessionLocal, engine
from app.mock_data import MOCK_JOURNAL_SEED, MOCK_MOOD_SEED
from app.models import JournalEntry, MoodCheckIn


def main() -> int:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for row in MOCK_JOURNAL_SEED:
            db.merge(
                JournalEntry(
                    id=row["id"],
                    text=row["text"],
                    mood=row["mood"],
                    mood_icon=row["mood_icon"],
                    mood_color=row["mood_color"],
                    prompt=row.get("prompt"),
                    created_at=row["created_at"],
                )
            )
        db.commit()
        print(f"Upserted {len(MOCK_JOURNAL_SEED)} journal_entries.")

        n_mood = db.scalar(select(func.count()).select_from(MoodCheckIn)) or 0
        if n_mood == 0:
            for row in MOCK_MOOD_SEED:
                db.add(
                    MoodCheckIn(
                        answers=row["answers"],
                        result_label=row["result_label"],
                        result_level=row["result_level"],
                        result_message=row["result_message"],
                    )
                )
            db.commit()
            print(f"Inserted {len(MOCK_MOOD_SEED)} mood_check_ins.")
        else:
            print(f"Skipped mood seed (mood_check_ins already has {n_mood} row(s)).")
    except Exception as e:
        db.rollback()
        print("Seed FAILED:", e, file=sys.stderr)
        return 1
    finally:
        db.close()

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
