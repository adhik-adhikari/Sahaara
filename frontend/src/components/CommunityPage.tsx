import { useCallback, useMemo, useState } from "react";

/** Onboarding should set this key to one of the stressor ids below (see `peerGroupForStressor`). */
export const SAHAARA_ONBOARDING_STRESSOR_KEY = "sahaara_onboarding_stressor";

type OnboardingStressorId =
  | "final_year"
  | "job_seeking"
  | "early_career"
  | "burnout"
  | "general";

type Platform = "reddit" | "facebook" | "discord";

interface ExternalCommunity {
  platform: Platform;
  label: string;
  url: string;
}

interface PeerGroup {
  id: string;
  title: string;
  description: string;
  memberCount: number;
  accent: string;
  communities: ExternalCommunity[];
}

const PEER_GROUPS: PeerGroup[] = [
  {
    id: "final-year",
    title: "Final Year Students",
    description:
      "Capstone stress, deadlines, and graduation anxiety — share study rhythms, ask for proofreads, and celebrate small wins together.",
    memberCount: 18420,
    accent: "var(--glow)",
    communities: [
      { platform: "reddit", label: "r/college", url: "https://www.reddit.com/r/college/" },
      { platform: "facebook", label: "Grad support circle", url: "https://www.facebook.com/groups/" },
      { platform: "discord", label: "Thesis & finals lounge", url: "https://discord.com/channels/@me" },
    ],
  },
  {
    id: "job-seekers",
    title: "Job Seekers",
    description:
      "Interview prep, rejection resilience, and networking without burnout — peer encouragement while you search.",
    memberCount: 23100,
    accent: "var(--amber)",
    communities: [
      { platform: "reddit", label: "r/jobs", url: "https://www.reddit.com/r/jobs/" },
      { platform: "facebook", label: "Career transition hub", url: "https://www.facebook.com/groups/" },
      { platform: "discord", label: "Interview buddy server", url: "https://discord.com/channels/@me" },
    ],
  },
  {
    id: "early-career",
    title: "Early Career Professionals",
    description:
      "First roles, imposter feelings, and setting boundaries at work — normalize the messy middle of starting out.",
    memberCount: 15680,
    accent: "var(--sage)",
    communities: [
      { platform: "reddit", label: "r/careerguidance", url: "https://www.reddit.com/r/careerguidance/" },
      { platform: "facebook", label: "New grads at work", url: "https://www.facebook.com/groups/" },
      { platform: "discord", label: "First-job cohort", url: "https://discord.com/channels/@me" },
    ],
  },
  {
    id: "burnout-recovery",
    title: "Burnout Recovery",
    description:
      "Rest-first peers who get exhaustion, cynicism, and recovery pacing — no hustle talk, just honest recovery steps.",
    memberCount: 9875,
    accent: "var(--rose)",
    communities: [
      { platform: "reddit", label: "r/burnout", url: "https://www.reddit.com/r/burnout/" },
      { platform: "facebook", label: "Gentle recovery group", url: "https://www.facebook.com/groups/" },
      { platform: "discord", label: "Rest & reset", url: "https://discord.com/channels/@me" },
    ],
  },
];

const SUPPORT_LINKS: { label: string; description: string; url: string }[] = [
  {
    label: "988 Suicide & Crisis Lifeline",
    description: "Call or text 988 (US) — free, 24/7 crisis support.",
    url: "https://988lifeline.org/",
  },
  {
    label: "Crisis Text Line",
    description: "Text HOME to 741741 to connect with a crisis counselor.",
    url: "https://www.crisistextline.org/",
  },
  {
    label: "SAMHSA National Helpline",
    description: "Treatment referral and information (US), 1-800-662-4357.",
    url: "https://www.samhsa.gov/find-help/national-helpline",
  },
  {
    label: "Find a therapist (Psychology Today)",
    description: "Directory to search licensed providers by location and focus.",
    url: "https://www.psychologytoday.com/us/therapists",
  },
];

