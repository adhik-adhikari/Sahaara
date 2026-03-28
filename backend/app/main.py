from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .mock_data import (
    CHECK_IN_QUESTIONS,
    MOCK_POSTS,
    DASHBOARD_WIDGETS_GREEN,
    DASHBOARD_WIDGETS_YELLOW,
    tier_from_scores,
    tier_message,
)

app = FastAPI(
    title="Sahaara API",
    description="Private first-step mental health support — demo backend with mock data.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginBody(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=1)
    username: str = Field(..., min_length=1)


class CheckInBody(BaseModel):
    answers: dict[str, str | int | float | None]


@app.get("/health")
def health():
    return {"status": "ok", "service": "sahaara"}


@app.post("/api/auth/login")
def fake_login(body: LoginBody):
    """No real auth — accepts any credentials for demo."""
    return {
        "ok": True,
        "token": "demo-token",
        "user": {
            "email": body.email.strip(),
            "username": body.username.strip(),
        },
    }


@app.get("/api/check-in/questions")
def get_check_in_questions():
    return {"questions": CHECK_IN_QUESTIONS}


@app.post("/api/check-in/submit")
def submit_check_in(body: CheckInBody):
    tier, emoji = tier_from_scores({k: body.answers.get(k) for k in body.answers})
    widgets = list(DASHBOARD_WIDGETS_GREEN)
    if tier in ("yellow", "orange", "red"):
        widgets = DASHBOARD_WIDGETS_YELLOW + DASHBOARD_WIDGETS_GREEN[:1]
    return {
        "tier": tier,
        "tier_emoji": emoji,
        "message": tier_message(tier),
        "suggested_widgets": widgets,
    }


@app.get("/api/dashboard/summary")
def dashboard_summary():
    """Static demo summary when client has not submitted a fresh check-in."""
    return {
        "tier": "green",
        "tier_emoji": "🟢",
        "message": "Complete a pulse check-in to personalize your dashboard.",
        "widgets": DASHBOARD_WIDGETS_GREEN,
        "quick_stats": {
            "check_ins_this_week": 0,
            "circles_joined": 0,
        },
    }


@app.get("/api/community/posts")
def list_posts():
    return {"posts": MOCK_POSTS}
