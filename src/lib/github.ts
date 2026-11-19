import "server-only";

/*
 * Reads the public contribution calendar from github.com/users/<name>/contributions — the same HTML fragment
 * GitHub's profile page loads — so no token is needed. Returns null if GitHub changes the markup or is down.
 */

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { days: ContributionDay[]; total: number; longestStreak: number; currentStreak: number; best: ContributionDay | null };

export async function getContributions(user: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
      headers: { "User-Agent": "portfolio-site", Accept: "text/html" },
      next: { revalidate: 21_600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const tips = new Map<string, number>();
    for (const m of html.matchAll(/for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const n = /^([\d,]+) contribution/.exec(m[2]);
      tips.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
    }
    const days: ContributionDay[] = [];
    for (const m of html.matchAll(/<td\b[^>]*\bdata-date="([\d-]+)"[^>]*>/g)) {
      const id = /\bid="(contribution-day-component-[\d-]+)"/.exec(m[0])?.[1];
      const level = Number(/\bdata-level="(\d)"/.exec(m[0])?.[1] ?? 0) as ContributionDay["level"];
      days.push({ date: m[1], count: (id && tips.get(id)) || 0, level });
    }
    if (days.length < 300) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));

    let run = 0;
    let longestStreak = 0;
    for (const d of days) {
      run = d.count > 0 ? run + 1 : 0;
      longestStreak = Math.max(longestStreak, run);
    }
    /* Today may not have a commit yet, so the current streak can end yesterday. */
    let currentStreak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) currentStreak++;
      else if (i === days.length - 1) continue;
      else break;
    }
    const best = days.reduce<ContributionDay | null>((b, d) => (!b || d.count > b.count ? d : b), null);
    return { days, total: days.reduce((t, d) => t + d.count, 0), longestStreak, currentStreak, best };
  } catch {
    return null;
  }
}
