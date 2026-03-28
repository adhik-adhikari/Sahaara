from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import JournalEntry
from app.schemas import JournalEntryCreate, JournalEntryRead

router = APIRouter(prefix="/journal", tags=["journal"])


@router.get("/entries", response_model=list[JournalEntryRead])
def list_entries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> list[JournalEntry]:
    stmt = select(JournalEntry).order_by(JournalEntry.created_at.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


@router.post("/entries", response_model=JournalEntryRead, status_code=status.HTTP_201_CREATED)
def create_entry(body: JournalEntryCreate, db: Session = Depends(get_db)) -> JournalEntry:
    when = body.date if body.date is not None else datetime.now(timezone.utc)
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    row = JournalEntry(
        id=body.id,
        text=body.text,
        mood=body.mood,
        mood_icon=body.mood_icon,
        mood_color=body.mood_color,
        prompt=body.prompt,
        created_at=when,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/entries/{entry_id}", response_model=JournalEntryRead)
def get_entry(entry_id: str, db: Session = Depends(get_db)) -> JournalEntry:
    row = db.get(JournalEntry, entry_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Entry not found")
    return row


@router.delete("/entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: str, db: Session = Depends(get_db)) -> None:
    row = db.get(JournalEntry, entry_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(row)
    db.commit()
