import type { CommunityPost } from "../types";
import "./PostFeed.css";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function PostFeed({ posts }: { posts: CommunityPost[] }) {
  return (
    <section className="post-feed" aria-label="Community posts">
      <h2 className="post-feed-heading">Community feed</h2>
      <p className="post-feed-sub">Mock posts for demo — scroll to explore.</p>
      <div className="post-feed-scroll">
        {posts.map((p) => (
          <article key={p.id} className="post-card">
            <header className="post-card-head">
              <span className="post-name">{p.display_name}</span>
              <span className="post-room">{p.room}</span>
            </header>
            <p className="post-body">{p.body}</p>
            <footer className="post-card-foot">
              <span className="post-meta">Relatable · {p.relatable_count}</span>
              <span className="post-meta">Support · {p.support_count}</span>
              <span className="post-meta post-time">{formatDate(p.created_at)}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
