import { useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BgCanvas from "./components/BgCanvas";
import Cursor from "./components/Cursor";
import Intro from "./components/Intro";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CommunityPage from "./pages/CommunityPage";
import Sessions from "./pages/Sessions";
import Journal from "./pages/JournalPage";
import Resources from "./pages/Resources";
import { globalCSS } from "./lib/styles";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <div>Loading…</div>;
  if (!isSignedIn) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { isLoaded, isSignedIn } = useAuth();

  const [introComplete, setIntroComplete] = useState(() => !!isSignedIn);
  const [appVisible, setAppVisible] = useState(() => !!isSignedIn);
  const [totalPosts, setTotalPosts] = useState(0);
  const [onlineCount, setOnlineCount] = useState(57);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    setAppVisible(true);
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
          position: "fixed", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#f0ebe3", zIndex: 1,
        }}>
          Loading…
        </div>
      </>
    );
  }

  return (
    <Router>
      <style>{globalCSS}</style>

      {/* Canvas sits at z-index 0, behind everything */}
      <BgCanvas />
      <Cursor />

      {/* This wrapper gives all page content a stacking context ABOVE the canvas */}
      <div id="app-scroll" style={{ position: "relative", zIndex: 1 }}>
        {!isSignedIn && !introComplete && (
          <Intro onComplete={handleIntroComplete} />
        )}
        {(isSignedIn || introComplete) && <Navbar />}

        <Routes>
          <Route
            path="/"
            element={
              !isSignedIn ? (
                <LandingPage
                  introComplete={introComplete}
                  appVisible={appVisible}
                  totalPosts={totalPosts}
                  onlineCount={onlineCount}
                  handleStats={handleStats}
                />
              ) : (
                <Dashboard />
              )
            }
          />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}