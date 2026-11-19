import "server-only";
import { accessToken, call, civil, iso, num, type Civil } from "@/lib/health";

/*
 * The last 30 days of the owner's Google Health data, for /health.
 * Each metric is fetched on its own and fails on its own: a failed metric comes back null and its chart hides.
 * Missing is never zero: a day the watch wasn't worn stays null and draws as a gap.
 */

export const HISTORY_DAYS = 30;

export type Day = {
  date: string; // YYYY-MM-DD, owner's time zone
  steps: number | null;
  distanceKm: number | null;
  floors: number | null;
  zoneMinutes: number | null;
  calories: number | null;
  sleep: { asleep: number; deep: number | null; rem: number | null; light: number | null; awake: number | null; bed: string; wake: string } | null;
  restingHr: number | null;
  hrv: number | null;
  spo2: number | null;
  breathing: number | null;
};

export type Workout = { date: string; start: string; type: string; minutes: number | null; km: number | null; kcal: number | null; steps: number | null; avgHr: number | null };

export type HealthHistory = { updated: string; days: Day[]; workouts: Workout[]; failed: string[] };

const midnight = { hours: 0, minutes: 0, seconds: 0, nanos: 0 };
type RollRow = { civilStartTime?: { date?: Civil } } & Record<string, unknown>;

/* Daily rollups are capped per call (14 days for total-calories, 90 for the rest), so walk the range in chunks. */
async function rollup(token: string, type: string, chunk: number, pick: (r: RollRow) => number | null) {
  const out = new Map<string, number | null>();
  for (let start = -(HISTORY_DAYS - 1); start <= 0; start += chunk) {
    const end = Math.min(start + chunk, 1);
    const j = await call<{ rollupDataPoints?: RollRow[] }>(token, `${type}/dataPoints:dailyRollUp`, {
      method: "POST",
      body: JSON.stringify({ range: { start: { date: civil(start), time: midnight }, end: { date: civil(end), time: midnight } }, windowSizeDays: 1 }),
    });
    if (!j) throw new Error(type);
    for (const r of j.rollupDataPoints ?? []) if (r.civilStartTime?.date) out.set(iso(r.civilStartTime.date), pick(r));
  }
  return out;
}

/* List or reconcile with pagination; capped so a misbehaving token can't loop forever. */
async function pages<T>(token: string, path: string, maxPages = 10) {
  const all: T[] = [];
  let pageToken = "";
  for (let i = 0; i < maxPages; i++) {
    const j = await call<{ dataPoints?: T[]; nextPageToken?: string }>(token, `${path}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`);
    if (!j) throw new Error(path.split("/")[0]);
    all.push(...(j.dataPoints ?? []));
    if (!j.nextPageToken) break;
    pageToken = j.nextPageToken;
  }
  return all;
}

const since = () => iso(civil(-(HISTORY_DAYS - 1)));
const q = (filter: string) => `filter=${encodeURIComponent(filter)}`;

async function daily<K extends string>(token: string, type: string, id: string, field: K, pick: (v: Record<string, unknown>) => number | null) {
  const rows = await pages<Record<K, { date?: Civil } & Record<string, unknown>>>(token, `${type}/dataPoints?pageSize=100&${q(`${id}.date >= "${since()}"`)}`);
  return new Map(rows.filter((r) => r[field]?.date).map((r) => [iso(r[field].date!), pick(r[field])]));
}

/* Wall-clock time where it happened: the API gives UTC plus that moment's offset. */
function local(utc: string | undefined, offset: string | undefined) {
  const t = Date.parse(utc ?? "");
  if (Number.isNaN(t)) return null;
  const d = new Date(t + (parseInt(offset ?? "0", 10) || 0) * 1000);
  return { date: d.toISOString().slice(0, 10), time: d.toISOString().slice(11, 16) };
}

type SleepPoint = {
  sleep?: {
    interval?: { startTime?: string; startUtcOffset?: string; endTime?: string; endUtcOffset?: string };
    metadata?: { mainSleep?: boolean };
    summary?: { minutesAsleep?: string; stagesSummary?: { type?: string; minutes?: string }[] };
  };
};

async function sleeps(token: string) {
  const mask = `fields=${encodeURIComponent("dataPoints(sleep(interval,metadata,summary)),nextPageToken")}`;
  const rows = await pages<SleepPoint>(token, `sleep/dataPoints:reconcile?pageSize=25&${mask}&${q(`sleep.interval.civil_end_time >= "${since()}"`)}`);
  const out = new Map<string, Day["sleep"]>();
  for (const { sleep: s } of rows) {
    if (!s?.metadata?.mainSleep || !s.summary?.minutesAsleep) continue;
    const bed = local(s.interval?.startTime, s.interval?.startUtcOffset);
    const wake = local(s.interval?.endTime, s.interval?.endUtcOffset);
    if (!bed || !wake) continue;
    const stage = (t: string) => num(s.summary?.stagesSummary?.find((x) => x.type === t)?.minutes);
    /* A night belongs to the morning you woke up. */
    out.set(wake.date, { asleep: num(s.summary.minutesAsleep)!, deep: stage("DEEP"), rem: stage("REM"), light: stage("LIGHT"), awake: stage("AWAKE"), bed: bed.time, wake: wake.time });
  }
  return out;
}

type ExercisePoint = {
  exercise?: {
    interval?: { startTime?: string; startUtcOffset?: string; endTime?: string };
    exerciseType?: string;
    displayName?: string;
    activeDuration?: string;
    metricsSummary?: { caloriesKcal?: number; distanceMillimeters?: number; steps?: string; averageHeartRateBeatsPerMinute?: string };
  };
};

