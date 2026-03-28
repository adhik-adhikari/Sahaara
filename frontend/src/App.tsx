import { useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import BgCanvas from "./components/BgCanvas";
import Cursor from "./components/Cursor";
import Intro from "./components/Intro";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsCol from "./components/StatsCol";
import FeedCol from "./components/FeedCol";
import MoodCol from "./components/MoodCol";
import Dashboard from "./components/Dashboard";
import { globalCSS } from "./lib/styles";

export default function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const [introComplete, setIntroComplete] = useState(false);
  const [appVisible, setAppVisible] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [onlineCount, setOnlineCount] = useState(57);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    setTimeout(() => setAppVisible(true), 100);
  }, []);

  const handleStats = useCallback((posts: number, online: number) => {
    setTotalPosts(posts);
    setOnlineCount(online);
  }, []);

  if (!isLoaded) {
    return (
      <>
        <style>{globalCSS}</style>
        <BgCanvas />
        <div style={{
          position: "fixed", inset: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--mist)", fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase",
        }}>
          Loading…
        </div>
      </>
    );
  }

  return (
    <>
      <style>{globalCSS}</style>
      <BgCanvas />
      <Cursor />

      {/* Noise overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.032,
      }} />

      {!isSignedIn ? (
        // Landing page for unsigned users
        <>
          {!introComplete && <Intro onComplete={handleIntroComplete} />}

          {introComplete && (
            <div
              id="app-scroll"
              style={{
                position: "fixed", inset: 0, zIndex: 5,
                opacity: appVisible ? 1 : 0,
                pointerEvents: appVisible ? "all" : "none",
                transition: "opacity 1.2s ease",
              }}
            >
              {/* Navbar visible after intro */}
              <Navbar />
              <Hero />
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr minmax(340px,440px) 1fr",
                gap: "2rem",
                padding: "2rem 2.5rem 4rem",
                maxWidth: 1280,
                margin: "0 auto",
                alignItems: "start",
              }}>
                <StatsCol totalPosts={totalPosts} onlineCount={onlineCount} />
                <FeedCol onStats={handleStats} />
                <MoodCol />
              </div>
            </div>
          )}
        </>
      ) : (
        // Signed-in users: show Navbar and Dashboard
        <>
          <Navbar />
          <Dashboard />
        </>
      )}
    </>
  );
}