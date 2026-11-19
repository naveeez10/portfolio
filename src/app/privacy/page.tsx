import type { Metadata } from "next";
import { profile } from "@/content/profile";

export const metadata: Metadata = { title: "Privacy", robots: { index: false } };

/* Required by Google's OAuth consent screen for the Google Health integration that powers the "body" tile. */
export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-5 pb-24 pt-24 sm:pt-28">
      <h1 className="text-[28px] leading-tight text-[var(--strong)]">Privacy</h1>
      <p className="mono mt-2 text-[12px] text-[var(--faint)]">last updated 19 nov 2026</p>

      <div className="mt-8 space-y-5 leading-[1.6]">
        <p>
          This site belongs to {profile.name}. It has one Google integration: a small tile on the home page that shows
          my own step count, sleep and resting heart rate from my watch, read with the Google Health API.
        </p>
        <p>
          <strong>Whose data.</strong> Only mine. The integration is authorized with my own Google account, and visitors are
          never asked to sign in with Google or share any data.
        </p>
        <p>
          <strong>What is read.</strong> Read-only access to daily steps, sleep duration and daily resting heart rate. Nothing
          is written to Google, and no other health data is requested.
        </p>
        <p>
          <strong>How it is used.</strong> A server route fetches these numbers about every ten minutes and shows the
          totals on the home page. Raw data isn&apos;t stored in a database, sold, shared with third parties, or used for
          advertising or AI training.
        </p>
        <p>
          <strong>Analytics.</strong> The site uses Google Analytics to count page views. It doesn&apos;t use your Google
          account.
        </p>
        <p>
          <strong>Google API Services.</strong> Use of information received from Google APIs follows the{" "}
          <a className="link" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">
            Google API Services User Data Policy ↗
          </a>
          , including the Limited Use requirements.
        </p>
        <p>
          <strong>Contact.</strong>{" "}
          <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>
    </main>
  );
}
