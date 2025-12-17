"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/ramblings", label: "Ramblings" },
  { href: "/games", label: "Games" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={[
              "transition-colors",
              active
                ? "text-zinc-950 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
            ].join(" ")}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}


