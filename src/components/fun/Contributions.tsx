"use client";

import { useEffect, useRef, useState } from "react";
import type { Contributions as Data } from "@/lib/github";

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 26; // room for weekday labels
const TOP = 16; // room for month labels

const day = (d: string) => new Date(`${d}T00:00:00Z`);
const nice = (d: string) => day(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const int = (n: number) => n.toLocaleString("en-IN");

export function Contributions({ data, user }: Readonly<{ data: Data; user: string }>) {
  const scroller = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  /* On a phone the year doesn't fit, so start scrolled to the most recent weeks. */
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const first = day(data.days[0].date);
  const offset = first.getUTCDay(); // GitHub's columns start on Sunday
  const cells = data.days.map((d, i) => ({ ...d, col: Math.floor((i + offset) / 7), row: (i + offset) % 7 }));
  const cols = cells.at(-1)!.col + 1;
  const width = LEFT + cols * STEP;
  const height = TOP + 7 * STEP;

  /* A month label over the first column that starts in that month. */
  const months: { col: number; label: string }[] = [];
  for (const c of cells) {
    if (c.row !== 0 && c !== cells[0]) continue;
    const label = day(c.date).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
    if (months.at(-1)?.label !== label && (months.length === 0 || c.col - months.at(-1)!.col >= 3)) months.push({ col: c.col, label });
  }

  const h = hover === null ? null : cells[hover];
  const stats = [
    { label: "contributions", value: int(data.total), sub: "in the last year" },
    { label: "longest streak", value: `${data.longestStreak} days`, sub: "in a row" },
    { label: "current streak", value: `${data.currentStreak} day${data.currentStreak === 1 ? "" : "s"}`, sub: data.currentStreak ? "and counting" : "time to push something" },
    { label: "busiest day", value: data.best ? `${data.best.count}` : "–", sub: data.best ? day(data.best.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) : "" },
  ];

  return (
    <div>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label} data-fx="spot tilt" className="rounded-[14px] border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2.5 hover:border-[var(--accent)]">
            <p className="label">{s.label}</p>
            <p data-fx="count" className="mt-1 text-[20px] leading-[24px] text-[var(--strong)]">{s.value}</p>
            <p className="mono mt-0.5 text-[12px] text-[var(--faint)]">{s.sub}</p>
          </li>
        ))}
      </ul>

      <div className="relative mt-5">
        <div ref={scroller} className="overflow-x-auto pb-1 [scrollbar-width:thin]">
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", minWidth: 560, height: "auto" }} role="img" aria-label={`${int(data.total)} GitHub contributions in the last year`} data-fx="draw" onPointerLeave={() => setHover(null)} className="block">
            {months.map((m) => (
              <text key={m.col} x={LEFT + m.col * STEP} y={10} className="mono" fontSize={10} fill="var(--faint)">
                {m.label}
              </text>
            ))}
            {[
              [1, "mon"],
              [3, "wed"],
              [5, "fri"],
            ].map(([r, l]) => (
              <text key={l} x={0} y={TOP + (r as number) * STEP + 8.5} className="mono" fontSize={9} fill="var(--faint)">
                {l}
              </text>
            ))}
            {cells.map((c, i) => (
              <rect
                key={c.date}
                className="fx-cell"
                style={{ "--i": c.col } as React.CSSProperties}
                x={LEFT + c.col * STEP}
                y={TOP + c.row * STEP}
                width={CELL}
                height={CELL}
                rx={2.5}
                fill={`var(--heat-${c.level})`}
                stroke={hover === i ? "var(--strong)" : "none"}
                strokeWidth={1}
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                tabIndex={-1}
              />
            ))}
          </svg>
        </div>
        <div className="mono mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--faint)]">
          <span aria-live="polite" className="text-[var(--text)]">
            {h ? (
              <>
                <span className="text-[var(--strong)]">{h.count ? `${h.count} contribution${h.count === 1 ? "" : "s"}` : "No contributions"}</span> · {nice(h.date)}
              </>
            ) : (
              <>hover a square for the day</>
            )}
          </span>
          <span className="flex items-center gap-1">
            less
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: `var(--heat-${l})` }} />
            ))}
            more
          </span>
          <a className="link" href={`https://github.com/${user}`} target="_blank" rel="noreferrer">
            github.com/{user} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
