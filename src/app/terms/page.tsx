import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-[700px] px-5 pb-24 pt-24 sm:pt-28">
      <h1 className="text-[32px] leading-tight text-[var(--strong)]">Terms</h1>
      <p className="mono mt-2 text-[13px] text-[var(--faint)]">last updated 19 nov 2026</p>

      <div className="mt-8 space-y-5 leading-[1.6]">
        <p>
          This is the personal portfolio of {profile.name}. You&apos;re welcome to browse it, link to it and share it.
        </p>
        <p>
          <strong>No accounts.</strong> The site has no sign-up or login. Its only Google integration reads my own health
          stats with my own account, as described in the <Link className="link" href="/privacy">privacy page</Link>.
        </p>
        <p>
          <strong>Content.</strong> Text, images and project write-ups are mine unless noted otherwise. Please ask before
          reusing them beyond a quote with a link back.
        </p>
        <p>
          <strong>No warranty.</strong> Everything here is provided as-is. The live numbers (time, ratings, health stats)
          come from third-party services and may be delayed or wrong.
        </p>
        <p>
          <strong>Contact.</strong>{" "}
          <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>
    </main>
  );
}
