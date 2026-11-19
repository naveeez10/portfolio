import type { Metadata } from "next";
import { Contributions } from "@/components/fun/Contributions";
import { Codeforces } from "@/components/sections/Codeforces";
import { getContributions } from "@/lib/github";
import { Shell } from "@/components/sections/Shell";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { CHART, CURSOR, TERMINAL, TROPHY } from "@/components/pixel/bitmaps";
import { achievements, profile } from "@/content/profile";

export const metadata: Metadata = { title: "Fun" };

/* The GitHub graph is fetched at build and refreshed every 6 hours. */
export const revalidate = 21600;

function Heading({ icon, title, sub }: Readonly<{ icon: readonly string[]; title: string; sub: string }>) {
  return (
    <div>
      <h2 className="flex items-center gap-2.5 text-[16px] text-[var(--strong)]">
        <span className="text-[var(--strong)]">
          <PixelIcon bitmap={icon} scale={1.5} />
        </span>
        {title}
      </h2>
      <p className="mt-1 max-w-[340px] text-[13px] leading-[1.4]">{sub}</p>
    </div>
  );
}

export default async function FunPage() {
  const github = await getContributions(profile.github);
  return (
    <main className="mx-auto w-full max-w-[720px] px-5 pb-24 pt-24 sm:pt-28">
      <div className="rise flex items-center gap-2.5 text-[var(--strong)]">
        <PixelIcon bitmap={CURSOR} scale={1.5} />
        <h1 className="text-[16px]">fun</h1>
      </div>
      <p className="rise d1 mt-8 max-w-[260px] text-[15px] leading-[1.45]">
        A collection of <strong>experiments</strong>, <strong>hackathons</strong>, and <strong>things built for fun</strong>.
      </p>

      <section data-fx="in" className="mt-16">
        <Heading icon={CHART} title="GitHub" sub="A year of commits, reviews and pull requests. Hover a square to see the day." />
        <div className="mt-5 rounded-[22px] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6">
          {github ? (
            <Contributions data={github} user={profile.github} />
          ) : (
            <p className="mono text-[12px] text-[var(--faint)]">
              Couldn&apos;t reach GitHub right now.{" "}
              <a className="link" href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">See it on GitHub ↗</a>
            </p>
          )}
        </div>
      </section>

      <section data-fx="in" className="mt-16">
        <Heading icon={CHART} title="Codeforces, back then" sub="Where the repeats started, mostly in college. I don't compete much anymore; hover the chart to scrub the old contests." />
        <div className="mt-5 rounded-[22px] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6">
          <Codeforces />
        </div>
      </section>

      <section id="shell" data-fx="in" className="mt-16 scroll-mt-10">
        <Heading icon={TERMINAL} title="Terminal" sub="This site, as a shell. Try help, work, or wins. Tab completes, ↑ recalls." />
        <div className="mt-5">
          <Shell />
        </div>
      </section>

      <section data-fx="in" className="mt-16">
        <Heading icon={TROPHY} title="Hackathons & contests" sub="Built in a weekend, judged by strangers." />
        <ul className="rows mt-5 border-t border-[var(--line)]">
          {achievements.map((a) => (
            <li key={a.title} className="row grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-[var(--line)] py-3">
              <span>
                <span className="text-[var(--strong)]">{a.title}</span>
                <span className="ml-2 text-[var(--accent)]">{a.result}</span>
                <span className="mt-0.5 block text-[13px]">{a.detail}</span>
              </span>
              <span className="mono text-[11px] text-[var(--faint)]">{a.year}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
