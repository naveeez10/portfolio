"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const connectLinks = [
  { label: "Email", href: "mailto:naveezkhoja1063@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/naviz-khoja/" },
  { label: "GitHub", href: "https://github.com/naveeez10" },
  { label: "Twitter", href: "https://twitter.com/iam_viz" },
  { label: "Codeforces (theviz)", href: "https://codeforces.com/profile/theviz" },
  { label: "LeetCode", href: "https://leetcode.com/nvz10/" },
] as const;

const coreTechnologies = [
  "Dart",
  "Kotlin",
  "Swift",
  "TypeScript",
  "C++",
  "Go",
  "Python",
  "Flutter",
  "Firebase",
  "Next.js",
  "NestJS",
  "Bun",
  "MongoDB",
  "MySQL",
  "GCP",
  "Kubernetes",
  "Docker",
] as const;

type Role = {
  company: string;
  title: string;
  dates: string;
  stack?: string;
  bullets: { id: string; content: React.ReactNode }[];
};

const roles: Role[] = [
  {
    company: "Adora Inc.",
    title: "Founding Software Engineer",
    dates: "Jun 2024 — Present",
    stack:
      "Flutter, Firebase, Kotlin, Swift, TypeScript, Go, Python, Bun, GCP, Kubernetes, Docker, GenAI",
    bullets: [
      {
        id: "adora-se-owned-location",
        content: (
          <>
            Owned and delivered <strong>end-to-end production features</strong>{" "}
            including <strong>Leave & Arrival Notifications</strong> and{" "}
            <strong>Location History</strong>—spanning UI, backend logic, and
            location-based algorithms for real-time parental safety use cases.
          </>
        ),
      },
      {
        id: "adora-se-unsafe-text",
        content: (
          <>
            Led development of <strong>Unsafe Text Detection</strong>:
            integrated LLM inference with <strong>Google Gemini</strong> and
            deployed <strong>ShieldGemma 9B</strong> on self-hosted VM
            infrastructure, <strong>significantly reducing inference costs</strong>{" "}
            vs managed LLM APIs.
          </>
        ),
      },
      {
        id: "adora-se-roc-auc",
        content: (
          <>
            Fine-tuned and evaluated safety classification models using{" "}
            <strong>ROC/AUC</strong> analysis, improving detection accuracy and
            optimizing thresholds for <strong>high-recall</strong> child safety
            scenarios.
          </>
        ),
      },
      {
        id: "adora-se-ingestion-pipeline",
        content: (
          <>
            Built a <strong>scalable pipeline</strong> to detect, ingest, and
            store messages from <strong>multiple third-party apps</strong> for
            cross-platform unsafe content analysis, with secure handling of
            sensitive user data.
          </>
        ),
      },
      {
        id: "adora-se-ai-ui",
        content: (
          <>
            Designed and implemented <strong>production UIs</strong> for
            AI-powered safety features focused on <strong>explainability</strong>
            , performance, and usability for non-technical parent users.
          </>
        ),
      },
      {
        id: "adora-se-kddi",
        content: (
          <>
            Led the <strong>KDDI integration</strong>: designed backend
            communication pipelines using <strong>NATS</strong>,{" "}
            <strong>Cloud Functions</strong>, and <strong>Cloud Tasks</strong>,
            ensuring <strong>static IP-based</strong> outbound access to meet
            telecom-grade security/compliance requirements.
          </>
        ),
      },
      {
        id: "adora-se-k8s-line",
        content: (
          <>
            Contributed to a <strong>Kubernetes-native LINE message monitoring
            platform</strong> on <strong>GKE</strong> serving thousands of users
            across production shards; orchestrated user lifecycle via{" "}
            <strong>custom Kubernetes operators (kubebuilder / CRDs)</strong>,
            dynamically migrating authenticated sessions from onboarding pools to
            application shards using shared <strong>ReadWriteMany PVCs</strong>.
          </>
        ),
      },
      {
        id: "adora-se-amplitude-ab",
        content: (
          <>
            Instrumented product analytics and event logging using{" "}
            <strong>Amplitude</strong>; ran <strong>data analysis</strong> and{" "}
            <strong>A/B test</strong> evaluation to iterate on feature design,
            onboarding flows, and UI decisions with marketing/UX partners.
          </>
        ),
      },
      {
        id: "adora-se-kodomamo",
        content: (
          <>
            Contributed to <strong>Kodomamo School (iPad)</strong> via Cloud
            Functions and UI components tailored for institutional deployments.
          </>
        ),
      },
      {
        id: "adora-se-screen-time",
        content: (
          <>
            Played a key role in the <strong>Screen Time Management</strong>{" "}
            system, contributing to implementation and review of{" "}
            <strong>AI-based web filtering</strong>, including classifier
            integration and safety logic validation.
          </>
        ),
      },
      {
        id: "adora-se-incidents",
        content: (
          <>
            Handled <strong>customer support</strong> and{" "}
            <strong>production incidents</strong>—diagnosing edge cases, fixing
            bugs, and reducing recurring issues by addressing root causes.
          </>
        ),
      },
      {
        id: "adora-se-mentorship",
        content: (
          <>
            Mentored and managed <strong>2 interns</strong> through feature
            delivery, code reviews, and quality improvements; performed
            cross-cutting refactors to improve stability and maintainability.
          </>
        ),
      },
    ],
  },
  {
    company: "Adora Inc.",
    title: "Software Engineer Intern",
    dates: "Oct 2023 — May 2024",
    stack: "Flutter, Firebase, Dart, TypeScript, GCP",
    bullets: [
      {
        id: "adora-intern-crashlytics",
        content: (
          <>
            Monitored production stability by reviewing{" "}
            <strong>Firebase Crashlytics</strong> daily; diagnosed root causes
            and shipped fixes that reduced crash frequency and improved
            reliability for active users.
          </>
        ),
      },
      {
        id: "adora-intern-family",
        content: (
          <>
            Built and shipped the <strong>Family</strong> feature to support
            multiple parents/guardians per family account for shared monitoring
            and management workflows.
          </>
        ),
      },
      {
        id: "adora-intern-autoroute",
        content: (
          <>
            Revamped the app routing/navigation architecture using{" "}
            <strong>auto_route</strong>—simplifying navigation logic, reducing
            routing bugs, and improving scalability for future features.
          </>
        ),
      },
      {
        id: "adora-intern-ui",
        content: (
          <>
            Designed and implemented <strong>Flutter UI components</strong> in
            close collaboration with designers and engineers; participated in
            regular code reviews to improve quality and consistency.
          </>
        ),
      },
      {
        id: "adora-intern-revenuecat",
        content: (
          <>
            Integrated the <strong>RevenueCat</strong> SDK for subscriptions
            and in-app payments, contributing to the launch of paid plans and
            production monetization infrastructure.
          </>
        ),
      },
    ],
  },
  {
    company: "Incubyte",
    title: "Software Craftsperson Intern",
    dates: "Jan 2024 — May 2024",
    stack: "TypeScript, Next.js, NestJS, TDD, Generative AI",
    bullets: [
      { id: "incubyte-uiux", content: "Enhanced UI/UX for a US client using ChakraUI + Next.js + NestJS." },
      { id: "incubyte-rag", content: "Built proof-of-concepts including a GPT-powered RAG application." },
      { id: "incubyte-tdd", content: "Developed APIs in NestJS with TDD and strong design patterns." },
    ],
  },
  {
    company: "EventBeep",
    title: "Software Development Intern",
    dates: "Mar 2023 — Sep 2023",
    stack: "Flutter, Firebase, Dart, BLoC, MVC",
    bullets: [
      { id: "eventbeep-contrib", content: "Contributed across design, testing, and maintenance of the mobile app." },
      { id: "eventbeep-perf", content: "Improved performance and maintainability using Cubit/BLoC, getIt, freezed, build_runner." },
      { id: "eventbeep-collab", content: "Collaborated with cross-functional teams to ship product improvements." },
    ],
  },
  {
    company: "iMocha (Skills Assessment Platform)",
    title: "Problem Setter Intern",
    dates: "Oct 2022 — Feb 2023",
    stack: "C++, C, Python",
    bullets: [
      {
        id: "imocha-dsa",
        content:
          "Designed and tested DSA problems (arrays, queues, DSU, sorting, hash tables) and wrote editorials.",
      },
      {
        id: "imocha-tests",
        content:
          "Created thorough edge-case test suites and validated constraints to prevent flaky or ambiguous evaluations.",
      },
      {
        id: "imocha-solutions",
        content:
          "Implemented reference solutions in C++/Python and verified time + memory behavior across inputs.",
      },
    ],
  },
];

