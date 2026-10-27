"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/profile";

function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

/* ---------- Oen: "Today, together." in the app's own palette ---------- */

const OEN = {
  bg: "#211f1b",
  card: "#2f2c27",
  cream: "#f5f1e4",
  muted: "#b3ae9f",
  partner: "#73a3fc",
};

const SWATCHES = [
  { name: "ember", c: "#ed835e" },
  { name: "rose", c: "#e97da4" },
  { name: "gold", c: "#d09a21" },
  { name: "mint", c: "#45bf82" },
  { name: "lilac", c: "#b98cea" },
];

type Heart = { id: number; x: number; drift: number };

function StepRow({ who, color, value }: Readonly<{ who: string; color: string; value: number }>) {
  return (
    <div className="rounded-2xl p-3" style={{ background: OEN.card }}>
      <div className="flex items-center justify-between text-[11px]" style={{ color: OEN.muted }}>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} />
          <span style={{ color: OEN.cream }}>{who}</span> · steps
        </span>
        <span>{Math.round(value / 100)}% of 10,000</span>
      </div>
      <p className="mt-1 text-[24px] font-semibold tabular-nums tracking-tight" style={{ color: OEN.cream }}>
        {value.toLocaleString("en-US")}
      </p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: "#3d3a33" }}>
        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${value / 100}%`, background: color }} />
      </div>
    </div>
  );
}

export function OenVisual() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const [mine, setMine] = useState(SWATCHES[0]);
  const [steps, setSteps] = useState({ partner: 8412, you: 6280 });
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [sent, setSent] = useState(0);
  const id = useRef(0);

  // Steps tick up while the card is on screen, like a day going by.
  useEffect(() => {
    if (!on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setSteps((s) => ({
        partner: Math.min(10000, s.partner + Math.round(Math.random() * 14)),
        you: Math.min(10000, s.you + Math.round(Math.random() * 22)),
      }));
    }, 600);
    return () => window.clearInterval(t);
  }, [on]);

  const cheer = () => {
    const batch = Array.from({ length: 7 }, () => ({ id: id.current++, x: 40 + Math.random() * 20, drift: (Math.random() - 0.5) * 80 }));
    setHearts((h) => [...h, ...batch]);
    setSent((n) => n + 1);
    window.setTimeout(() => setHearts((h) => h.filter((x) => !batch.includes(x))), 1400);
  };

  return (
    <div ref={ref} className="relative flex h-full flex-col overflow-hidden p-5 sm:p-6" style={{ background: OEN.bg, color: OEN.cream }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: OEN.muted }}>
          a little look inside
        </span>
        <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: OEN.card, color: OEN.muted }}>
          demo day
        </span>
      </div>
      <p className="mt-2 text-[22px] font-semibold tracking-tight">
        Today, together<span style={{ color: mine.c }}>.</span>
      </p>

      <div className="mt-3 space-y-2">
        <StepRow who="Alex" color={OEN.partner} value={steps.partner} />
        <StepRow who="You" color={mine.c} value={steps.you} />
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
        <div>
          <p className="text-[10px]" style={{ color: OEN.muted }}>
            your colour · <span style={{ color: mine.c }}>{mine.name}</span>
          </p>
          <div className="mt-1.5 flex gap-1.5" role="radiogroup" aria-label="Pick your colour">
            {SWATCHES.map((s) => (
              <button
                key={s.name}
                type="button"
                role="radio"
                aria-checked={mine.name === s.name}
                aria-label={s.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setMine(s);
                }}
                className="h-5 w-5 rounded-full transition-transform hover:scale-110"
                style={{ background: s.c, boxShadow: mine.name === s.name ? `0 0 0 2px ${OEN.bg}, 0 0 0 3.5px ${s.c}` : undefined }}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            cheer();
          }}
          className="relative rounded-full px-3.5 py-2 text-[12px] font-medium transition-transform active:scale-95"
          style={{ background: mine.c, color: OEN.bg }}
        >
          {sent ? `Cheer sent ♥ ${sent > 1 ? `×${sent}` : ""}` : "Send Alex a cheer ♥"}
        </button>
      </div>

      {hearts.map((h) => (
        <span
          key={h.id}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-12 text-[18px]"
          style={{
            left: `${h.x}%`,
            color: mine.c,
            animation: "oen-heart 1.4s cubic-bezier(.2,.7,.3,1) forwards",
            ["--drift" as string]: `${h.drift}px`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}

/* ---------- Codeforces: live rating sparkline ---------- */

export function CodeforcesMini() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const [ratings, setRatings] = useState<number[] | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!on || ratings) return;
    fetch("https://codeforces.com/api/user.rating?handle=theviz")
      .then((r) => r.json())
      .then((j) => setRatings(j.result.map((x: { newRating: number }) => x.newRating)))
      .catch(() => setRatings([]));
  }, [on, ratings]);

  const W = 300;
  const H = 120;
  const pts = ratings?.length
    ? (() => {
        const min = Math.min(...ratings) - 40;
        const max = Math.max(...ratings) + 40;
        return ratings.map((v, i) => ({ x: (i / (ratings.length - 1)) * W, y: H - ((v - min) / (max - min)) * H, v }));
      })()
    : [];
  const shown = hover !== null && pts[hover] ? pts[hover].v : ratings?.length ? ratings[ratings.length - 1] : null;

  return (
    <div ref={ref} className="relative flex h-full flex-col justify-between bg-[#2d68ff] p-5 text-white sm:p-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "linear-gradient(#fff3 1px, transparent 1px), linear-gradient(90deg, #fff3 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="mono text-[10px] text-white/75">theviz · {hover !== null ? `contest ${hover + 1}` : "current rating"}</p>
          <p className="pixel mt-1 text-[56px] leading-none tabular-nums">{shown ?? "····"}</p>
        </div>
        <span className="mono flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-white" /> live
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative h-auto w-full overflow-visible"
        onPointerMove={(e) => {
          if (!pts.length) return;
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const i = Math.round(((e.clientX - r.left) / r.width) * (pts.length - 1));
          setHover(Math.max(0, Math.min(pts.length - 1, i)));
        }}
        onPointerLeave={() => setHover(null)}
        aria-label="Codeforces rating history"
        role="img"
      >
        {pts.length ? (
          <>
            <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            {hover !== null ? <circle cx={pts[hover].x} cy={pts[hover].y} r="4.5" fill="#fff" /> : null}
          </>
        ) : (
          <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="#fff" strokeOpacity="0.4" strokeDasharray="4 6" />
        )}
      </svg>
      <p className="mono relative text-[10px] text-white/75">hover the line · {ratings?.length ?? "…"} contests</p>
    </div>
  );
}

export function PhotoVisual({ project }: Readonly<{ project: Project }>) {
  if (!project.photo) return null;
  return <Image src={project.photo.src} alt={project.photo.alt} fill sizes="(max-width: 640px) 100vw, 520px" className="object-cover object-[50%_30%]" />;
}

export function ProjectVisual({ project }: Readonly<{ project: Project }>) {
  switch (project.visual) {
    case "adora":
      return <AdoraVisual />;
    case "oen":
      return <OenVisual />;
    case "codeforces":
      return <CodeforcesMini />;
    case "photo":
      return <PhotoVisual project={project} />;
  }
}

/* ---------- Adora: a brand tile, wordmark on a soft teal glow ---------- */

export function AdoraVisual() {
  const [glow, setGlow] = useState({ x: 50, y: 45 });

  return (
    <div
      className="relative flex h-full items-center justify-center overflow-hidden bg-[#0f332d]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      onPointerLeave={() => setGlow({ x: 50, y: 45 })}
    >
      {/* Drifting blobs */}
      <span aria-hidden="true" className="adora-blob absolute -left-[10%] top-[8%] h-[60%] w-[60%] rounded-full bg-[#4ecbae] opacity-70 blur-[70px]" />
      <span aria-hidden="true" className="adora-blob absolute -right-[12%] bottom-[-10%] h-[65%] w-[65%] rounded-full bg-[#1f8f78] opacity-60 blur-[80px] [animation-delay:-6s]" />
      {/* Cursor-follow glow */}
      <span
        aria-hidden="true"
        className="absolute h-[55%] w-[55%] rounded-full bg-[#9be8d6] opacity-30 blur-[70px] transition-[left,top] duration-700 ease-out"
        style={{ left: `${glow.x}%`, top: `${glow.y}%`, transform: "translate(-50%,-50%)" }}
      />
      {/* Fine grain */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: "radial-gradient(#fff 0.6px, transparent 0.6px)", backgroundSize: "3px 3px" }}
      />

      <div className="relative flex flex-col items-center text-center text-white">
        <span className="flex items-center gap-2.5">
          <Heart className="h-[clamp(30px,6.5vw,42px)] w-[clamp(30px,6.5vw,42px)]" strokeWidth={2.4} aria-hidden="true" />
          <span className="text-[clamp(44px,10vw,64px)] font-semibold leading-none tracking-[-0.04em]">Adora</span>
        </span>
        <p className="mt-3 text-[14px] text-white/85">
          Tech Lead<span className="mx-1.5 text-white/40">·</span>mobile, backend & ML
        </p>
      </div>

      <span className="mono absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur">
        oct 2023 — now
      </span>
    </div>
  );
}
