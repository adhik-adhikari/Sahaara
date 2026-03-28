"""Static mock payloads for Sahaara demo APIs."""

from __future__ import annotations

from datetime import datetime

CHECK_IN_QUESTIONS = [
    {
        "id": "sleep",
        "prompt": "In the past week, how often have you felt rested after sleep?",
        "type": "scale",
        "min": 1,
        "max": 5,
        "labels": {"1": "Rarely", "5": "Most nights"},
    },
    {
        "id": "stress",
        "prompt": "How much day-to-day stress are you carrying right now?",
        "type": "scale",
        "min": 1,
        "max": 5,
        "labels": {"1": "Very little", "5": "A lot"},
    },
    {
        "id": "pressure",
        "prompt": "How pressured do you feel by family, work, or school expectations?",
        "type": "scale",
        "min": 1,
        "max": 5,
        "labels": {"1": "Not much", "5": "Overwhelming"},
    },
    {
        "id": "hope",
        "prompt": "When you think about the next few weeks, how much hope do you sense?",
        "type": "scale",
        "min": 1,
        "max": 5,
        "labels": {"1": "Very little", "5": "Quite a bit"},
    },
    {
        "id": "check_in_note",
        "prompt": "Anything you want to name about today? (optional)",
        "type": "text",
        "placeholder": "A word, a feeling, or leave blank",
    },
]

MOCK_POSTS = [
    {
        "id": "p1",
        "display_name": "QuietRiver",
        "room": "Academic burnout",
        "body": "Finished exams but I still feel empty. Glad this space exists.",
        "relatable_count": 42,
        "support_count": 18,
        "created_at": "2026-03-26T14:20:00Z",
    },
    {
        "id": "p2",
        "display_name": "StoicPanda42",
        "room": "Family expectations",
        "body": "Small win: I said I needed a break without apologizing ten times.",
        "relatable_count": 89,
        "support_count": 56,
        "created_at": "2026-03-27T09:05:00Z",
    },
    {
        "id": "p3",
        "display_name": "WarmCedar",
        "room": "Positive pivot",
        "body": "Grateful for sunlight and a friend who listened without fixing me.",
        "relatable_count": 31,
        "support_count": 72,
        "created_at": "2026-03-27T11:40:00Z",
    },
    {
        "id": "p4",
        "display_name": "NightOwl_NP",
        "room": "Academic burnout",
        "body": "Three hours of sleep again. Not asking for advice—just naming it.",
        "relatable_count": 64,
        "support_count": 41,
        "created_at": "2026-03-27T16:12:00Z",
    },
    {
        "id": "p5",
        "display_name": "MonsoonMist",
        "room": "Family expectations",
        "body": "Used the family-safe explanation tool. It helped me describe burnout without the word 'depression.'",
        "relatable_count": 55,
        "support_count": 29,
        "created_at": "2026-03-28T08:00:00Z",
    },
    {
        "id": "p6",
        "display_name": "HimalayanHeron",
        "room": "Positive pivot",
        "body": "Did the 90-second check-in. Green tier today. Breathing exercise actually helped.",
        "relatable_count": 22,
        "support_count": 15,
        "created_at": "2026-03-28T10:30:00Z",
    },
    {
        "id": "p7",
        "display_name": "AnonymousLotus",
        "room": "Academic burnout",
        "body": "Posting because reading your stories makes me feel less alone.",
        "relatable_count": 103,
        "support_count": 67,
        "created_at": "2026-03-28T12:45:00Z",
    },
    {
        "id": "p8",
        "display_name": "ValleyEcho",
        "room": "Family expectations",
        "body": "Pressure to be the 'stable one' in the family is exhausting.",
        "relatable_count": 77,
        "support_count": 44,
        "created_at": "2026-03-28T13:10:00Z",
    },
]

