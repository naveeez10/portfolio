"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { roles } from "@/content/experience";
import { achievements, education, profile, socialLinks } from "@/content/profile";
import { copyEmail } from "@/lib/toast";

type Line = { id: number; kind: "in" | "out" | "err"; body: ReactNode };

const FILES = ["about.txt", "work.log", "wins.md", "skills.json", "contact.txt", "resume.pdf"] as const;

const SKILLS = {
  languages: ["Dart", "Kotlin", "Swift", "TypeScript", "Go", "Python", "C++"],
  mobile: ["Flutter", "Firebase", "RevenueCat", "auto_route"],
  backend: ["NestJS", "Bun", "GCP", "Kubernetes", "kubebuilder", "NATS", "Docker", "MongoDB", "MySQL"],
  ml: ["LLM inference", "model evaluation", "RAG", "Python"],
};

const COMMANDS = ["help", "whoami", "ls", "cat", "work", "wins", "skills", "contact", "email", "resume", "codeforces", "date", "echo", "history", "clear", "sudo"] as const;

const Muted = ({ children }: { children: ReactNode }) => <span className="text-[var(--faint)]">{children}</span>;
const Hi = ({ children }: { children: ReactNode }) => <span className="text-[var(--accent)]">{children}</span>;

const welcome: ReactNode = (
  <>
    naviz-sh 1.0 — type <Hi>help</Hi> to see what this can do. <Muted>Tab completes, ↑ recalls.</Muted>
  </>
);

