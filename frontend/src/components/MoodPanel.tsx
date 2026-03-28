import { useState } from "react";
import { MOOD_PILLS } from "../lib/data";

export default function MoodPanel() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 18, padding: "1.4rem 1.6rem",
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 600,
        fontSize: "0.8rem", letterSpacing: "0.1em",
        textTransform: "uppercase", color: "var(--mist)",
        marginBottom: "1.1rem",
      }}>
        How are you feeling?
      </div>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        {MOOD_PILLS.map(pill => (
          <div
            key={pill.mood}
            data-interactive
            onClick={() => setSelected(pill.mood)}
            style={{
              padding: "0.45rem 1rem", borderRadius: "100px",
              fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif",
              cursor: "none", border: `1px solid ${pill.border}`,
              background: pill.bg, color: pill.color,
              opacity: selected && selected !== pill.mood ? 0.6 : 1,
              transform: selected === pill.mood ? "scale(1.06)" : "scale(1)",
              transition: "opacity 0.2s, transform 0.2s",
            }}
          >
            {pill.mood}
          </div>
        ))}
      </div>
    </div>
  );
}
