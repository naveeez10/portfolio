"use client";

import { ArrowUpRight, CornerDownLeft, FileText, Hash, Mail, Search, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { profile, socialLinks } from "@/content/profile";
import { copyEmail } from "@/lib/toast";

type Item = { id: string; group: string; label: string; icon: ReactNode; hint?: string; run: () => void };

const pages = [
  { href: "/", label: "Work" },
  { href: "/fun", label: "Fun" },
  { href: "/about", label: "About" },
] as const;

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  const items = useMemo<Item[]>(() => {
    return [
      ...pages.map((p) => ({ id: `go-${p.href}`, group: "Go to", label: p.label, icon: <Hash className="h-4 w-4" />, run: () => router.push(p.href) })),
      { id: "email", group: "Actions", label: "Copy email address", hint: profile.email, icon: <Mail className="h-4 w-4" />, run: () => copyEmail(profile.email) },
      { id: "resume", group: "Actions", label: "Open resume", icon: <FileText className="h-4 w-4" />, run: () => window.open(profile.resumeHref, "_blank", "noopener") },
      {
        id: "shell",
        group: "Actions",
        label: "Open the shell",
        icon: <Terminal className="h-4 w-4" />,
        run: () => {
          router.push("/fun#shell");
          window.setTimeout(() => window.dispatchEvent(new Event("naviz:focus-shell")), 700);
        },
      },
      ...socialLinks.map((l) => ({
        id: `link-${l.label}`,
        group: "Elsewhere",
        label: l.label,
        icon: <ArrowUpRight className="h-4 w-4" />,
        run: () => window.open(l.href, "_blank", "noopener"),
      })),
    ];
  }, [router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.group} ${i.label} ${i.hint ?? ""}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("naviz:open-command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("naviz:open-command", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  if (!open) return null;

  const run = (item: Item | undefined) => {
    if (!item) return;
    close();
    item.run();
  };

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[14vh]" role="dialog" aria-modal="true" aria-label="Command menu">
      <button type="button" aria-label="Close command menu" className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={close} />
      <div className="rise relative w-full max-w-[520px] overflow-hidden rounded-xl border border-[var(--line-2)] bg-[var(--panel)] shadow-[var(--shadow)]">
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-3.5">
          <Search className="h-4 w-4 text-[var(--faint)]" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                run(filtered[index]);
              }
            }}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            className="h-12 w-full bg-transparent text-[15px] text-[var(--strong)] outline-none placeholder:text-[var(--faint)]"
          />
          <kbd className="mono rounded border border-[var(--line-2)] px-1.5 text-[10px] text-[var(--faint)]">esc</kbd>
        </div>
        <ul ref={listRef} className="max-h-[50vh] overflow-y-auto p-1.5" role="listbox">
          {filtered.length === 0 ? <li className="px-3 py-6 text-center text-sm text-[var(--faint)]">Nothing matches “{query}”.</li> : null}
          {filtered.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            const selected = i === index;
            return (
              <li key={item.id} role="presentation">
                {header ? <p className="label px-2.5 pb-1 pt-2.5 text-[10px]">{header}</p> : null}
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  data-index={i}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => run(item)}
                  className={[
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                    selected ? "bg-[var(--panel-2)] text-[var(--strong)]" : "text-[var(--text)]",
                  ].join(" ")}
                >
                  <span className={selected ? "text-[var(--accent)]" : "text-[var(--faint)]"} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.hint ? <span className="mono hidden text-[var(--faint)] sm:inline">{item.hint}</span> : null}
                  {selected ? <CornerDownLeft className="h-3.5 w-3.5 text-[var(--faint)]" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
