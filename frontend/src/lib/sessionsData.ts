export interface Counselor {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  avatar: string; // initials fallback
  avatarColor: string;
  avatarGradient: string;
  rating: number;
  totalSessions: number;
  bio: string;
}

export interface Session {
  id: string;
  counselorId: string;
  title: string;
  description: string;
  date: string; // ISO
  time: string;
  duration: number; // minutes
  maxParticipants: number;
  signedUp: number;
  type: "group" | "workshop" | "meditation" | "therapy";
  zoomLink: string;
  zoomId: string;
  zoomPassword: string;
  tags: string[];
}

export const COUNSELORS: Counselor[] = [
  {
    id: "c1",
    name: "Dr. Aisha Mensah",
    title: "Licensed Clinical Psychologist",
    specialty: ["Anxiety & Stress", "Mindfulness", "CBT"],
    avatar: "AM",
    avatarColor: "#c084fc",
    avatarGradient: "linear-gradient(135deg, #c084fc, #818cf8)",
    rating: 4.9,
    totalSessions: 312,
    bio: "Specializing in evidence-based approaches for anxiety and life transitions.",
  },
  {
    id: "c2",
    name: "Marcus Rivera, LCSW",
    title: "Licensed Clinical Social Worker",
    specialty: ["Grief & Loss", "Trauma", "Men's Wellbeing"],
    avatar: "MR",
    avatarColor: "#4dd0a4",
    avatarGradient: "linear-gradient(135deg, #4dd0a4, #38bdf8)",
    rating: 4.8,
    totalSessions: 248,
    bio: "Creating safe spaces for men to explore vulnerability and build resilience.",
  },
  {
    id: "c3",
    name: "Priya Nair, MFT",
    title: "Marriage & Family Therapist",
    specialty: ["Relationships", "Self-esteem", "Cultural Identity"],
    avatar: "PN",
    avatarColor: "#f9a8d4",
    avatarGradient: "linear-gradient(135deg, #f9a8d4, #fcd34d)",
    rating: 4.9,
    totalSessions: 289,
    bio: "Blending Eastern wisdom with Western therapy for holistic healing.",
  },
  {
    id: "c4",
    name: "James Okafor, PhD",
    title: "Behavioral Health Specialist",
    specialty: ["Depression", "Sleep", "Habit Formation"],
    avatar: "JO",
    avatarColor: "#7eb4d4",
    avatarGradient: "linear-gradient(135deg, #7eb4d4, #4dd0a4)",
    rating: 4.7,
    totalSessions: 197,
    bio: "Helping you rewire patterns and reclaim rest, focus, and motivation.",
  },
];

export const SESSIONS: Session[] = [
  {
    id: "s1",
    counselorId: "c1",
    title: "Morning Anxiety Reset",
    description: "Start your week with calming breathwork and cognitive reframing tools to manage daily anxiety.",
    date: "2026-04-01",
    time: "08:00 AM",
    duration: 60,
    maxParticipants: 20,
    signedUp: 14,
    type: "group",
    zoomLink: "https://zoom.us/j/92834710293?pwd=aXR0ZWVkR3BQcGZmT2tXNVpRMTFidz09",
    zoomId: "928 3471 0293",
    zoomPassword: "serenity",
    tags: ["Anxiety", "Breathwork", "Morning"],
  },
  {
    id: "s2",
    counselorId: "c2",
    title: "Grief Circle — Open Session",
    description: "A compassionate group space to share, witness, and process loss without judgment.",
    date: "2026-04-02",
    time: "06:00 PM",
    duration: 90,
    maxParticipants: 12,
    signedUp: 7,
    type: "therapy",
    zoomLink: "https://zoom.us/j/81923840192?pwd=bGtHQ2JYeVpNVWtST3ZQNmlZYzdkZz09",
    zoomId: "819 2384 0192",
    zoomPassword: "circle",
    tags: ["Grief", "Loss", "Community"],
  },
  {
    id: "s3",
    counselorId: "c3",
    title: "Relationship Patterns Workshop",
    description: "Uncover attachment styles and communication blocks that shape your closest bonds.",
    date: "2026-04-03",
    time: "05:30 PM",
    duration: 75,
    maxParticipants: 16,
    signedUp: 11,
    type: "workshop",
    zoomLink: "https://zoom.us/j/73829401823?pwd=cUxWQUhQMWFISzJlUnZTeTRhYnZBUT09",
    zoomId: "738 2940 1823",
    zoomPassword: "bond",
    tags: ["Relationships", "Attachment", "Communication"],
  },
  {
    id: "s4",
    counselorId: "c4",
    title: "Sleep Restoration Deep Dive",
    description: "Science-backed techniques for resetting your sleep cycle and quieting the night-time mind.",
    date: "2026-04-04",
    time: "09:00 PM",
    duration: 60,
    maxParticipants: 25,
    signedUp: 18,
    type: "workshop",
    zoomLink: "https://zoom.us/j/64728301928?pwd=dVBFcXpKWGZGNmNYRUxjQ2FQTmJYUT09",
    zoomId: "647 2830 1928",
    zoomPassword: "rest",
    tags: ["Sleep", "Insomnia", "Relaxation"],
  },
  {
    id: "s5",
    counselorId: "c1",
    title: "Guided Mindfulness Meditation",
    description: "A 45-minute journey through body scan and present-moment awareness practices.",
    date: "2026-04-05",
    time: "07:30 AM",
    duration: 45,
    maxParticipants: 30,
    signedUp: 22,
    type: "meditation",
    zoomLink: "https://zoom.us/j/55619283017?pwd=eVpTWVFOdkVLS3dxRlZiT3ZYTGhQdz09",
    zoomId: "556 1928 3017",
    zoomPassword: "present",
    tags: ["Meditation", "Mindfulness", "Calm"],
  },
  {
    id: "s6",
    counselorId: "c3",
    title: "Identity & Belonging",
    description: "Exploring cultural identity, belonging, and self-worth in a complex, modern world.",
    date: "2026-04-07",
    time: "04:00 PM",
    duration: 90,
    maxParticipants: 14,
    signedUp: 6,
    type: "group",
    zoomLink: "https://zoom.us/j/48291038471?pwd=fHlGY3FKZ2tETFZYcWFPaGpHYUhUZz09",
    zoomId: "482 9103 8471",
    zoomPassword: "belong",
    tags: ["Identity", "Culture", "Self-worth"],
  },
];
