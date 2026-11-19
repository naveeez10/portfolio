#!/usr/bin/env node
/*
 * One-time setup for the health tile: signs you in to Google, saves the refresh token to .env.local,
 * then probes each Google Health endpoint so you can see the data actually comes back.
 *
 *   1. Put GOOGLE_HEALTH_CLIENT_ID and GOOGLE_HEALTH_CLIENT_SECRET in .env.local
 *   2. node scripts/health-auth.mjs
 *
 * The OAuth client must list http://127.0.0.1:5179/callback as an authorized redirect URI.
 */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { exec } from "node:child_process";

const ENV = ".env.local";
const PORT = 5179;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
  "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
  "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
];

const envText = existsSync(ENV) ? readFileSync(ENV, "utf8") : "";
const env = Object.fromEntries(envText.split("\n").map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]));
const id = process.env.GOOGLE_HEALTH_CLIENT_ID ?? env.GOOGLE_HEALTH_CLIENT_ID;
const secret = process.env.GOOGLE_HEALTH_CLIENT_SECRET ?? env.GOOGLE_HEALTH_CLIENT_SECRET;
if (!id || !secret) {
  console.error(`Missing GOOGLE_HEALTH_CLIENT_ID / GOOGLE_HEALTH_CLIENT_SECRET in ${ENV}.`);
  process.exit(1);
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({ client_id: id, redirect_uri: REDIRECT, response_type: "code", scope: SCOPES.join(" "), access_type: "offline", prompt: "consent" });

const token = async (params) => {
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: id, client_secret: secret, ...params }) });
  const j = await r.json();
  if (!r.ok) throw new Error(`token endpoint ${r.status}: ${j.error} ${j.error_description ?? ""}`);
  return j;
};

const probe = async (label, access, url, init) => {
  const r = await fetch(url, { ...init, headers: { Authorization: `Bearer ${access}`, Accept: "application/json", "Content-Type": "application/json" } });
  const body = await r.text();
  console.log(`\n── ${label} → ${r.status}\n${body.slice(0, 1500)}`);
};

const server = createServer(async (req, res) => {
  const u = new URL(req.url, REDIRECT);
  if (u.pathname !== "/callback") return res.writeHead(404).end();
  const code = u.searchParams.get("code");
  res.writeHead(200, { "Content-Type": "text/plain" }).end(code ? "Done — you can close this tab and go back to the terminal." : `Error: ${u.searchParams.get("error")}`);
  server.close();
  if (!code) process.exit(1);

  try {
    const t = await token({ code, redirect_uri: REDIRECT, grant_type: "authorization_code" });
    if (!t.refresh_token) throw new Error("No refresh_token returned. Remove the app at myaccount.google.com/permissions and run again.");

    const line = `GOOGLE_HEALTH_REFRESH_TOKEN=${t.refresh_token}`;
    const cur = existsSync(ENV) ? readFileSync(ENV, "utf8") : "";
    writeFileSync(ENV, /^GOOGLE_HEALTH_REFRESH_TOKEN=.*$/m.test(cur) ? cur.replace(/^GOOGLE_HEALTH_REFRESH_TOKEN=.*$/m, line) : `${cur.trimEnd()}\n${line}\n`);
    console.log(`✓ Saved GOOGLE_HEALTH_REFRESH_TOKEN to ${ENV}`);
    if (t.refresh_token_expires_in) console.log(`  ! refresh token expires in ${Math.round(t.refresh_token_expires_in / 86400)} days — publish the OAuth app to Production so it doesn't.`);

    const api = "https://health.googleapis.com/v4/users/me";
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
    const [y, m, d] = today.split("-").map(Number);
    const ago = new Date(Date.UTC(y, m - 1, d - 6));
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    const cd = (x) => ({ year: x.getUTCFullYear(), month: x.getUTCMonth() + 1, day: x.getUTCDate() });
    const midnight = { hours: 0, minutes: 0, seconds: 0, nanos: 0 };
    const since = new Date(Date.UTC(y, m - 1, d - 7)).toISOString().slice(0, 10);

    await probe("identity", t.access_token, `${api}/identity`);
    await probe("steps dailyRollUp", t.access_token, `${api}/dataTypes/steps/dataPoints:dailyRollUp`, {
      method: "POST",
      body: JSON.stringify({ range: { start: { date: cd(ago), time: midnight }, end: { date: cd(next), time: midnight } }, windowSizeDays: 1 }),
    });
    await probe("sleep reconcile", t.access_token, `${api}/dataTypes/sleep/dataPoints:reconcile?filter=${encodeURIComponent(`sleep.interval.civil_end_time >= "${since}"`)}`);
    await probe("resting hr", t.access_token, `${api}/dataTypes/daily-resting-heart-rate/dataPoints?filter=${encodeURIComponent(`daily_resting_heart_rate.date >= "${since}"`)}`);

    const again = await token({ refresh_token: t.refresh_token, grant_type: "refresh_token" });
    console.log(`\n── refresh check: ${again.refresh_token && again.refresh_token !== t.refresh_token ? "⚠ refresh token ROTATES — a plain env var won't keep working" : "✓ refresh token is reusable (safe to store as an env var)"}`);
  } catch (e) {
    console.error("✗", e.message);
    process.exit(1);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Opening Google sign-in… if nothing opens, visit:\n${authUrl}\n`);
  exec(`${process.platform === "darwin" ? "open" : "xdg-open"} "${authUrl}"`);
});
