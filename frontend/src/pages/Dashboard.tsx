import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboardSummary, fetchPosts } from "../api/client";
import type { CheckInResult, CommunityPost, Widget } from "../types";
import { getCheckInResult, getDemoUser } from "../session";
import { PostFeed } from "../components/PostFeed";
import "./Dashboard.css";
import "./FormPages.css";

export default function Dashboard() {
  const user = getDemoUser();
  const [checkIn, setCheckIn] = useState<CheckInResult | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [stats, setStats] = useState<{ check_ins_this_week: number; circles_joined: number } | null>(
    null
  );
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getCheckInResult();
    if (stored) {
      setCheckIn(stored);
      setWidgets(stored.suggested_widgets);
    }

    let cancelled = false;
    (async () => {
      try {
        const [summary, feed] = await Promise.all([fetchDashboardSummary(), fetchPosts()]);
        if (cancelled) return;
        if (!stored) {
          setWidgets(summary.widgets);
        }
        setStats(summary.quick_stats);
        setPosts(feed.posts);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load dashboard");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const tierLabel = checkIn
    ? `${checkIn.tier_emoji} ${checkIn.tier.charAt(0).toUpperCase()}${checkIn.tier.slice(1)} tier`
    : "Complete a pulse check-in";

  const tierMessage = checkIn?.message ?? "Your personalized tier will appear after you finish the pulse.";

  return (
    <div className="dashboard">
      <h1 className="dashboard-greet">
        Welcome back{user?.username ? `, ${user.username}` : ""}
      </h1>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="tier-banner">
        <h2 className="tier-label">{tierLabel}</h2>
        <p className="tier-message">{tierMessage}</p>
        <Link to="/check-in" className="btn btn-small btn-primary">
          Retake pulse
        </Link>
      </section>

      {stats ? (
        <div className="quick-stats">
          <div className="stat">
            <span className="stat-value">{stats.check_ins_this_week}</span>
            <span className="stat-label">Check-ins (demo)</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.circles_joined}</span>
            <span className="stat-label">Circles joined</span>
          </div>
        </div>
      ) : null}

      <section className="widgets">
        <h2 className="section-title">Suggested next steps</h2>
        <div className="widget-grid">
          {widgets.map((w) => (
            <article key={w.id} className="widget-card">
              <h3>{w.title}</h3>
              <p>{w.description}</p>
              <button type="button" className="btn btn-small">
                {w.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <PostFeed posts={posts} />
    </div>
  );
}
