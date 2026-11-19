import { getHealthStats, type HealthStats } from "@/lib/health";

/* Cached for 10 minutes, so visitors never trigger Google calls or token refreshes directly. */
export const revalidate = 600;

/* `HEALTH_FIXTURE=1 npm run dev` renders the tile with sample numbers, without any credentials. */
const fixture: HealthStats = { stepsToday: 8430, stepsWeek: [6120, 9874, 4310, 11250, 7702, 10033, 8430], sleepMinutes: 412, restingHr: 58 };

export async function GET() {
  const stats = process.env.NODE_ENV === "development" && process.env.HEALTH_FIXTURE === "1" ? fixture : await getHealthStats();
  return Response.json(stats);
}
