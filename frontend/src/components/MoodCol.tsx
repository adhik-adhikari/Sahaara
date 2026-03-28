import MoodPanel from "./MoodPanel";
import QuoteCard from "./QuoteCard";
import BreathingWidget from "./BreathingWidget";

export default function MoodCol() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <MoodPanel />
      <QuoteCard />
      <BreathingWidget />
    </div>
  );
}
