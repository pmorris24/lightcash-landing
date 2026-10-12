"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CashChart } from "@/components/cash-chart";
import { Check } from "@/components/icons";
import { SectionHeading, Soft, StepNumber } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cents, incoming, transactions, type Txn } from "@/lib/demo";
import { cn } from "@/lib/utils";
import { wrap } from "@/lib/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Example data for the step visuals.
const accounts = [
  { name: "Chase Business", detail: "Bank ··4821" },
  { name: "Amex Business Gold", detail: "Card ··1003" },
  { name: "Stripe", detail: "Payments", connectable: true },
];

type Connection = "idle" | "connecting" | "connected";

/** 4×3 dot grid that pulses left to right, like a scanner. */
function DotLoader() {
  return (
    <span className="grid shrink-0 grid-cols-4 gap-0.5" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="size-1 rounded-[1px] bg-peri-deep animate-dot"
          style={{ animationDelay: `${(i % 4) * 0.18 + Math.floor(i / 4) * 0.06}s` }}
        />
      ))}
    </span>
  );
}

/** Step 1: Stripe is one click away; connecting it runs through the real states. */
function ConnectAccounts() {
  const [stripe, setStripe] = useState<Connection>("idle");
  useEffect(() => {
    if (stripe !== "connecting") return;
    const timer = setTimeout(() => setStripe("connected"), 1800);
    return () => clearTimeout(timer);
  }, [stripe]);

  return (
    <ul className="grid gap-2.5">
      {accounts.map((a) => {
        const state: Connection = a.connectable ? stripe : "connected";
        return (
          <li key={a.name} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate font-medium">{a.name}</span>
              <span className="block text-sm text-mute">{a.detail}</span>
            </span>
            <span aria-live="polite">
              {state === "connected" && (
                <Badge variant="success" className={cn("h-6 px-2.5", a.connectable && "animate-in zoom-in-90 duration-300")}>
                  <Check /> Connected
                </Badge>
              )}
              {state === "connecting" && (
                <Badge variant="outline" className="h-6 gap-2 px-2.5 text-ink-soft">
                  <DotLoader /> Connecting
                </Badge>
              )}
              {state === "idle" && (
                <button
                  type="button"
                  onClick={() => setStripe("connecting")}
                  className="relative h-7 rounded-full bg-ink px-3 text-xs font-medium text-paper transition-colors hover:bg-ink/80"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-peri-deep/30 motion-reduce:hidden" aria-hidden="true" />
                  <span className="relative">Connect</span>
                </button>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Bump "Just now" and "n min ago" by a minute when something newer arrives. */
const older = (when: string) => {
  if (when === "Just now") return "1 min ago";
  const m = when.match(/^(\d+) min ago$/);
  return m ? `${Number(m[1]) + 1} min ago` : when;
};

/** Step 2: while it is on screen, a new transaction lands every few seconds. The Live badge pauses it. */
function LiveFeed() {
  const [rows, setRows] = useState<Txn[]>(() => transactions.slice(0, 4));
  // Starts paused for reduced motion; after that the Live button decides.
  const reduced = useReducedMotion();
  const [choice, setPaused] = useState<boolean | null>(null);
  const paused = choice ?? reduced;
  const [visible, setVisible] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const next = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    if (list.current) observer.observe(list.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    const timer = setInterval(() => {
      const t = incoming[next.current++ % incoming.length];
      setRows((now) => [{ ...t, id: `live-${next.current}`, when: "Just now" }, ...now.map((r) => ({ ...r, when: older(r.when) }))].slice(0, 4));
    }, 4200);
    return () => clearInterval(timer);
  }, [paused, visible]);

  return (
    <>
      <div className="flex items-center justify-between px-1 text-sm">
        <span className="font-medium">Transactions</span>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-pressed={!paused}
          aria-label={paused ? "Resume live transactions" : "Pause live transactions"}
          className={cn(
            "flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors",
            paused ? "bg-cloud text-mute hover:text-ink" : "bg-good-soft text-good hover:bg-good-soft/70",
          )}
        >
          <span className={cn("size-1.5 rounded-full", paused ? "bg-mute" : "animate-pulse bg-good")} />
          {paused ? "Paused" : "Live"}
        </button>
      </div>
      <ul ref={list} className="mt-3 overflow-hidden rounded-2xl border border-line bg-paper">
        {rows.map((t, i) => (
          <li
            key={t.id}
            data-feed={t.id === "t1" || undefined}
            className={cn("flex items-center gap-3 px-4 py-2.5", i && "border-t border-line", t.id.startsWith("live") && i === 0 && "animate-flash")}
          >
            <span className={cn("flex min-w-0 flex-1 items-center gap-3", t.id.startsWith("live") && i === 0 && "animate-in duration-500 fade-in slide-in-from-left-3")}>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[0.92rem] font-medium">{t.what}</span>
                <span className="block truncate text-xs text-mute">{t.category}</span>
              </span>
              <span className="text-right leading-tight">
                <span className={cn("block text-[0.92rem] tabular-nums", t.amount > 0 && "text-good")}>{cents(t.amount)}</span>
                <span className="block text-xs text-mute">{t.when}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Step 3: the projection, with the December what-if one switch away. */
function LookAhead() {
  const [hire, setHire] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-1 text-sm">
        <span className="font-medium">Cash projection</span>
        <label className="flex cursor-pointer items-center gap-2 text-mute">
          Hire in Dec
          <Switch size="sm" checked={hire} onCheckedChange={setHire} />
        </label>
      </div>
      <div className="mt-3 rounded-2xl border border-line bg-paper p-2">
        <CashChart compact draw scenario={hire ? "hire" : "base"} />
      </div>
      <p className="mt-2 px-1 text-xs text-mute">Point at the chart to read any month.</p>
    </>
  );
}

function Visual({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="group" aria-label={label} className="dashed flex h-76 flex-col justify-center overflow-hidden rounded-3xl bg-cloud/60 p-4 sm:p-5">
      {children}
    </div>
  );
}

function Step({ n, title, visual, children }: { n: string; title: string; visual: ReactNode; children: ReactNode }) {
  return (
    <li data-reveal className="flex min-w-0 flex-col">
      {visual}
      <div className="mt-8 flex items-start gap-5">
        <StepNumber n={n} />
        <div className="min-w-0 pt-1">
          <h3 className="text-[1.45rem] leading-tight tracking-[-0.02em]">{title}</h3>
          <p className="mt-2.5 leading-relaxed text-pretty text-mute">{children}</p>
        </div>
      </div>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <SectionHeading className="max-w-3xl">Connected in minutes. <Soft>Live from then on.</Soft></SectionHeading>

      <ol className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        <Step
          n="1"
          title="Connect your accounts"
          visual={
            <Visual label="A business bank account and a card connected, and Stripe ready to connect.">
              <ConnectAccounts />
            </Visual>
          }
        >
          Link your bank, cards and payment tools in a few clicks.
        </Step>

        <Step
          n="2"
          title="See everything, live"
          visual={
            <Visual label="Transactions arriving as they happen, each one already categorized.">
              <LiveFeed />
            </Visual>
          }
        >
          Every transaction lands as it happens, organized and categorized automatically.
        </Step>

        <Step
          n="3"
          title="Look ahead"
          visual={
            <Visual label="A cash projection for the next three months, with a likely range.">
              <LookAhead />
            </Visual>
          }
        >
          Projections built from your real patterns show where your cash will be next month and next quarter.
        </Step>
      </ol>
    </section>
  );
}
