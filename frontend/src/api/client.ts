import type { CheckInQuestion, CheckInResult, CommunityPost, Widget } from "../types";

const json = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
};

export async function login(email: string, password: string, username: string) {
  return json<{ ok: boolean; token: string; user: { email: string; username: string } }>(
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    })
  );
}

export async function fetchCheckInQuestions() {
  return json<{ questions: CheckInQuestion[] }>(await fetch("/api/check-in/questions"));
}

export async function submitCheckIn(answers: Record<string, string | number>) {
  return json<CheckInResult>(
    await fetch("/api/check-in/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
  );
}

export async function fetchDashboardSummary() {
  return json<{
    tier: string;
    tier_emoji: string;
    message: string;
    widgets: Widget[];
    quick_stats: { check_ins_this_week: number; circles_joined: number };
  }>(await fetch("/api/dashboard/summary"));
}

export async function fetchPosts() {
  return json<{ posts: CommunityPost[] }>(await fetch("/api/community/posts"));
}