function Section({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <Card as="section" interactive className="p-6">
      <h2 className="text-sm font-extrabold tracking-tight text-[var(--nb-text)]">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-7 text-[var(--nb-muted)]">
        {children}
      </div>
    </Card>
  );
}

function ExpandableBullets({
  bullets,
  defaultVisibleCount = 6,
  expanded = false,
}: Readonly<{
  bullets: Role["bullets"];
  defaultVisibleCount?: number;
  expanded?: boolean;
}>) {
  const canExpand = bullets.length > defaultVisibleCount;

  const visible = useMemo(() => {
    if (!canExpand || expanded) return bullets;
    return bullets.slice(0, defaultVisibleCount);
  }, [bullets, canExpand, defaultVisibleCount, expanded]);

  return (
    <ul
      className={[
        "mt-3 list-disc space-y-1 pl-5 text-[15px] leading-7",
        !expanded && canExpand ? "fade-mask-bottom" : "",
      ].join(" ")}
    >
      {visible.map((b) => (
        <li key={b.id}>{b.content}</li>
      ))}
    </ul>
  );
}

function RoleToggle({
  canExpand,
  expanded,
  onToggle,
}: Readonly<{
  canExpand: boolean;
  expanded: boolean;
  onToggle: () => void;
}>) {
  return (
    <button
      type="button"
      className={[
        "absolute left-0 top-1.5",
        "flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] shadow-[3px_3px_0_0_var(--nb-shadow)]",
        "transition",
        canExpand
          ? "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--nb-shadow)]"
          : "cursor-default",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-border)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nb-bg)]",
      ].join(" ")}
      aria-label={
        canExpand
          ? expanded
            ? "Collapse experience details"
            : "Expand experience details"
          : undefined
      }
      aria-expanded={canExpand ? expanded : undefined}
      disabled={!canExpand}
      onClick={onToggle}
    >
      <ChevronRight
        className="h-3.5 w-3.5 text-white transition-transform"
        style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        aria-hidden="true"
      />
    </button>
  );
}

