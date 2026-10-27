import type { ReactNode } from "react";

export type Role = {
  key: string;
  company: string;
  title: string;
  dates: string;
  current?: boolean;
  summary?: string;
  stack?: readonly string[];
  bullets: readonly { id: string; content: ReactNode }[];
};

export const roles: readonly Role[] = [
  {
    key: "adora-tech-lead",
    company: "Adora Inc.",
    title: "Tech Lead",
    dates: "Oct 2026 — Present",
    current: true,
    stack: ["Flutter", "Kotlin", "Swift", "TypeScript", "Go", "Bun", "Python", "GenAI", "GCP", "Kubernetes", "Docker"],
    bullets: [
      { id: "tl-1", content: "Leading the backend, frontend, mobile and ML teams, and the infra underneath them." },
      { id: "tl-2", content: "Setting technical direction, reviewing designs and code, and keeping releases moving." },
      { id: "tl-3", content: "First on call for production incidents, from triage through to the root-cause fix." },
    ],
  },
  {
    key: "adora-founding",
    company: "Adora Inc.",
    title: "Founding Software Engineer",
    dates: "Jun 2024 — Sep 2026",
    stack: ["Flutter", "Firebase", "Kotlin", "Swift", "TypeScript", "Go", "Bun", "Python", "GenAI", "GCP", "Kubernetes", "Docker"],
    bullets: [
      { id: "fse-1", content: "Shipped features end to end, from the Flutter app through backend services and cloud infra." },
      { id: "fse-2", content: "Built and evaluated ML models for safety features, tuning thresholds for high recall." },
      { id: "fse-3", content: "Designed backend pipelines and ran services on Kubernetes in production." },
      { id: "fse-4", content: "Used product analytics and A/B tests to iterate on onboarding and UI decisions." },
      { id: "fse-5", content: "Handled support and production incidents, and mentored two interns." },
    ],
  },
  {
    key: "adora-intern",
    company: "Adora Inc.",
    title: "Software Engineer Intern",
    dates: "Oct 2023 — May 2024",
    stack: ["Flutter", "Firebase", "Dart", "TypeScript", "GCP"],
    bullets: [
      { id: "int-1", content: "Built and shipped features in the Flutter app and its Firebase backend." },
      { id: "int-2", content: "Tracked crashes daily and shipped fixes that improved app stability." },
      { id: "int-3", content: "Reworked the app's navigation architecture and integrated in-app subscriptions." },
    ],
  },
  {
    key: "incubyte",
    company: "Incubyte",
    title: "Software Craftsperson Intern",
    dates: "Jan 2024 — May 2024",
    stack: ["TypeScript", "Next.js", "NestJS", "TDD", "GenAI"],
    bullets: [
      {
        id: "incubyte-uiux",
        content: "Enhanced UI/UX for a US client using Chakra UI, Next.js, and NestJS.",
      },
      {
        id: "incubyte-rag",
        content: "Built proof-of-concepts including a GPT-powered RAG application.",
      },
      {
        id: "incubyte-tdd",
        content: "Developed NestJS APIs with TDD and strong design patterns.",
      },
    ],
  },
  {
    key: "eventbeep",
    company: "EventBeep",
    title: "Software Development Intern",
    dates: "Mar 2023 — Sep 2023",
    stack: ["Flutter", "Firebase", "Dart", "BLoC"],
    bullets: [
      {
        id: "eventbeep-contrib",
        content: "Contributed across design, testing, and maintenance of the mobile app.",
      },
      {
        id: "eventbeep-perf",
        content:
          "Improved performance and maintainability using Cubit/BLoC, getIt, freezed, and build_runner.",
      },
      {
        id: "eventbeep-collab",
        content: "Collaborated with cross-functional teams to ship product improvements.",
      },
    ],
  },
  {
    key: "imocha",
    company: "iMocha",
    title: "Problem Setter Intern",
    dates: "Oct 2022 — Feb 2023",
    stack: ["C++", "Python"],
    bullets: [
      {
        id: "imocha-dsa",
        content:
          "Designed and tested DSA problems (arrays, queues, DSU, sorting, hash tables) and wrote editorials.",
      },
      {
        id: "imocha-tests",
        content:
          "Created thorough edge-case test suites and validated constraints to prevent ambiguous evaluations.",
      },
      {
        id: "imocha-solutions",
        content: "Wrote reference solutions in C++ and Python and checked their time and memory limits.",
      },
    ],
  },
];
