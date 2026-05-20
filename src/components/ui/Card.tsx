import type { ElementType, ComponentProps, ReactNode } from "react";

type CardTone = "surface" | "accent";

type CardOwnProps = {
  tone?: CardTone;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

type CardProps<T extends ElementType> = CardOwnProps & {
  as?: T;
} & Omit<ComponentProps<T>, keyof CardOwnProps | "as">;

const base =
  "rounded-2xl border-2 border-[var(--nb-border)] shadow-[6px_6px_0_0_var(--nb-shadow)] transition";

const toneClass: Record<CardTone, string> = {
  surface: "bg-[var(--nb-surface)] text-[var(--nb-text)]",
  accent: "bg-[var(--nb-accent)] text-white",
};

const interactiveClass: Record<CardTone, string> = {
  surface:
    "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-[var(--nb-accent-soft)] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]",
  accent:
    "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:brightness-[1.03] hover:shadow-[7px_7px_0_0_var(--nb-shadow)]",
};

export function Card<T extends ElementType = "div">({
  as,
  tone = "surface",
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={[
        base,
        toneClass[tone],
        interactive ? `group ${interactiveClass[tone]}` : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
