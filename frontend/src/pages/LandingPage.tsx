import { useState, useCallback } from "react";
import Hero from "../components/Hero";
import StatsCol from "../components/StatsCol";
import FeedCol from "../components/FeedCol";
import MoodCol from "../components/MoodCol";

interface LandingPageProps {
    introComplete: boolean;
    appVisible: boolean;
    totalPosts: number;
    onlineCount: number;
    handleStats: (posts: number, online: number) => void;
}

export default function LandingPage({
    introComplete,
    appVisible,
    totalPosts,
    onlineCount,
    handleStats,
}: LandingPageProps) {
    return (
        <div style={{ opacity: introComplete && appVisible ? 1 : 0, transition: "opacity 1.2s ease" }}>
            <Hero />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr minmax(340px,440px) 1fr",
                    gap: "2rem",
                    padding: "2rem 2.5rem 4rem",
                    maxWidth: 1280,
                    margin: "0 auto",
                    alignItems: "start",
                }}
            >
                <StatsCol totalPosts={totalPosts} onlineCount={onlineCount} />
                <FeedCol onStats={handleStats} />
                <MoodCol />
            </div>
        </div>
    );
}