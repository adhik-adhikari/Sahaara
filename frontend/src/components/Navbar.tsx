import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function Navbar() {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    const handler = () => openSignIn();
    window.addEventListener("open-signin", handler);
    return () => window.removeEventListener("open-signin", handler);
  }, [openSignIn]);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 2.5rem",
      background: "rgba(8,11,18,0.75)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
        fontSize: "1.35rem", letterSpacing: "0.22em",
        textTransform: "uppercase", color: "var(--cream)",
      }}>
        Saha<span style={{ color: "var(--glow)" }}>r</span>a
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        {["Community", "Sessions", "Journal", "Resources"].map(link => (
          <a key={link} href={link === "Community" ? "/community" : "#"} data-interactive style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--muted)", textDecoration: "none",
            cursor: "none", transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--cream)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
          >
            {link}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {user && (
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
            color: "var(--mist)", letterSpacing: "0.08em",
          }}>
            {user.firstName || user.emailAddresses[0]?.emailAddress}
          </span>
        )}

        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "0.45rem 1.1rem",
          background: "rgba(126,184,212,0.1)",
          border: "1px solid rgba(126,184,212,0.25)",
          borderRadius: "100px",
          fontFamily: "'Syne', sans-serif", fontSize: "0.68rem",
          fontWeight: 600, letterSpacing: "0.1em",
          color: "var(--glow)", cursor: "none",
        }}>
          <div style={{ position: "relative", width: 8, height: 8 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#4dd0a4", opacity: 0, animation: "rippleOut 2s ease-out infinite" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4dd0a4", position: "relative", zIndex: 1 }} />
          </div>
          Live Feed
        </div>

        <div data-interactive style={{ cursor: "none" }}>
          {user ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 34, height: 34, border: "1px solid rgba(126,184,212,0.3)" },
                  userButtonPopoverCard: { background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" },
                  userButtonPopoverActionButton: { color: "var(--mist)" },
                  userButtonPopoverActionButtonText: { color: "var(--mist)" },
                },
              }}
            />
          ) : (
            <button
              onClick={() => openSignIn()}
              style={{
                fontSize: "0.68rem",
                padding: "0.45rem 1.1rem",
                borderRadius: "100px",
                border: "1px solid rgba(126,184,212,0.25)",
                background: "transparent",
                color: "var(--glow)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}