import Image from "next/image";
import Link from "next/link";
import { AchievementsPhotoCarousel } from "@/components/AchievementsPhotoCarousel";

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
    <span className="rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1 text-xs font-semibold leading-none text-[var(--nb-text)] transition-colors group-hover:bg-[var(--nb-accent-soft)]">
      {children}
    </span>
  );
}

type Stat = {
  label: string;
  value: string;
  hint: string;
  tone: "surface" | "accent";
};

const stats: readonly Stat[] = [
  {
    label: "Codeforces",
    value: "Specialist · 1431",
    hint: "theviz · 1000+ problems solved",
    tone: "surface",
  },
  {
    label: "ICPC",
    value: "AIR 129 · AIR 64",
    hint: "Amritapuri Preliminary + Regionals (2022)",
    tone: "surface",
  },
  {
    label: "Wins",
    value: "Hackathons + Funding",
    hint: "Multiple wins · SSIP 2.0 funded",
    tone: "accent",
  },
] as const;

function StatCard({ stat }: Readonly<{ stat: Stat }>) {
  const base =
    "rounded-2xl border-2 p-5 shadow-[6px_6px_0_0_var(--nb-shadow)] transition-transform transition-colors";
  const surface =
    "border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-text)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-[var(--nb-accent-soft)] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]";
  const accent =
    "border-[var(--nb-border)] bg-[var(--nb-accent)] text-white hover:-translate-x-[1px] hover:-translate-y-[1px] hover:brightness-[1.03] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]";
  return (
    <div
      className={[
        "group",
        base,
        stat.tone === "accent" ? accent : surface,
      ].join(" ")}
    >
      <p className="text-xs font-semibold opacity-80">{stat.label}</p>
      <p className="mt-2 text-lg font-extrabold tracking-tight">{stat.value}</p>
      <p className="mt-2 text-sm opacity-90">{stat.hint}</p>
    </div>
  );
}

function TimelineDot({
  variant,
}: Readonly<{ variant: Achievement["variant"] }>) {
  const border = "border-[var(--nb-border)]";
  switch (variant) {
    case "cp":
      return (
        <span
          className={[
            "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 bg-[var(--nb-surface)] text-[var(--nb-text)]",
            border,
            "shadow-[4px_4px_0_0_var(--nb-shadow)]",
          ].join(" ")}
        >
          <Icon variant={variant} />
        </span>
      );
    case "icpc":
      return (
        <span
          className={[
            "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 bg-[var(--nb-surface)] text-[var(--nb-text)]",
            border,
            "shadow-[4px_4px_0_0_var(--nb-shadow)]",
          ].join(" ")}
        >
          <Icon variant={variant} />
        </span>
      );
    case "hackathon":
      return (
        <span
          className={[
            "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 bg-[var(--nb-accent)] text-white",
            border,
            "shadow-[4px_4px_0_0_var(--nb-shadow)]",
          ].join(" ")}
        >
          <Icon variant={variant} />
        </span>
      );
    case "funding":
      return (
        <span
          className={[
            "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 bg-[var(--nb-surface)] text-[var(--nb-text)]",
            border,
            "shadow-[4px_4px_0_0_var(--nb-shadow)]",
          ].join(" ")}
        >
          <Icon variant={variant} />
        </span>
      );
  }
}

function CodeforcesCard() {
  return (
    <Link
      href="https://codeforces.com/profile/theviz"
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-6 shadow-[6px_6px_0_0_var(--nb-shadow)] transition-transform transition-colors hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-[var(--nb-accent-soft)] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-sm font-extrabold text-[var(--nb-text)]">
          Codeforces activity
        </h3>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[var(--nb-border)] bg-white px-3 py-1 text-xs font-bold text-[var(--nb-text)]">
          Profile <span aria-hidden="true">↗</span>
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-[var(--nb-muted)]">
        My peak problem-solving days looked like this.
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border-2 border-[var(--nb-border)] bg-white shadow-[4px_4px_0_0_var(--nb-shadow)]">
        <Image
          src="/codeforces.png"
          alt="Codeforces activity heatmap snapshot"
          width={1782}
          height={372}
          className="h-auto w-full select-none"
        />
      </div>

      <p className="mt-3 text-xs font-semibold text-[var(--nb-muted)]">
        Handle: <span className="font-bold text-[var(--nb-text)]">theviz</span>
      </p>
    </Link>
  );
}

const achievementPhotos: readonly string[] = [
  "/achievments/photo-1.jpg",
  "/achievments/photo-2.jpg",
  "/achievments/photo-3.jpg",
  "/achievments/photo-4.jpg",
  "/achievments/photo-5.jpg",
  "/achievments/photo-6.jpg",
] as const;

export function AchievementsSection() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--nb-text)]">
          Achievements.
        </h2>
        <p className="mt-4 text-base leading-8 text-[var(--nb-muted)]">
          Milestones from competitive programming, hackathons, and shipping
          products.
        </p>
      </div>

      <section className="mt-10 border-t-2 border-[var(--nb-border)] pt-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-6 shadow-[6px_6px_0_0_var(--nb-shadow)]">
              <h3 className="text-sm font-extrabold text-[var(--nb-text)]">
                What I optimize for
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--nb-muted)]">
                <li>
                  <span className="font-bold text-[var(--nb-text)]">
                    Consistency:
                  </span>{" "}
                  showing up daily and compounding skills.
                </li>
                <li>
                  <span className="font-bold text-[var(--nb-text)]">
                    Execution:
                  </span>{" "}
                  shipping, measuring, iterating.
                </li>
                <li>
                  <span className="font-bold text-[var(--nb-text)]">
                    Competitive edge:
                  </span>{" "}
                  problem solving under constraints.
                </li>
              </ul>
            </div>

            <CodeforcesCard />

            <AchievementsPhotoCarousel images={achievementPhotos} />
          </div>

          <ol className="relative space-y-4">
            <div
              className="absolute left-5 top-0 h-full w-[2px] bg-[var(--nb-border)]"
              aria-hidden="true"
            />
            {achievements.map((a) => (
              <li
                key={a.title}
                className="relative grid grid-cols-[56px_1fr] gap-4"
              >
                <div className="flex items-start justify-center pt-1">
                  <TimelineDot variant={a.variant} />
                </div>

                <div className="group rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-5 shadow-[6px_6px_0_0_var(--nb-shadow)] transition-transform transition-colors hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-[var(--nb-accent-soft)] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-base font-extrabold text-[var(--nb-text)]">
                      {a.title}
                    </p>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[var(--nb-border)] bg-white px-3 py-1 text-xs font-bold text-[var(--nb-text)]">
                      <Icon variant={a.variant} />
                      <span className="capitalize">{a.variant}</span>
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
          </ol>
        </div>
      </section>
    </div>
  );
}


