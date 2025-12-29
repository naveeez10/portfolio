const achievements = [
  {
    title: "Codeforces Specialist (1431)",
    detail: "Handle: theviz · 1000+ problems solved.",
  },
  {
    title: "ICPC",
    detail:
      "AIR 129 in ICPC Amritapuri Preliminary (Qualified for Regionals) · AIR 64 in ICPC Amritapuri Regional Round 2022.",
  },
  {
    title: "Azadi ka Amrut Mohatsav Hackathon 2022 — Winner",
    detail:
      "Project: Parivartan (NFT Marketplace for Gujarat’s cultural artifacts).",
  },
  {
    title: "HackNUthon (Nirma University) — 2nd Prize",
    detail: "Project: Parivartan.",
  },
  {
    title: "SSIP 2.0 Funding",
    detail:
      "Parivartan funded under Gujarat Government’s Student Startup and Innovation Policy 2.0 (₹88,250).",
  },
  {
    title: "Odoo Hackathon 2025 — Winner",
    detail:
      "GlobeTrotter · Won among ~19,000 teams · Prize: ₹1,50,000.",
  },
] as const;

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
        <ul className="grid gap-4">
          {achievements.map((a) => (
            <li
              key={a.title}
              className="rounded-xl border border-zinc-200/70 bg-white p-5 dark:border-zinc-800/60 dark:bg-black"
            >
              <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                {a.title}
              </p>
              <p className="mt-1 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {a.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


