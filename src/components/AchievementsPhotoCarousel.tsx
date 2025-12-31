"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: readonly string[];
  intervalMs?: number;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function AchievementsPhotoCarousel({
  images,
  intervalMs = 3500,
}: Readonly<Props>) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const safeImages = useMemo(() => images, [images]);
  const [activeIdx, setActiveIdx] = useState(0);

  const goTo = (idx: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const next = ((idx % safeImages.length) + safeImages.length) % safeImages.length;
    setActiveIdx(next);

    const left = next * viewport.clientWidth;
    viewport.scrollTo({
      left,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const id = window.setInterval(() => goTo(activeIdx + 1), intervalMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, intervalMs, safeImages.length, prefersReducedMotion]);

  useEffect(() => {
    // Keep alignment when the viewport size changes.
    const onResize = () => goTo(activeIdx);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, prefersReducedMotion, safeImages.length]);

  if (safeImages.length === 0) return null;

  return (
    <div className="rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-6 shadow-[6px_6px_0_0_var(--nb-shadow)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-[var(--nb-text)]">
          Hackathons + ICPC
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => goTo(activeIdx - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--nb-border)] bg-white shadow-[3px_3px_0_0_var(--nb-shadow)] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--nb-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-border)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nb-bg)]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => goTo(activeIdx + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--nb-border)] bg-white shadow-[3px_3px_0_0_var(--nb-shadow)] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--nb-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-border)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nb-bg)]"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border-2 border-[var(--nb-border)] bg-white shadow-[4px_4px_0_0_var(--nb-shadow)]">
        <div
          ref={viewportRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {safeImages.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="relative aspect-[4/3] w-full shrink-0 snap-center"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {safeImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to photo ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={[
              "h-2.5 w-2.5 rounded-full border-2 border-[var(--nb-border)] transition-transform",
              idx === activeIdx ? "bg-[var(--nb-accent)]" : "bg-white",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}


