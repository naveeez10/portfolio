"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const links = [
  { href: "/#top", label: "Top", id: "top" },
  { href: "/#about", label: "About", id: "about" },
  { href: "/#projects", label: "Projects", id: "projects" },
  { href: "/#achievements", label: "Achievements", id: "achievements" },
] as const;

function useActiveSection(sectionIds: readonly string[]) {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          );

        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
          return;
        }

        if (window.scrollY < 120) setActive("top");
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}

export function SiteNav() {
  const sectionIds = useMemo(() => links.map((l) => l.id), []);
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <nav
        aria-label="Primary"
        className="hidden items-center gap-2 text-sm md:flex"
      >
        {links.map((l) => {
          const isCurrent = active === l.id;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isCurrent ? "page" : undefined}
              className={[
                "relative rounded-lg px-3 py-2 font-extrabold transition-colors",
                "text-[var(--nb-text)]/80 hover:text-[var(--nb-text)] hover:bg-[var(--nb-accent-soft)]",
                "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-[var(--nb-accent)] after:transition-transform after:origin-left",
                isCurrent
                  ? "after:scale-x-100 text-[var(--nb-text)]"
                  : "after:scale-x-0",
              ].join(" ")}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--nb-border)] bg-white px-4 py-2 text-sm font-extrabold text-[var(--nb-text)] shadow-[4px_4px_0_0_var(--nb-shadow)] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0_0_var(--nb-shadow)] md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        Menu <span aria-hidden="true">{open ? "×" : "≡"}</span>
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="absolute right-0 mt-3 w-56 rounded-2xl border-2 border-[var(--nb-border)] bg-white p-2 shadow-[6px_6px_0_0_var(--nb-shadow)] md:hidden"
        >
          <nav aria-label="Primary mobile" className="flex flex-col">
            {links.map((l) => {
              const isCurrent = active === l.id;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-xl px-3 py-2 text-sm font-extrabold transition-colors",
                    isCurrent
                      ? "bg-[var(--nb-accent-soft)] text-[var(--nb-text)]"
                      : "text-[var(--nb-text)] hover:bg-[var(--nb-accent-soft)]",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </div>
  );
}