export function AboutSection() {
  const [expandedRoleKeys, setExpandedRoleKeys] = useState<
    Readonly<Record<string, boolean>>
  >({});

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="max-w-2xl lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-4xl font-extrabold tracking-tight text-[var(--nb-text)]">
            About.
          </h2>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-4 py-2 text-sm font-extrabold text-white shadow-[3px_3px_0_0_var(--nb-shadow)]">
            <span>Software Engineer</span>
            <span className="opacity-80">·</span>
            <span>Mobile + Backend + GenAI</span>
          </div>

          <p className="mt-6 text-base leading-8 text-[var(--nb-muted)]">
            I build products end-to-end—shipping polished mobile experiences,
            reliable backend systems, and GenAI features that improve safety,
            UX, and decision-making. I care about clean architecture,
            measurable impact, and iteration that compounds.
          </p>

          <div className="mt-8">
            <Section title="Connect">
              <ul className="flex flex-wrap gap-2">
                {connectLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--nb-border)] bg-white px-4 py-2 text-sm font-extrabold text-[var(--nb-text)] shadow-[4px_4px_0_0_var(--nb-shadow)] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0_0_var(--nb-shadow)]"
                    >
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="mt-6">
            <Section title="Toolbox">
              <div className="flex flex-wrap gap-2">
                {coreTechnologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1 text-sm font-semibold text-[var(--nb-text)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        </div>

        <div className="space-y-6">
          <Section title="Experience">
            <ol className="relative space-y-5">
              <div
                className="absolute left-2 top-0 h-full w-[2px] bg-[var(--nb-border)]"
                aria-hidden="true"
              />
              {roles.map((r) => {
                const roleKey = `${r.company}-${r.title}`;
                const canExpand = r.bullets.length > 2;
                const expanded = expandedRoleKeys[roleKey] ?? false;
                return (
                  <li key={roleKey} className="relative pl-8">
                    <RoleToggle
                      canExpand={canExpand}
                      expanded={expanded}
                      onToggle={() =>
                        setExpandedRoleKeys((prev) => ({
                          ...prev,
                          [roleKey]: !expanded,
                        }))
                      }
                    />
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-base font-extrabold text-[var(--nb-text)]">
                        {r.company} — {r.title}
                      </h3>
                      <p className="text-sm font-semibold text-[var(--nb-muted)]">
                        {r.dates}
                      </p>
                    </div>
                    {r.stack ? (
                      <p className="mt-1 text-sm text-[var(--nb-muted)]">
                        {r.stack}
                      </p>
                    ) : null}
                    <ExpandableBullets
                      bullets={r.bullets}
                      defaultVisibleCount={2}
                      expanded={expanded}
                    />
                  </li>
                );
              })}
            </ol>
          </Section>

          <Section title="Education">
            <div className="space-y-1">
              <p className="text-base font-extrabold text-[var(--nb-text)]">
                L.D. College of Engineering — B.E. (IT), CGPA 8.67
              </p>
              <p className="text-sm text-[var(--nb-muted)]">
                Aug 2020 — May 2024 · Ahmedabad, Gujarat
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}


