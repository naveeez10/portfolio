"use client";

import { useEffect, useRef } from "react";

/*
 * Site-wide visual effects, opted into with data-fx attributes so components stay plain markup:
 *   data-fx="in"     fade and rise into view on scroll (stagger with style --d)
 *   data-fx="spot"   soft accent glow that follows the cursor
 *   data-fx="tilt"   a few degrees of 3D tilt toward the cursor
 *   data-fx="count"  numbers count up the first time they come into view
 *   data-fx="draw"   charts draw in (bars .fx-bar, lines .fx-line, dots .fx-dot)
 * Plus a canvas that lights up the page's dot grid around the cursor and ripples on click.
 * With prefers-reduced-motion everything except the static glow is off, and nothing is ever hidden.
 */

const GRID = 24; // matches body background-size in globals.css
const ACCENT = "45, 104, 255";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- count-up ---------- */

function countUp(el: HTMLElement) {
  const node = el.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE || el.childNodes.length !== 1) return;
  const original = node.nodeValue ?? "";
  const parts = original.split(/(\d[\d,]*(?:\.\d+)?)/);
  const nums = parts.map((p, i) => (i % 2 ? { v: Number(p.replace(/,/g, "")), dec: p.split(".")[1]?.length ?? 0, comma: p.includes(","), pad: /^0\d/.test(p) ? p.length : 0 } : null));
  if (!nums.some(Boolean)) return;
  const fmt = (n: NonNullable<(typeof nums)[number]>, t: number) => {
    const v = n.v * t;
    const s = n.comma ? v.toLocaleString("en-IN", { minimumFractionDigits: n.dec, maximumFractionDigits: n.dec }) : v.toFixed(n.dec);
    return n.pad ? s.padStart(n.pad, "0") : s;
  };
  let start = 0;
  const dur = 900;
  /* Whatever happens to animation frames (a hidden tab pauses them), the real text comes back. */
  const restore = () => {
    if (el.contains(node)) node.nodeValue = original;
  };
  const failsafe = window.setTimeout(restore, dur + 600);
  const frame = (now: number) => {
    start ||= now;
    const p = Math.min(1, Math.max(0, (now - start) / dur));
    const e = 1 - (1 - p) ** 3;
    /* Bail if React has re-rendered this text in the meantime. */
    if (!el.contains(node)) return window.clearTimeout(failsafe);
    node.nodeValue = p >= 1 ? original : parts.map((s, i) => (nums[i] ? fmt(nums[i]!, e) : s)).join("");
    if (p < 1) requestAnimationFrame(frame);
    else window.clearTimeout(failsafe);
  };
  requestAnimationFrame(frame);
}

/* ---------- dot field ---------- */

