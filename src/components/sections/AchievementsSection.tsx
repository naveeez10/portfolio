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
    detail: "GlobeTrotter · Won among ~19,000 teams · Prize: ₹1,50,000.",
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
    <span className="rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2.5 py-1 text-[11px] font-semibold leading-none text-[var(--nb-text)]">
      {children}
    </span>
  );
}

function accentBg(variant: Achievement["variant"]) {
  switch (variant) {
    case "cp":
      return "bg-sky-300";
    case "icpc":
      return "bg-violet-300";
    case "hackathon":
      return "bg-emerald-300";
    case "funding":
      return "bg-amber-300";
  }
}

export function AchievementsSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--nb-text)]">
          Achievements.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--nb-muted)]">
          A few milestones from competitive programming, hackathons, and
          building in public.
        </p>
      </div>

      <section className="mt-10 border-t-2 border-[var(--nb-border)] pt-10">
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-4 shadow-[6px_6px_0_0_var(--nb-shadow)]">
            <dt className="text-xs font-semibold text-[var(--nb-muted)]">CF</dt>
            <dd className="mt-1 text-sm font-extrabold text-[var(--nb-text)]">
              Specialist · 1431
            </dd>
          </div>
          <div className="rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-4 shadow-[6px_6px_0_0_var(--nb-shadow)]">
            <dt className="text-xs font-semibold text-[var(--nb-muted)]">
              ICPC
            </dt>
            <dd className="mt-1 text-sm font-extrabold text-[var(--nb-text)]">
              AIR 129 · AIR 64
            </dd>
          </div>
          <div className="rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] p-4 shadow-[6px_6px_0_0_var(--nb-shadow)]">
            <dt className="text-xs font-semibold text-[var(--nb-text)]">Wins</dt>
            <dd className="mt-1 text-sm font-extrabold text-[var(--nb-text)]">
              Hackathons + Funding
            </dd>
          </div>
        </dl>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {achievements.map((a) => (
            <li
              key={a.title}
              className="group relative overflow-hidden rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-5 shadow-[6px_6px_0_0_var(--nb-shadow)] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]"
            >
              <div className="relative">
                <div
                  className={[
                    "absolute -left-10 -top-10 h-24 w-24 rotate-12 rounded-2xl border-2 border-[var(--nb-border)]",
                    accentBg(a.variant),
                  ].join(" ")}
                  aria-hidden="true"
                />
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-extrabold text-[var(--nb-text)]">
                    {a.title}
                  </p>
                  <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-text)] shadow-[3px_3px_0_0_var(--nb-shadow)]">
                    <Icon variant={a.variant} />
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-[var(--nb-muted)]">
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
    </div>
  );
}


