import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <p className="landing-tag">Private first-step support</p>
      <h1 className="landing-title">Sahaara</h1>
      <p className="landing-sub">
        <em>Sahaara</em> means support. We help you check in privately, understand stress in a
        non-stigmatizing way, and find a path toward help—before things become a crisis.
      </p>

      <section className="landing-grid">
        <article className="landing-card">
          <h2>The Pulse</h2>
          <p>
            A short anonymous check-in on sleep, stress, pressure, and hope. You get a color-coded
            support tier—not a label, but a gentle direction for what might help next.
          </p>
        </article>
        <article className="landing-card">
          <h2>The Community</h2>
          <p>
            A pseudo-anonymous feed where people share wins and hard days. React with
            &quot;Relatable&quot; or &quot;Support&quot; instead of likes—empathy over vanity.
          </p>
        </article>
        <article className="landing-card">
          <h2>The Bridge</h2>
          <p>
            Language that avoids clinical shame and a future &quot;family-safe&quot; way to explain
            what you are going through to people you trust.
          </p>
        </article>
      </section>

      <p className="landing-note">
        This demo uses mock data and fake sign-in. Nothing you enter is real authentication yet.
      </p>

      <div className="landing-cta">
        <Link to="/login" className="btn btn-primary">
          Continue to sign in
        </Link>
      </div>
    </div>
  );
}
