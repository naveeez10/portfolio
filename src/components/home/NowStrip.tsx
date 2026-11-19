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

function mood(hour: number) {
  if (hour < 6) return "asleep, hopefully";
  if (hour < 10) return "coffee first";
  if (hour < 19) return "at work";
  if (hour < 23) return "building Oen";
  return "one more bug";
}

function Tile({ label, value, sub, href, num, wide }: Readonly<{ label: string; value: string; sub: ReactNode; href?: string; num?: boolean; wide?: boolean }>) {
  const body = (
    <>
      <p className="label">{label}</p>
      <p className={`mt-1.5 min-h-[24px] leading-[24px] text-[var(--strong)] tabular-nums ${num ? "mono text-[19px]" : "text-[16.5px]"}`}>{value}</p>
      <p className="mono mt-1 flex items-center gap-1.5 text-[12px] text-[var(--faint)]">{sub}</p>
    </>
  );
  const cls = "block h-full rounded-[14px] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 transition-colors";
  if (!href) return <li data-fx="spot tilt" className={cls}>{body}</li>;
  const link = href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer" data-fx="spot tilt" className={`${cls} hover:border-[var(--accent)]`}>{body}</a>
  ) : (
    <Link href={href} data-fx="spot tilt" className={`${cls} hover:border-[var(--accent)]`}>{body}</Link>
  );
  /* Three tiles in a two-column phone grid: the last one spans the row instead of sitting alone. */
  return <li className={`group ${wide ? "col-span-2 sm:col-span-1" : ""}`}>{link}</li>;
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
    <li className="col-span-2 sm:col-span-3">
      <Link href="/health" data-fx="spot" className="block rounded-[14px] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 transition-colors hover:border-[var(--accent)]">
      <div className="flex items-center justify-between gap-4">
        <p className="label">body · from my watch <span className="text-[var(--accent)]">· last 30 days →</span></p>
        {h.stepsWeek.length === 7 && <Spark data={h.stepsWeek} />}
      </div>
      <dl className="mt-1.5 grid grid-cols-3 gap-3">
        {stats.filter(([, v]) => v !== null).map(([label, value, sub]) => (
          <div key={label}>
            <dt className="mono text-[12px] text-[var(--faint)]">{label}</dt>
            <dd data-fx="count" className="mono mt-0.5 text-[19px] leading-[24px] text-[var(--strong)] tabular-nums">{value}</dd>
            <dd className="mono mt-0.5 text-[12px] text-[var(--faint)]">{sub}</dd>
          </div>
        ))}
      </dl>
      </Link>
    </li>
  );
}

export function NowStrip() {
  const sec = useSyncExternalStore(tick, second, none);
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => (r.ok ? r.json() : null))
      .then(setHealth)
      .catch(() => {});
  }, []);

  const d = sec === null ? null : new Date(sec * 1000);
  const time = d ? fmt(d, { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }) : "--:--:--";
  const hour = d ? Number(fmt(d, { hour: "numeric", hourCycle: "h23" })) : null;

  return (
    <section aria-label="Right now" className="mx-auto w-full max-w-[960px] px-5 pt-12 sm:pt-14">
      <ul className="rise d3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Tile label="local time · ist" value={time} sub={hour === null ? "…" : mood(hour)} num />
        <Tile label="currently" value="Tech lead at Adora" sub="since oct 2026" href="/about" />
        <Tile label="side project" value="Building Oen" sub="for two people" href="https://oen-app.com" wide />
        {health && <HealthRow h={health} />}
      </ul>
    </section>
  );
}
