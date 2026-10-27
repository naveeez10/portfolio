export const profile = {
  name: "Naviz Khoja",
  first: "Naviz",
  last: "khoja",
  title: "Software Engineer",
  company: "Adora Inc.",
  email: "naveezkhoja1063@gmail.com",
  resumeHref: "/resume.pdf",
  codeforces: "theviz",
} as const;

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/naveeez10" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/naviz-khoja/" },
  { label: "Twitter", href: "https://twitter.com/iam_viz" },
  { label: "Codeforces", href: "https://codeforces.com/profile/theviz" },
  { label: "LeetCode", href: "https://leetcode.com/nvz10/" },
] as const;

export type ProjectVisual = "adora" | "oen" | "codeforces" | "photo";

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  where: string;
  visual: ProjectVisual;
  photo?: { src: string; alt: string };
  points: readonly string[];
  stack?: readonly string[];
  links?: readonly { label: string; href: string }[];
};

export const projects: readonly Project[] = [
  {
    slug: "adora",
    title: "Tech Lead at Adora.",
    blurb: "Leading engineering across mobile, frontend, backend, ML and infra. Three years from intern to founding engineer to tech lead.",
    where: "Adora Inc. · Oct 2023 — Present",
    visual: "adora",
    points: [
      "Tech Lead since October 2026, leading the mobile, frontend, backend and ML engineers.",
      "Founding Software Engineer from June 2024, working across the whole stack.",
      "Joined as a Software Engineer Intern in October 2023.",
    ],
    stack: ["Flutter", "Kotlin", "Swift", "TypeScript", "Go", "Bun", "Python", "GenAI", "GCP", "Kubernetes", "Docker"],
    links: [{ label: "adora-app.com", href: "https://www.adora-app.com" }],
  },
  {
    slug: "oen",
    title: "Oen, a little closer every day.",
    blurb: "A small app for two people: your steps, their sleep, and a little cheer in between. Building it in my free time.",
    where: "Side project · coming soon to iOS & Android",
    visual: "oen",
    points: [
      "Share steps, sleep, walks and runs: a small window into each other's everyday.",
      "Send a cheer to your person: a photo, a doodle, a little “thinking of you”.",
      "Choose what you share and keep the rest yours.",
      "Building it in my free time, outside my day job.",
    ],
    links: [{ label: "oen-app.com", href: "https://oen-app.com" }],
  },
  {
    slug: "codeforces",
    title: "103 rated contests and counting.",
    blurb: "Where the repeats started. Specialist on Codeforces with 1000+ problems solved; this card pulls my rating live.",
    where: "Codeforces · theviz",
    visual: "codeforces",
    points: [
      "Specialist on Codeforces, with 1000+ problems solved.",
      "ICPC Amritapuri 2022: AIR 129 in the preliminary, AIR 64 in the regional round.",
      "Set DSA problems and wrote editorials as a problem-setter intern at iMocha.",
    ],
    links: [
      { label: "Live stats & heatmap", href: "/fun" },
      { label: "codeforces.com/profile/theviz", href: "https://codeforces.com/profile/theviz" },
    ],
  },
  {
    slug: "globetrotter",
    title: "GlobeTrotter, first of 19,000 teams.",
    blurb: "Won the Odoo Hackathon 2025 with GlobeTrotter, taking the ₹1,50,000 prize.",
    where: "Odoo Hackathon · 2025",
    visual: "photo",
    photo: { src: "/achievements/photo-6.jpg", alt: "Holding the Odoo Hackathon 2025 winners cheque" },
    points: ["Built GlobeTrotter with the team at the Odoo Hackathon 2025.", "Won among 19,000 teams, with a ₹1,50,000 prize."],
  },
];

export const photos = [
  { src: "/achievements/photo-4.jpg", caption: "lanyards & balloons" },
  { src: "/achievements/photo-1.jpg", caption: "hour twenty" },
  { src: "/achievements/photo-2.jpg", caption: "table 55" },
] as const;

export const achievements = [
  { title: "Odoo Hackathon", result: "Winner", detail: "GlobeTrotter · 1st of 19,000 teams · ₹1,50,000", year: "2025" },
  { title: "ICPC Amritapuri", result: "AIR 64", detail: "Regional round · AIR 129 in the preliminary", year: "2022" },
] as const;

export const education = {
  school: "L.D. College of Engineering",
  degree: "B.E. Information Technology",
  detail: "CGPA 8.67",
  dates: "2020 — 2024",
} as const;
