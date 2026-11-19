"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { profile } from "@/content/profile";

/* A clock that only exists on the client: the server renders the empty state, so nothing mismatches on hydration. */
const tick = (cb: () => void) => {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
};
const second = () => Math.floor(Date.now() / 1000);
const none = () => null;

function fmt(d: Date, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: profile.timeZone }).format(d);
}

/* Codeforces' rating bands, so the label matches the number without a second request. */
function rank(r: number) {
  const bands: [number, string][] = [
    [1200, "newbie"], [1400, "pupil"], [1600, "specialist"], [1900, "expert"], [2100, "candidate master"],
    [2300, "master"], [2400, "international master"], [2600, "grandmaster"], [3000, "international grandmaster"],
  ];
  return bands.find(([max]) => r < max)?.[1] ?? "legendary grandmaster";
}

function mood(hour: number) {
  if (hour < 6) return "asleep, hopefully";
  if (hour < 10) return "coffee first";
  if (hour < 19) return "at work";
  if (hour < 23) return "building Oen";
  return "one more bug";
}

function Tile({ label, value, sub, href, num }: Readonly<{ label: string; value: string; sub: ReactNode; href?: string; num?: boolean }>) {
  const body = (
    <>
      <p className="label">{label}</p>
      <p className={`mt-1.5 h-[22px] leading-[22px] text-[var(--strong)] tabular-nums ${num ? "mono text-[17px]" : "text-[15px]"}`}>{value}</p>
      <p className="mono mt-1 flex items-center gap-1.5 text-[11px] text-[var(--faint)]">{sub}</p>
    </>
  );
  const cls = "block h-full rounded-[14px] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 transition-colors";
  if (!href) return <li className={cls}>{body}</li>;
  const link = href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer" className={`${cls} hover:border-[var(--accent)]`}>{body}</a>
  ) : (
    <Link href={href} className={`${cls} hover:border-[var(--accent)]`}>{body}</Link>
  );
  return <li className="group">{link}</li>;
}

type Health = { stepsToday: number | null; stepsWeek: number[]; sleepMinutes: number | null; restingHr: number | null };

const hm = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

function Spark({ data }: Readonly<{ data: number[] }>) {
  const max = Math.max(...data, 1);
  return (
    <svg viewBox="0 0 70 22" className="h-[22px] w-[70px]" aria-hidden>
      {data.map((v, i) => (
        <rect key={i} x={i * 10} y={22 - Math.max(2, (v / max) * 22)} width="7" height={Math.max(2, (v / max) * 22)} rx="1.5"
          fill={i === data.length - 1 ? "var(--accent)" : "var(--line-2)"} />
      ))}
    </svg>
  );
}

/* Synced from my watch via the Google Health API; hidden entirely until there's data. */
function HealthRow({ h }: Readonly<{ h: Health }>) {
  const stats: [string, string | null, string][] = [
    ["steps today", h.stepsToday === null ? null : h.stepsToday.toLocaleString("en-IN"), h.stepsWeek.length ? `${Math.round(h.stepsWeek.reduce((a, b) => a + b, 0) / 7).toLocaleString("en-IN")}/day avg` : ""],
    ["last night", h.sleepMinutes === null ? null : hm(h.sleepMinutes), "asleep"],
    ["resting hr", h.restingHr === null ? null : `${h.restingHr} bpm`, "latest"],
  ];
  return (
    <li className="col-span-2 rounded-[14px] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 lg:col-span-4">
      <div className="flex items-center justify-between gap-4">
        <p className="label">body · from my watch</p>
        {h.stepsWeek.length === 7 && <Spark data={h.stepsWeek} />}
      </div>
      <dl className="mt-1.5 grid grid-cols-3 gap-3">
        {stats.filter(([, v]) => v !== null).map(([label, value, sub]) => (
          <div key={label}>
            <dt className="mono text-[11px] text-[var(--faint)]">{label}</dt>
            <dd className="mono mt-0.5 text-[17px] leading-[22px] text-[var(--strong)] tabular-nums">{value}</dd>
            <dd className="mono mt-0.5 text-[11px] text-[var(--faint)]">{sub}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

export function NowStrip() {
  const sec = useSyncExternalStore(tick, second, none);
  const [cf, setCf] = useState<number | null>(null);
  const [health, setHealth] = useState<Health | null>(null);

  /* Same endpoint as the Codeforces card, so both show the same number. */
  useEffect(() => {
    fetch(`https://codeforces.com/api/user.rating?handle=${profile.codeforces}`)
      .then((r) => r.json())
      .then((j) => setCf(j.result.at(-1)?.newRating ?? null))
      .catch(() => {});
    fetch("/api/health")
      .then((r) => (r.ok ? r.json() : null))
      .then(setHealth)
      .catch(() => {});
  }, []);

  const d = sec === null ? null : new Date(sec * 1000);
  const time = d ? fmt(d, { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }) : "--:--:--";
  const hour = d ? Number(fmt(d, { hour: "numeric", hourCycle: "h23" })) : null;

  return (
    <section aria-label="Right now" className="mx-auto w-full max-w-[880px] px-5 pt-12 sm:pt-14">
      <ul className="rise d3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Tile label="local time · ist" value={time} sub={hour === null ? "…" : mood(hour)} num />
        <Tile label="currently" value="Tech lead at Adora" sub="since oct 2026" href="/about" />
        <Tile label="side project" value="Building Oen" sub="for two people" href="https://oen-app.com" />
        <Tile
          label="codeforces"
          value={cf ? String(cf) : "····"}
          sub={
            <>
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--live)]" />
              {cf ? rank(cf) : "fetching"}
            </>
          }
          href={`https://codeforces.com/profile/${profile.codeforces}`}
          num
        />
        {health && <HealthRow h={health} />}
      </ul>
    </section>
  );
}
