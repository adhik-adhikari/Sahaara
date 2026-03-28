from datetime import datetime

from sqlalchemy import DateTime, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    mood: Mapped[str] = mapped_column(String(128), nullable=False)
    mood_icon: Mapped[str] = mapped_column(String(32), nullable=False)
    mood_color: Mapped[str] = mapped_column(String(32), nullable=False)
    prompt: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class MoodCheckIn(Base):
    __tablename__ = "mood_check_ins"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    answers: Mapped[dict] = mapped_column(JSON, nullable=False)
    result_label: Mapped[str] = mapped_column(String(128), nullable=False)
    result_level: Mapped[str] = mapped_column(String(32), nullable=False)
    result_message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
