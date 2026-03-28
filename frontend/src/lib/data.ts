import { User, Tag, Quote, BreathPhase } from "../types";

export const USERS: User[] = [
  { id: 1, name: "Maya Chen",      handle: "mayaheals",     av: "MC", color: "#6c8ef5", tag: "Therapist" },
  { id: 2, name: "Jordan Lee",     handle: "jord_mind",     av: "JL", color: "#4dd0a4", tag: "Member" },
  { id: 3, name: "Sam Rivera",     handle: "samriv",        av: "SR", color: "#f06292", tag: "Coach" },
  { id: 4, name: "Alex Kim",       handle: "alexkimwell",   av: "AK", color: "#f5a623", tag: "Member" },
  { id: 5, name: "Dr. Priya Nair", handle: "drpriya",       av: "PN", color: "#a78bfa", tag: "Psychiatrist" },
  { id: 6, name: "Chris Okafor",   handle: "chriswellness", av: "CO", color: "#34d399", tag: "Peer" },
  { id: 7, name: "Lena Schmidt",   handle: "lenaschmidt",   av: "LS", color: "#fb923c", tag: "Counselor" },
];

export const MESSAGES: string[] = [
  "Remember — one breath at a time. You're doing better than you think 🌿",
  "Just checked in and feeling so much lighter after today's session ✨",
  "Anyone else trying the 4-7-8 breathing? It's genuinely helping my anxiety!",
  "Small wins count. Made my bed today and that's enough 💙",
  "Gratitude journal check-in: grateful for this community 🙏",
  "Panic attack at 2am but used the grounding technique — it worked 💪",
  "Reminder: your feelings are valid, even the ones that don't make sense 🤍",
  "Week 3 of journaling every day! Progress feels slow but real 📓",
  "Not every day is a good day, and that's okay. We keep going 🌱",
  "Finally feeling brave enough to share — thank you all 💚",
  "The mindfulness session tonight was so calming, highly recommend 🧘",
  "Anyone want an accountability buddy for morning check-ins? 🌅",
  "Just completed my first week without a panic attack in months! 🎉",
  "Sending everyone here so much warmth today 💛",
];

export const TAGS: Tag[] = [
  { label: "Anxiety",     color: "#6c8ef5" },
  { label: "Mindfulness", color: "#4dd0a4" },
  { label: "Gratitude",   color: "#f5a623" },
  { label: "Progress",    color: "#f06292" },
  { label: "Grounding",   color: "#a78bfa" },
  { label: "Support",     color: "#34d399" },
];

export const REACTIONS: string[] = ["❤️","🙌","💙","✨","🌿","🫂","💪","🌱"];

export const QUOTES: Quote[] = [
  { text: '"You don\'t have to be positive all the time. It\'s perfectly okay to feel sad, angry, annoyed, frustrated, or scared."', attr: "Lori Deschene" },
  { text: '"Mental health is not a destination, but a process. It\'s about how you drive, not where you\'re going."', attr: "Noam Shpancer" },
  { text: '"There is hope, even when your brain tells you there isn\'t."', attr: "John Green" },
  { text: '"Self-care is not selfish. You cannot pour from an empty cup."', attr: "Unknown" },
  { text: '"Recovery is not one and done. It is a lifelong journey."', attr: "Unknown" },
];

export const BREATH_PHASES: BreathPhase[] = [
  { label: "Breathe in…",  color: "#7aad96", scale: 1.5, dur: 4 },
  { label: "Hold…",        color: "#d4956a", scale: 1.5, dur: 4 },
  { label: "Breathe out…", color: "#7eb8d4", scale: 1,   dur: 4 },
  { label: "Hold…",        color: "#c9849a", scale: 1,   dur: 2 },
];

export const MOOD_PILLS = [
  { mood: "😟 Anxious",  bg: "rgba(108,142,245,0.1)", color: "#6c8ef5", border: "rgba(108,142,245,0.2)" },
  { mood: "😤 Stressed", bg: "rgba(240,98,146,0.1)",  color: "#f06292", border: "rgba(240,98,146,0.2)" },
  { mood: "😌 Calm",     bg: "rgba(77,208,164,0.1)",  color: "#4dd0a4", border: "rgba(77,208,164,0.2)" },
  { mood: "😊 Happy",    bg: "rgba(245,166,35,0.1)",  color: "#f5a623", border: "rgba(245,166,35,0.2)" },
  { mood: "😞 Down",     bg: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "rgba(167,139,250,0.2)" },
  { mood: "🙏 Grateful", bg: "rgba(122,173,150,0.1)", color: "#7aad96", border: "rgba(122,173,150,0.2)" },
];
