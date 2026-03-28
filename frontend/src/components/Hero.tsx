export default function Hero() {
  return (
    <section style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", textAlign: "center",
      padding: "6rem 2rem 4rem",
      position: "relative",
      animation: "fadeInUp 0.9s 0.2s both",
    }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem",
        letterSpacing: "0.38em", textTransform: "uppercase",
        color: "var(--glow)", marginBottom: "1.2rem",
      }}>
        Mental wellness · peer support · community healing
      </div>

      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: "clamp(2.4rem,5.5vw,4.5rem)", lineHeight: 1.1,
        color: "var(--cream)", letterSpacing: "-0.01em", maxWidth: 700,
      }}>
        A place where{" "}
        <em style={{ fontStyle: "italic", color: "var(--glow)" }}>healing</em>
        <br />feels like coming home
      </h1>

      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: "clamp(0.85rem,1.5vw,1rem)", color: "var(--mist)",
        lineHeight: 1.7, maxWidth: 480, margin: "1.4rem auto 0",
      }}>
        Join thousands sharing their journey — anonymously, openly, and without judgment.
        Real stories. Real support. Real change.
      </p>
    </section>
  );
}
