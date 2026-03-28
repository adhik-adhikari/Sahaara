import { useState, useEffect, useRef, useCallback } from "react";

/* ─── types ─── */
interface JournalEntry {
  id: string;
  text: string;
  mood: string;
  moodIcon: string;
  moodColor: string;
  date: string;       // ISO string
  prompt?: string;
}

/* ─── constants ─── */
const MOODS = [
  { label: "Grateful", icon: "🙏", color: "#7aad96" },
  { label: "Happy", icon: "😊", color: "#f5a623" },
  { label: "Calm", icon: "😌", color: "#4dd0a4" },
  { label: "Anxious", icon: "😟", color: "#6c8ef5" },
  { label: "Sad", icon: "😢", color: "#a78bfa" },
  { label: "Stressed", icon: "😤", color: "#f06292" },
  { label: "Hopeful", icon: "🌱", color: "#34d399" },
  { label: "Reflective", icon: "🪞", color: "#7eb8d4" },
];

const PROMPTS = [
  "What are three things you're grateful for today?",
  "Describe a moment that made you smile recently.",
  "What emotion are you sitting with right now, and why?",
  "Write about something you'd like to let go of.",
  "What does your ideal day of peace look like?",
  "Name one act of kindness you witnessed or performed.",
  "What boundary do you need to set for your wellbeing?",
  "Reflect on a challenge you overcame this week.",
  "Write a short letter of compassion to yourself.",
  "What song, book, or memory brought you comfort lately?",
  "Describe a place where you feel completely safe.",
  "What is one small step you can take toward healing today?",
];

const LS_KEY = "sahaara_journal_entries";

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveEntries(entries: JournalEntry[]) {
  console.log("Saving entries:", entries);
  localStorage.setItem(LS_KEY, JSON.stringify(entries));
}

