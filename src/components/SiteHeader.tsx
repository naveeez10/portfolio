import Link from "next/link";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-3">
          <Link
            href="/about"
            className="text-sm font-extrabold tracking-tight text-[var(--nb-text)]"
          >
            Naviz Khoja
          </Link>
          <span className="hidden rounded-full border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-2 py-0.5 text-[11px] font-bold text-[var(--nb-text)] sm:inline">
            Software Engineer
          </span>
        </div>
        <SiteNav />
      </div>
    </header>
  );
}



