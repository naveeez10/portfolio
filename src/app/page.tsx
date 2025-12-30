"use client";

import Link from "next/link";
import { HeroGraphic } from "@/components/HeroGraphic";

export default function Home() {
  return (
    <main className="w-full">
      <section className="relative w-full overflow-hidden border-y-2 border-[var(--nb-border)] bg-black text-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-white/70">
              NAVIZ KHOJA
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Thinker. Builder.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">
              Software Engineer shipping mobile + web products, blending
              engineering fundamentals with fast iteration and a love for
              problem-solving.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-[var(--nb-accent)] px-4 py-2 text-sm font-extrabold text-[var(--nb-text)] shadow-[5px_5px_0_0_white] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_white] transition-transform"
              >
                About me <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-transparent px-4 py-2 text-sm font-extrabold text-white shadow-[5px_5px_0_0_white] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_white] transition-transform"
              >
                View projects <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-3xl border-2 border-white bg-[var(--nb-accent)] opacity-90" />
            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-3xl border-2 border-white bg-white/10" />
            <div className="relative rounded-3xl border-2 border-white bg-white/5 p-6 shadow-[10px_10px_0_0_white]">
              <HeroGraphic className="hero-float h-auto w-full" />
            </div>
          </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black shadow-[4px_4px_0_0_white]">
            <span className="text-white/80" aria-hidden="true">
              ↓
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
