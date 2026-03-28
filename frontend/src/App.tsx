import { useState, useCallback, type CSSProperties } from "react";
import { useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import BgCanvas from "./components/BgCanvas";
import Cursor from "./components/Cursor";
import Intro from "./components/Intro";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsCol from "./components/StatsCol";
import FeedCol from "./components/FeedCol";
import MoodCol from "./components/MoodCol";
import Dashboard from "./components/Dashboard";
import CommunityPage from "./components/CommunityPage";
import { globalCSS } from "./lib/styles";

/** Below navbar; must sit above the fixed noise layer (z-index 1) or text can composite “empty”. */
const SIGNED_MAIN_SCROLL: CSSProperties = {
  position: "relative",
  zIndex: 10,
  flex: 1,
  minHeight: 0,
  width: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(255,255,255,0.08) transparent",
};

/**
 * Lock to one viewport tall so `main` (flex:1; minHeight:0; overflow:auto) is the scroll root.
 * With only minHeight:100vh the shell grew with content, main never overflowed, and body overflow:hidden blocked scrolling.
 */
const SIGNED_SHELL: CSSProperties = {
  position: "relative",
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  maxHeight: "100vh",
  overflow: "hidden",
};

function SignedCommunityView() {
  return (
    <div style={SIGNED_SHELL}>
      <Navbar />
      <main id="community-scroll" style={SIGNED_MAIN_SCROLL}>
        <CommunityPage />
      </main>
    </div>
  );
}

function AppRoutes() {
  const { isSignedIn } = useAuth();
  const location = useLocation();
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

  if (!isSignedIn) {
    if (location.pathname === "/community") {
      return <Navigate to="/" replace />;
    }
    return (
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
    );
  }

  return (
    <Routes>
      <Route path="/community" element={<SignedCommunityView />} />
      <Route
        path="*"
        element={
          <div style={SIGNED_SHELL}>
            <Navbar />
            <main style={SIGNED_MAIN_SCROLL}>
              <Dashboard />
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default function App() {
  const { isLoaded } = useAuth();

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
    <BrowserRouter>
      <style>{globalCSS}</style>
      <BgCanvas />
      <Cursor />

      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.032,
      }} />

      <AppRoutes />
    </BrowserRouter>
  );
}
