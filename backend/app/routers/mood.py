from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MoodCheckIn
from app.schemas import MoodCheckInCreate, MoodCheckInRead

router = APIRouter(prefix="/mood", tags=["mood"])


@router.get("/check-ins", response_model=list[MoodCheckInRead])
def list_check_ins(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)) -> list[MoodCheckIn]:
    stmt = select(MoodCheckIn).order_by(MoodCheckIn.created_at.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


@router.post("/check-ins", response_model=MoodCheckInRead, status_code=status.HTTP_201_CREATED)
def create_check_in(body: MoodCheckInCreate, db: Session = Depends(get_db)) -> MoodCheckIn:
    row = MoodCheckIn(
        answers=body.answers,
        result_label=body.result_label,
        result_level=body.result_level,
        result_message=body.result_message,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/check-ins/{check_in_id}", response_model=MoodCheckInRead)
def get_check_in(check_in_id: int, db: Session = Depends(get_db)) -> MoodCheckIn:
    row = db.get(MoodCheckIn, check_in_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Check-in not found")
    return row