function readStoredStressor(): OnboardingStressorId {
  try {
    const raw = localStorage.getItem(SAHAARA_ONBOARDING_STRESSOR_KEY);
    if (
      raw === "final_year" ||
      raw === "job_seeking" ||
      raw === "early_career" ||
      raw === "burnout" ||
      raw === "general"
    ) {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return "general";
}

const STRESSOR_TO_GROUP_ID: Record<OnboardingStressorId, string> = {
  final_year: "final-year",
  job_seeking: "job-seekers",
  early_career: "early-career",
  burnout: "burnout-recovery",
  general: "final-year",
};

function peerGroupForStressor(stressor: OnboardingStressorId): PeerGroup {
  const id = STRESSOR_TO_GROUP_ID[stressor];
  return PEER_GROUPS.find((g) => g.id === id) ?? PEER_GROUPS[0];
}

function formatMembers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k members`;
  return `${n} members`;
}

function platformBadge(platform: Platform): { text: string; bg: string } {
  switch (platform) {
    case "reddit":
      return { text: "Reddit", bg: "rgba(255,69,0,0.15)" };
    case "facebook":
      return { text: "Facebook", bg: "rgba(24,119,242,0.15)" };
    case "discord":
      return { text: "Discord", bg: "rgba(88,101,242,0.2)" };
    default:
      return { text: platform, bg: "rgba(255,255,255,0.08)" };
  }
}

export default function CommunityPage() {
  const stressor = useMemo(() => readStoredStressor(), []);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(() => new Set());
  const [toast, setToast] = useState<string | null>(null);

  const recommended = useMemo(() => peerGroupForStressor(stressor), [stressor]);

  const join = useCallback((id: string, title: string) => {
    setJoinedIds((prev) => new Set(prev).add(id));
    setToast(`You're in — welcome to ${title}.`);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const cardBase: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "1.35rem 1.5rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "2rem 2.5rem 4rem",
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "'DM Sans', sans-serif",
        /* Hex + vars: avoids “invisible” text if :root vars fail to apply under some stacks */
        color: "var(--cream, #f0ebe3)",
      }}
    >
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            padding: "0.65rem 1.25rem",
            borderRadius: 100,
            background: "rgba(126,184,212,0.18)",
            border: "1px solid rgba(126,184,212,0.35)",
            color: "var(--cream)",
            fontSize: "0.8rem",
            letterSpacing: "0.04em",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}
        >
          {toast}
        </div>
      )}

      <header style={{ marginBottom: "2.25rem" }}>
        <a
          href="/"
          data-interactive
          style={{
            display: "inline-block",
            fontSize: "0.72rem",
            color: "var(--muted)",
            textDecoration: "none",
            letterSpacing: "0.06em",
            marginBottom: "1rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          ← Mood check-in
        </a>
        <p
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--glow)",
            marginBottom: "0.6rem",
          }}
        >
          Community
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: "clamp(1.85rem, 4vw, 2.35rem)",
            letterSpacing: "0.06em",
            lineHeight: 1.2,
            marginBottom: "0.5rem",
          }}
        >
          Peer groups & spaces
        </h1>
        <p style={{ color: "var(--mist)", fontSize: "0.92rem", lineHeight: 1.65, maxWidth: 560 }}>
          Browse categorized peer communities. Each group links out to example spaces on Reddit, Facebook, and Discord
          (replace with your real invites later). Joining here is a gentle local confirmation — external links open in a
          new tab.
        </p>
      </header>

      {/* FR-31 Recommended */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "1rem",
          }}
        >
          Recommended for you
        </h2>
        <div
          style={{
            ...cardBase,
            borderColor: "rgba(126,184,212,0.28)",
            boxShadow: "0 0 0 1px rgba(126,184,212,0.08), 0 12px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ flex: "1 1 220px" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: recommended.accent,
                  marginBottom: "0.45rem",
                }}
              >
                Based on your onboarding stressor
              </span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.45rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                {recommended.title}
              </h3>
              <p style={{ color: "var(--mist)", fontSize: "0.88rem", lineHeight: 1.6 }}>{recommended.description}</p>
              <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--muted)" }}>
                {formatMembers(recommended.memberCount)} · mock count for demo
              </p>
            </div>
            <button
              type="button"
              data-interactive
              disabled={joinedIds.has(recommended.id)}
              onClick={() => !joinedIds.has(recommended.id) && join(recommended.id, recommended.title)}
              style={{
                alignSelf: "center",
                padding: "0.65rem 1.4rem",
                borderRadius: 100,
                border: joinedIds.has(recommended.id) ? "1px solid rgba(77,208,164,0.35)" : "1px solid rgba(126,184,212,0.35)",
                background: joinedIds.has(recommended.id) ? "rgba(77,208,164,0.12)" : "rgba(126,184,212,0.12)",
                color: joinedIds.has(recommended.id) ? "var(--sage)" : "var(--glow)",
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: joinedIds.has(recommended.id) ? "default" : "pointer",
              }}
            >
              {joinedIds.has(recommended.id) ? "Joined" : "Join"}
            </button>
          </div>
          <div style={{ marginTop: "1.15rem", paddingTop: "1.15rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.65rem" }}>
              External communities
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {recommended.communities.map((c) => {
                const b = platformBadge(c.platform);
                return (
                  <a
                    key={`${recommended.id}-${c.platform}`}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-interactive
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 0.85rem",
                      borderRadius: 10,
                      background: b.bg,
                      color: "var(--cream)",
                      textDecoration: "none",
                      fontSize: "0.78rem",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ opacity: 0.85 }}>{b.text}</span>
                    <span style={{ color: "var(--mist)" }}>{c.label}</span>
                    <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>↗</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FR-28–30 All groups */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "1rem",
          }}
        >
          All peer groups
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {PEER_GROUPS.map((g) => (
            <article
              key={g.id}
              style={{
                ...cardBase,
                borderLeft: `3px solid ${g.accent}`,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                <div style={{ flex: "1 1 240px" }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    {g.title}
                  </h3>
                  <p style={{ color: "var(--mist)", fontSize: "0.86rem", lineHeight: 1.6 }}>{g.description}</p>
                  <p style={{ marginTop: "0.65rem", fontSize: "0.78rem", color: "var(--muted)" }}>
                    {formatMembers(g.memberCount)}
                  </p>
                </div>
                <button
                  type="button"
                  data-interactive
                  disabled={joinedIds.has(g.id)}
                  onClick={() => !joinedIds.has(g.id) && join(g.id, g.title)}
                  style={{
                    alignSelf: "center",
                    padding: "0.55rem 1.2rem",
                    borderRadius: 100,
                    border: joinedIds.has(g.id) ? "1px solid rgba(77,208,164,0.35)" : "1px solid var(--border)",
                    background: joinedIds.has(g.id) ? "rgba(77,208,164,0.1)" : "transparent",
                    color: joinedIds.has(g.id) ? "var(--sage)" : "var(--mist)",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: joinedIds.has(g.id) ? "default" : "pointer",
                  }}
                >
                  {joinedIds.has(g.id) ? "Joined" : "Join"}
                </button>
              </div>
              <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {g.communities.map((c) => {
                  const b = platformBadge(c.platform);
                  return (
                    <a
                      key={`${g.id}-${c.platform}`}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-interactive
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.4rem 0.75rem",
                        borderRadius: 8,
                        background: b.bg,
                        color: "var(--cream)",
                        textDecoration: "none",
                        fontSize: "0.74rem",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {b.text} · {c.label} ↗
                    </a>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Support links */}
      <section>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "1rem",
          }}
        >
          If you need immediate support
        </h2>
        <p style={{ color: "var(--mist)", fontSize: "0.85rem", lineHeight: 1.65, marginBottom: "1rem" }}>
          These are independent resources. Use them if you or someone you know is in crisis or needs professional help.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {SUPPORT_LINKS.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-interactive
                style={{
                  display: "block",
                  padding: "1rem 1.15rem",
                  borderRadius: 12,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.2s",
                }}
              >
                <span style={{ color: "var(--glow)", fontSize: "0.88rem", fontWeight: 500 }}>{s.label}</span>
                <span style={{ display: "block", marginTop: "0.35rem", fontSize: "0.8rem", color: "var(--mist)", lineHeight: 1.5 }}>
                  {s.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
