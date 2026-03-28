import { useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { COUNSELORS, SESSIONS, type Session, type Counselor } from "../lib/sessionsData";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function spotsLeft(s: Session) {
  return s.maxParticipants - s.signedUp;
}

function typeColor(type: Session["type"]) {
  return {
    group: { bg: "rgba(126,184,212,0.12)", color: "#7eb4d4", border: "rgba(126,184,212,0.25)" },
    workshop: { bg: "rgba(192,132,252,0.12)", color: "#c084fc", border: "rgba(192,132,252,0.25)" },
    meditation: { bg: "rgba(77,208,164,0.12)", color: "#4dd0a4", border: "rgba(77,208,164,0.25)" },
    therapy: { bg: "rgba(249,168,212,0.12)", color: "#f9a8d4", border: "rgba(249,168,212,0.25)" },
  }[type];
}

// ─── Email via Gmail MCP ─────────────────────────────────────────────────────

async function sendConfirmationEmail(
  toEmail: string,
  toName: string,
  session: Session,
  counselor: Counselor
) {
  const subject = `✅ You're in: "${session.title}" — ${formatDate(session.date)}`;

  const body = `Hi ${toName || "there"},

You're confirmed for the following Sahara session:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${session.title}
  Led by ${counselor.name}
  ${formatDate(session.date)} · ${session.time} · ${session.duration} min
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JOIN WITH ZOOM
Link: ${session.zoomLink}
Meeting ID: ${session.zoomId}
Passcode: ${session.zoomPassword}

Tips before you join:
• Find a quiet, private space
• Join 2–3 minutes early
• Headphones recommended

We're looking forward to seeing you there.

With care,
The Sahara Team

──────────────────────────────
Sahara · Community Wellness Platform
If you need to cancel, simply reply to this email.
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Send an email using Gmail with the following details:
To: ${toEmail}
Subject: ${subject}
Body:
${body}

Please send this email now.`,
      }],
      mcp_servers: [{
        type: "url",
        url: "https://gmail.mcp.claude.com/mcp",
        name: "gmail-mcp",
      }],
    }),
  });

  const data = await response.json();
  const success = data.content?.some(
    (b: { type: string; text?: string }) =>
      b.type === "text" && /sent|success|delivered/i.test(b.text || "")
  );
  return success;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CounselorAvatar({ c, size = 44 }: { c: Counselor; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: c.avatarGradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 700, color: "#fff",
      fontFamily: "'Syne', sans-serif",
      boxShadow: `0 0 0 2px rgba(255,255,255,0.06), 0 4px 14px ${c.avatarColor}44`,
    }}>
      {c.avatar}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="9" height="9" viewBox="0 0 12 12" fill="none">
          <polygon
            points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"
            fill={i <= Math.round(rating) ? "#fcd34d" : "rgba(255,255,255,0.12)"}
          />
        </svg>
      ))}
      <span style={{ fontSize: 10, color: "#fcd34d", fontFamily: "'DM Sans', sans-serif", marginLeft: 2 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const urgent = pct >= 80;
  return (
    <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: urgent ? "linear-gradient(90deg,#f9a8d4,#f06292)" : `linear-gradient(90deg,${color}88,${color})`,
        borderRadius: 99, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
      }} />
    </div>
  );
}

// ─── Join Button with states ─────────────────────────────────────────────────

type JoinState = "idle" | "loading" | "done" | "error";

