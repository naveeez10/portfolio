import Link from "next/link";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--nb-surface)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--nb-surface)]/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center">
          <Link
            href="/#top"
            className="group inline-flex flex-col leading-tight"
          >
            <span className="text-lg font-extrabold tracking-tight text-[var(--nb-text)]">
              Naviz Khoja
            </span>
            <span className="mt-1 text-xs font-semibold tracking-[0.22em] text-[var(--nb-muted)] uppercase">
              Software Engineer
            </span>
          </Link>
        </div>
        <SiteNav />
      </div>
    </header>
  );
}



