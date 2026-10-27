import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceList } from "@/components/about/ExperienceList";
import { PolaroidPile } from "@/components/about/PolaroidPile";
import { LongJ } from "@/components/pixel/LongJ";
import { education, photos, profile, socialLinks } from "@/content/profile";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-5 pb-24 pt-24 sm:pt-28">
      <h1 className="pixel rise text-[34px] leading-tight text-[var(--strong)]">Hi i&apos;m, <LongJ word={profile.name} />.</h1>
      <p className="rise d1 mt-3 text-[15px] leading-[1.5]">
        I&apos;m a <strong>software engineer</strong> with <strong>3 years at Adora</strong>, working across{" "}
        <strong>mobile</strong>, <strong>backend</strong> and <strong>AI</strong>. In my free time I&apos;m building{" "}
        <a className="link" href="https://oen-app.com" target="_blank" rel="noreferrer">Oen ↗</a>, a small app that
        keeps two people a little closer every day.
      </p>

      <section className="rise d2 mt-12">
        <h2 className="text-[var(--strong)]">My journey:</h2>
        <p className="mt-1 leading-[1.6]">
          Studied <strong>{education.degree}</strong> at {education.school} ({education.dates}), where
          competitive programming took over most evenings (
          <a className="link" href={`https://codeforces.com/profile/${profile.codeforces}`} target="_blank" rel="noreferrer">
            theviz ↗
          </a>
          ). Set DSA problems for iMocha, built Flutter apps at EventBeep, and practised TDD at Incubyte.
          Joined <strong>Adora</strong> as an intern in 2023, became a <strong>founding engineer</strong> in
          2024, and took on the <strong>tech lead</strong> role in October 2026.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-[var(--strong)]">Experience:</h2>
        <div className="mt-3">
          <ExperienceList />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[var(--strong)]">Outside of work:</h2>
        <ul className="mt-1 space-y-1">
          <li>· Solving contest problems on Codeforces. 1000+ so far, Specialist rated.</li>
          <li>· Went to ICPC Amritapuri regionals in 2022 (AIR 64).</li>
          <li>
            · Hackathons, most recently winning the Odoo Hackathon 2025.{" "}
            <Link className="link" href="/fun">
              see them ↗
            </Link>
          </li>
          <li>
            · There&apos;s a terminal on the{" "}
            <Link className="link" href="/fun#shell">
              fun page ↗
            </Link>{" "}
            if you&apos;d rather type.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-[var(--strong)]">Find me:</h2>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          {socialLinks.map((l) => (
            <a key={l.label} className="link" href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
          <a className="link" href={`mailto:${profile.email}`}>
            Email ↗
          </a>
        </p>
      </section>

      <div className="mt-12">
        <PolaroidPile
          photos={[...photos, { src: "/achievements/photo-6.jpg", caption: "Odoo Hackathon '25" }]}
          layout={[
            { x: 2, y: 8, r: -9, z: 1 },
            { x: 27, y: 0, r: 4, z: 2 },
            { x: 55, y: 6, r: 8, z: 3 },
            { x: 30, y: 44, r: -4, z: 4 },
          ]}
        />
        <p className="mono -mt-4 text-center text-[11px] text-[var(--faint)]">pick them up</p>
      </div>
    </main>
  );
}
