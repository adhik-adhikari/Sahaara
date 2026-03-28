import { useEffect, useState } from "react";
import { animCount } from "../lib/utils";

interface StatCardProps {
  color: string;
  num: number;
  label: string;
  delta: string;
}

function StatCard({ color, num, label, delta }: StatCardProps) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 18, padding: "1.4rem 1.6rem",
      position: "relative", overflow: "hidden",
      animation: "fadeInUp 0.8s both",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, width: 3, height: "100%",
        background: color,
      }} />
      <div style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: "2.4rem", lineHeight: 1, color: "var(--cream)",
      }}>
        {num.toLocaleString()}
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--muted)", marginTop: "0.3rem",
      }}>
        {label}
      </div>
      <div style={{ fontSize: "0.7rem", fontFamily: "'DM Sans', sans-serif", color: "var(--sage)", marginTop: "0.6rem" }}>
        {delta}
      </div>
    </div>
  );
}

interface StatsColProps {
  totalPosts: number;
  onlineCount: number;
}

export default function StatsCol({ totalPosts, onlineCount }: StatsColProps) {
  const [members,  setMembers]  = useState(0);
  const [sessions, setSessions] = useState(0);
  const [posts,    setPosts]    = useState(0);
  const [online,   setOnline]   = useState(0);

  useEffect(() => {
    animCount(setMembers,  14820);
    animCount(setSessions, 38640);
  }, []);

  useEffect(() => { setPosts(totalPosts); },  [totalPosts]);
  useEffect(() => { setOnline(onlineCount); }, [onlineCount]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <StatCard color="var(--glow)"  num={members}  label="Community members"  delta="↑ 124 joined today" />
      <StatCard color="var(--sage)"  num={sessions} label="Sessions completed" delta="↑ 88% completion rate" />
      <StatCard color="var(--amber)" num={posts}    label="Posts shared today"  delta="Live · updating now" />
      <StatCard color="var(--rose)"  num={online}   label="Members online now"  delta="↑ Most active: 9pm" />
    </div>
  );
}