export function Shell() {
  const [lines, setLines] = useState<Line[]>([{ id: 0, kind: "out", body: welcome }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [busy, setBusy] = useState(false);
  const idRef = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focus = () => inputRef.current?.focus({ preventScroll: true });
    window.addEventListener("naviz:focus-shell", focus);
    return () => window.removeEventListener("naviz:focus-shell", focus);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = (kind: Line["kind"], body: ReactNode) =>
    setLines((ls) => [...ls, { id: idRef.current++, kind, body }]);

  const cat = (file: string): void | Promise<void> => {
    switch (file) {
      case "about.txt":
        return print("out", <>Naviz Khoja. Software engineer at Adora since 2023, building Oen (oen-app.com) in my free time. Built on repeats.</>);
      case "work.log":
        return run("work");
      case "wins.md":
        return run("wins");
      case "skills.json":
        return print("out", <pre className="whitespace-pre-wrap">{JSON.stringify(SKILLS, null, 2)}</pre>);
      case "contact.txt":
        return run("contact");
      case "resume.pdf":
        return print("err", <>cat: resume.pdf: binary file. Try <Hi>resume</Hi>.</>);
      default:
        return print("err", <>cat: {file || "(nothing)"}: no such file. Try <Hi>ls</Hi>.</>);
    }
  };

  async function run(raw: string): Promise<void> {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    switch (cmd.toLowerCase()) {
      case "":
        return;
      case "help":
        return print(
          "out",
          <div className="grid grid-cols-[110px_1fr] gap-x-3">
            {[
              ["whoami", "the short version"],
              ["ls / cat", "browse files"],
              ["work", "roles, newest first"],
              ["wins", "hackathons and contests"],
              ["skills", "what I work with"],
              ["codeforces", "live rating from the API"],
              ["contact", "ways to reach me"],
              ["email", "copy my email"],
              ["resume", "open the PDF"],
              ["clear", "wipe the screen"],
            ].map(([c, d]) => (
              <div key={c} className="contents">
                <Hi>{c}</Hi>
                <Muted>{d}</Muted>
              </div>
            ))}
          </div>
        );
      case "whoami":
        return print("out", <>naviz — software engineer at Adora, building Oen on the side. Specialist on Codeforces.</>);
      case "ls":
        return print("out", <div className="flex flex-wrap gap-x-5">{FILES.map((f) => <span key={f} className={f.endsWith(".pdf") ? "text-[var(--live)]" : "text-[var(--strong)]"}>{f}</span>)}</div>);
      case "cat":
        return cat(args[0] ?? "");
      case "work":
      case "experience":
        return print(
          "out",
          <div className="grid grid-cols-[1fr_auto] gap-x-4">
            {roles.map((r) => (
              <div key={r.key} className="contents">
                <span>
                  <span className="text-[var(--strong)]">{r.title}</span> <Muted>@ {r.company}</Muted>
                </span>
                <Muted>{r.dates}</Muted>
              </div>
            ))}
            <span>
              <span className="text-[var(--strong)]">{education.degree}</span> <Muted>@ {education.school}</Muted>
            </span>
            <Muted>{education.dates}</Muted>
          </div>
        );
      case "wins":
        return print(
          "out",
          <div>
            {achievements.map((a) => (
              <div key={a.title}>
                <span className="text-[var(--live)]">✓</span> <span className="text-[var(--strong)]">{a.title}</span> <Hi>{a.result}</Hi> <Muted>{a.year}</Muted>
              </div>
            ))}
          </div>
        );
      case "skills":
        return print(
          "out",
          <div>
            {Object.entries(SKILLS).map(([k, v]) => (
              <div key={k}>
                <Hi>{k.padEnd(10, " ")}</Hi> {v.join(", ")}
              </div>
            ))}
          </div>
        );
      case "contact":
        return print(
          "out",
          <div>
            <div>
              <Muted>email </Muted>
              <span className="text-[var(--strong)]">{profile.email}</span>
            </div>
            {socialLinks.map((l) => (
              <div key={l.label}>
                <Muted>{l.label.toLowerCase().padEnd(11, " ")}</Muted>
                <a href={l.href} target="_blank" rel="noreferrer" className="underline decoration-[var(--line-2)] underline-offset-4 hover:text-[var(--accent)]">
                  {l.href.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </div>
            ))}
          </div>
        );
      case "email":
        await copyEmail(profile.email);
        return print("out", <>copied {profile.email}</>);
      case "resume":
        window.open(profile.resumeHref, "_blank", "noopener");
        return print("out", <>opening resume.pdf …</>);
      case "codeforces":
      case "cf": {
        setBusy(true);
        print("out", <Muted>GET codeforces.com/api/user.info?handles={profile.codeforces} …</Muted>);
        try {
          const res = await fetch(`https://codeforces.com/api/user.info?handles=${profile.codeforces}`);
          const json = await res.json();
          const u = json.result?.[0];
          if (!u) throw new Error("no result");
          print(
            "out",
            <>
              <span className="text-[var(--strong)]">{u.handle}</span> · {u.rank} · rating <Hi>{u.rating}</Hi> <Muted>(max {u.maxRating})</Muted>
            </>
          );
        } catch {
          print("err", <>couldn&apos;t reach Codeforces right now. Last known: specialist, 1435.</>);
        } finally {
          setBusy(false);
        }
        return;
      }
      case "date":
        return print("out", new Date().toString());
      case "echo":
        return print("out", args.join(" "));
      case "history":
        return print("out", <div>{history.map((h, i) => <div key={i}><Muted>{String(i + 1).padStart(3, " ")}</Muted> {h}</div>)}</div>);
      case "clear":
        return setLines([]);
      case "sudo":
        return print("err", <>nice try. this incident will be reported.</>);
      case "rm":
        return print("err", <>rm: refusing to delete anything. it took three years to build.</>);
      case "exit":
        return print("out", <>there is no exit. only more repeats.</>);
      default:
        return print("err", <>{cmd}: command not found. Try <Hi>help</Hi>.</>);
    }
  }

  const submit = async () => {
    const value = input;
    print("in", value);
    setInput("");
    setCursor(-1);
    if (value.trim()) setHistory((h) => [...h, value]);
    await run(value);
  };

  const complete = () => {
    const parts = input.split(" ");
    if (parts.length === 1) {
      const hits = COMMANDS.filter((c) => c.startsWith(parts[0]));
      if (hits.length === 1) setInput(`${hits[0]} `);
      else if (hits.length > 1) print("out", <Muted>{hits.join("  ")}</Muted>);
    } else if (parts[0] === "cat") {
      const hits = FILES.filter((f) => f.startsWith(parts[1] ?? ""));
      if (hits.length === 1) setInput(`cat ${hits[0]}`);
      else if (hits.length > 1) print("out", <Muted>{hits.join("  ")}</Muted>);
    }
  };

  const suggestions = ["help", "whoami", "work", "codeforces", "cat skills.json"];

  return (
    <div className="ink">
      <div
        className="overflow-hidden rounded-[22px] border border-[var(--line-2)] bg-[var(--panel)] shadow-[var(--shadow)]"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="mono ml-2 text-[11px] text-[var(--faint)]">naviz@portfolio: ~</span>
        </div>

        <div ref={scrollRef} className="mono h-[300px] overflow-y-auto px-4 py-3 text-[12.5px] leading-[1.7]" role="log" aria-live="polite">
          {lines.map((l) => (
            <div key={l.id} className={l.kind === "err" ? "text-[#f87171]" : l.kind === "in" ? "text-[var(--strong)]" : "text-[var(--text)]"}>
              {l.kind === "in" ? (
                <>
                  <span className="text-[var(--live)]">➜</span> <span className="text-[var(--accent)]">~</span> {l.body}
                </>
              ) : (
                l.body
              )}
            </div>
          ))}
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!busy) void submit();
            }}
          >
            <span className="text-[var(--live)]" aria-hidden="true">➜</span>
            <span className="text-[var(--accent)]" aria-hidden="true">~</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  complete();
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (!history.length) return;
                  const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
                  setCursor(next);
                  setInput(history[next]);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (cursor < 0) return;
                  const next = cursor + 1;
                  if (next >= history.length) {
                    setCursor(-1);
                    setInput("");
                  } else {
                    setCursor(next);
                    setInput(history[next]);
                  }
                } else if (e.key === "l" && e.ctrlKey) {
                  e.preventDefault();
                  setLines([]);
                }
              }}
              aria-label="Terminal input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-[var(--strong)] caret-[var(--accent)] outline-none"
            />
          </form>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-[var(--line)] px-3 py-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                print("in", s);
                setHistory((h) => [...h, s]);
                void run(s);
              }}
              className="mono rounded border border-[var(--line-2)] px-1.5 py-0.5 text-[11px] text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
