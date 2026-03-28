from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class JournalEntryCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    text: str
    mood: str
    mood_icon: str = Field(validation_alias=AliasChoices("moodIcon", "mood_icon"))
    mood_color: str = Field(validation_alias=AliasChoices("moodColor", "mood_color"))
    date: datetime | None = None
    prompt: str | None = None


class JournalEntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    text: str
    mood: str
    mood_icon: str = Field(serialization_alias="moodIcon")
    mood_color: str = Field(serialization_alias="moodColor")
    created_at: datetime = Field(serialization_alias="date")

    prompt: str | None = None


class MoodCheckInCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    answers: dict[str, str]
    result_label: str = Field(validation_alias=AliasChoices("result_label", "label"))
    result_level: str = Field(validation_alias=AliasChoices("result_level", "level"))
    result_message: str = Field(validation_alias=AliasChoices("result_message", "msg"))


class MoodCheckInRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    answers: dict
    result_label: str
    result_level: str
    result_message: str
    created_at: datetime
