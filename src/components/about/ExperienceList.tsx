"use client";

import { useState } from "react";
import { roles } from "@/content/experience";

export function ExperienceList() {
  const [open, setOpen] = useState<string | null>(roles[0].key);
  return (
    <ul className="rows border-t border-[var(--line)]">
      {roles.map((r) => {
        const isOpen = open === r.key;
        return (
          <li key={r.key} className="row border-b border-[var(--line)]">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : r.key)}
              className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-4 py-3 text-left"
            >
              <span>
                <span className="text-[var(--strong)] transition-colors group-hover:text-[var(--accent)]">{r.title}</span>
                <span className="ml-2">{r.company}</span>
                {r.current ? <span className="ml-2 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-[var(--accent)]" aria-label="current" /> : null}
              </span>
              <span className="mono text-[11px] text-[var(--faint)]">{r.dates}</span>
            </button>
            <div className="reveal" data-open={isOpen}>
              <div>
                <div className="pb-4">
                  <ul className="space-y-1.5">
                    {r.bullets.map((b) => (
                      <li key={b.id} className="flex gap-2.5">
                        <span className="text-[var(--faint)]">·</span>
                        <span>{b.content}</span>
                      </li>
                    ))}
                  </ul>
                  {r.stack ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {r.stack.map((t) => (
                        <li key={t} className="mono rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[11px] text-[var(--text)]">
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
