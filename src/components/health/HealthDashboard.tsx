"use client";

import type { HealthHistory } from "@/lib/health-history";
import { Bars, ChartCard, Line, SleepBars, STAGES, longDate } from "./charts";

const hm = (m: number) => `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, "0")}m`;
const int = (v: number) => Math.round(v).toLocaleString("en-IN");
const one = (v: number) => (Math.round(v * 10) / 10).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function avg(xs: (number | null | undefined)[]) {
  const v = xs.filter((x): x is number => typeof x === "number");
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}
function sum(xs: (number | null | undefined)[]) {
  const v = xs.filter((x): x is number => typeof x === "number");
  return v.length ? v.reduce((a, b) => a + b, 0) : null;
}
/* Typical clock time; bedtimes straddle midnight, so shift early-morning times past 24:00 before averaging. */
function clock(times: string[], night: boolean) {
  if (!times.length) return null;
  const mins = times.map((t) => {
    const [h, m] = t.split(":").map(Number);
    const v = h * 60 + m;
    return night && v < 12 * 60 ? v + 24 * 60 : v;
  });
  const a = Math.round(mins.reduce((x, y) => x + y, 0) / mins.length) % (24 * 60);
  return `${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

function Stat({ label, value, sub }: Readonly<{ label: string; value: string | null; sub: string }>) {
  return (
    <li data-fx="spot tilt" className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 hover:border-[var(--accent)]">
      <p className="label">{label}</p>
      <p data-fx="count" className="mt-1.5 text-[22px] leading-[26px] text-[var(--strong)]">{value ?? "–"}</p>
      <p className="mono mt-1 text-[12px] text-[var(--faint)]">{sub}</p>
    </li>
  );
}

function Section({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="mt-12">
      <h2 className="label mb-3">{title}</h2>
      {children}
    </section>
  );
}

export function HealthDashboard({ data }: Readonly<{ data: HealthHistory }>) {
  const { days, workouts } = data;
  const dates = days.map((d) => d.date);
  /* Today is still in progress, so averages use completed days. */
  const done = days.slice(0, -1);
  const pick = <K extends keyof (typeof days)[number]>(k: K) => days.map((d) => d[k]);
  const has = (vs: unknown[]) => vs.some((v) => v !== null && v !== undefined);

  const steps = pick("steps");
  const distance = pick("distanceKm");
  const floors = pick("floors");
  const zone = pick("zoneMinutes");
  const calories = pick("calories");
  const nights = pick("sleep");
  const rhr = pick("restingHr");
  const hrv = pick("hrv");
  const spo2 = pick("spo2");
  const breathing = pick("breathing");
  const slept = nights.filter((n): n is NonNullable<typeof n> => n !== null);

  const updated = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short", timeZone: "Asia/Kolkata", hourCycle: "h23" }).format(new Date(data.updated));
  const avgSteps = avg(done.map((d) => d.steps));
  const totalKm = sum(distance);
  const avgSleep = avg(slept.map((n) => n.asleep));
  const avgRhr = avg(rhr);

  return (
    <>
      <ul className="rise d1 mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Stat label="steps / day" value={avgSteps === null ? null : int(avgSteps)} sub={`${int(sum(steps) ?? 0)} total`} />
        <Stat label="distance" value={totalKm === null ? null : `${one(totalKm)} km`} sub={`${workouts.length} workout${workouts.length === 1 ? "" : "s"}`} />
        <Stat label="sleep / night" value={avgSleep === null ? null : hm(avgSleep)} sub={`${slept.length} nights tracked`} />
        <Stat label="resting hr" value={avgRhr === null ? null : `${Math.round(avgRhr)} bpm`} sub={rhr.at(-1) ? `${rhr.at(-1)} today` : "30-day average"} />
      </ul>

      <Section title="activity">
        <div className="grid gap-2.5">
          {has(steps) && (
            <ChartCard title="steps" value={avgSteps === null ? "–" : `${int(avgSteps)} avg`}>
              <Bars dates={dates} values={steps} format={(v) => `${int(v)} steps`} label="Steps per day" />
            </ChartCard>
          )}
          <div className="grid gap-2.5 sm:grid-cols-2">
            {has(distance) && (
              <ChartCard title="distance" value={`${one(avg(done.map((d) => d.distanceKm)) ?? 0)} km avg`}>
                <Bars dates={dates} values={distance} format={(v) => `${one(v)} km`} label="Distance per day" />
              </ChartCard>
            )}
            {has(calories) && (
              <ChartCard title="calories burned" value={`${int(avg(done.map((d) => d.calories)) ?? 0)} kcal avg`}>
                <Bars dates={dates} values={calories} format={(v) => `${int(v)} kcal`} label="Calories burned per day" />
              </ChartCard>
            )}
            {has(zone) && (
              <ChartCard title="active zone minutes" value={`${int(sum(zone) ?? 0)} total`}>
                <Bars dates={dates} values={zone} format={(v) => `${int(v)} min`} label="Active zone minutes per day" />
              </ChartCard>
            )}
            {has(floors) && (
              <ChartCard title="floors" value={`${int(sum(floors) ?? 0)} total`}>
                <Bars dates={dates} values={floors} format={(v) => `${int(v)} floors`} label="Floors climbed per day" />
              </ChartCard>
            )}
          </div>
        </div>
      </Section>

      {slept.length > 0 && (
        <Section title="sleep">
          <ChartCard
            title="time asleep"
            value={avgSleep === null ? "–" : `${hm(avgSleep)} avg`}
            note={`usually ${clock(slept.map((n) => n.bed), true)} → ${clock(slept.map((n) => n.wake), false)}`}
          >
            <SleepBars dates={dates} nights={nights} format={hm} />
            {/* Legend doubles as the visible labels the lighter stage colours need. */}
            <ul className="mono mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text)]">
              {STAGES.map((st) => {
                const m = avg(slept.map((n) => n[st.key]));
                return (
                  <li key={st.key} className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: st.color }} />
                    {st.label} <span className="text-[var(--strong)]">{m === null ? "–" : hm(m)}</span>
                  </li>
                );
              })}
            </ul>
          </ChartCard>
        </Section>
      )}

      {(has(rhr) || has(hrv) || has(spo2) || has(breathing)) && (
        <Section title="heart & recovery">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {has(rhr) && (
              <ChartCard title="resting heart rate" value={`${Math.round(avg(rhr)!)} bpm avg`}>
                <Line dates={dates} values={rhr} format={(v) => `${Math.round(v)} bpm`} label="Resting heart rate" />
              </ChartCard>
            )}
            {has(hrv) && (
              <ChartCard title="heart rate variability" value={`${Math.round(avg(hrv)!)} ms avg`}>
                <Line dates={dates} values={hrv} format={(v) => `${Math.round(v)} ms`} label="Heart rate variability" />
              </ChartCard>
            )}
            {has(spo2) && (
              <ChartCard title="blood oxygen (spo2)" value={`${one(avg(spo2)!)}% avg`}>
                <Line dates={dates} values={spo2} format={(v) => `${one(v)}%`} label="Blood oxygen during sleep" />
              </ChartCard>
            )}
            {has(breathing) && (
              <ChartCard title="breathing rate" value={`${one(avg(breathing)!)} /min avg`}>
                <Line dates={dates} values={breathing} format={(v) => `${one(v)} /min`} label="Breathing rate during sleep" />
              </ChartCard>
            )}
          </div>
        </Section>
      )}

      {workouts.length > 0 && (
        <Section title="workouts">
          <ul data-fx="in" className="divide-y divide-[var(--line)] rounded-[14px] border border-[var(--line)] bg-[var(--panel)]">
            {workouts.map((w) => (
              <li key={w.date + w.start} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
                <div>
                  <p className="text-[16.5px] capitalize text-[var(--strong)]">{w.type}</p>
                  <p className="mono text-[12px] text-[var(--faint)]">
                    {longDate(w.date)} · {w.start}
                  </p>
                </div>
                <p className="mono text-[13px] tabular-nums text-[var(--text)]">
                  {[w.minutes !== null && `${w.minutes} min`, w.km && `${one(w.km)} km`, w.kcal !== null && `${w.kcal} kcal`, w.avgHr && `${w.avgHr} bpm`].filter(Boolean).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <details data-fx="in" className="mt-12 rounded-[14px] border border-[var(--line)] bg-[var(--panel)] px-4 py-3">
        <summary className="label cursor-pointer">every day as a table</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="mono w-full min-w-[640px] text-left text-[12px] tabular-nums">
            <thead className="text-[var(--faint)]">
              <tr>
                {["date", "steps", "km", "kcal", "zone min", "floors", "sleep", "rhr", "hrv", "spo2", "breaths"].map((h) => (
                  <th key={h} className="py-1 pr-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[var(--strong)]">
              {[...days].reverse().map((d) => (
                <tr key={d.date} className="border-t border-[var(--line)]">
                  <td className="py-1 pr-3 text-[var(--text)]">{longDate(d.date)}</td>
                  <td className="pr-3">{d.steps === null ? "–" : int(d.steps)}</td>
                  <td className="pr-3">{d.distanceKm === null ? "–" : one(d.distanceKm)}</td>
                  <td className="pr-3">{d.calories === null ? "–" : int(d.calories)}</td>
                  <td className="pr-3">{d.zoneMinutes ?? "–"}</td>
                  <td className="pr-3">{d.floors ?? "–"}</td>
                  <td className="pr-3">{d.sleep ? hm(d.sleep.asleep) : "–"}</td>
                  <td className="pr-3">{d.restingHr ?? "–"}</td>
                  <td className="pr-3">{d.hrv === null ? "–" : Math.round(d.hrv)}</td>
                  <td className="pr-3">{d.spo2 === null ? "–" : `${one(d.spo2)}%`}</td>
                  <td className="pr-3">{d.breathing === null ? "–" : one(d.breathing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="mono mt-6 text-[12px] text-[var(--faint)]">
        updated {updated} ist · refreshes hourly{data.failed.length ? ` · couldn't load: ${data.failed.join(", ")}` : ""}
      </p>
    </>
  );
}
