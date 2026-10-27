"use client";

import { useEffect, useState } from "react";

const EVENT = "naviz:toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: message }));
}

export async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email);
    toast("Email copied to clipboard");
  } catch {
    window.location.href = `mailto:${email}`;
  }
}

export function useToast() {
  const [msg, setMsg] = useState<{ text: string; id: number } | null>(null);
  useEffect(() => {
    let t: number | undefined;
    const on = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setMsg({ text, id: Date.now() });
      window.clearTimeout(t);
      t = window.setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener(EVENT, on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.clearTimeout(t);
    };
  }, []);
  return msg;
}
