import type { ReactNode } from "react";
import { ArrowRight } from "@/components/icons";

export function SectionHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.04] tracking-[-0.035em] text-balance ${className}`}
    >
      {children}
    </h2>
  );
}

/** Numbered step marker for the real process sequence (connect, see, look ahead). */
export function StepNumber({ n }: { n: string }) {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm text-paper shadow-[0_0_0_4px_var(--color-paper),0_0_0_5px_var(--color-line)]">
      {n}
    </span>
  );
}

type ButtonProps = { href: string; children: ReactNode; variant?: "dark" | "light"; arrow?: boolean };

const variants = {
  dark: "bg-ink text-paper hover:bg-ink-soft",
  light: "bg-paper text-ink border border-line hover:bg-cloud",
};

export function ButtonLink({ href, children, variant = "dark", arrow = false }: ButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[0.95rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peri-deep ${variants[variant]}`}
    >
      {children}
      {arrow && <ArrowRight className="size-4" />}
    </a>
  );
}
