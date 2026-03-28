import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearDemoSession, getDemoUser } from "../session";
import "./AppShell.css";

export function AppShell() {
  const navigate = useNavigate();
  const user = getDemoUser();

  const signOut = () => {
    clearDemoSession();
    navigate("/");
  };

  return (
    <div className="shell">
      <header className="shell-header">
        <Link to={user ? "/dashboard" : "/"} className="shell-brand">
          Sahaara
        </Link>
        <nav className="shell-nav">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/check-in">Pulse</Link>
              <span className="shell-user">{user.username}</span>
              <button type="button" className="btn btn-ghost" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/login" className="btn btn-small">
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
