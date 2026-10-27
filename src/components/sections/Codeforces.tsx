"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/content/profile";

type RatingChange = { contestId: number; contestName: string; rank: number; oldRating: number; newRating: number; ratingUpdateTimeSeconds: number };
type Submission = { creationTimeSeconds: number; verdict?: string; problem: { contestId?: number; index: string; name: string } };
type Data = { ratings: RatingChange[]; subs: Submission[] };

const API = "https://codeforces.com/api";

function useCodeforces(handle: string) {
  const [state, setState] = useState<{ status: "loading" | "ok" | "error"; data?: Data }>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [r, s] = await Promise.all([
          fetch(`${API}/user.rating?handle=${handle}`).then((x) => x.json()),
          fetch(`${API}/user.status?handle=${handle}`).then((x) => x.json()),
        ]);
        if (r.status !== "OK" || s.status !== "OK") throw new Error("bad response");
        if (alive) setState({ status: "ok", data: { ratings: r.result, subs: s.result } });
      } catch {
        if (alive) setState({ status: "error" });
      }
    })();
    return () => {
      alive = false;
    };
  }, [handle]);
  return state;
}

/* Rating colours follow Codeforces' own bands. */
const bands = [
  { min: 0, max: 1200, color: "#9ca3af", name: "Newbie" },
  { min: 1200, max: 1400, color: "#22c55e", name: "Pupil" },
  { min: 1400, max: 1600, color: "#22d3ee", name: "Specialist" },
  { min: 1600, max: 1900, color: "#6366f1", name: "Expert" },
  { min: 1900, max: 2100, color: "#c026d3", name: "CM" },
];

