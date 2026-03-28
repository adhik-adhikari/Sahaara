import type { CheckInResult } from "./types";

const USER_KEY = "sahaara_demo_user";
const CHECKIN_KEY = "sahaara_check_in_result";

export type DemoUser = { email: string; username: string; token: string };

export function getDemoUser(): DemoUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function setDemoUser(user: DemoUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearDemoSession() {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(CHECKIN_KEY);
}

export function getCheckInResult(): CheckInResult | null {
  try {
    const raw = sessionStorage.getItem(CHECKIN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckInResult;
  } catch {
    return null;
  }
}

export function setCheckInResult(result: CheckInResult) {
  sessionStorage.setItem(CHECKIN_KEY, JSON.stringify(result));
}
