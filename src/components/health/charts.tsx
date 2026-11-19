"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/* Charts are drawn in real pixels (measured), so bar corners and 2px lines stay crisp at any width. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

const SURFACE = "#f7f7f7"; // var(--panel); the gap and ring colour
const H = 112;
const short = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
export const longDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

/* Clean tick: 1, 2 or 5 × 10ⁿ at or above the max. */
function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  return ([1, 2, 2.5, 5, 10].find((m) => m * p >= v) ?? 10) * p;
}
const compact = (v: number) => (v >= 10_000 ? `${Math.round(v / 1000)}K` : v.toLocaleString("en-IN"));

/* A bar path with a 4px rounded data end and a square baseline. */
function bar(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

type Frame = { title: string; value: ReactNode; note?: ReactNode; children: ReactNode };

export function ChartCard({ title, value, note, children }: Readonly<Frame>) {
  return (
    <figure className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] px-4 pb-3 pt-3">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="label">{title}</span>
        <span className="text-[15px] text-[var(--strong)]">{value}</span>
      </figcaption>
      {note && <p className="mono mt-0.5 text-right text-[11px] text-[var(--faint)]">{note}</p>}
      <div className="mt-2">{children}</div>
    </figure>
  );
}

function Tip({ x, w, children }: Readonly<{ x: number; w: number; children: ReactNode }>) {
  /* Measure the tooltip so it stays inside the card at either edge. */
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const half = Math.min(el.offsetWidth / 2, w / 2);
    el.style.left = `${Math.max(half, Math.min(w - half, x))}px`;
  });
  return (
    <div
      ref={ref}
      role="status"
      className="mono pointer-events-none absolute -top-1 z-10 w-max max-w-[calc(100vw-48px)] -translate-x-1/2 -translate-y-full rounded-[8px] border border-[var(--line)] bg-white px-2 py-1 text-[11px] leading-[1.45] text-[var(--strong)] shadow-sm"
      style={{ left: x }}
    >
      {children}
    </div>
  );
}

function Axis({ dates }: Readonly<{ dates: string[] }>) {
  return (
    <div className="mono mt-1.5 flex justify-between text-[10px] text-[var(--faint)]">
      <span>{short(dates[0])}</span>
      <span>{short(dates[Math.floor(dates.length / 2)])}</span>
      <span>today</span>
    </div>
  );
}

/* Hover/tap anywhere in a column; keyboard users step through days with the arrow keys. */
function useHover(n: number, w: number) {
  const [i, setI] = useState<number | null>(null);
  const slot = w / n;
  return {
    i,
    slot,
    props: {
      tabIndex: 0,
      onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => setI(Math.max(0, Math.min(n - 1, Math.floor((e.clientX - e.currentTarget.getBoundingClientRect().left) / slot)))),
      onPointerLeave: () => setI(null),
      onBlur: () => setI(null),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") setI((v) => Math.max(0, (v ?? n) - 1));
        if (e.key === "ArrowRight") setI((v) => Math.min(n - 1, (v ?? -1) + 1));
      },
    },
  };
}

type Series = { dates: string[]; values: (number | null)[]; format: (v: number) => string; label: string };

export function Bars({ dates, values, format, label }: Readonly<Series>) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const n = values.length;
  const { i, slot, props } = useHover(n, w);
  const max = niceMax(Math.max(0, ...values.map((v) => v ?? 0)));
  const bw = Math.max(2, Math.min(24, slot - 2));
  const last = n - 1;
  return (
    <div>
      <div ref={ref} {...props} aria-label={`${label}, last ${n} days`} className="relative h-[112px] cursor-crosshair outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded">
        {w > 0 && (
          <svg width={w} height={H} className="block overflow-visible">
            <line x1={0} x2={w} y1={0.5} y2={0.5} stroke="var(--line)" />
            <line x1={0} x2={w} y1={H / 2} y2={H / 2} stroke="var(--line)" />
            <line x1={0} x2={w} y1={H - 0.5} y2={H - 0.5} stroke="var(--line-2)" />
            {values.map((v, k) => {
              if (v === null || v <= 0) return null;
              const h = Math.max(2, (v / max) * (H - 1));
              const fill = k === i ? "#1f4fd1" : "var(--accent)";
              return <path key={k} d={bar(k * slot + (slot - bw) / 2, H - h, bw, h)} fill={fill} opacity={k === last && k !== i ? 0.45 : 1} />;
            })}
          </svg>
        )}
        <span className="mono pointer-events-none absolute right-0 top-0.5 bg-[var(--panel)] pl-1 text-[10px] text-[var(--faint)]">{compact(max)}</span>
        {i !== null && (
          <Tip x={i * slot + slot / 2} w={w}>
            {longDate(dates[i])} · {values[i] === null ? "no data" : `${format(values[i]!)}${i === last ? " so far" : ""}`}
          </Tip>
        )}
      </div>
      <Axis dates={dates} />
    </div>
  );
}

