import Link from "next/link";

export function PlaceholderPage({
  title,
  description,
}: Readonly<{ title: string; description: string }>) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          {description}
        </p>
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          In the meantime, head back to{" "}
          <Link
            href="/about"
            className="text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-500 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-400"
          >
            About
          </Link>
          .
        </p>
      </div>
    </main>
  );
}


