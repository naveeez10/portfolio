"use client";

import { LongJ } from "@/components/pixel/LongJ";
import { profile, socialLinks } from "@/content/profile";
import { copyEmail } from "@/lib/toast";

export function SiteFooter({ built, commit }: Readonly<{ built: string; commit?: string }>) {
  return (
    <footer className="mx-auto w-full max-w-[880px] px-5 pb-16 sm:pb-20">
      <div className="border-t border-[var(--line)] pt-8">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6">
          <div>
            <p className="pixel text-[22px] leading-none text-[var(--strong)]">
              {profile.first} <LongJ word={profile.last} />
            </p>
            <p className="mt-2 text-[13px]">
              {profile.title.toLowerCase()} · {profile.location.toLowerCase()}
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13.5px]" aria-label="Elsewhere">
            {socialLinks.map((l) => (
              <li key={l.label}>
                <a className="link" href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              </li>
            ))}
            <li>
              <button type="button" className="link" onClick={() => copyEmail(profile.email)}>
                Copy email
              </button>
            </li>
          </ul>
        </div>
        <div className="mono mt-10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--faint)]">
          <p>
            deployed {commit ?? "locally"} · {built} · next.js on vercel
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="transition-colors hover:text-[var(--accent)]"
          >
            ↑ top
          </button>
        </div>
      </div>
    </footer>
  );
}