export function Line({ dates, values, format, label }: Readonly<Series>) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const n = values.length;
  const { i, slot, props } = useHover(n, w);
  const present = values.filter((v): v is number => v !== null);
  const lo = Math.min(...present);
  const hi = Math.max(...present);
  /* Data sits in a 16px-inset band so the low/high labels in the corners never cover it. */
  const [a, b] = lo === hi ? [lo - 1, hi + 1] : [lo, hi];
  const x = (k: number) => k * slot + slot / 2;
  const y = (v: number) => 16 + (1 - (v - a) / (b - a)) * (H - 32);
  /* Break the line wherever a day is missing rather than bridging the gap. */
  const d = values.reduce((p, v, k) => (v === null ? p : `${p}${k === 0 || values[k - 1] === null ? "M" : "L"}${x(k).toFixed(1)},${y(v).toFixed(1)}`), "");
  const end = values.findLastIndex((v) => v !== null);
  return (
    <div>
      <div ref={ref} {...props} aria-label={`${label}, last ${n} days`} className="relative h-[112px] cursor-crosshair outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded">
        {w > 0 && present.length > 0 && (
          <svg width={w} height={H} className="block overflow-visible">
            <line x1={0} x2={w} y1={0.5} y2={0.5} stroke="var(--line)" />
            <line x1={0} x2={w} y1={H - 0.5} y2={H - 0.5} stroke="var(--line-2)" />
            {/* Lone days between gaps have no segment, so give them a dot. */}
            {values.map((v, k) => (v !== null && values[k - 1] == null && values[k + 1] == null ? <circle key={k} cx={x(k)} cy={y(v)} r={2.5} fill="var(--accent)" /> : null))}
            <path d={d} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {i !== null && <line x1={x(i)} x2={x(i)} y1={0} y2={H} stroke="var(--line-2)" />}
            {[i !== null && values[i] !== null ? i : null, end].map((k, j) =>
              k === null || k < 0 ? null : <circle key={j} cx={x(k)} cy={y(values[k]!)} r={4} fill="var(--accent)" stroke={SURFACE} strokeWidth={2} />,
            )}
          </svg>
        )}
        <span className="mono pointer-events-none absolute right-0 top-0.5 bg-[var(--panel)] pl-1 text-[10px] text-[var(--faint)]">high {format(hi)}</span>
        <span className="mono pointer-events-none absolute bottom-0.5 right-0 bg-[var(--panel)] pl-1 text-[10px] text-[var(--faint)]">low {format(lo)}</span>
        {i !== null && (
          <Tip x={x(i)} w={w}>
            {longDate(dates[i])} · {values[i] === null ? "no data" : format(values[i]!)}
          </Tip>
        )}
      </div>
      <Axis dates={dates} />
    </div>
  );
}

/* Sleep stages, bottom to top in the order the legend reads. Validated palette (adjacent CVD ΔE ≥ 9.1). */
export const STAGES = [
  { key: "deep", label: "deep", color: "#2d68ff" },
  { key: "rem", label: "rem", color: "#eb6834" },
  { key: "light", label: "light", color: "#1baf7a" },
  { key: "awake", label: "awake", color: "#eda100" },
] as const;
type Stage = (typeof STAGES)[number]["key"];
type Night = Partial<Record<Stage, number | null>> & { asleep: number; bed: string; wake: string };

export function SleepBars({ dates, nights, format }: Readonly<{ dates: string[]; nights: (Night | null)[]; format: (m: number) => string }>) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const n = nights.length;
  const { i, slot, props } = useHover(n, w);
  const total = (s: Night) => STAGES.reduce((t, st) => t + (s[st.key] ?? 0), 0) || s.asleep;
  /* Round the scale up to whole two-hour steps, so the top tick reads 10h, not 16h 40m. */
  const max = Math.ceil(Math.max(60, ...nights.map((s) => (s ? total(s) : 0))) / 120) * 120;
  const bw = Math.max(2, Math.min(24, slot - 2));
  return (
    <div>
      <div ref={ref} {...props} aria-label={`Sleep by stage, last ${n} nights`} className="relative h-[112px] cursor-crosshair outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded">
        {w > 0 && (
          <svg width={w} height={H} className="block overflow-visible">
            <line x1={0} x2={w} y1={0.5} y2={0.5} stroke="var(--line)" />
            <line x1={0} x2={w} y1={H / 2} y2={H / 2} stroke="var(--line)" />
            <line x1={0} x2={w} y1={H - 0.5} y2={H - 0.5} stroke="var(--line-2)" />
            {nights.map((s, k) => {
              if (!s) return null;
              const bx = k * slot + (slot - bw) / 2;
              const hasStages = STAGES.some((st) => s[st.key]);
              if (!hasStages) {
                const h = (s.asleep / max) * (H - 1);
                return <path key={k} d={bar(bx, H - h, bw, h)} fill="var(--accent)" opacity={i === null || i === k ? 1 : 0.5} />;
              }
              let top = H;
              const segs = STAGES.filter((st) => (s[st.key] ?? 0) > 0);
              return (
                <g key={k} opacity={i === null || i === k ? 1 : 0.5}>
                  {segs.map((st, j) => {
                    const h = ((s[st.key] ?? 0) / max) * (H - 1);
                    top -= h;
                    /* 2px surface gap between stacked segments; only the top segment gets the rounded end. */
                    const gap = j < segs.length - 1 ? 2 : 0;
                    const hh = Math.max(1, h - gap);
                    return j === segs.length - 1 ? (
                      <path key={st.key} d={bar(bx, top, bw, hh)} fill={st.color} />
                    ) : (
                      <rect key={st.key} x={bx} y={top + gap} width={bw} height={hh} fill={st.color} />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        )}
        <span className="mono pointer-events-none absolute right-0 top-0.5 bg-[var(--panel)] pl-1 text-[10px] text-[var(--faint)]">{format(max)}</span>
        {i !== null && (
          <Tip x={i * slot + slot / 2} w={w}>
            {nights[i] ? (
              <>
                {longDate(dates[i])} · {format(nights[i]!.asleep)} · {nights[i]!.bed}→{nights[i]!.wake}
                <br />
                {STAGES.map((st) => `${st.label} ${nights[i]![st.key] ?? "–"}`).join(" · ")} min
              </>
            ) : (
              `${longDate(dates[i])} · no data`
            )}
          </Tip>
        )}
      </div>
      <Axis dates={dates} />
    </div>
  );
}
