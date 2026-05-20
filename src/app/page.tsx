"use client";

import Image from "next/image";
import Link from "next/link";
import { AboutSection } from "@/components/sections/AboutSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";

export default function Home() {
  return (
    <main className="w-full">
      <section
        id="top"
        className="relative w-full min-h-[calc(100dvh-104px)] overflow-hidden border-y-2 border-[var(--nb-border)] bg-white text-[var(--nb-text)]"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-12 sm:px-10 sm:py-16 min-h-[calc(100dvh-104px)]">
          <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-base font-extrabold tracking-widest text-[var(--nb-muted)]">
              NAVIZ KHOJA
            </p>
            <h1 className="mt-6 text-6xl font-extrabold tracking-tight sm:text-7xl">
              Built on repeats.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-[var(--nb-muted)]">
              Software Engineer shipping mobile and backend products, blending
              engineering fundamentals with fast iteration, GenAI, and a love
              for problem-solving.
            </p>

            <div className="mt-12 flex flex-wrap gap-5">
              <a
                href="mailto:naveezkhoja1063@gmail.com"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-7 py-4 text-lg font-extrabold text-white shadow-[6px_6px_0_0_var(--nb-shadow)] transition hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]"
              >
                Get in touch <span aria-hidden="true">↗</span>
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--nb-border)] bg-white px-7 py-4 text-lg font-extrabold text-[var(--nb-text)] shadow-[6px_6px_0_0_var(--nb-shadow)] transition hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]"
              >
                Resume <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/sisyphus.gif"
              alt="Sisyphus loop"
              width={900}
              height={900}
              priority
              unoptimized
              className="h-auto w-full select-none"
            />
          </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <Link
            href="#about"
            aria-label="Scroll to About section"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--nb-border)] bg-white shadow-[4px_4px_0_0_var(--nb-shadow)] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0_0_var(--nb-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-border)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <span className="text-[var(--nb-text)]" aria-hidden="true">
              ↓
            </span>
          </Link>
        </div>
      </section>

      <section id="about" className="scroll-mt-28">
        <AboutSection />
      </section>

      <section
        id="achievements"
        className="scroll-mt-28 border-t-2 border-[var(--nb-border)]"
      >
        <AchievementsSection />
      </section>
    </main>
  );
}
