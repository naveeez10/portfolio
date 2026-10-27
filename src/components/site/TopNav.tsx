"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { FOLDER, FOLDER_OPEN } from "@/components/pixel/bitmaps";
import { profile, socialLinks } from "@/content/profile";
import { copyEmail } from "@/lib/toast";

const tabs = [
  { href: "/", label: "work" },
  { href: "/fun", label: "fun" },
  { href: "/about", label: "about" },
] as const;

/* Short pixel-font marks for each network, drawn in a little box like a desktop shortcut. */
const marks: Record<string, string> = { GitHub: "gh", LinkedIn: "in", Twitter: "X" };

export function TopNav() {
  const path = usePathname();
  const shortcuts = socialLinks.filter((l) => l.label in marks);

  return (
    <>
      {/* Soft fade so content dissolves under the nav. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />

      <nav aria-label="Primary" className="fixed left-5 top-5 z-50 flex h-[30px] items-center gap-5 sm:left-8 sm:top-7">
        <Link href="/" aria-label="Home" className="text-[var(--accent)] transition-transform hover:-rotate-6 hover:scale-110">
          <PixelIcon bitmap={FOLDER} scale={2} fill="#ffffff" />
        </Link>
        <ul className="flex items-center gap-5 text-[15px]">
          {tabs.map((t) => {
            const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "text-[var(--accent)]" : "text-[var(--strong)] transition-colors hover:text-[var(--accent)]"}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="fixed right-5 top-5 z-50 flex h-[30px] items-center gap-4 sm:right-8 sm:top-7">
        <ul className="flex items-center gap-4" aria-label="Elsewhere">
          <li>
            <button
              type="button"
              onClick={() => copyEmail(profile.email)}
              aria-label="Copy email address"
              className="group flex items-center gap-1 text-[var(--strong)] transition-colors hover:text-[var(--accent)]"
            >
              <span className="pixel flex h-[24px] w-[26px] items-center justify-center border-2 border-current text-[15px] leading-none">@</span>
              <span className="text-[13px] leading-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </button>
          </li>
          {shortcuts.map((l) => (
            <li key={l.label} className="hidden lg:block">
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                aria-label={l.label}
                className="group flex items-center gap-1 text-[var(--strong)] transition-colors hover:text-[var(--accent)]"
              >
                <span className="pixel flex h-[24px] w-[26px] items-center justify-center border-2 border-current text-[15px] leading-none">{marks[l.label]}</span>
                <span className="text-[13px] leading-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.resumeHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Open resume"
          className="group relative text-[var(--strong)] transition-colors hover:text-[var(--accent)]"
        >
          <PixelIcon bitmap={FOLDER_OPEN} scale={2} />
          <span className="mono pointer-events-none absolute right-0 top-full mt-1.5 whitespace-nowrap rounded bg-[var(--strong)] px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
            resume.pdf
          </span>
        </a>
      </div>
    </>
  );
}
