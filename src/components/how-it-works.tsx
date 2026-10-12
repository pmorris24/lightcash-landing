import type { ReactNode } from "react";
import { ArrowLeft, Calendar, Check, ChevronDown, Diamond, List } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { Mute, Pill, SectionHeading, StepNumber } from "@/components/ui";
import { wrap } from "@/lib/site";

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <StepNumber n={n} />
      <h3 className="mt-8 text-[1.6rem] leading-tight tracking-[-0.02em] text-balance">{title}</h3>
      <p className="mt-4 max-w-sm leading-relaxed text-mute">{children}</p>
    </div>
  );
}

function Snippet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`dashed min-w-0 rounded-3xl bg-cloud/60 p-4 sm:p-5 ${className}`}>{children}</div>;
}

function StatusChip({ children, tone = "good" }: { children: ReactNode; tone?: "good" | "warn" | "plain" }) {
  const tones = {
    good: "bg-good-soft text-good",
    warn: "bg-warn-soft text-warn",
    plain: "bg-cloud text-ink-soft border border-line",
  };
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {tone === "good" && <Check className="size-3" />}
      {children}
    </span>
  );
}

function AgentAvatar() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-paper">
      <LogoMark className="size-3.5" />
    </span>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <div className="flex flex-col items-center text-center">
        <Pill>How it works</Pill>
        <SectionHeading className="mt-5 max-w-3xl">
          From <Mute>Transactions</Mute> To Decisions, Automatically
        </SectionHeading>
        <p className="mt-5 max-w-xl leading-relaxed text-mute">
          Lightcash pulls in every transaction, sorts it and keeps your numbers current. You always know where you
          stand, without manual bookkeeping.
        </p>
      </div>

      <div className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's cash */}
        <Snippet>
          <ArrowLeft className="size-4 text-ink-soft" />
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" /> Oct 12, 2026 <ChevronDown className="size-3.5" />
            </span>
            <span>All accounts</span>
          </div>
          <p className="mt-2 text-lg">Today’s Cash</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-good-soft px-2.5 py-0.5 text-xs font-medium text-good">
            <span className="size-2 rounded-full bg-good" /> Syncing live
          </span>
          <div className="mt-3 rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">Chase Business ··4821</p>
                <p className="text-sm text-mute">Checking</p>
              </div>
              <StatusChip>Synced</StatusChip>
            </div>
            <p className="mt-4 flex items-baseline justify-between gap-3 text-sm text-mute">
              Updated 2 min ago
              <span className="text-lg font-medium text-ink tabular-nums">$48,210.55</span>
            </p>
          </div>
          <div className="flex items-start justify-between gap-3 px-4 pt-4">
            <div className="min-w-0">
              <p className="font-medium">Stripe balance</p>
              <p className="text-sm text-mute tabular-nums">$6,940.20 · payout Oct 14</p>
            </div>
            <StatusChip tone="plain">Scheduled</StatusChip>
          </div>
        </Snippet>

        <div className="flex flex-col">
          <Step n="01" title="Connects To Your Accounts In Minutes">
            Link your bank, cards, Stripe and payroll once. Lightcash keeps every balance and transaction in sync from
            then on.
          </Step>
          <div className="mt-8 flex items-center gap-3 lg:mt-auto">
            <span className="grid size-8 place-items-center rounded-full bg-good text-paper">
              <Check className="size-4" />
            </span>
            <span className="leading-tight">
              <span className="block font-medium">Connected</span>
              <span className="block text-sm text-mute">4 accounts syncing</span>
            </span>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {["Chase", "Stripe", "Gusto", "QuickBooks"].map((name) => (
              <li key={name} className="rounded-full border border-line bg-paper px-3 py-1.5 shadow-sm">
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <Step n="02" title="Sorts Every Transaction For You">
            The Lightcash agent categorizes spending, matches invoices to payments and flags anything it is not sure
            about.
          </Step>
          <Snippet className="mt-8 lg:mt-auto">
            <div className="flex items-center gap-2">
              <AgentAvatar />
              <span className="font-medium">Lightcash agent</span>
              <ChevronDown className="size-3.5 text-mute" />
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-0.5 text-xs text-paper">
                <Check className="size-3" /> Categorized
              </span>
            </div>
            <p className="mt-4 flex items-baseline justify-between gap-3 text-[0.95rem]">
              <span className="underline decoration-mute/60 underline-offset-4">AWS · $1,240 → Software &amp; hosting</span>
              <span className="shrink-0 font-mono text-sm text-peri-deep">just now</span>
            </p>
          </Snippet>
        </div>

        {/* Weekly summary */}
        <Snippet>
          <ArrowLeft className="size-4 text-ink-soft" />
          <p className="mt-4 text-lg">Weekly Summary</p>
          <p className="mt-4 flex items-center gap-2.5 font-medium">
            <Diamond className="size-4" /> Week of Oct 6 to Oct 12
          </p>
          <ul className="mt-3 grid list-disc gap-2 pl-12 text-[0.95rem] text-ink-soft marker:text-mute">
            <li>Revenue is up 8% on last week</li>
            <li>Software costs are $2,310, with 3 renewals next week</li>
            <li>Payroll on Oct 15 is covered, with a $21k buffer</li>
          </ul>
        </Snippet>

        {/* Needs review */}
        <Snippet>
          <ArrowLeft className="size-4 text-ink-soft" />
          <p className="mt-4 flex items-center gap-2 text-lg">
            Needs Your Review <span className="text-mute">(2)</span>
          </p>
          <div className="mt-4 grid gap-3">
            {[
              { who: "Lightcash agent", what: "Approve 3 uncategorized expenses" },
              { who: "Tax set-aside", what: "Move $4,800 to tax savings" },
            ].map((item) => (
              <div key={item.what} className="rounded-2xl border border-line bg-paper p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <AgentAvatar />
                    <span className="truncate font-medium">{item.who}</span>
                  </span>
                  <StatusChip tone="warn">Suggested</StatusChip>
                </div>
                <p className="mt-2 flex items-center gap-2 pl-1 text-sm text-ink-soft">
                  <List className="size-3.5 text-mute" /> {item.what}
                </p>
              </div>
            ))}
          </div>
        </Snippet>

        <Step n="03" title="Projects Where You’ll Be Next Month">
          Projections use your real income, bills and payroll dates, so you see a cash dip weeks before it happens.
        </Step>
      </div>
    </section>
  );
}
