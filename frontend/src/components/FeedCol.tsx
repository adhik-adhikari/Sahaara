import { useEffect, useRef, useState, useCallback } from "react";
import { Post } from "../types";
import { USERS, MESSAGES, TAGS, REACTIONS } from "../lib/data";
import { rand, ri } from "../lib/utils";
import NotifCard from "./NotifCard";
import { useRequireAuth } from "../hooks/useRequireAuth";

interface HistoryItem {
  id: number;
  user: { av: string; name: string; color: string };
  preview: string;
}

interface FeedColProps {
  onStats: (posts: number, online: number) => void;
}

const VISIBLE_MS = 4600;
const ANIM_OUT_MS = 500;

let postId = 0;
function makePost(): Post {
  const tags = [...TAGS].sort(() => Math.random() - 0.5).slice(0, ri(1, 2));
  return {
    id: postId++, user: rand(USERS), message: rand(MESSAGES),
    reactions: ri(2, 28), replies: ri(0, 12),
    topReaction: rand(REACTIONS), tags, liked: false,
  };
}

export default function FeedCol({ onStats }: FeedColProps) {
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [typingUser, setTypingUser] = useState<typeof USERS[0] | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [onlineCount, setOnlineCount] = useState(57);
  const [totalPosts, setTotalPosts] = useState(0);
  const busy = useRef(false);
  const queue = useRef<Post[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const requireAuth = useRequireAuth();

  const addToHistory = useCallback((post: Post) => {
    setHistory(prev => [{
      id: post.id,
      user: { av: post.user.av, name: post.user.name, color: post.user.color },
      preview: post.message.slice(0, 55) + (post.message.length > 55 ? "…" : ""),
    }, ...prev].slice(0, 6));
  }, []);

  const showNext = useCallback(() => {
    if (queue.current.length === 0) { busy.current = false; return; }
    busy.current = true;
    const post = queue.current.shift()!;

    setTypingUser(post.user);

    timerRef.current = setTimeout(() => {
      setTypingUser(null);
      setActivePost(post);
      setTotalPosts(p => p + 1);
      setUnread(u => u + 1);

      timerRef.current = setTimeout(() => {
        setActivePost(null);
        addToHistory(post);
        setTimeout(() => showNext(), ANIM_OUT_MS);
      }, VISIBLE_MS);
    }, ri(1200, 2100));
  }, [addToHistory, onlineCount, onStats]);

  const enqueue = useCallback(() => {
    queue.current.push(makePost());
    if (!busy.current) showNext();
    setOnlineCount(c => Math.max(40, c + ri(-1, 3)));
  }, [showNext]);

  useEffect(() => {
    const tick = () => {
      enqueue();
      timerRef.current = setTimeout(tick, ri(1000, 2000));
    };
    timerRef.current = setTimeout(tick, 400);
    return () => clearTimeout(timerRef.current);
  }, [enqueue]);

  useEffect(() => {
    onStats(totalPosts, onlineCount);
  }, [onlineCount, totalPosts, onStats]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderBottom: "none", borderRadius: "22px 22px 0 0",
        padding: "1.2rem 1.4rem 1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--cream)", letterSpacing: "-0.01em" }}>
              Community Feed
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "'DM Sans', sans-serif", marginTop: "0.2rem" }}>
              Live messages from your people
            </div>
          </div>
          {unread > 0 && (
            <div
              data-interactive
              onClick={() => setUnread(0)}
              style={{
                background: "#f06292", color: "#fff",
                fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 700,
                padding: "2px 9px", borderRadius: "100px",
                cursor: "none", animation: "countPop 0.3s ease",
              }}
            >
              +{unread}
            </div>
          )}
        </div>

        {/* Online bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0.55rem 0.9rem",
          background: "rgba(77,208,164,0.05)",
          border: "1px solid rgba(77,208,164,0.13)",
          borderRadius: 10, marginTop: "0.8rem",
        }}>
          <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#4dd0a4", opacity: 0, animation: "rippleOut 2s ease-out infinite" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4dd0a4", position: "relative", zIndex: 1 }} />
          </div>
          <span style={{ fontSize: "0.72rem", color: "#4dd0a4", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            {onlineCount} members online now
          </span>
          <div style={{ marginLeft: "auto", display: "flex" }}>
            {USERS.slice(0, 5).map((u, i) => (
              <div key={u.id} style={{
                width: 22, height: 22, borderRadius: "50%",
                border: "2px solid var(--surface)",
                background: u.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7.5, fontWeight: 700, color: "#fff",
                fontFamily: "'Syne', sans-serif",
                marginLeft: i === 0 ? 0 : -7,
              }}>
                {u.av[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feed body */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "0 0 22px 22px",
        padding: "0.9rem 0.9rem 1.1rem",
        display: "flex", flexDirection: "column", gap: "0.7rem",
        minHeight: 360,
      }}>
        {/* Typing indicator */}
        {typingUser && (
          <div style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "9px 13px", background: "var(--card)",
            border: "1px solid var(--border)", borderRadius: 14,
            animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: "#fff",
              fontFamily: "'Syne', sans-serif",
              background: `linear-gradient(135deg,${typingUser.color}cc,${typingUser.color}44)`,
            }}>
              {typingUser.av}
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
                {typingUser.name} is sharing…
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 4.5, height: 4.5, borderRadius: "50%",
                    background: typingUser.color,
                    animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active card */}
        {activePost ? (
          <NotifCard key={activePost.id} post={activePost} />
        ) : !typingUser && (
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--muted)", fontSize: 12,
            fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em",
          }}>
            Listening for messages…
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: "0.9rem" }}>
          <div style={{
            fontSize: 9.5, color: "var(--muted)",
            fontFamily: "'Syne', sans-serif", letterSpacing: "0.12em",
            textTransform: "uppercase", marginBottom: "0.55rem",
          }}>
            Earlier
          </div>
          {history.map((item, i) => (
            <div key={item.id} data-interactive style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "7px 11px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 11, marginBottom: 5,
              opacity: Math.max(0.1, 0.7 - i * 0.1),
              transition: "background 0.2s",
              cursor: "none",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
            >
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7.5, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                background: `${item.user.color}44`, color: item.user.color,
              }}>
                {item.user.av}
              </div>
              <span style={{
                fontSize: 11.5, color: "var(--muted)", fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                <strong style={{ color: "rgba(232,234,240,0.45)", fontWeight: 500 }}>{item.user.name}</strong>
                {" · "}{item.preview}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Compose bar */}
      <div style={{
        marginTop: "0.75rem", background: "var(--surface)",
        border: "1px solid var(--border)", borderRadius: 15,
        padding: "0.75rem 1rem",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif",
          background: "linear-gradient(135deg, var(--glow), var(--rose))",
        }}>
          You
        </div>
        <div style={{ flex: 1, fontSize: 12.5, color: "var(--muted)", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
          Share something with the community…
        </div>
        <button data-interactive style={{
          background: "linear-gradient(135deg, var(--glow), #5a9ec4)",
          border: "none", borderRadius: 9,
          color: "var(--bg)", padding: "6px 14px",
          fontSize: 11.5, fontFamily: "'Syne', sans-serif", fontWeight: 700,
          cursor: "none", boxShadow: "0 3px 12px rgba(126,184,212,0.3)",
          transition: "box-shadow 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 5px 20px rgba(126,184,212,0.5)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 3px 12px rgba(126,184,212,0.3)")}
          onClick={() => requireAuth()
          }>
          Post
        </button>
      </div>
    </div>
  );
}
