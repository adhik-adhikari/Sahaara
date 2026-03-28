import { useEffect, useRef, useState } from "react";
import { QUOTES } from "../lib/data";

export default function QuoteCard() {
  const [idx, setIdx]         = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 500);
    }, 9000);
    return () => clearInterval(timerRef.current);
  }, []);

  const q = QUOTES[idx];

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(126,184,212,0.06), rgba(122,173,150,0.04))",
      border: "1px solid rgba(126,184,212,0.15)",
      borderRadius: 18, padding: "1.6rem",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(-6px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontStyle: "italic", fontSize: "1.15rem", lineHeight: 1.6,
        color: "var(--cream)", marginBottom: "0.8rem",
      }}>
        {q.text}
      </div>
      <div style={{
        fontSize: "0.7rem", letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--muted)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        — {q.attr}
      </div>
    </div>
  );
}
