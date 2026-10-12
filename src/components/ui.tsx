import type { ReactNode } from "react";
import { ArrowRight } from "@/components/icons";

/** Small rounded label above a section heading. */
export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      data-reveal
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-paper py-1 pr-3 pl-1 text-xs text-ink-soft shadow-[0_1px_2px_rgb(13_13_18/0.04)] ${className}`}
    >
      <span className="grid size-5 place-items-center rounded-full bg-ink">
        <span className="size-1.5 rounded-full bg-peri" />
      </span>
      {children}
    </span>
  );
}

/** The grey word in a two-tone heading. */
export function Mute({ children }: { children: ReactNode }) {
  return <span className="text-mute">{children}</span>;
}

export function SectionHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      data-split
      className={`font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.035em] text-balance ${className}`}
    >
      {children}
    </h2>
  );
}

/** Numbered step marker for the real process sequence (connect, sort, project, report). */
export function StepNumber({ n }: { n: string }) {
  return (
    <span className="grid size-12 place-items-center rounded-full bg-ink font-mono text-sm text-paper shadow-[0_0_0_4px_var(--color-paper),0_0_0_5px_var(--color-line)]">
      {n}
    </span>
  );
}

type ButtonProps = { href: string; children: ReactNode; variant?: "dark" | "light" | "glass"; arrow?: boolean };

const variants = {
  dark: "bg-ink text-paper hover:bg-ink-soft",
  light: "bg-paper text-ink border border-line hover:bg-cloud",
  glass: "bg-white/12 text-white border border-white/25 backdrop-blur-md hover:bg-white/20",
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