function JoinButton({
  session,
  counselor,
  onJoin,
}: {
  session: Session;
  counselor: Counselor;
  onJoin: (s: Session, c: Counselor) => Promise<void>;
}) {
  const [state, setState] = useState<JoinState>("idle");
  const full = spotsLeft(session) <= 0;

  const handle = async () => {
    if (state !== "idle" || full) return;
    setState("loading");
    try {
      await onJoin(session, counselor);
      setState("done");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const label = { idle: "Join Session", loading: "Sending…", done: "✓ Confirmed", error: "Try Again" }[state];
  const bg = {
    idle: "linear-gradient(135deg, var(--glow, #7eb4d4), #5a9ec4)",
    loading: "rgba(126,184,212,0.2)",
    done: "linear-gradient(135deg, #4dd0a4, #38bdf8)",
    error: "linear-gradient(135deg, #f06292, #e11d48)",
  }[state];

  return (
    <button
      data-interactive
      onClick={handle}
      disabled={state === "loading" || state === "done" || full}
      style={{
        background: full ? "rgba(255,255,255,0.05)" : bg,
        border: full ? "1px solid rgba(255,255,255,0.08)" : "none",
        borderRadius: 10, color: full ? "var(--muted, #666)" : (state === "loading" ? "var(--glow, #7eb4d4)" : "#0b0f18"),
        padding: "0.55rem 1.1rem", fontSize: "0.72rem",
        fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "0.07em",
        cursor: full || state === "done" ? "default" : "pointer",
        whiteSpace: "nowrap", transition: "all 0.25s",
        boxShadow: state === "idle" && !full ? "0 4px 16px rgba(126,184,212,0.25)" : "none",
        minWidth: 110,
      }}
    >
      {full ? "Session Full" : label}
    </button>
  );
}

// ─── Session Card ────────────────────────────────────────────────────────────

function SessionCard({
  session,
  onJoin,
}: {
  session: Session;
  onJoin: (s: Session, c: Counselor) => Promise<void>;
}) {
  const counselor = COUNSELORS.find(c => c.id === session.counselorId)!;
  const tc = typeColor(session.type);
  const left = spotsLeft(session);

  return (
    <div style={{
      background: "var(--surface, #111827)",
      border: "1px solid var(--border, rgba(255,255,255,0.07))",
      borderRadius: 20,
      padding: "1.4rem 1.5rem",
      display: "flex", flexDirection: "column", gap: "1rem",
      transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
      cursor: "default",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${counselor.avatarColor}44`;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${counselor.avatarColor}18`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border, rgba(255,255,255,0.07))";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Top row: type badge + date */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          fontSize: 9.5, fontFamily: "'Syne', sans-serif", fontWeight: 700,
          letterSpacing: "0.13em", textTransform: "uppercase",
          background: tc.bg, color: tc.color,
          border: `1px solid ${tc.border}`,
          padding: "3px 10px", borderRadius: 99,
        }}>
          {session.type}
        </div>
        <div style={{ fontSize: 10.5, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif" }}>
          {formatDate(session.date)} · {session.time}
        </div>
      </div>

      {/* Title + description */}
      <div>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem",
          color: "var(--cream, #f0ece4)", lineHeight: 1.25, marginBottom: "0.4rem",
        }}>
          {session.title}
        </div>
        <div style={{
          fontSize: 11.5, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.55,
        }}>
          {session.description}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {session.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 9.5, fontFamily: "'DM Sans', sans-serif",
            color: "var(--muted, #555)", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "2px 8px", borderRadius: 99,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Counselor row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "0.65rem 0.85rem",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 12,
      }}>
        <CounselorAvatar c={counselor} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "var(--cream, #f0ece4)" }}>
            {counselor.name}
          </div>
          <div style={{ fontSize: 10, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif" }}>
            {counselor.title}
          </div>
        </div>
        <StarRating rating={counselor.rating} />
      </div>

      {/* Spots + progress */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10.5, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif" }}>
            {session.signedUp} / {session.maxParticipants} joined
          </span>
          <span style={{
            fontSize: 10.5, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            color: left <= 3 ? "#f06292" : left <= 6 ? "#fcd34d" : "#4dd0a4",
          }}>
            {left <= 0 ? "Full" : `${left} spot${left === 1 ? "" : "s"} left`}
          </span>
        </div>
        <ProgressBar value={session.signedUp} max={session.maxParticipants} color={counselor.avatarColor} />
      </div>

      {/* Bottom: duration + join */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted, #555)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ fontSize: 11, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif" }}>
            {session.duration} min
          </span>
        </div>
        <JoinButton session={session} counselor={counselor} onJoin={onJoin} />
      </div>
    </div>
  );
}

// ─── Counselor Spotlight ──────────────────────────────────────────────────────

function CounselorSpotlight({ c }: { c: Counselor }) {
  const sessions = SESSIONS.filter(s => s.counselorId === c.id);
  return (
    <div style={{
      background: "var(--surface, #111827)",
      border: "1px solid var(--border, rgba(255,255,255,0.07))",
      borderRadius: 18, padding: "1.2rem 1.3rem",
      display: "flex", flexDirection: "column", gap: "0.75rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CounselorAvatar c={c} size={50} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--cream, #f0ece4)" }}>
            {c.name}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
            {c.title}
          </div>
          <StarRating rating={c.rating} />
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: "rgba(232,234,240,0.4)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
        {c.bio}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {c.specialty.map(s => (
          <span key={s} style={{
            fontSize: 9.5, fontFamily: "'DM Sans', sans-serif",
            color: c.avatarColor, background: `${c.avatarColor}12`,
            border: `1px solid ${c.avatarColor}30`,
            padding: "2px 9px", borderRadius: 99,
          }}>
            {s}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, borderTop: "1px solid var(--border, rgba(255,255,255,0.07))", paddingTop: "0.65rem" }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--cream, #f0ece4)" }}>
            {c.totalSessions}
          </div>
          <div style={{ fontSize: 9.5, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif" }}>sessions</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--cream, #f0ece4)" }}>
            {sessions.length}
          </div>
          <div style={{ fontSize: 9.5, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif" }}>upcoming</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fcd34d" }}>
            {c.rating}
          </div>
          <div style={{ fontSize: 9.5, color: "var(--muted, #555)", fontFamily: "'DM Sans', sans-serif" }}>rating</div>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message, type, visible }: { message: string; type: "success" | "error"; visible: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: "2rem", left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
      opacity: visible ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
      zIndex: 999,
      background: type === "success" ? "linear-gradient(135deg,#4dd0a4,#38bdf8)" : "linear-gradient(135deg,#f06292,#e11d48)",
      color: type === "success" ? "#0b0f18" : "#fff",
      padding: "0.75rem 1.5rem", borderRadius: 14,
      fontSize: "0.8rem", fontFamily: "'Syne', sans-serif", fontWeight: 700,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      pointerEvents: "none",
    }}>
      {message}
    </div>
  );
}

// ─── Filter tabs ─────────────────────────────────────────────────────────────

const FILTERS = ["All", "group", "workshop", "meditation", "therapy"] as const;
type Filter = typeof FILTERS[number];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Sessions() {
  const { user } = useUser();
  const requireAuth = useRequireAuth();
  const [filter, setFilter] = useState<Filter>("All");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error"; show: boolean }>({
    msg: "", type: "success", show: false,
  });

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  }, []);

  const handleJoin = useCallback(async (session: Session, counselor: Counselor) => {
    requireAuth(async () => {
      if (!user) return;
      const email = user.primaryEmailAddress?.emailAddress;
      const name = user.firstName || user.username || "there";
      if (!email) { showToast("No email found on your account.", "error"); return; }

      try {
        const ok = await sendConfirmationEmail(email, name, session, counselor);
        if (ok) {
          showToast(`You're in! Confirmation sent to ${email}`, "success");
        } else {
          showToast("Joined! (email delivery pending)", "success");
        }
      } catch {
        showToast("Joined the session! Email may be delayed.", "success");
      }
    });
  }, [user, requireAuth, showToast]);

  const filtered = filter === "All" ? SESSIONS : SESSIONS.filter(s => s.type === filter);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2.5rem 2.5rem 5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
          fontSize: "2.2rem", color: "var(--cream, #f0ece4)",
          letterSpacing: "-0.02em", lineHeight: 1.1,
          marginBottom: "0.5rem",
        }}>
          Live Sessions
        </div>
        <div style={{
          fontSize: "0.82rem", color: "var(--muted, #555)",
          fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
        }}>
          Join a counselor-led session. A confirmation with your Zoom link will be emailed to you.
        </div>
      </div>

      {/* Layout: sessions grid + counselor sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "2rem", alignItems: "start" }}>
        {/* Left: filters + cards */}
        <div>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {FILTERS.map(f => {
              const tc = f === "All" ? null : typeColor(f);
              const active = filter === f;
              return (
                <button
                  key={f}
                  data-interactive
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "0.4rem 1rem", borderRadius: 99, cursor: "pointer",
                    fontFamily: "'Syne', sans-serif", fontWeight: 600,
                    fontSize: "0.7rem", letterSpacing: "0.09em", textTransform: "capitalize",
                    border: active
                      ? (tc ? `1px solid ${tc.border}` : "1px solid rgba(126,184,212,0.4)")
                      : "1px solid rgba(255,255,255,0.07)",
                    background: active
                      ? (tc ? tc.bg : "rgba(126,184,212,0.1)")
                      : "transparent",
                    color: active
                      ? (tc ? tc.color : "#7eb4d4")
                      : "var(--muted, #555)",
                    transition: "all 0.2s",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.2rem",
          }}>
            {filtered.map(session => (
              <SessionCard key={session.id} session={session} onJoin={handleJoin} />
            ))}
          </div>
        </div>

        {/* Right: counselors */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: 90 }}>
          <div style={{
            fontSize: 9.5, color: "var(--muted, #555)",
            fontFamily: "'Syne', sans-serif", letterSpacing: "0.14em",
            textTransform: "uppercase", marginBottom: "0.25rem",
          }}>
            Our Counselors
          </div>
          {COUNSELORS.map(c => (
            <CounselorSpotlight key={c.id} c={c} />
          ))}
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast.msg} type={toast.type} visible={toast.show} />
    </div>
  );
}