function dotField(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  let w = 0;
  let h = 0;
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const target = { x: -999, y: -999 };
  const cur = { x: -999, y: -999 };
  let strength = 0; // fades the glow in and out
  let lastMove = 0;
  const ripples: { x: number; y: number; t: number }[] = [];
  let raf = 0;

  const R = 150;
  const draw = (now: number) => {
    raf = 0;
    ctx.clearRect(0, 0, w, h);
    cur.x += (target.x - cur.x) * 0.18;
    cur.y += (target.y - cur.y) * 0.18;
    const active = now - lastMove < 1200;
    strength += ((active ? 1 : 0) - strength) * 0.08;

    const ox = -((window.scrollX % GRID) + GRID) % GRID;
    const oy = -((window.scrollY % GRID) + GRID) % GRID;
    const live = ripples.filter((r) => now - r.t < 900);
    ripples.splice(0, ripples.length, ...live);

    /* Only visit dots near the cursor or a ripple ring. */
    const zones: [number, number, number][] = [];
    if (strength > 0.01) zones.push([cur.x, cur.y, R]);
    for (const r of live) zones.push([r.x, r.y, ((now - r.t) / 900) * 320 + 40]);

    const seen = new Set<number>();
    for (const [zx, zy, zr] of zones) {
      const x0 = Math.floor((zx - zr - ox) / GRID);
      const x1 = Math.ceil((zx + zr - ox) / GRID);
      const y0 = Math.floor((zy - zr - oy) / GRID);
      const y1 = Math.ceil((zy + zr - oy) / GRID);
      for (let gx = x0; gx <= x1; gx++) {
        for (let gy = y0; gy <= y1; gy++) {
          const key = gx * 100003 + gy;
          if (seen.has(key)) continue;
          seen.add(key);
          const x = ox + gx * GRID + GRID / 2;
          const y = oy + gy * GRID + GRID / 2;
          let f = 0;
          const d = Math.hypot(x - cur.x, y - cur.y);
          if (d < R) f = (1 - d / R) ** 2 * strength;
          for (const r of live) {
            const age = (now - r.t) / 900;
            const ring = age * 320 + 20;
            const band = Math.abs(Math.hypot(x - r.x, y - r.y) - ring);
            if (band < 26) f = Math.max(f, (1 - band / 26) * (1 - age) * 0.9);
          }
          if (f < 0.02) continue;
          /* Dots lean slightly toward the cursor. */
          const pull = d < R ? (1 - d / R) * 3 * strength : 0;
          const px = d > 0 ? x + ((cur.x - x) / d) * pull : x;
          const py = d > 0 ? y + ((cur.y - y) / d) * pull : y;
          ctx.beginPath();
          ctx.arc(px, py, 1 + f * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ACCENT}, ${Math.min(0.9, f * 0.95)})`;
          ctx.fill();
        }
      }
    }
    if (strength > 0.01 || live.length) raf = requestAnimationFrame(draw);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    target.x = e.clientX;
    target.y = e.clientY;
    if (cur.x < -900) {
      cur.x = target.x;
      cur.y = target.y;
    }
    lastMove = performance.now();
    kick();
  };
  const onDown = (e: PointerEvent) => {
    ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    kick();
  };
  const onLeave = () => {
    lastMove = 0;
    kick();
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", resize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("scroll", kick);
    window.removeEventListener("resize", resize);
  };
}

/* ---------- spotlight + tilt (one delegated listener) ---------- */

function pointerFx() {
  let last: HTMLElement | null = null;
  const tilt = finePointer() && !reduced();
  const reset = (el: HTMLElement) => {
    el.classList.remove("fx-tracking");
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  };
  const onMove = (e: PointerEvent) => {
    const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-fx~="spot"], [data-fx~="tilt"]') ?? null;
    if (last && last !== el) reset(last);
    last = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    if (tilt && el.matches('[data-fx~="tilt"]')) {
      /* Small cards tilt more than big ones, so it reads the same at any size. */
      const max = r.width > 360 ? 3 : 6;
      el.classList.add("fx-tracking");
      el.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
    }
  };
  const onOut = (e: PointerEvent) => {
    if (last && !last.contains(e.relatedTarget as Node | null)) {
      reset(last);
      last = null;
    }
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onOut, { passive: true });
  return () => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerout", onOut);
  };
}

/* ---------- scroll reveal, count-up, chart draw ---------- */

function viewFx(motion: boolean) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        const fx = (el.dataset.fx ?? "").split(/\s+/);
        if (fx.includes("in")) el.classList.add("fx-seen");
        if (fx.includes("draw")) requestAnimationFrame(() => el.classList.add("fx-drawn"));
        if (fx.includes("count") && motion) countUp(el);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  const watched = new WeakSet<Element>();
  const scan = (root: ParentNode) => {
    const els = root instanceof Element && root.matches("[data-fx]") ? [root, ...root.querySelectorAll("[data-fx]")] : [...root.querySelectorAll("[data-fx]")];
    for (const el of els) {
      const fx = (el as HTMLElement).dataset.fx ?? "";
      if (!/\b(in|draw|count)\b/.test(fx) || watched.has(el)) continue;
      watched.add(el);
      io.observe(el);
    }
  };
  scan(document);
  /* Catch things rendered later: route changes, charts after measuring, the home health row after its fetch. */
  const mo = new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) scan(n as Element);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  return () => {
    io.disconnect();
    mo.disconnect();
  };
}

export function Effects() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const motion = !reduced();
    const root = document.documentElement;
    root.classList.toggle("fx", motion);
    root.classList.add("fx-ready");
    const stops = [viewFx(motion), pointerFx()];
    if (motion && canvas.current) stops.push(dotField(canvas.current));
    return () => stops.forEach((s) => s());
  }, []);
  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen" />;
}

/* Runs before first paint (inlined in <head>) so reveal targets start hidden instead of flashing. */
export const fxBootScript = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("fx")}catch(e){}`;
