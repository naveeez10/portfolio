const connectLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Codeforces (theviz)", href: "#" },
  { label: "LeetCode", href: "#" },
  { label: "CodeChef", href: "#" },
] as const;

const coreTechnologies = [
  "Dart",
  "Kotlin",
  "Swift",
  "JavaScript/TypeScript",
  "C++",
  "Go",
  "Flutter",
  "Firebase",
  "Next.js",
  "NestJS",
  "Express.js",
  "MongoDB",
  "MySQL",
  "GCP",
] as const;

const achievements = [
  "Codeforces Specialist (1431) — 1000+ problems solved (theviz)",
  "ICPC — AIR 129 (Amritapuri Preliminary; qualified for Regionals), AIR 64 (Amritapuri Regional 2022)",
  "Hackathons — Winner (Azadi ka Amrut Mohatsav Hackathon 2022) for Parivartan; 2nd Prize (HackNUthon, Nirma University)",
  "Funding — SSIP 2.0 grant ₹88,250 for Parivartan",
  "Odoo Hackathon ’25 — Winner (GlobeTrotter) among 19,000 teams, ₹1,50,000",
] as const;

type Role = {
  company: string;
  title: string;
  dates: string;
  stack?: string;
  bullets: string[];
};

const roles: Role[] = [
  {
    company: "Adora",
    title: "Founding Engineer (Intern until May 2024)",
    dates: "Oct 2023 — Present",
    stack: "Flutter, Firebase, Dart, Kotlin, Swift, TypeScript, GCP, GenAI",
    bullets: [
      "Designed and scaled the payments/subscription system from scratch using RevenueCat.",
      "Shipped core mobile features: Location History, Arrival/Departure Alerts, Line Voom Block, In‑app Purchase Blocking.",
      "Built LLM-powered safety features (e.g., unsafe text detection) and now architecting a self-hosted LLM pipeline to reduce inference costs.",
      "Owned reliability + analytics: Crashlytics, Firebase Cloud Functions, deep linking, and Amplitude reporting for UX decisions.",
      "Led 2 interns, drove code reviews, and supported releases with manual QA.",
    ],
  },
  {
    company: "Incubyte",
    title: "Software Craftsperson Intern",
    dates: "Jan 2024 — May 2024",
    stack: "TypeScript, Next.js, NestJS, TDD, Generative AI",
    bullets: [
      "Enhanced UI/UX for a US client using ChakraUI + Next.js + NestJS.",
      "Built proof-of-concepts including a GPT-powered RAG application.",
      "Developed APIs in NestJS with TDD and strong design patterns.",
    ],
  },
  {
    company: "EventBeep",
    title: "Software Development Intern",
    dates: "Mar 2023 — Sep 2023",
    stack: "Flutter, Firebase, Dart, BLoC, MVC",
    bullets: [
      "Contributed across design, testing, and maintenance of the mobile app.",
      "Improved performance and maintainability using Cubit/BLoC, getIt, freezed, build_runner.",
      "Collaborated with cross-functional teams to ship product improvements.",
    ],
  },
  {
    company: "iMocha (Skills Assessment Platform)",
    title: "Problem Setter Intern",
    dates: "Oct 2022 — Feb 2023",
    stack: "C++, C, Python",
    bullets: [
      "Designed and tested DSA problems (arrays, queues, DSU, sorting, hash tables) and wrote editorials.",
    ],
  },
];

function Section({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="border-t border-zinc-200/60 pt-10 dark:border-zinc-800/60">
      <h2 className="text-sm font-medium tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          About Me.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          Software Engineer building reliable, user-first products across mobile
          and web.
        </p>
        <p className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          I enjoy taking ideas from zero-to-one and scaling them—shipping
          polished Flutter experiences, building TypeScript web apps, and
          integrating GenAI where it genuinely improves safety and UX. I care
          about clean architecture, testable code, and making decisions backed
          by data.
        </p>
      </div>

      <div className="mt-12 grid gap-10">
        <Section title="Connect">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {connectLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-500 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-400"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Replace the “#” links with your real URLs.
          </p>
        </Section>

        <Section title="Core Technologies">
          <div className="flex flex-wrap gap-2">
            {coreTechnologies.map((t) => (
              <span
                key={t}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Achievements">
          <ul className="list-disc space-y-2 pl-5">
            {achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Section>

        <Section title="Experience">
          <div className="grid gap-6">
            {roles.map((r) => (
              <article key={`${r.company}-${r.title}`} className="space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {r.company} — {r.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {r.dates}
                  </p>
                </div>
                {r.stack ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {r.stack}
                  </p>
                ) : null}
                <ul className="list-disc space-y-1 pl-5">
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Education">
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              L.D. College of Engineering — B.E. (IT), CGPA 8.67
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Aug 2020 — May 2024 · Ahmedabad, Gujarat
            </p>
          </div>
        </Section>
      </div>
    </main>
  );
}


