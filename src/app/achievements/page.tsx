type Achievement = {
  title: string;
  detail: string;
  tags: readonly string[];
  variant: "cp" | "icpc" | "hackathon" | "funding";
};

const achievements: readonly Achievement[] = [
  {
    title: "Codeforces Specialist (1431)",
    detail: "Handle: theviz · 1000+ problems solved.",
    tags: ["Competitive Programming", "Codeforces"],
    variant: "cp",
  },
  {
    title: "ICPC",
    detail:
      "AIR 129 in ICPC Amritapuri Preliminary (Qualified for Regionals) · AIR 64 in ICPC Amritapuri Regional Round 2022.",
    tags: ["Competitive Programming", "ICPC"],
    variant: "icpc",
  },
  {
    title: "Azadi ka Amrut Mohatsav Hackathon 2022 — Winner",
    detail:
      "Project: Parivartan (NFT Marketplace for Gujarat’s cultural artifacts).",
    tags: ["Hackathon", "Winner"],
    variant: "hackathon",
  },
  {
    title: "HackNUthon (Nirma University) — 2nd Prize",
    detail: "Project: Parivartan.",
    tags: ["Hackathon", "2nd Prize"],
    variant: "hackathon",
  },
  {
    title: "SSIP 2.0 Funding",
    detail:
      "Parivartan funded under Gujarat Government’s Student Startup and Innovation Policy 2.0 (₹88,250).",
    tags: ["Funding", "SSIP 2.0"],
    variant: "funding",
  },
  {
    title: "Odoo Hackathon 2025 — Winner",
    detail:
      "GlobeTrotter · Won among ~19,000 teams · Prize: ₹1,50,000.",
    tags: ["Hackathon", "Winner"],
    variant: "hackathon",
  },
] as const;

function Icon({ variant }: Readonly<{ variant: Achievement["variant"] }>) {
  const common = "h-4 w-4";
  switch (variant) {
    case "cp":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6.5h16M7 10.5h10M9 14.5h6M11 18.5h2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "icpc":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6l3-7z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "hackathon":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 14l2 2 8-8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 12a7.5 7.5 0 1015 0 7.5 7.5 0 10-15 0z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "funding":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 7h10v14H7V7z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9 5h6v2H9V5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 12h5M9.5 15h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function Tag({ children }: Readonly<{ children: string }>) {
  return (
    <span className="rounded-full border border-zinc-200/80 bg-white px-2.5 py-1 text-[11px] leading-none text-zinc-600 dark:border-zinc-800/70 dark:bg-black dark:text-zinc-400">
      {children}
    </span>
  );
}

function accentClasses(variant: Achievement["variant"]) {
  switch (variant) {
    case "cp":
      return "from-sky-500/15 via-transparent to-transparent dark:from-sky-400/15";
    case "icpc":
      return "from-violet-500/15 via-transparent to-transparent dark:from-violet-400/15";
    case "hackathon":
      return "from-emerald-500/15 via-transparent to-transparent dark:from-emerald-400/15";
    case "funding":
      return "from-amber-500/15 via-transparent to-transparent dark:from-amber-400/15";
  }
}

export default function AchievementsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Achievements.
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          A few milestones from competitive programming, hackathons, and building
          in public.
        </p>
      </div>

      <section className="mt-10 border-t border-zinc-200/60 pt-10 dark:border-zinc-800/60">
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200/70 bg-white p-4 dark:border-zinc-800/60 dark:bg-black">
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">CF</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Specialist · 1431
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white p-4 dark:border-zinc-800/60 dark:bg-black">
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">ICPC</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
              AIR 129 · AIR 64
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white p-4 dark:border-zinc-800/60 dark:bg-black">
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">Wins</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Hackathons + Funding
            </dd>
          </div>
        </dl>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {achievements.map((a) => (
            <li
              key={a.title}
              className={[
                "group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-5 transition-all",
                "hover:-translate-y-0.5 hover:border-zinc-300/80 hover:shadow-sm",
                "dark:border-zinc-800/60 dark:bg-black dark:hover:border-zinc-700/70",
              ].join(" ")}
            >
              <div
                className={[
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity",
                  "group-hover:opacity-100",
                  accentClasses(a.variant),
                ].join(" ")}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {a.title}
                  </p>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/80 bg-white text-zinc-700 dark:border-zinc-800/70 dark:bg-black dark:text-zinc-200">
                    <Icon variant={a.variant} />
                  </span>
                </div>
              <p className="mt-1 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {a.detail}
              </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


