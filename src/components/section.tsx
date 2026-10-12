import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn("font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.04] tracking-[-0.035em] text-balance", className)}
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
