import "server-only";
import { profile } from "@/content/profile";

/*
 * Reads the site owner's own stats from the Google Health API (the successor to the Fitbit Web API).
 * Credentials live in server env vars only; see scripts/health-auth.mjs for getting the refresh token.
 * Everything fails soft: any missing env var or upstream error yields null, and the tile hides.
 */

export type HealthStats = {
  stepsToday: number | null;
  stepsWeek: number[]; // oldest → today, 7 entries
  sleepMinutes: number | null;
  restingHr: number | null;
};

const API = "https://health.googleapis.com/v4/users/me/dataTypes";

export type Civil = { year: number; month: number; day: number };

/* Civil date in the owner's time zone, offset by `days`. Servers run in UTC, so never use local Date getters. */
export function civil(days = 0): Civil {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: profile.timeZone, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date())
    .split("-")
    .map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return { year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() };
}
export const iso = (c: Civil) => `${c.year}-${String(c.month).padStart(2, "0")}-${String(c.day).padStart(2, "0")}`;
const sameDay = (a?: Partial<Civil>, b?: Civil) => !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day;
export const num = (v: unknown) => (v == null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));

export async function accessToken(): Promise<string | null> {
  const { GOOGLE_HEALTH_CLIENT_ID: id, GOOGLE_HEALTH_CLIENT_SECRET: secret, GOOGLE_HEALTH_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) return null;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: id, client_secret: secret, refresh_token: refresh, grant_type: "refresh_token" }),
  });
  if (!res.ok) {
    console.error("[health] token refresh failed", res.status);
    return null;
  }
  return (await res.json()).access_token ?? null;
}

export async function call<T>(token: string, path: string, init?: RequestInit): Promise<T | null> {
  const res = await fetch(`${API}/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
  });
  if (!res.ok) {
    console.error("[health]", path.split("?")[0], res.status);
    return null;
  }
  return res.json();
}

type RollUp = { rollupDataPoints?: { civilStartTime?: { date?: Civil }; steps?: { countSum?: string } }[] };

async function steps(token: string) {
  const days = Array.from({ length: 7 }, (_, i) => civil(i - 6));
  const midnight = { hours: 0, minutes: 0, seconds: 0, nanos: 0 };
  const j = await call<RollUp>(token, "steps/dataPoints:dailyRollUp", {
    method: "POST",
    body: JSON.stringify({ range: { start: { date: days[0], time: midnight }, end: { date: civil(1), time: midnight } }, windowSizeDays: 1 }),
  });
  if (!j) return { stepsToday: null, stepsWeek: [] };
  const week = days.map((d) => num(j.rollupDataPoints?.find((p) => sameDay(p.civilStartTime?.date, d))?.steps?.countSum) ?? 0);
  return { stepsToday: week[6], stepsWeek: week };
}

type Sleep = { dataPoints?: { sleep?: { interval?: { endTime?: string }; metadata?: { mainSleep?: boolean; nap?: boolean }; summary?: { minutesAsleep?: string } } }[] };

async function sleep(token: string) {
  const filter = `sleep.interval.civil_end_time >= "${iso(civil(-3))}"`;
  const j = await call<Sleep>(token, `sleep/dataPoints:reconcile?filter=${encodeURIComponent(filter)}`);
  const sessions = (j?.dataPoints ?? []).map((p) => p.sleep).filter((s) => s?.summary?.minutesAsleep);
  /* Most recent main sleep (not a nap); before the morning sync that's still the previous night, which beats an empty tile. */
  const main = sessions.filter((s) => s?.metadata?.mainSleep);
  const latest = (main.length ? main : sessions.filter((s) => !s?.metadata?.nap)).sort(
    (a, b) => Date.parse(b?.interval?.endTime ?? "") - Date.parse(a?.interval?.endTime ?? ""),
  )[0];
  return num(latest?.summary?.minutesAsleep);
}

type Rhr = { dataPoints?: { dailyRestingHeartRate?: { date?: Civil; beatsPerMinute?: string } }[] };

async function restingHr(token: string) {
  const since = iso(civil(-7));
  /* Filters use the snake_case identifier; the camelCase form in the docs' example is rejected with a 400. */
  const j = await call<Rhr>(token, `daily-resting-heart-rate/dataPoints?filter=${encodeURIComponent(`daily_resting_heart_rate.date >= "${since}"`)}`);
  const latest = (j?.dataPoints ?? [])
    .map((p) => p.dailyRestingHeartRate)
    .filter((r) => r?.date && r.beatsPerMinute)
    .sort((a, b) => iso(b!.date!).localeCompare(iso(a!.date!)))[0];
  return num(latest?.beatsPerMinute);
}

export async function getHealthStats(): Promise<HealthStats | null> {
  try {
    const token = await accessToken();
    if (!token) return null;
    const [s, sl, hr] = await Promise.all([steps(token), sleep(token), restingHr(token)]);
    const out = { ...s, sleepMinutes: sl, restingHr: hr };
    return out.stepsToday === null && out.sleepMinutes === null && out.restingHr === null ? null : out;
  } catch (e) {
    console.error("[health]", e instanceof Error ? e.message : "failed");
    return null;
  }
}