DASHBOARD_WIDGETS_GREEN = [
    {"id": "w1", "title": "90-second breathing", "description": "A short reset you can do anywhere.", "cta": "Start"},
    {"id": "w2", "title": "Journal prompt", "description": "What is one kind thing your body did for you today?", "cta": "Open"},
    {"id": "w3", "title": "Pressure release", "description": "Name one expectation you can set down for an hour.", "cta": "Try"},
]

DASHBOARD_WIDGETS_YELLOW = [
    {"id": "w4", "title": "Circle check-in", "description": "Anonymous peer room: Academic burnout.", "cta": "Enter room"},
    {"id": "w5", "title": "Relatable feed", "description": "See posts others marked as relatable.", "cta": "Browse"},
]


def tier_from_scores(answers: dict) -> tuple[str, str]:
    """Derive a demo tier from numeric answers (sleep reversed for stress load)."""
    numeric_keys = ("sleep", "stress", "pressure", "hope")
    values = []
    for k in numeric_keys:
        v = answers.get(k)
        if v is None:
            continue
        try:
            n = int(v)
            values.append(n)
        except (TypeError, ValueError):
            continue
    if not values:
        return "green", "🟢"
    sleep = int(answers.get("sleep", 3))
    stress = int(answers.get("stress", 2))
    pressure = int(answers.get("pressure", 2))
    hope = int(answers.get("hope", 4))
    load = (6 - sleep) + stress + pressure + (6 - hope)
    if load >= 14:
        return "red", "🔴"
    if load >= 11:
        return "orange", "🟠"
    if load >= 8:
        return "yellow", "🟡"
    return "green", "🟢"


def tier_message(tier: str) -> str:
    messages = {
        "green": "You may be doing okay right now. Gentle self-care and check-ins can keep it that way.",
        "yellow": "Sounds like things feel heavy. Peer circles and small steps can help—you are not alone.",
        "orange": "It may help to connect with a listener or someone you trust. We will surface bridge options next.",
        "red": "If you might hurt yourself or are in immediate danger, please use crisis resources now. You deserve support.",
    }
    return messages.get(tier, messages["green"])


# ── DB seed rows (journal_entries + mood_check_ins) ─────────────────


def _dt(iso: str) -> datetime:
    return datetime.fromisoformat(iso.replace("Z", "+00:00"))


# Stable string IDs so re-seeding upserts the same rows.
MOCK_JOURNAL_SEED = [
    {
        "id": "mock_seed_j1",
        "text": "Grateful for quiet morning tea and a full night of sleep.",
        "mood": "Grateful",
        "mood_icon": "🙏",
        "mood_color": "#7aad96",
        "prompt": "What are three things you're grateful for today?",
        "created_at": _dt("2026-03-26T08:15:00Z"),
    },
    {
        "id": "mock_seed_j2",
        "text": "Exam week is heavy but I reached out to a friend. Small win.",
        "mood": "Hopeful",
        "mood_icon": "🌱",
        "mood_color": "#34d399",
        "prompt": None,
        "created_at": _dt("2026-03-27T19:40:00Z"),
    },
    {
        "id": "mock_seed_j3",
        "text": "Naming that I feel anxious without judging myself for it.",
        "mood": "Anxious",
        "mood_icon": "😟",
        "mood_color": "#6c8ef5",
        "prompt": "What emotion are you sitting with right now, and why?",
        "created_at": _dt("2026-03-28T11:05:00Z"),
    },
]


def _mood_checkin_row(answers: dict, tier: str) -> dict:
    return {
        "answers": answers,
        "result_label": f"{tier.title()} tier",
        "result_level": {"green": "success", "yellow": "warning", "orange": "warning", "red": "danger"}.get(
            tier, "success"
        ),
        "result_message": tier_message(tier),
    }


MOCK_MOOD_SEED = [
    _mood_checkin_row({"sleep": "4", "stress": "2", "pressure": "2", "hope": "5"}, "green"),
    _mood_checkin_row({"sleep": "2", "stress": "4", "pressure": "4", "hope": "3"}, "yellow"),
    _mood_checkin_row({"sleep": "1", "stress": "5", "pressure": "5", "hope": "2"}, "orange"),
]
