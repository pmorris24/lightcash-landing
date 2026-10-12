"use client";

import { useState, type ReactNode } from "react";
import { Field } from "@/components/field";
import { SectionHeading, Soft } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { wrap } from "@/lib/site";

// Example month-end cash by account. Each month's total matches the product mock's chart
// (cash-chart.tsx), and October is today.
type Month = "Jul" | "Aug" | "Sep" | "Oct";

const accounts: { name: string; cash: Record<Month, number> }[] = [
  { name: "Chase operating", cash: { Jul: 30_900, Aug: 35_200, Sep: 39_800, Oct: 41_260 } },
  { name: "Stripe balance", cash: { Jul: 8_400, Aug: 10_300, Sep: 11_900, Oct: 13_110 } },
  { name: "Savings", cash: { Jul: 6_000, Aug: 6_500, Sep: 7_000, Oct: 7_000 } },
  { name: "Amex Business Gold", cash: { Jul: -2_200, Aug: -2_400, Sep: -3_000, Oct: -3_340 } },
];

const total = (month: Month) => accounts.reduce((sum, a) => sum + a.cash[month], 0);
const money = (v: number) => `${v < 0 ? "−" : ""}$${Math.abs(v).toLocaleString("en-US")}`;

type Report = {
  label: string;
  title: string;
  meta: string;
  status: ReactNode;
  months: Month[];
  /** The month the report is still waiting on. */
  pending?: Month;
  /** The month being filled in as money moves. */
  live?: Month;
  footer: ReactNode;
};

const reports: Report[] = [
  {
    label: "The monthly spreadsheet",
    title: "Cash report.xlsx",
    meta: "Last updated Sep 4",
    status: (
      <Badge variant="warning" className="h-6 px-2.5">
        Waiting on bookkeeper
      </Badge>
    ),
    months: ["Jul", "Aug", "Sep"],
    pending: "Sep",
    footer: "September’s numbers land around Oct 20.",
  },
  {
    label: "Lightcash",
    title: "Cash position",
    meta: "Updated 2 min ago",
    status: (
      <Badge variant="success" className="h-6 gap-1.5 px-2.5">
        <span className="size-1.5 rounded-full bg-good" /> Live
      </Badge>
    ),
    months: ["Aug", "Sep", "Oct"],
    live: "Oct",
    footer: (
      <span className="flex items-center gap-2">
        Up {money(total("Oct") - total("Sep"))} this month
        <Badge variant="success" className="h-5 px-1.5 tabular-nums">
          +{(((total("Oct") - total("Sep")) / total("Sep")) * 100).toFixed(1)}%
        </Badge>
      </span>
    ),
  },
];

/** A month the report does not have yet: a hatched placeholder where the number will go. */
function Pending() {
  return (
    <span
      className="inline-block h-2.5 w-12 rounded-full bg-[repeating-linear-gradient(135deg,var(--color-line)_0_4px,transparent_4px_8px)] align-middle"
      aria-hidden="true"
    />
  );
}

function ReportCard({
  report,
  hovered,
  onHover,
}: {
  report: Report;
  /** The row being pointed at in either card, so both light up together. */
  hovered: string | null;
  onHover: (row: string | null) => void;
}) {
  const { label, title, meta, status, months, pending, live, footer } = report;
  const columns = "grid-cols-[minmax(0,1fr)_repeat(3,minmax(4.25rem,5.5rem))]";
  const cell = (month: Month) =>
    cn("px-2 text-right tabular-nums sm:px-3", month === live && "bg-peri-deep/[0.06] font-medium text-ink");
  const row = (name: string) => ({
    onPointerEnter: () => onHover(name),
    onPointerLeave: () => onHover(null),
    className: cn("grid border-t border-line py-2.5 transition-colors duration-200", columns, hovered === name && "bg-peri-deep/[0.07] text-ink"),
  });
  return (
    <figure className="flex min-w-0 flex-col">
      <figcaption className="mb-2.5 px-1 text-sm text-white/90">{label}</figcaption>
      <div className={cn("flex flex-1 flex-col rounded-2xl bg-paper shadow-[0_24px_60px_-28px_rgb(13_13_18/0.45)]", pending && "text-ink-soft")}>
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate font-medium text-ink">{title}</span>
            <span className="block text-xs text-mute">{meta}</span>
          </span>
          {status}
        </div>

        <div className="py-2 text-[0.8rem] sm:text-sm">
          <div className={cn("grid py-2 text-xs text-mute", columns)}>
            <span className="px-4 sm:px-5">Account</span>
            {months.map((m) => (
              <span key={m} className={cell(m)}>
                {m === live ? "Today" : m}
              </span>
            ))}
          </div>
          {accounts.map((a) => (
            <div key={a.name} {...row(a.name)}>
              <span className="truncate px-4 sm:px-5">{a.name}</span>
              {months.map((m) => (
                <span key={m} className={cell(m)}>
                  {m === pending ? <Pending /> : money(a.cash[m])}
                </span>
              ))}
            </div>
          ))}
          <div {...row("Net cash")}>
            <span className="px-4 font-medium text-ink sm:px-5">Net cash</span>
            {months.map((m) => (
              <span key={m} className={cell(m)}>
                <span className="font-medium text-ink">{m === pending ? <Pending /> : money(total(m))}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-line px-4 py-3 text-xs text-mute sm:px-5">{footer}</div>
      </div>
    </figure>
  );
}

/**
 * The same cash report two ways, on a textured panel like the product shots: the spreadsheet is still
 * waiting on last month, and Lightcash already has today.
 */
function Reports() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div
      data-reveal
      role="img"
      aria-label="The monthly spreadsheet was last updated September 4 and is still waiting on September's numbers. Lightcash shows every account up to today, updated two minutes ago."
      className="relative isolate mt-14 overflow-hidden rounded-3xl p-3 sm:p-6 lg:p-10"
    >
      <Field palette="twilight" className="-z-10" />
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {reports.map((report) => (
          <ReportCard key={report.label} report={report} hovered={hovered} onHover={setHovered} />
        ))}
      </div>
    </div>
  );
}

export function Problem() {
  return (
    <section className={`${wrap} py-24 sm:py-32`}>
      <div data-reveal className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
        <SectionHeading>Your books close once a month. <Soft>Your business doesn’t.</Soft></SectionHeading>
        <div className="grid max-w-xl gap-4 text-[1.05rem] leading-relaxed text-pretty text-ink-soft">
          <p>
            Most small businesses only see their finances in the rearview mirror: a monthly spreadsheet, a quarterly
            report, an accountant’s bill. By the time the numbers arrive, the decision has already been made.
          </p>
          <p className="text-ink">Lightcash puts your finances in real time, so you always know where you stand.</p>
        </div>
      </div>
      <Reports />
    </section>
  );
}
