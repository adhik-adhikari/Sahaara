import { useEffect, useRef, useState } from "react";
import { BREATH_PHASES } from "../lib/data";

export default function BreathingWidget() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [scale, setScale]       = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const phase = BREATH_PHASES[phaseIdx];
    setScale(phase.scale);

    timerRef.current = setTimeout(() => {
      setPhaseIdx(i => (i + 1) % BREATH_PHASES.length);
    }, phase.dur * 1000);

    return () => clearTimeout(timerRef.current);
  }, [phaseIdx]);

  const phase = BREATH_PHASES[phaseIdx];

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 18, padding: "1.4rem 1.6rem",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 600,
        fontSize: "0.8rem", letterSpacing: "0.1em",
        textTransform: "uppercase", color: "var(--mist)",
      }}>
        Quick Breathing Exercise
      </div>

      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        border: "1px solid rgba(126,184,212,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: "50%",
          background: `radial-gradient(circle, ${phase.color}30, transparent 70%)`,
          border: `1px solid ${phase.color}88`,
          boxShadow: `0 0 20px ${phase.color}44`,
          transform: `scale(${scale})`,
          transition: `transform ${phase.dur * 0.9}s ease-in-out, border-color 0.5s, box-shadow 0.5s`,
        }} />
      </div>

      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem",
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: phase.color, transition: "color 0.4s",
      }}>
        {phase.label}
      </div>
    </div>
  );
}
