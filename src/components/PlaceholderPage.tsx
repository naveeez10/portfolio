import Link from "next/link";

export function PlaceholderPage({
  title,
  description,
}: Readonly<{ title: string; description: string }>) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--nb-text)]">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--nb-muted)]">
          {description}
        </p>
        <div className="mt-8 rounded-2xl border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-5 shadow-[6px_6px_0_0_var(--nb-shadow)]">
          <p className="text-sm font-bold text-[var(--nb-text)]">
            Coming soon.
          </p>
          <p className="mt-2 text-sm text-[var(--nb-muted)]">
            In the meantime, head back to{" "}
            <Link
              href="/about"
              className="font-bold underline decoration-[var(--nb-border)] underline-offset-4"
            >
              About
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}