const pretty = (t: string) => t.toLowerCase().replace(/_/g, " ");

async function workouts(token: string): Promise<Workout[]> {
  const rows = await pages<ExercisePoint>(token, `exercise/dataPoints?pageSize=25&${q(`exercise.interval.civil_start_time >= "${since()}"`)}`);
  return rows
    .map(({ exercise: e }) => {
      const at = local(e?.interval?.startTime, e?.interval?.startUtcOffset);
      if (!e || !at) return null;
      const secs = e.activeDuration ? parseFloat(e.activeDuration) : (Date.parse(e.interval?.endTime ?? "") - Date.parse(e.interval?.startTime ?? "")) / 1000;
      const m = e.metricsSummary ?? {};
      return {
        date: at.date,
        start: at.time,
        type: e.displayName || pretty(e.exerciseType ?? "workout"),
        minutes: Number.isFinite(secs) ? Math.round(secs / 60) : null,
        km: m.distanceMillimeters ? Math.round(m.distanceMillimeters / 10_000) / 100 : null,
        kcal: m.caloriesKcal != null ? Math.round(m.caloriesKcal) : null,
        steps: num(m.steps),
        avgHr: num(m.averageHeartRateBeatsPerMinute),
      };
    })
    .filter((w): w is Workout => w !== null)
    .sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start));
}

/*
 * Returns null only when nothing is configured. If every metric fails (an expired token, Google down) it throws,
 * so a cached page keeps serving the last good copy instead of caching an empty one. During `next build` it
 * returns null instead, so a Google hiccup can't fail a deploy.
 */
export async function getHealthHistory(): Promise<HealthHistory | null> {
  const building = process.env.NEXT_PHASE === "phase-production-build";
  const token = await accessToken();
  if (!token) {
    if (process.env.GOOGLE_HEALTH_REFRESH_TOKEN && !building) throw new Error("[health] token refresh failed");
    return null;
  }

  const jobs = {
    steps: () => rollup(token, "steps", 90, (r) => num((r.steps as { countSum?: string })?.countSum)),
    distanceKm: () => rollup(token, "distance", 90, (r) => { const mm = num((r.distance as { millimetersSum?: string })?.millimetersSum); return mm === null ? null : Math.round(mm / 10_000) / 100; }),
    floors: () => rollup(token, "floors", 90, (r) => num((r.floors as { countSum?: string })?.countSum)),
    zoneMinutes: () => rollup(token, "active-zone-minutes", 90, (r) => {
      const z = r.activeZoneMinutes as Record<string, string> | undefined;
      /* The sums already count cardio and peak minutes double (each data point is worth 1 or 2), so just add the zones. */
      return z ? (num(z.sumInFatBurnHeartZone) ?? 0) + (num(z.sumInCardioHeartZone) ?? 0) + (num(z.sumInPeakHeartZone) ?? 0) : null;
    }),
    calories: () => rollup(token, "total-calories", 14, (r) => { const k = num((r.totalCalories as { kcalSum?: number })?.kcalSum); return k === null ? null : Math.round(k); }),
    restingHr: () => daily(token, "daily-resting-heart-rate", "daily_resting_heart_rate", "dailyRestingHeartRate", (v) => num(v.beatsPerMinute)),
    hrv: () => daily(token, "daily-heart-rate-variability", "daily_heart_rate_variability", "dailyHeartRateVariability", (v) => { const n = num(v.averageHeartRateVariabilityMilliseconds); return n === null ? null : Math.round(n * 10) / 10; }),
    spo2: () => daily(token, "daily-oxygen-saturation", "daily_oxygen_saturation", "dailyOxygenSaturation", (v) => num(v.averagePercentage)),
    breathing: () => daily(token, "daily-respiratory-rate", "daily_respiratory_rate", "dailyRespiratoryRate", (v) => num(v.breathsPerMinute)),
    sleep: () => sleeps(token),
    workouts: () => workouts(token),
  };

  const keys = Object.keys(jobs) as (keyof typeof jobs)[];
  const settled = await Promise.allSettled(keys.map((k) => jobs[k]()));
  const got = Object.fromEntries(keys.map((k, i) => [k, settled[i].status === "fulfilled" ? (settled[i] as PromiseFulfilledResult<unknown>).value : null])) as {
    [K in keyof typeof jobs]: Awaited<ReturnType<(typeof jobs)[K]>> | null;
  };
  const failed = keys.filter((_, i) => settled[i].status === "rejected");
  if (failed.length) console.error("[health] history metrics failed:", failed.join(", "));
  if (failed.length === keys.length) {
    if (building) return null;
    throw new Error("[health] every history metric failed");
  }

  const days: Day[] = Array.from({ length: HISTORY_DAYS }, (_, i) => {
    const date = iso(civil(i - (HISTORY_DAYS - 1)));
    return {
      date,
      steps: got.steps?.get(date) ?? null,
      distanceKm: got.distanceKm?.get(date) ?? null,
      floors: got.floors?.get(date) ?? null,
      zoneMinutes: got.zoneMinutes?.get(date) ?? null,
      calories: got.calories?.get(date) ?? null,
      sleep: got.sleep?.get(date) ?? null,
      restingHr: got.restingHr?.get(date) ?? null,
      hrv: got.hrv?.get(date) ?? null,
      spo2: got.spo2?.get(date) ?? null,
      breathing: got.breathing?.get(date) ?? null,
    };
  });

  return { updated: new Date().toISOString(), days, workouts: got.workouts ?? [], failed };
}