/* ─── helpers ─── */
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/* ─── main ─── */
export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMood, setFilterMood] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // persist
  useEffect(() => { saveEntries(entries); }, [entries]);

  // auto-focus textarea on compose
  useEffect(() => {
    if (composing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [composing]);

  const randomPrompt = useCallback(() => {
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setActivePrompt(p);
    setText("");
  }, []);

  const handleSave = () => {
    if (!text.trim() || !selectedMood) return;
    const entry: JournalEntry = {
      id: uid(),
      text: text.trim(),
      mood: selectedMood.label,
      moodIcon: selectedMood.icon,
      moodColor: selectedMood.color,
      date: new Date().toISOString(),
      prompt: activePrompt || undefined,
    };
    setEntries(prev => [entry, ...prev]);
    setText("");
    setSelectedMood(null);
    setActivePrompt(null);
    setComposing(false);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setDeleteConfirm(null);
    if (expandedId === id) setExpandedId(null);
  };

  const handleCancel = () => {
    setText("");
    setSelectedMood(null);
    setActivePrompt(null);
    setComposing(false);
  };

  /* filter + search */
  const filtered = entries.filter(e => {
    if (filterMood && e.mood !== filterMood) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.text.toLowerCase().includes(q) || e.mood.toLowerCase().includes(q);
    }
    return true;
  });

  /* streak calculator */
  const streak = (() => {
    if (entries.length === 0) return 0;
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let d = 0; d < 365; d++) {
      const day = new Date(today);
      day.setDate(day.getDate() - d);
      const dayStr = day.toDateString();
      const hasEntry = entries.some(e => new Date(e.date).toDateString() === dayStr);
      if (hasEntry) count++;
      else if (d > 0) break; // allow today to be missing
      else break;
    }
    return count;
  })();

  /* ─── render ─── */
  return (
    <div style={{
      height: "calc(100vh - 60px)", overflowY: "auto",
      scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent",
    }}>
      <style>{`
        @keyframes journalFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes journalPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(126,184,212,0.3); }
          50%      { box-shadow: 0 0 0 8px rgba(126,184,212,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .journal-entry-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .journal-entry-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.12);
        }
        .mood-chip {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .mood-chip:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .journal-textarea {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          resize: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--cream);
          min-height: 160px;
        }
        .journal-textarea::placeholder {
          color: var(--muted);
          font-style: italic;
        }
        .filter-pill {
          transition: all 0.18s ease;
        }
        .filter-pill:hover {
          background: rgba(255,255,255,0.08) !important;
        }
      `}</style>

      <div style={{
        maxWidth: 720, margin: "0 auto",
        padding: "2.5rem 1.5rem 5rem",
        animation: "journalFadeIn 0.7s ease both",
      }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem",
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: "var(--glow)", marginBottom: "0.6rem",
          }}>
            Your private space
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1.15,
            color: "var(--cream)", letterSpacing: "-0.01em",
          }}>
            Journal
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: "0.88rem", color: "var(--mist)", lineHeight: 1.7,
            maxWidth: 460, marginTop: "0.5rem",
          }}>
            A safe, private space to reflect on your thoughts and track your emotional journey.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem",
          marginBottom: "1.5rem",
        }}>
          {[
            { num: entries.length, label: "Entries", color: "var(--glow)", icon: "📝" },
            { num: streak, label: "Day streak", color: "var(--sage)", icon: "🔥" },
            { num: MOODS.length, label: "Moods tracked", color: "var(--amber)", icon: "🎭" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "1rem 1.1rem",
              position: "relative", overflow: "hidden",
              animation: `journalFadeIn 0.6s ${0.1 * i}s both`,
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, width: 3, height: "100%",
                background: s.color,
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
                <div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
                    fontSize: "1.6rem", lineHeight: 1, color: "var(--cream)",
                  }}>{s.num}</div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--muted)", marginTop: "0.15rem",
                  }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── New entry button / Composer ── */}
        {!composing ? (
          <button
            id="journal-new-entry"
            onClick={() => setComposing(true)}
            style={{
              width: "100%", padding: "1.1rem 1.4rem",
              background: "linear-gradient(135deg, rgba(126,184,212,0.08), rgba(122,173,150,0.06))",
              border: "1px dashed rgba(126,184,212,0.3)",
              borderRadius: 18, cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.8rem",
              transition: "all 0.25s ease",
              animation: "journalFadeIn 0.7s 0.3s both",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(126,184,212,0.14), rgba(122,173,150,0.10))";
              e.currentTarget.style.borderColor = "rgba(126,184,212,0.5)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(126,184,212,0.08), rgba(122,173,150,0.06))";
              e.currentTarget.style.borderColor = "rgba(126,184,212,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--glow), var(--sage))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", color: "#fff", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(126,184,212,0.3)",
            }}>✦</div>
            <div style={{ textAlign: "left" }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 600,
                fontSize: "0.85rem", color: "var(--cream)",
                letterSpacing: "0.02em",
              }}>
                Write a new entry
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
                color: "var(--muted)", marginTop: "0.15rem",
              }}>
                Reflect, express, and let it out
              </div>
            </div>
            <div style={{
              marginLeft: "auto", fontSize: "0.7rem",
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--glow)", letterSpacing: "0.08em",
            }}>
              ⌘ + N
            </div>
          </button>
        ) : (
          /* ── Compose panel ── */
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 22, overflow: "hidden",
            animation: "journalFadeIn 0.4s ease both",
            marginBottom: "1.5rem",
          }}>
            {/* Prompt bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.9rem 1.3rem",
              borderBottom: "1px solid var(--border)",
              background: "rgba(126,184,212,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem" }}>💡</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
                  color: "var(--mist)", letterSpacing: "0.04em",
                }}>
                  Need inspiration?
                </span>
              </div>
              <button
                id="journal-prompt-btn"
                onClick={randomPrompt}
                style={{
                  background: "rgba(126,184,212,0.1)",
                  border: "1px solid rgba(126,184,212,0.25)",
                  borderRadius: 100, padding: "0.35rem 0.9rem",
                  fontSize: "0.68rem", fontFamily: "'Syne', sans-serif",
                  fontWeight: 600, color: "var(--glow)",
                  cursor: "pointer", letterSpacing: "0.06em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(126,184,212,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(126,184,212,0.1)";
                }}
              >
                ✨ Random prompt
              </button>
            </div>

            {/* Active prompt display */}
            {activePrompt && (
              <div style={{
                padding: "0.9rem 1.3rem",
                background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(126,184,212,0.04))",
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
                  fontStyle: "italic", fontSize: "1.05rem", lineHeight: 1.6,
                  color: "var(--violet)",
                }}>
                  "{activePrompt}"
                </div>
              </div>
            )}

            {/* Textarea */}
            <div style={{ padding: "1.2rem 1.3rem 0.5rem" }}>
              <textarea
                ref={textareaRef}
                className="journal-textarea"
                placeholder="What's on your mind today…"
                value={text}
                onChange={e => setText(e.target.value)}
                rows={6}
              />
            </div>

            {/* Mood selector */}
            <div style={{
              padding: "0 1.3rem 0.8rem",
            }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: "0.7rem",
                fontWeight: 600, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "var(--mist)",
                marginBottom: "0.6rem",
              }}>
                How are you feeling?
              </div>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "0.4rem",
              }}>
                {MOODS.map(m => {
                  const active = selectedMood?.label === m.label;
                  return (
                    <button
                      key={m.label}
                      className="mood-chip"
                      onClick={() => setSelectedMood(active ? null : m)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.35rem",
                        padding: "0.4rem 0.75rem",
                        borderRadius: 100,
                        border: `1px solid ${active ? m.color : "rgba(255,255,255,0.08)"}`,
                        background: active ? `${m.color}20` : "rgba(255,255,255,0.03)",
                        color: active ? m.color : "var(--muted)",
                        fontSize: "0.72rem", fontFamily: "'DM Sans', sans-serif",
                        fontWeight: active ? 500 : 400,
                        cursor: "pointer",
                        transition: "all 0.18s ease",
                      }}
                    >
                      <span>{m.icon}</span>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.8rem 1.3rem",
              borderTop: "1px solid var(--border)",
              background: "rgba(0,0,0,0.15)",
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem",
                color: "var(--muted)",
              }}>
                {text.length > 0 ? `${text.length} characters` : "Start writing…"}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  id="journal-cancel-btn"
                  onClick={handleCancel}
                  style={{
                    padding: "0.5rem 1rem", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent", color: "var(--muted)",
                    fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  Cancel
                </button>
                <button
                  id="journal-save-btn"
                  onClick={handleSave}
                  disabled={!text.trim() || !selectedMood}
                  style={{
                    padding: "0.5rem 1.2rem", borderRadius: 10,
                    border: "none",
                    background: (!text.trim() || !selectedMood)
                      ? "rgba(126,184,212,0.15)"
                      : "linear-gradient(135deg, var(--glow), #5a9ec4)",
                    color: (!text.trim() || !selectedMood) ? "var(--muted)" : "var(--bg)",
                    fontSize: "0.75rem", fontFamily: "'Syne', sans-serif",
                    fontWeight: 700, cursor: (!text.trim() || !selectedMood) ? "default" : "pointer",
                    boxShadow: (!text.trim() || !selectedMood) ? "none" : "0 4px 16px rgba(126,184,212,0.3)",
                    transition: "all 0.25s",
                    letterSpacing: "0.04em",
                  }}
                >
                  Save entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Search + Filter bar ── */}
        {entries.length > 0 && (
          <div style={{
            marginTop: composing ? 0 : "1.5rem",
            marginBottom: "1rem",
            animation: "journalFadeIn 0.6s 0.4s both",
          }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "0.6rem 1rem",
              marginBottom: "0.75rem",
            }}>
              <span style={{ fontSize: "0.85rem", opacity: 0.5 }}>🔍</span>
              <input
                id="journal-search"
                type="text"
                placeholder="Search your entries…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
                  color: "var(--cream)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--muted)", fontSize: "0.7rem",
                  }}
                >✕</button>
              )}
            </div>

            {/* Mood filter pills */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "0.35rem",
              alignItems: "center",
            }}>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontSize: "0.6rem",
                fontWeight: 600, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "var(--muted)",
                marginRight: "0.3rem",
              }}>
                Filter:
              </span>
              <button
                className="filter-pill"
                onClick={() => setFilterMood(null)}
                style={{
                  padding: "0.3rem 0.65rem", borderRadius: 100,
                  border: `1px solid ${!filterMood ? "rgba(126,184,212,0.4)" : "rgba(255,255,255,0.06)"}`,
                  background: !filterMood ? "rgba(126,184,212,0.12)" : "transparent",
                  color: !filterMood ? "var(--glow)" : "var(--muted)",
                  fontSize: "0.68rem", fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                }}
              >All</button>
              {MOODS.map(m => {
                const active = filterMood === m.label;
                return (
                  <button
                    key={m.label}
                    className="filter-pill"
                    onClick={() => setFilterMood(active ? null : m.label)}
                    style={{
                      padding: "0.3rem 0.65rem", borderRadius: 100,
                      border: `1px solid ${active ? m.color + "66" : "rgba(255,255,255,0.06)"}`,
                      background: active ? `${m.color}18` : "transparent",
                      color: active ? m.color : "var(--muted)",
                      fontSize: "0.68rem", fontFamily: "'DM Sans', sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    {m.icon} {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Entries list ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
          {filtered.length === 0 && entries.length > 0 && (
            <div style={{
              textAlign: "center", padding: "3rem 1rem",
              color: "var(--muted)", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
            }}>
              No entries match your search.
            </div>
          )}

          {filtered.length === 0 && entries.length === 0 && !composing && (
            <div style={{
              textAlign: "center", padding: "4rem 1.5rem",
              animation: "journalFadeIn 0.8s 0.5s both",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📓</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                fontSize: "1.4rem", color: "var(--cream)", marginBottom: "0.5rem",
              }}>
                Your journal awaits
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
                color: "var(--muted)", lineHeight: 1.7, maxWidth: 360,
                margin: "0 auto",
              }}>
                Start writing to track your thoughts, moods, and growth.
                Every entry is private and stays on your device.
              </div>
            </div>
          )}

          {filtered.map((entry, i) => {
            const expanded = expandedId === entry.id;
            const shouldTruncate = entry.text.length > 180 && !expanded;

            return (
              <div
                key={entry.id}
                className="journal-entry-card"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${entry.moodColor}`,
                  borderRadius: 18,
                  padding: "1.2rem 1.35rem",
                  animation: `journalFadeIn 0.5s ${0.06 * Math.min(i, 8)}s both`,
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => setExpandedId(expanded ? null : entry.id)}
              >
                {/* Top row: mood + date */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: "0.7rem",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.45rem",
                    padding: "0.25rem 0.7rem", borderRadius: 100,
                    background: `${entry.moodColor}15`,
                    border: `1px solid ${entry.moodColor}30`,
                  }}>
                    <span style={{ fontSize: "0.85rem" }}>{entry.moodIcon}</span>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
                      fontWeight: 500, color: entry.moodColor,
                    }}>{entry.mood}</span>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                  }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
                      color: "var(--muted)", letterSpacing: "0.04em",
                    }}>
                      {relativeTime(entry.date)}
                    </span>
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (deleteConfirm === entry.id) handleDelete(entry.id);
                        else setDeleteConfirm(entry.id);
                      }}
                      onMouseLeave={() => setDeleteConfirm(null)}
                      style={{
                        background: deleteConfirm === entry.id ? "rgba(240,98,146,0.15)" : "none",
                        border: deleteConfirm === entry.id ? "1px solid rgba(240,98,146,0.3)" : "1px solid transparent",
                        borderRadius: 8, padding: "0.2rem 0.4rem",
                        cursor: "pointer", fontSize: "0.7rem",
                        color: deleteConfirm === entry.id ? "#f06292" : "var(--muted)",
                        transition: "all 0.15s ease",
                        opacity: 0.6,
                      }}
                    >
                      {deleteConfirm === entry.id ? "Confirm?" : "🗑"}
                    </button>
                  </div>
                </div>

                {/* Prompt */}
                {entry.prompt && (
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                    fontSize: "0.85rem", color: "var(--violet)", marginBottom: "0.5rem",
                    opacity: 0.8,
                  }}>
                    Prompt: "{entry.prompt}"
                  </div>
                )}

                {/* Body text */}
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                  lineHeight: 1.75, color: "var(--cream)",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                }}>
                  {shouldTruncate ? entry.text.slice(0, 180) + "…" : entry.text}
                </p>

                {entry.text.length > 180 && (
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem",
                    color: "var(--glow)", marginTop: "0.5rem",
                    letterSpacing: "0.06em",
                  }}>
                    {expanded ? "Show less ↑" : "Read more ↓"}
                  </div>
                )}

                {/* Date detail on expanded */}
                {expanded && (
                  <div style={{
                    marginTop: "0.8rem", paddingTop: "0.6rem",
                    borderTop: "1px solid var(--border)",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
                    color: "var(--muted)", letterSpacing: "0.04em",
                  }}>
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
