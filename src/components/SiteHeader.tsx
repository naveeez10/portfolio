import Link from "next/link";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--nb-surface)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--nb-surface)]/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10 sm:py-6">
        <div className="flex items-center">
          <Link
            href="/#top"
            className="group inline-flex flex-col leading-tight"
          >
            <span className="text-2xl font-extrabold tracking-tight text-[var(--nb-text)] sm:text-[28px]">
              Naviz Khoja
            </span>
            <span className="mt-1.5 text-[13px] font-semibold tracking-[0.22em] text-[var(--nb-muted)] uppercase">
              Software Engineer
            </span>
          </Link>
        </div>
        <SiteNav />
      </div>
    </header>
  );
}



