import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCheckInQuestions, submitCheckIn } from "../api/client";
import type { CheckInQuestion } from "../types";
import { setCheckInResult } from "../session";
import "./CheckIn.css";
import "./FormPages.css";

export default function CheckIn() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<CheckInQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { questions: q } = await fetchCheckInQuestions();
        if (!cancelled) {
          setQuestions(q);
          const initial: Record<string, string | number> = {};
          for (const item of q) {
            if (item.type === "scale" && item.min != null) {
              initial[item.id] = Math.round(((item.min ?? 1) + (item.max ?? 5)) / 2);
            } else {
              initial[item.id] = "";
            }
          }
          setAnswers(initial);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Failed to load questions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await submitCheckIn(answers);
      setCheckInResult(result);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkin-page">
        <p className="muted">Loading your pulse check-in…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="checkin-page">
        <p className="form-error">{loadError}</p>
        <p>
          <Link to="/dashboard">Skip to dashboard</Link> or ensure the API is running on port 8000.
        </p>
      </div>
    );
  }

  return (
    <div className="checkin-page">
      <h1 className="checkin-title">The Pulse</h1>
      <p className="checkin-lead">
        About 90 seconds. Your answers stay in this demo session to shape the dashboard—no real
        account yet.
      </p>

      <form className="checkin-form" onSubmit={onSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="checkin-block">
            <label className="checkin-prompt">{q.prompt}</label>
            {q.type === "scale" && q.min != null && q.max != null ? (
              <div className="scale-row">
                <input
                  type="range"
                  min={q.min}
                  max={q.max}
                  value={Number(answers[q.id] ?? q.min)}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: Number(e.target.value) }))
                  }
                />
                <span className="scale-value">{String(answers[q.id] ?? q.min)}</span>
              </div>
            ) : (
              <input
                type="text"
                className="checkin-text"
                placeholder={q.placeholder}
                value={String(answers[q.id] ?? "")}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              />
            )}
            {q.labels && q.type === "scale" ? (
              <div className="scale-labels">
                <span>{q.labels[String(q.min)]}</span>
                <span>{q.labels[String(q.max)]}</span>
              </div>
            ) : null}
          </div>
        ))}

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="checkin-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "See my dashboard"}
          </button>
          <Link to="/dashboard" className="btn btn-ghost">
            Skip for now
          </Link>
        </div>
      </form>
    </div>
  );
}
