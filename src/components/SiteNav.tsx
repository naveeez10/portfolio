"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#ramblings", label: "Ramblings" },
  { href: "/#achievements", label: "Achievements" },
] as const;

function isActive(pathname: string, href: string) {
  const base = href.split("#")[0] || "/";
  return pathname === base || pathname.startsWith(`${base}/`);
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
              "rounded-md border-2 px-2.5 py-1 font-extrabold transition-transform",
              "border-white bg-[var(--nb-accent)] text-white",
              "shadow-[3px_3px_0_0_#fff] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_#fff]",
              active ? "opacity-100" : "opacity-90 hover:opacity-100",
            ].join(" ")}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}



