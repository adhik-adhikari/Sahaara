import React, { useCallback, useMemo, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

export const SAHAARA_ONBOARDING_STRESSOR_KEY = "sahaara_onboarding_stressor";

const TOAST_DURATION_MS = 3200;

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface SupportLink {
  label: string;
  description: string;
  url: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

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

const STRESSOR_TO_GROUP_ID: Record<OnboardingStressorId, string> = {
  final_year: "final-year",
  job_seeking: "job-seekers",
  early_career: "early-career",
  burnout: "burnout-recovery",
  general: "final-year",
};

const SUPPORT_LINKS: SupportLink[] = [
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

const PLATFORM_BADGE: Record<Platform, { text: string; bg: string }> = {
  reddit: { text: "Reddit", bg: "rgba(255,69,0,0.15)" },
  facebook: { text: "Facebook", bg: "rgba(24,119,242,0.15)" },
  discord: { text: "Discord", bg: "rgba(88,101,242,0.2)" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readStoredStressor(): OnboardingStressorId {
  const VALID_IDS: OnboardingStressorId[] = [
    "final_year",
    "job_seeking",
    "early_career",
    "burnout",
    "general",
  ];
  try {
    const raw = localStorage.getItem(SAHAARA_ONBOARDING_STRESSOR_KEY);
    if (raw && VALID_IDS.includes(raw as OnboardingStressorId)) {
      return raw as OnboardingStressorId;
    }
  } catch {
    // localStorage unavailable — fall through to default
  }
  return "general";
}

function resolveRecommendedGroup(stressor: OnboardingStressorId): PeerGroup {
  const targetId = STRESSOR_TO_GROUP_ID[stressor];
  return PEER_GROUPS.find((g) => g.id === targetId) ?? PEER_GROUPS[0];
}

function formatMemberCount(n: number): string {
  return n >= 1000
    ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k members`
    : `${n} members`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CommunityLinkProps {
  community: ExternalCommunity;
  compact?: boolean;
}

function CommunityLink({ community, compact = false }: CommunityLinkProps) {
  const badge = PLATFORM_BADGE[community.platform];
  return (
    <a
      href={community.url}
      target="_blank"
      rel="noopener noreferrer"
      data-interactive
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? "0.35rem" : "0.4rem",
        padding: compact ? "0.4rem 0.75rem" : "0.45rem 0.85rem",
        borderRadius: compact ? 8 : 10,
        background: badge.bg,
        color: "var(--cream)",
        textDecoration: "none",
        fontSize: compact ? "0.74rem" : "0.78rem",
        border: "1px solid var(--border)",
      }}
    >
      {compact ? (
        <>{badge.text} · {community.label} ↗</>
      ) : (
        <>
          <span style={{ opacity: 0.85 }}>{badge.text}</span>
          <span style={{ color: "var(--mist)" }}>{community.label}</span>
          <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>↗</span>
        </>
      )}
    </a>
  );
}

interface JoinButtonProps {
  joined: boolean;
  onJoin: () => void;
  size?: "sm" | "md";
}

function JoinButton({ joined, onJoin, size = "md" }: JoinButtonProps) {
  const isSm = size === "sm";
  return (
    <button
      type="button"
      data-interactive
      disabled={joined}
      onClick={() => !joined && onJoin()}
      style={{
        alignSelf: "center",
        padding: isSm ? "0.55rem 1.2rem" : "0.65rem 1.4rem",
        borderRadius: 100,
        border: joined
          ? "1px solid rgba(77,208,164,0.35)"
          : `1px solid ${isSm ? "var(--border)" : "rgba(126,184,212,0.35)"}`,
        background: joined
          ? "rgba(77,208,164,0.1)"
          : isSm ? "transparent" : "rgba(126,184,212,0.12)",
        color: joined ? "var(--sage)" : isSm ? "var(--mist)" : "var(--glow)",
        fontFamily: "'Syne', sans-serif",
        fontSize: isSm ? "0.65rem" : "0.68rem",
        fontWeight: 600,
        letterSpacing: isSm ? "0.1em" : "0.12em",
        textTransform: "uppercase",
        cursor: joined ? "default" : "pointer",
      }}
    >
      {joined ? "Joined" : "Join"}
    </button>
  );
}

interface SectionHeadingProps {
  children: React.ReactNode;
}

function SectionHeading({ children }: SectionHeadingProps) {
  return (
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
      {children}
    </h2>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CommunityPage() {
  const stressor = useMemo(readStoredStressor, []);
  const recommended = useMemo(() => resolveRecommendedGroup(stressor), [stressor]);

  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set);
  const [toast, setToast] = useState<string | null>(null);

  const handleJoin = useCallback((id: string, title: string) => {
    setJoinedIds((prev) => new Set(prev).add(id));
    setToast(`You're in — welcome to ${title}.`);
    window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
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
        color: "var(--cream, #f0ebe3)",
      }}
    >
      {/* Toast notification */}
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

      {/* Page header */}
      <header style={{ marginBottom: "2.25rem" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--glow)", marginBottom: "0.6rem" }}>
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

      {/* Recommended group */}
      <section style={{ marginBottom: "2.5rem" }}>
        <SectionHeading>Recommended for you</SectionHeading>
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
              <p style={{ color: "var(--mist)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                {recommended.description}
              </p>
              <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--muted)" }}>
                {formatMemberCount(recommended.memberCount)} · mock count for demo
              </p>
            </div>
            <JoinButton
              joined={joinedIds.has(recommended.id)}
              onJoin={() => handleJoin(recommended.id, recommended.title)}
            />
          </div>

          <div style={{ marginTop: "1.15rem", paddingTop: "1.15rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.65rem" }}>
              External communities
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {recommended.communities.map((c) => (
                <CommunityLink key={`${recommended.id}-${c.platform}`} community={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All peer groups */}
      <section style={{ marginBottom: "2.5rem" }}>
        <SectionHeading>All peer groups</SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {PEER_GROUPS.map((group) => (
            <article
              key={group.id}
              style={{ ...cardBase, borderLeft: `3px solid ${group.accent}` }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                <div style={{ flex: "1 1 240px" }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                    {group.title}
                  </h3>
                  <p style={{ color: "var(--mist)", fontSize: "0.86rem", lineHeight: 1.6 }}>
                    {group.description}
                  </p>
                  <p style={{ marginTop: "0.65rem", fontSize: "0.78rem", color: "var(--muted)" }}>
                    {formatMemberCount(group.memberCount)}
                  </p>
                </div>
                <JoinButton
                  size="sm"
                  joined={joinedIds.has(group.id)}
                  onJoin={() => handleJoin(group.id, group.title)}
                />
              </div>
              <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {group.communities.map((c) => (
                  <CommunityLink key={`${group.id}-${c.platform}`} community={c} compact />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Crisis support links */}
      <section>
        <SectionHeading>If you need immediate support</SectionHeading>
        <p style={{ color: "var(--mist)", fontSize: "0.85rem", lineHeight: 1.65, marginBottom: "1rem" }}>
          These are independent resources. Use them if you or someone you know is in crisis or needs professional help.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {SUPPORT_LINKS.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
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
                <span style={{ color: "var(--glow)", fontSize: "0.88rem", fontWeight: 500 }}>
                  {link.label}
                </span>
                <span style={{ display: "block", marginTop: "0.35rem", fontSize: "0.8rem", color: "var(--mist)", lineHeight: 1.5 }}>
                  {link.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}