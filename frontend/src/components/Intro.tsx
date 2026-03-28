import { useEffect, useState } from "react";

interface IntroProps {
  onComplete: () => void;
}

const CYCLE_WORDS = [
  { word: "Heard", color: "#7aad96" },
  { word: "Seen", color: "#7eb8d4" },
  { word: "Safe", color: "#d4956a" },
  { word: "Loved", color: "#c9849a" },
];

type Scene = "s1" | "s2" | "s3";

export default function Intro({ onComplete }: IntroProps) {
  const [scene, setScene] = useState<Scene>("s1");
  const [s1Visible, setS1Visible] = useState(true);
  const [s2Visible, setS2Visible] = useState(false);
  const [s3Visible, setS3Visible] = useState(false);
  const [cycleIdx, setCycleIdx] = useState(0);
  const [wordAnim, setWordAnim] = useState<"in" | "out">("in");

  // ── Helper: transition S1 → S2 (only triggered by button click) ───────
  const goToS2 = () => {
    setS1Visible(false);
    setTimeout(() => {
      setScene("s2");
      setS2Visible(true);
    }, 900);
  };

  // ── Scene 2: word cycling ───────────────────────────────────────────────
  useEffect(() => {
    if (scene !== "s2") return;

    let idx = 0;
    let cancelled = false;

    const cycleWord = () => {
      if (cancelled) return;
      setWordAnim("in");
      setCycleIdx(idx);

      const isLast = idx === CYCLE_WORDS.length - 1;

      setTimeout(() => {
        if (cancelled) return;
        if (!isLast) {
          setWordAnim("out");
          setTimeout(() => {
            if (cancelled) return;
            idx++;
            cycleWord();
          }, 480);
        } else {
          // Last word — linger, then go to scene 3
          setTimeout(() => {
            if (cancelled) return;
            setS2Visible(false);
            setTimeout(() => {
              if (cancelled) return;
              setScene("s3");
              setS3Visible(true);
            }, 800);
          }, 1800);
        }
      }, isLast ? 0 : 820);
    };

    const t = setTimeout(cycleWord, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [scene]);

  // ── Scene 3: transition to app ──────────────────────────────────────────
  useEffect(() => {
    if (scene !== "s3") return;
    const t = setTimeout(() => {
      setS3Visible(false);
      setTimeout(onComplete, 900);
    }, 3600);
    return () => clearTimeout(t);
  }, [scene, onComplete]);

  // ── Shared base style for each scene layer ──────────────────────────────
  const sceneBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.9s ease, filter 0.9s ease, transform 0.9s ease",
    pointerEvents: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ══════════════ Scene 1 ══════════════ */}
      <div
        style={{
          ...sceneBase,
          opacity: s1Visible ? 1 : 0,
          filter: s1Visible ? "blur(0px)" : "blur(12px)",
          transform: s1Visible ? "translateY(0)" : "translateY(-2%)",
          pointerEvents: s1Visible ? "all" : "none",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.55rem,1.1vw,0.7rem)",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "var(--glow)",
            marginBottom: "1.6rem",
            animation: "fadeInUp 1.1s 0.1s both",
          }}
        >
          A space to feel · heal · grow
        </div>

        {/* "You are not" — char-by-char */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "clamp(3.5rem,8.5vw,7.5rem)",
            lineHeight: 1.03,
            color: "var(--cream)",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          {"You are not".split("").map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                animation: `charIn 0.6s ${0.6 + i * 0.048}s both cubic-bezier(0.22,1,0.36,1)`,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>

        {/* "alone." — italic glow, char-by-char */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(3.5rem,8.5vw,7.5rem)",
            lineHeight: 1.03,
            color: "var(--glow)",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          {"alone.".split("").map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                animation: `charIn 0.75s ${1.4 + i * 0.072}s both cubic-bezier(0.22,1,0.36,1)`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Subline */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.78rem,1.5vw,0.95rem)",
            color: "var(--mist)",
            letterSpacing: "0.1em",
            marginTop: "1.8rem",
            textAlign: "center",
            animation: "fadeInUp 0.9s 2.1s both",
          }}
        >
          Mental wellness begins with one honest moment.
        </div>

        {/* CTA — ONLY ONE BUTTON NOW */}
        <div
          style={{
            marginTop: "2.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInUp 0.8s 2.6s both",
          }}
        >
          <button
            onClick={goToS2}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--bg)",
              background: "var(--glow)",
              border: "none",
              padding: "0.85rem 2.4rem",
              borderRadius: "100px",
              cursor: "pointer",
              boxShadow: "0 0 28px rgba(126,184,212,0.35)",
              transition: "box-shadow 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 44px rgba(126,184,212,0.55)";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 28px rgba(126,184,212,0.35)";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Begin the journey
          </button>
        </div>
      </div>

      {/* ══════════════ Scene 2 ══════════════ */}
      <div
        style={{
          ...sceneBase,
          opacity: s2Visible ? 1 : 0,
          filter: s2Visible ? "blur(0px)" : "blur(12px)",
          transform: s2Visible ? "scale(1)" : "scale(1.04)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.85rem,1.7vw,1.1rem)",
            letterSpacing: "0.25em",
            color: "var(--mist)",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
            animation: s2Visible ? "fadeInUp 0.85s 0.1s both" : "none",
          }}
        >
          You deserve to feel
        </div>

        <div
          style={{
            position: "relative",
            height: "clamp(5rem,12vw,9.5rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90vw",
            overflow: "hidden",
          }}
        >
          {CYCLE_WORDS.map((w, i) => (
            <div
              key={w.word}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(4rem,11vw,9rem)",
                textAlign: "center",
                lineHeight: 1,
                position: "absolute",
                letterSpacing: "-0.02em",
                color: w.color,
                opacity: i === cycleIdx ? undefined : 0,
                animation:
                  i === cycleIdx
                    ? wordAnim === "in"
                      ? "wordIn 0.72s cubic-bezier(0.22,1,0.36,1) forwards"
                      : "wordOut 0.48s ease-in forwards"
                    : "none",
              }}
            >
              {w.word}
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.68rem,1.3vw,0.84rem)",
            letterSpacing: "0.22em",
            color: "rgba(168,184,204,0.55)",
            textTransform: "uppercase",
            marginTop: "1.3rem",
            animation: s2Visible ? "fadeInUp 0.9s 0.8s both" : "none",
          }}
        >
          and that is only the beginning
        </div>
      </div>

      {/* ══════════════ Scene 3 ══════════════ */}
      <div
        style={{
          ...sceneBase,
          opacity: s3Visible ? 1 : 0,
          filter: s3Visible ? "blur(0px)" : "blur(16px)",
          transform: s3Visible ? "scale(1)" : "scale(1.03)",
        }}
      >
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg,transparent,rgba(126,184,212,0.45),transparent)",
            marginBottom: "1.3rem",
            animation: s3Visible ? "lineExpand 1.1s 0.1s both" : "none",
          }}
        />
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: "clamp(4rem,10vw,8.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            textAlign: "center",
            animation: s3Visible ? "introPop 1.4s 0.2s both" : "none",
          }}
        >
          Sahara
        </div>
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg,transparent,rgba(126,184,212,0.45),transparent)",
            marginTop: "1.3rem",
            animation: s3Visible ? "lineExpand 1.1s 0.3s both" : "none",
          }}
        />
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.62rem,1.2vw,0.78rem)",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: "var(--glow)",
            textAlign: "center",
            marginTop: "0.6rem",
            animation: s3Visible ? "fadeInUp 0.9s 1.0s both" : "none",
          }}
        >
          Your mental wellness companion
        </div>
      </div>
    </div>
  );
}