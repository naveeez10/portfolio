"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { FOLDER, FOLDER_OPEN } from "@/components/pixel/bitmaps";
import { projects, type Project } from "@/content/profile";
import { ProjectVisual } from "./visuals";

function Sheet({ project, onClose }: Readonly<{ project: Project; onClose: () => void }>) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#111214]/40 backdrop-blur-[3px]" />
      <div className="rise relative max-h-[88svh] w-full max-w-[600px] overflow-y-auto rounded-t-[26px] bg-[var(--bg)] p-5 shadow-2xl sm:rounded-[26px] sm:p-6" style={{ animationDuration: "500ms" }}>
        <div className={`media w-full ${project.visual === "photo" ? "aspect-[16/10]" : project.visual === "adora" ? "aspect-[16/10]" : "aspect-[0.78] sm:aspect-[1.04]"}`}>
          <ProjectVisual project={project} />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5 text-[var(--accent)]">
            <PixelIcon bitmap={FOLDER_OPEN} scale={1.5} />
            <h2 id="sheet-title" className="text-[18px] text-[var(--strong)]">{project.title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close details" className="rounded-full p-1 text-[var(--text)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--strong)]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="label mt-1 pl-[38px]">{project.where}</p>
        <ul className="mt-4 space-y-2">
          {project.points.map((p) => (
            <li key={p} className="flex gap-3 text-[15.5px] leading-[1.5]">
              <span className="text-[var(--faint)]">·</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        {project.stack ? (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li key={s} className="pill">{s}</li>
            ))}
          </ul>
        ) : null}
        {project.links ? (
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} className="link text-[15.5px]" {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                {l.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function WorkList() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section aria-labelledby="work-heading" className="mx-auto w-full max-w-[960px] px-5 pb-24 pt-16 sm:pt-20">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 id="work-heading" className="label">selected work</h2>
        <p className="mono hidden text-[12px] text-[var(--faint)] sm:block">⌘K to jump around</p>
      </div>
      <ul className="grid grid-cols-1 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:gap-x-7">
        {projects.map((p, n) => (
          <li key={p.slug} data-fx="in" style={{ "--d": n % 2 } as React.CSSProperties} className="card group">
            <div
              data-fx="spot tilt"
              className={`media w-full cursor-pointer bg-[var(--panel-2)] ${p.visual === "photo" ? "aspect-[1.04]" : p.visual === "adora" ? "aspect-[1.04]" : "aspect-[0.78] sm:aspect-[1.04]"}`}
              onClick={() => setOpen(p)}
              role="presentation"
            >
              <ProjectVisual project={p} />
            </div>
            <button
              type="button"
              onClick={() => setOpen(p)}
              className="mt-4 flex items-center gap-2.5 text-left text-[var(--strong)] transition-colors hover:text-[var(--accent)]"
            >
              <span className="text-[var(--accent)] transition-transform group-hover:-rotate-6">
                <PixelIcon bitmap={FOLDER} scale={1.5} />
              </span>
              <span className="text-[16.5px]">{p.title}</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
            <p className="mt-2 max-w-[500px] pl-[37px] text-[15px] leading-[1.4]">{p.blurb}</p>
          </li>
        ))}
      </ul>
      {open ? <Sheet project={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}
