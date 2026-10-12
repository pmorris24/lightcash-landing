import type { ReactNode } from "react";
import { CashChart } from "@/components/cash-chart";
import { Check } from "@/components/icons";
import { SectionHeading, StepNumber } from "@/components/ui";
import { wrap } from "@/lib/site";

// Example data for the step visuals.
const accounts = [
  { name: "Chase Business", detail: "Bank ··4821", connected: true },
  { name: "Amex Business Gold", detail: "Card ··1003", connected: true },
  { name: "Stripe", detail: "Payments", connected: false },
];

const feed = [
  { what: "Stripe payout", category: "Income", amount: "+$6,940.20", when: "Just now", income: true },
  { what: "AWS", category: "Software & hosting", amount: "−$1,240.00", when: "4 min ago" },
  { what: "Figma", category: "Software & hosting", amount: "−$75.00", when: "1 hr ago" },
  { what: "Acme Co. invoice", category: "Income", amount: "+$4,800.00", when: "Today", income: true },
];

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

function Visual({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="img" aria-label={label} className="dashed flex h-72 flex-col justify-center overflow-hidden rounded-3xl bg-cloud/60 p-4 sm:p-5">
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
      <SectionHeading className="max-w-3xl">Up and running in minutes.</SectionHeading>

      <ol className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        <Step
          n="1"
          title="Connect your accounts"
          visual={
            <Visual label="A business bank account and a card connected, and Stripe connecting.">
              <ul className="grid gap-2.5">
                {accounts.map((a) => (
                  <li key={a.name} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate font-medium">{a.name}</span>
                      <span className="block text-sm text-mute">{a.detail}</span>
                    </span>
                    {a.connected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-good-soft px-2.5 py-0.5 text-xs font-medium text-good">
                        <Check className="size-3" /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-soft">
                        <DotLoader /> Connecting
                      </span>
                    )}
                  </li>
                ))}
              </ul>
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
              <div className="flex items-center justify-between px-1 text-sm">
                <span className="font-medium">Transactions</span>
                <span className="inline-flex items-center gap-1.5 text-good">
                  <span className="size-2 rounded-full bg-good" /> Live
                </span>
              </div>
              <ul className="mt-3 overflow-hidden rounded-2xl border border-line bg-paper">
                {feed.map((t, i) => (
                  <li
                    key={t.what}
                    data-feed
                    className={`flex items-center gap-3 px-4 py-2.5 ${i ? "border-t border-line" : ""}`}
                  >
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[0.92rem] font-medium">{t.what}</span>
                      <span className="block truncate text-xs text-mute">{t.category}</span>
                    </span>
                    <span className="text-right leading-tight">
                      <span className={`block text-[0.92rem] tabular-nums ${t.income ? "text-good" : ""}`}>{t.amount}</span>
                      <span className="block text-xs text-mute">{t.when}</span>
                    </span>
                  </li>
                ))}
              </ul>
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
              <div className="flex items-center justify-between px-1 text-sm">
                <span className="font-medium">Cash projection</span>
                <span className="text-mute">Next 90 days</span>
              </div>
              <div className="mt-3 rounded-2xl border border-line bg-paper p-2">
                <CashChart compact draw />
              </div>
            </Visual>
          }
        >
          Projections built from your real patterns show where your cash will be next month and next quarter.
        </Step>
      </ol>
    </section>
  );
}
