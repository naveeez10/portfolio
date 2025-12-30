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
    <section className="rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-6 shadow-[6px_6px_0_0_var(--nb-shadow)]">
      <h2 className="text-sm font-extrabold tracking-tight text-[var(--nb-text)]">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-7 text-[var(--nb-muted)]">
        {children}
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--nb-text)]">
          About Me.
        </h2>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-3 py-1 text-xs font-extrabold text-[var(--nb-text)] shadow-[3px_3px_0_0_var(--nb-shadow)]">
          <span>Software Engineer</span>
          <span className="opacity-80">·</span>
          <span>Mobile + Web</span>
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--nb-muted)]">
          I enjoy taking ideas from zero-to-one and scaling them—shipping
          polished Flutter experiences, building TypeScript web apps, and
          integrating GenAI where it genuinely improves safety and UX. I care
          about clean architecture, testable code, and making decisions backed
          by data.
        </p>
      </div>

      <div className="mt-10 grid gap-6">
        <Section title="Connect">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {connectLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="font-bold underline decoration-[var(--nb-border)] underline-offset-4"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[var(--nb-muted)]">
            Replace the “#” links with your real URLs.
          </p>
        </Section>

        <Section title="Core Technologies">
          <div className="flex flex-wrap gap-2">
            {coreTechnologies.map((t) => (
              <span
                key={t}
                className="rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1 text-xs font-semibold text-[var(--nb-text)]"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Experience">
          <div className="grid gap-6">
            {roles.map((r) => (
              <article key={`${r.company}-${r.title}`} className="space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-sm font-extrabold text-[var(--nb-text)]">
                    {r.company} — {r.title}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--nb-muted)]">
                    {r.dates}
                  </p>
                </div>
                {r.stack ? (
                  <p className="text-xs text-[var(--nb-muted)]">{r.stack}</p>
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
            <p className="text-sm font-extrabold text-[var(--nb-text)]">
              L.D. College of Engineering — B.E. (IT), CGPA 8.67
            </p>
            <p className="text-xs text-[var(--nb-muted)]">
              Aug 2020 — May 2024 · Ahmedabad, Gujarat
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}