function RatingChart({ ratings }: Readonly<{ ratings: RatingChange[] }>) {
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 220;
  const pad = { l: 36, r: 10, t: 12, b: 22 };

  const { pts, yMin, yMax, x, y } = useMemo(() => {
    const vals = ratings.map((r) => r.newRating);
    const yMin = Math.floor((Math.min(...vals, 1000) - 50) / 100) * 100;
    const yMax = Math.ceil((Math.max(...vals) + 80) / 100) * 100;
    const t0 = ratings[0].ratingUpdateTimeSeconds;
    const t1 = ratings[ratings.length - 1].ratingUpdateTimeSeconds;
    const x = (t: number) => pad.l + ((t - t0) / Math.max(1, t1 - t0)) * (W - pad.l - pad.r);
    const y = (v: number) => pad.t + (1 - (v - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);
    const pts = ratings.map((r) => ({ x: x(r.ratingUpdateTimeSeconds), y: y(r.newRating), r }));
    return { pts, yMin, yMax, x, y };
  }, [ratings, pad.l, pad.r, pad.t, pad.b]);

  const path = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${path} L${pts[pts.length - 1].x},${H - pad.b} L${pts[0].x},${H - pad.b} Z`;
  const years = Array.from(new Set(ratings.map((r) => new Date(r.ratingUpdateTimeSeconds * 1000).getFullYear())));

  const onMove = (e: React.PointerEvent) => {
    const svg = ref.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    pts.forEach((p, i) => {
      if (Math.abs(p.x - mx) < Math.abs(pts[best].x - mx)) best = i;
    });
    setHover(best);
  };

  const h = hover !== null ? pts[hover] : null;
  const delta = h ? h.r.newRating - h.r.oldRating : 0;

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`Codeforces rating over ${ratings.length} contests, peaking at ${Math.max(...ratings.map((r) => r.newRating))}`}
      >
        <defs>
          <linearGradient id="cf-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {bands
          .filter((b) => b.max > yMin && b.min < yMax)
          .map((b) => {
            const top = y(Math.min(b.max, yMax));
            const bottom = y(Math.max(b.min, yMin));
            return (
              <g key={b.name}>
                <rect x={pad.l} y={top} width={W - pad.l - pad.r} height={bottom - top} fill={b.color} opacity="0.07" />
                <text x={W - pad.r - 4} y={top + 11} textAnchor="end" className="mono" fontSize="9" fill={b.color} opacity="0.75">
                  {b.name}
                </text>
              </g>
            );
          })}
        {Array.from({ length: (yMax - yMin) / 200 + 1 }, (_, i) => yMin + i * 200).map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray="2 4" />
            <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="var(--faint)" className="mono">
              {v}
            </text>
          </g>
        ))}
        {years.map((yr) => {
          const t = new Date(yr, 0, 1).getTime() / 1000;
          const xx = x(Math.max(t, ratings[0].ratingUpdateTimeSeconds));
          return (
            <text key={yr} x={xx} y={H - 6} fontSize="9" fill="var(--faint)" className="mono">
              {yr}
            </text>
          );
        })}
        <path d={area} fill="url(#cf-area)" />
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hover === i ? 4.5 : 1.8} fill={hover === i ? "var(--strong)" : "var(--accent)"} />
        ))}
        {h ? <line x1={h.x} x2={h.x} y1={pad.t} y2={H - pad.b} stroke="var(--strong)" strokeOpacity="0.35" /> : null}
      </svg>

      {h ? (
        <div
          className="mono pointer-events-none absolute top-2 z-10 w-[220px] rounded-md border border-[var(--line-2)] bg-[var(--panel)] px-2.5 py-2 text-[11px] shadow-[var(--shadow)]"
          style={{ left: `clamp(0px, calc(${(h.x / W) * 100}% - 110px), calc(100% - 220px))` }}
        >
          <p className="truncate text-[var(--strong)]">{h.r.contestName}</p>
          <p className="mt-1 flex justify-between text-[var(--text)]">
            <span>
              {h.r.newRating} <span style={{ color: delta >= 0 ? "var(--live)" : "#f87171" }}>{delta >= 0 ? `+${delta}` : delta}</span>
            </span>
            <span>rank {h.r.rank}</span>
          </p>
          <p className="text-[var(--faint)]">{new Date(h.r.ratingUpdateTimeSeconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
      ) : null}
    </div>
  );
}

function Heatmap({ subs }: Readonly<{ subs: Submission[] }>) {
  const byDay = useMemo(() => {
    const m = new Map<string, number>();
    subs.forEach((s) => {
      const key = new Date(s.creationTimeSeconds * 1000).toISOString().slice(0, 10);
      m.set(key, (m.get(key) ?? 0) + 1);
    });
    return m;
  }, [subs]);

  const years = useMemo(() => {
    const totals = new Map<number, number>();
    byDay.forEach((n, k) => totals.set(Number(k.slice(0, 4)), (totals.get(Number(k.slice(0, 4))) ?? 0) + n));
    return [...totals.entries()].sort((a, b) => a[0] - b[0]);
  }, [byDay]);

  const busiest = years.reduce((a, b) => (b[1] > a[1] ? b : a), years[0] ?? [new Date().getFullYear(), 0])[0];
  const [year, setYear] = useState<number>(busiest);
  const [tip, setTip] = useState<{ date: string; n: number } | null>(null);

  const weeks = useMemo(() => {
    const start = new Date(Date.UTC(year, 0, 1));
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    const cols: { date: string; n: number; inYear: boolean }[][] = [];
    const d = new Date(start);
    while (d.getUTCFullYear() <= year) {
      const col: { date: string; n: number; inYear: boolean }[] = [];
      for (let i = 0; i < 7; i++) {
        const key = d.toISOString().slice(0, 10);
        col.push({ date: key, n: byDay.get(key) ?? 0, inYear: d.getUTCFullYear() === year });
        d.setUTCDate(d.getUTCDate() + 1);
      }
      cols.push(col);
      if (d.getUTCFullYear() > year) break;
    }
    return cols;
  }, [byDay, year]);

  const level = (n: number) => (n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4);
  const total = years.find(([y]) => y === year)?.[1] ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="mono text-[var(--faint)]">
          {tip ? (
            <>
              <span className="text-[var(--strong)]">{tip.n} submissions</span> on {new Date(tip.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </>
          ) : (
            <>
              <span className="text-[var(--strong)]">{total}</span> submissions in {year}
            </>
          )}
        </p>
        <div className="flex gap-1" role="tablist" aria-label="Year">
          {years.map(([y]) => (
            <button
              key={y}
              type="button"
              role="tab"
              aria-selected={y === year}
              onClick={() => setYear(y)}
              className={[
                "mono rounded px-1.5 py-0.5 text-[11px] transition-colors",
                y === year ? "bg-[var(--accent)] text-white" : "text-[var(--faint)] hover:text-[var(--strong)]",
              ].join(" ")}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 overflow-x-auto pb-1" onPointerLeave={() => setTip(null)}>
        <div className="flex w-max gap-[3px]">
          {weeks.map((col, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {col.map((c) => (
                <span
                  key={c.date}
                  onPointerEnter={() => c.inYear && setTip({ date: c.date, n: c.n })}
                  className="h-[10px] w-[10px] rounded-[2px] transition-transform hover:scale-150"
                  style={{ background: c.inYear ? `var(--heat-${level(c.n)})` : "transparent" }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Codeforces() {
  const cf = useCodeforces(profile.codeforces);

  const stats = useMemo(() => {
    if (!cf.data) return null;
    const { ratings, subs } = cf.data;
    const solved = new Set(subs.filter((s) => s.verdict === "OK").map((s) => `${s.problem.contestId}-${s.problem.index}`)).size;
    const max = Math.max(...ratings.map((r) => r.newRating));
    const best = ratings.reduce((a, b) => (b.newRating - b.oldRating > a.newRating - a.oldRating ? b : a));
    return [
      { k: "rating", v: String(ratings[ratings.length - 1]?.newRating ?? "—") },
      { k: "peak", v: String(max) },
      { k: "contests", v: String(ratings.length) },
      { k: "solved", v: String(solved) },
      { k: "best jump", v: `+${best.newRating - best.oldRating}` },
    ];
  }, [cf.data]);

  return (
    <div>
      <p className="mono flex items-center gap-1.5 text-[var(--faint)]">
        <span className={`h-1.5 w-1.5 rounded-full ${cf.status === "ok" ? "bg-[var(--accent)]" : "bg-[var(--faint)]"}`} aria-hidden="true" />
        {cf.status === "ok" ? "live from the Codeforces API" : cf.status === "loading" ? "fetching…" : "offline snapshot"}
      </p>
      {cf.status === "error" ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-[var(--line-2)]">
          <Image src="/codeforces.png" alt="Codeforces activity heatmap for theviz" width={1782} height={372} className="h-auto w-full" />
        </div>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-3 border-y border-[var(--line)] sm:grid-cols-5">
            {(stats ?? Array.from({ length: 5 }, (_, i) => ({ k: ["rating", "peak", "contests", "solved", "best jump"][i], v: "" }))).map((s, i) => (
              <div key={s.k} className={["py-3", i ? "sm:border-l sm:border-[var(--line)] sm:pl-4" : "", i % 3 ? "border-l border-[var(--line)] pl-4 sm:pl-4" : "", i >= 3 ? "border-t border-[var(--line)] sm:border-t-0" : ""].join(" ")}>
                <dt className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--faint)]">{s.k}</dt>
                <dd className="mt-0.5 text-lg font-medium tabular-nums text-[var(--strong)]">
                  {s.v || <span className="inline-block h-4 w-10 animate-pulse rounded bg-[var(--panel-2)] align-middle" />}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">{cf.data ? <RatingChart ratings={cf.data.ratings} /> : <div className="h-[200px] animate-pulse rounded-lg bg-[var(--panel)]" />}</div>
          <div className="mt-8">{cf.data ? <Heatmap subs={cf.data.subs} /> : null}</div>
        </>
      )}
    </div>
  );
}
