import type { Metadata } from "next";
import { Codeforces } from "@/components/sections/Codeforces";
import { Shell } from "@/components/sections/Shell";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { CHART, CURSOR, TERMINAL, TROPHY } from "@/components/pixel/bitmaps";
import { achievements } from "@/content/profile";

export const metadata: Metadata = { title: "Fun" };

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

export default function FunPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-5 pb-24 pt-24 sm:pt-28">
      <div className="rise flex items-center gap-2.5 text-[var(--strong)]">
        <PixelIcon bitmap={CURSOR} scale={1.5} />
        <h1 className="text-[16px]">fun</h1>
      </div>
      <p className="rise d1 mt-8 max-w-[260px] text-[15px] leading-[1.45]">
        A collection of <strong>contests</strong>, <strong>experiments</strong>, and <strong>things built for fun</strong>.
      </p>

      <section className="mt-16">
        <Heading icon={CHART} title="Codeforces" sub="Where the repeats started. Hover the chart to scrub every rated contest; pick a year to see how often I showed up." />
        <div className="mt-5 rounded-[22px] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6">
          <Codeforces />
        </div>
      </section>

      <section id="shell" className="mt-16 scroll-mt-10">
        <Heading icon={TERMINAL} title="Terminal" sub="This site, as a shell. Try help, work, or codeforces. Tab completes, ↑ recalls." />
        <div className="mt-5">
          <Shell />
        </div>
      </section>

      <section className="mt-16">
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
