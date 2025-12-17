import Link from "next/link";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur dark:border-zinc-800/60 dark:bg-black/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-3">
          <Link
            href="/about"
            className="text-sm font-medium tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            Naviz Khoja
          </Link>
          <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:inline">
            Software Engineer
          </span>
        </div>
        <SiteNav />
      </div>
    </header>
  );
}


