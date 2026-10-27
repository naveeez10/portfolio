"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Photo = { src: string; caption: string };
type Spot = { x: number; y: number; r: number; z: number };

/** Polaroids you can pick up and drop. Positions are percentages of the pile area. */
export function PolaroidPile({ photos, layout, height = 380, width = "w-[42%] max-w-[210px]" }: Readonly<{ photos: readonly Photo[]; layout: Spot[]; height?: number; width?: string }>) {
  const area = useRef<HTMLDivElement>(null);
  const [spots, setSpots] = useState(layout);
  const [active, setActive] = useState<number | null>(null);
  const drag = useRef<{ i: number; dx: number; dy: number } | null>(null);
  const top = useRef(layout.length);

  const pct = (x: number, y: number) => {
    const r = area.current!.getBoundingClientRect();
    return { x: ((x - r.left) / r.width) * 100, y: ((y - r.top) / r.height) * 100 };
  };

  return (
    <div
      ref={area}
      className="relative touch-none select-none"
      style={{ height }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const p = pct(e.clientX, e.clientY);
        setSpots((s) =>
          s.map((sp, j) =>
            j === d.i
              ? { ...sp, x: Math.min(70, Math.max(-4, p.x - d.dx)), y: Math.min(62, Math.max(-6, p.y - d.dy)), r: Math.max(-16, Math.min(16, sp.r + e.movementX * 0.12)) }
              : sp
          )
        );
      }}
      onPointerUp={() => {
        drag.current = null;
        setActive(null);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setActive(null);
      }}
    >
      {photos.map((p, i) => {
        const s = spots[i];
        const lifted = active === i;
        return (
          <figure
            key={p.src}
            tabIndex={0}
            aria-label={`${p.caption}. Drag to move, or use arrow keys.`}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              const q = pct(e.clientX, e.clientY);
              drag.current = { i, dx: q.x - s.x, dy: q.y - s.y };
              top.current += 1;
              const z = top.current;
              setActive(i);
              setSpots((all) => all.map((sp, j) => (j === i ? { ...sp, z } : sp)));
            }}
            onKeyDown={(e) => {
              const k = e.shiftKey ? 6 : 2;
              const dx = e.key === "ArrowLeft" ? -k : e.key === "ArrowRight" ? k : 0;
              const dy = e.key === "ArrowUp" ? -k : e.key === "ArrowDown" ? k : 0;
              if (!dx && !dy) return;
              e.preventDefault();
              setSpots((all) => all.map((sp, j) => (j === i ? { ...sp, x: sp.x + dx, y: sp.y + dy } : sp)));
            }}
            className={`polaroid absolute ${width} cursor-grab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] active:cursor-grabbing`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              zIndex: s.z,
              transform: `rotate(${s.r}deg) scale(${lifted ? 1.05 : 1})`,
              transition: lifted ? "transform 150ms" : "transform 450ms cubic-bezier(.45,.05,.12,1)",
              boxShadow: lifted ? "0 34px 60px -20px rgba(17,18,20,.55)" : undefined,
            }}
          >
            <span className="relative block aspect-[4/3.2] overflow-hidden rounded-[2px] bg-[var(--panel-2)]">
              <Image src={p.src} alt={p.caption} fill sizes="220px" draggable={false} className="pointer-events-none object-cover" />
            </span>
            <figcaption className="pixel absolute inset-x-0 bottom-1.5 text-center text-[13px] text-[#111214]">{p.caption}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
