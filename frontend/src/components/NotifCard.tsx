import { useState } from "react";
import { Post } from "../types";

const VISIBLE_MS = 4600;

interface NotifCardProps {
  post: Post;
}

export default function NotifCard({ post }: NotifCardProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(post.reactions);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setCount(c => c + 1);
  };

  return (
    <div
      style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 18, padding: "13px 15px",
        position: "relative", overflow: "hidden",
        borderLeft: `3px solid ${post.user.color}`,
        animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Progress drain bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, height: 2,
        borderRadius: "0 0 18px 18px",
        background: `linear-gradient(90deg,${post.user.color},${post.user.color}44)`,
        animation: `drainBar ${VISIBLE_MS}ms linear forwards`,
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
        <div style={{
          width: 37, height: 37, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#fff",
          fontFamily: "'Syne', sans-serif",
          background: `linear-gradient(135deg,${post.user.color}cc,${post.user.color}44)`,
          border: `2px solid ${post.user.color}44`,
          boxShadow: `0 0 14px ${post.user.color}33`,
          position: "relative",
        }}>
          {post.user.av}
          <div style={{
            position: "absolute", bottom: 1, right: 1,
            width: 8, height: 8, borderRadius: "50%",
            background: "#4dd0a4", border: "2px solid var(--card)",
            animation: "pulseGreen 2.5s ease-in-out infinite",
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: "var(--cream)" }}>
              {post.user.name}
            </span>
            <span style={{
              fontSize: 9, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              padding: "1px 7px", borderRadius: "100px", marginLeft: 5,
              background: `${post.user.color}20`, color: post.user.color,
              border: `1px solid ${post.user.color}40`,
            }}>
              {post.user.tag}
            </span>
          </div>
          <div style={{ fontSize: 10.5, color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
            @{post.user.handle} · just now
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          fontSize: 9, color: "#4dd0a4",
          fontFamily: "'Syne', sans-serif", fontWeight: 600,
          background: "rgba(77,208,164,0.08)",
          padding: "3px 7px", borderRadius: "100px",
          border: "1px solid rgba(77,208,164,0.2)", flexShrink: 0,
        }}>
          <div style={{ position: "relative", width: 7, height: 7 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#4dd0a4", opacity: 0.5, animation: "rippleOut 1.8s ease-out infinite" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4dd0a4", position: "relative" }} />
          </div>
          LIVE
        </div>
      </div>

      {/* Message */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
        lineHeight: 1.6, color: "var(--cream)",
        marginBottom: 10, paddingLeft: 47,
      }}>
        {post.message}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", gap: 5, paddingLeft: 47, marginBottom: 10, flexWrap: "wrap" }}>
        {post.tags.map(t => (
          <div key={t.label} style={{
            fontSize: 10, fontFamily: "'DM Sans', sans-serif",
            padding: "2px 8px", borderRadius: "100px",
            background: `${t.color}18`, color: t.color,
            border: `1px solid ${t.color}30`,
          }}>
            #{t.label}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        paddingLeft: 47, borderTop: "1px solid var(--border)", paddingTop: 9,
      }}>
        <button
          data-interactive
          onClick={handleLike}
          style={{
            background: "none", border: "none", cursor: "none",
            display: "flex", alignItems: "center", gap: 5,
            fontFamily: "'DM Sans', sans-serif", fontSize: 11.5,
            color: liked ? "#f06292" : "var(--muted)", transition: "color 0.2s",
          }}
        >
          <span style={{ transition: "transform 0.18s", display: "inline-block" }}>
            {liked ? "❤️" : "🤍"}
          </span>
          <span>{count}</span>
        </button>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: "var(--muted)" }}>
          {post.topReaction} Resonates
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: "var(--muted)", marginLeft: "auto" }}>
          💬 {post.replies}
        </span>
      </div>
    </div>
  );
}
