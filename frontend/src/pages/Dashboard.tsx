import MoodPage from "./MoodPage";

export default function Dashboard() {
    return (
        <div
            style={{
                height: "calc(100vh - 60px)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.8rem 1.5rem",
                    background: "rgba(8,11,18,0.6)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid var(--border)",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    letterSpacing: "0.06em",
                    color: "var(--glow)",
                }}
            >
                🧠 Mood Check-in
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: "hidden" }}>
                <MoodPage />
            </div>
        </div>
    );
}