"use client";

import Image from "next/image";
import Link from "next/link";
import { AboutSection } from "@/components/sections/AboutSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";

export default function Home() {
  return (
    <main className="w-full">
      <section className="relative w-full min-h-[calc(100dvh-72px)] overflow-hidden border-y-2 border-[var(--nb-border)] bg-white text-[var(--nb-text)]">
        <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-12 sm:px-10 sm:py-16 min-h-[calc(100dvh-72px)]">
          <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-[var(--nb-muted)]">
              NAVIZ KHOJA
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Thinker. Builder.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--nb-muted)]">
              Software Engineer shipping mobile + web products, blending
              engineering fundamentals with fast iteration and a love for
              problem-solving.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#about"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-[var(--nb-accent)] px-4 py-2 text-sm font-extrabold text-white shadow-[5px_5px_0_0_#fff] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_#fff]"
              >
                About me <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-[var(--nb-accent)] px-4 py-2 text-sm font-extrabold text-white shadow-[5px_5px_0_0_#fff] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_#fff]"
              >
                View projects <span aria-hidden="true">↗</span>
              </Link>
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

        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--nb-border)] bg-white shadow-[4px_4px_0_0_var(--nb-shadow)]">
            <span className="text-[var(--nb-text)]" aria-hidden="true">
              ↓
            </span>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-28">
        <AboutSection />
      </section>

      <section
        id="projects"
        className="scroll-mt-28 border-t-2 border-[var(--nb-border)]"
      >
        <div className="mx-auto w-full max-w-5xl px-6 py-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--nb-text)]">
            Projects.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--nb-muted)]">
            Coming soon.
          </p>
        </div>
      </section>

      <section
        id="ramblings"
        className="scroll-mt-28 border-t-2 border-[var(--nb-border)]"
      >
        <div className="mx-auto w-full max-w-5xl px-6 py-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--nb-text)]">
            Ramblings.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--nb-muted)]">
            Coming soon.
          </p>
        </div>
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
