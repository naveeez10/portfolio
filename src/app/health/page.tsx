import type { Metadata } from "next";
import Link from "next/link";
import { HealthDashboard } from "@/components/health/HealthDashboard";
import { getHealthHistory, HISTORY_DAYS } from "@/lib/health-history";

export const metadata: Metadata = { title: "Health", description: "The last 30 days from my watch: activity, sleep, heart and workouts." };

/* Rebuilt in the background at most once an hour; if Google fails, the last good copy keeps serving. */
export const revalidate = 3600;
export const maxDuration = 60;

export default async function HealthPage() {
  const data = await getHealthHistory();
  return (
    <main className="mx-auto w-full max-w-[960px] px-5 pb-24 pt-24 sm:pt-28">
      <h1 className="rise text-[32px] leading-tight text-[var(--strong)]">Health</h1>
      <p className="rise d1 mt-2 text-[16.5px] leading-[1.5]">
        The last {HISTORY_DAYS} days from my Fitbit Air, synced through Google Health. Hover or tap a chart for each day.
      </p>
      {data ? (
        <HealthDashboard data={data} />
      ) : (
        <p className="mono mt-10 text-[13px] text-[var(--faint)]">
          No data right now. <Link className="link" href="/">Back home</Link>
        </p>
      )}
    </main>
  );
}
