import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/client";
import { setDemoUser } from "../session";
import "./FormPages.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password, username);
      if (res.ok && res.user) {
        setDemoUser({
          email: res.user.email,
          username: res.user.username,
          token: res.token,
        });
        navigate("/check-in", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h1 className="form-page-title">Sign in (demo)</h1>
      <p className="form-page-lead">
        Any email, password, and display name work. The API does not verify credentials yet.
      </p>

      <form className="form-card" onSubmit={onSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        <label className="field">
          <span>Display username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. QuietRiver"
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
          {loading ? "Signing in…" : "Continue to pulse check-in"}
        </button>
      </form>

      <p className="form-footer">
        <Link to="/">← Back to home</Link>
      </p>
    </div>
  );
}
