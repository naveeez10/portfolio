"use client";

import { useToast } from "@/lib/toast";

export function Toaster() {
  const msg = useToast();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center">
      {msg ? (
        <div
          key={msg.id}
          className="rise mono rounded-md border border-[var(--line-2)] bg-[var(--panel)] px-3 py-2 text-[var(--strong)] shadow-[var(--shadow)]"
        >
          <span className="mr-2 text-[var(--live)]">✓</span>
          {msg.text}
        </div>
      ) : null}
    </div>
  );
}
