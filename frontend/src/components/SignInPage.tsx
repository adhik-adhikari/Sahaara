import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 20,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "2rem",
    }}>
      {/* Brand header above the sign-in card */}
      <div style={{ textAlign: "center", animation: "fadeInUp 0.9s both" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
          fontSize: "clamp(2.5rem,6vw,4.5rem)",
          color: "var(--cream)", letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}>
          Saha<span style={{ color: "var(--glow)" }}>r</span>a
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: "0.72rem", letterSpacing: "0.38em",
          textTransform: "uppercase", color: "var(--glow)",
          marginTop: "0.4rem",
        }}>
          Your mental wellness companion
        </div>
      </div>

      {/* Clerk sign-in widget — themed for dark UI */}
      <div style={{ animation: "fadeInUp 0.9s 0.2s both" }}>
        <SignIn
          routing="hash"
          appearance={{
            variables: {
              colorPrimary: "#7eb8d4",
              colorBackground: "#0f1219",
              colorText: "#f0ebe3",
              colorTextSecondary: "#a8b8cc",
              colorInputBackground: "#161922",
              colorInputText: "#f0ebe3",
              borderRadius: "14px",
              fontFamily: "'DM Sans', sans-serif",
            },
            elements: {
              card: {
                background: "#0f1219",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
              },
              headerTitle: {
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "1.6rem",
                color: "#f0ebe3",
                letterSpacing: "0.02em",
              },
              headerSubtitle: {
                color: "#a8b8cc",
              },
              formButtonPrimary: {
                background: "linear-gradient(135deg, #7eb8d4, #5a9ec4)",
                boxShadow: "0 4px 20px rgba(126,184,212,0.35)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.08em",
              },
              footerActionLink: { color: "#7eb8d4" },
              dividerLine: { background: "rgba(255,255,255,0.07)" },
              dividerText: { color: "#5a6278" },
              socialButtonsBlockButton: {
                background: "#161922",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#a8b8cc",
              },
              formFieldInput: {
                background: "#161922",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f0ebe3",
              },
              formFieldLabel: { color: "#a8b8cc" },
              identityPreviewText: { color: "#a8b8cc" },
            },
          }}
        />
      </div>
    </div>
  );
}
