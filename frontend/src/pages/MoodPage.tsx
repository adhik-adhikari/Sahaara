import { useState } from "react";
import questions from "../data/moodQuestions.json"; // adjust path as needed


const severity: Record<string, number> = {
  joy: 0, content: 0, restful: 0, bonded: 0, recov: 0, vsup: 0,
  growing: 1, ssup: 1, tired: 1, motions: 2, interrupted: 1,
  toolittle: 2, toomuch: 2, restless: 2, numb: 2, tense: 2,
  sad: 2, overwhelmed: 3, detached: 3, anxious: 2, pain: 2, exhausted: 3,
  hopeless: 4, nodidnt: 3, resentful: 3, alone: 3, misund: 3,
  judged: 3, discbody: 3, invis: 4,
};

type ResultLevel = "success" | "warning" | "danger";

interface Result {
  label: string;
  level: ResultLevel;
  msg: string;
}

function getResult(answers: Record<number, string>): Result {
  const score = Object.values(answers).reduce((s, k) => s + (severity[k] || 0), 0);
  if (score <= 3)
    return { label: "Doing well", level: "success", msg: "You seem to be in a good place. Keep nurturing yourself and reach out if anything shifts." };
  if (score <= 8)
    return { label: "Mild strain", level: "warning", msg: "You may be experiencing some strain. It is okay to ask for help — talk to someone you trust or a health worker." };
  if (score <= 13)
    return { label: "Difficult time", level: "danger", msg: "You seem to be going through a difficult period. Please consider speaking with a midwife, doctor, or counselor soon." };
  return { label: "Support needed", level: "danger", msg: "It sounds like you are really struggling right now. Please reach out to a healthcare provider today. You are not alone." };
}

const statusStyles: Record<ResultLevel, React.CSSProperties> = {
  success: { background: "#DCFCE7", color: "#166534" },
  warning: { background: "#FEF9C3", color: "#854D0E" },
  danger: { background: "#FEE2E2", color: "#991B1B" },
};

export default function MoodPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const q = questions[current];

  const select = (qId: number, key: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: key }));
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent((c) => c + 1);
    }, 300);
  };

  const goBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const goNext = () => {
    if (!answers[q.id]) return;
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else setShowResult(true);
  };

  const restart = () => {
    setCurrent(0);
    setAnswers({});
    setShowResult(false);
  };

  const pct = Math.round((current / questions.length) * 100);
  const result = getResult(answers);
  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }

      .opt-card {
        background: #111; /* darker card */
        border: 1px solid #333;
        border-radius: 14px;
        padding: 14px 12px;
        cursor: pointer;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        transition: border-color 0.15s, transform 0.1s, box-shadow 0.15s;
        color: #eee;
      }
      .opt-card:hover {
        border-color: #888;
        box-shadow: 0 2px 8px rgba(255,255,255,0.1);
        transform: translateY(-1px);
      }
      .opt-card.selected {
        border: 2px solid #0F72EA;
        box-shadow: 0 2px 12px rgba(255,255,255,0.15);
      }

      .btn-primary {
        background: #0F72EA;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px 22px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: opacity 0.15s;
      }
      .btn-primary:disabled { opacity: 0.25; cursor: default; }
      .btn-primary:hover:not(:disabled) { opacity: 0.85; }

      .btn-secondary {
        background: transparent;
        color: #aaa;
        border: 1px solid #555;
        border-radius: 10px;
        padding: 10px 22px;
        font-size: 14px;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s;
      }
      .btn-secondary:disabled { opacity: 0.3; cursor: default; }
      .btn-secondary:hover:not(:disabled) { background: #222; }

      @keyframes fadeSlide {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-in { animation: fadeSlide 0.25s ease both; }
    `}</style>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>
            Welcome TO Mood Check-in
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
            How are you feeling today?
          </h1>
          <p style={{ marginTop: 6, fontSize: 14, color: "#ccc", lineHeight: 1.6 }}>
            A private, safe space to check in with yourself. No wrong answers.
          </p>
        </div>
        {!showResult ? (
          <div className="animate-in" key={current}>

            {/* Previous answer chips */}
            {current > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                {questions.slice(0, current).map((pq) => {
                  const key = answers[pq.id];
                  const opt = key && pq.options.find((o) => o.key === key);
                  return opt ? (
                    <span
                      key={pq.id}
                      style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 99,
                        background: opt.bg + "99", border: `1px solid ${opt.bg}`,
                        color: "#334155", display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      {opt.icon} {opt.label}
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Progress bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 3, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: "#0F172A", borderRadius: 99,
                  transition: "width 0.4s ease",
                }} />
              </div>
              <span style={{ fontSize: 12, color: "#94A3B8", whiteSpace: "nowrap" }}>
                {current + 1} / {questions.length}
              </span>
            </div>

            {/* Question */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#94A3B8", textTransform: "uppercase", marginBottom: 6 }}>
                Question {current + 1}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#94A3B8", lineHeight: 1.4 }}>
                {q.text}
              </h2>
            </div>

            {/* Options grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 24 }}>
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.key;
                return (
                  <div
                    key={opt.key}
                    className={`opt-card${selected ? " selected" : ""}`}
                    onClick={() => select(q.id, opt.key)}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: opt.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                    }}>
                      {opt.icon}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A", lineHeight: 1.2 }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.4 }}>
                      {opt.desc}
                    </div>
                    {selected && (
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%",
                        background: "#0F172A",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, color: "#fff", marginTop: 2,
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn-secondary" onClick={goBack} disabled={current === 0}>
                ← Back
              </button>
              <button className="btn-primary" onClick={goNext} disabled={!answers[q.id]}>
                {current === questions.length - 1 ? "See results" : "Next →"}
              </button>
            </div>
          </div>
        ) : (
          /* Results screen */
          <div className="animate-in">
            <div style={{
              background: "#fff", border: "1px solid #E2E8F0",
              borderRadius: 16, padding: "28px 24px", marginBottom: 12,
            }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#94A3B8", textTransform: "uppercase", marginBottom: 16 }}>
                Your check-in result
              </div>

              <span style={{
                ...statusStyles[result.level],
                fontSize: 13, fontWeight: 500,
                padding: "4px 12px", borderRadius: 99,
                display: "inline-block", marginBottom: 14,
              }}>
                {result.label}
              </span>

              <p style={{ fontSize: 16, fontWeight: 500, color: "#0F172A", lineHeight: 1.6, marginBottom: 20 }}>
                {result.msg}
              </p>

              <div style={{ height: 1, background: "#F1F5F9", marginBottom: 16 }} />

              <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#94A3B8", textTransform: "uppercase", marginBottom: 12 }}>
                Your responses
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {questions.map((pq) => {
                  const key = answers[pq.id];
                  const opt = key && pq.options.find((o) => o.key === key);
                  return opt ? (
                    <span key={pq.id} style={{
                      fontSize: 13, padding: "6px 12px", borderRadius: 10,
                      background: opt.bg + "88", border: `1px solid ${opt.bg}`,
                      color: "#334155", display: "flex", alignItems: "center", gap: 6,
                    }}>
                      {opt.icon} {opt.label}
                    </span>
                  ) : null;
                })}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={restart}>
                  Check in again
                </button>
                <button className="btn-secondary">
                  Find support
                </button>
              </div>
            </div>

            <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7, textAlign: "center" }}>
              This is not a clinical diagnosis. If you are in distress,
              please contact a healthcare provider or a trusted person in your community.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
