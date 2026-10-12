"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { siQuickbooks, siShopify, siStripe, siXero, type SimpleIcon } from "simple-icons";
import { AnimatedNumber } from "@/components/animated-number";
import { Check, Share, Sparkle } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { SectionHeading, Soft } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { balances, money, scenarios, statements, upcoming } from "@/lib/demo";
import { cn } from "@/lib/utils";
import { wrap } from "@/lib/site";

// The tiles are small working pieces of the product. Their data lives in src/lib/demo.ts so it matches
// the hero dashboard and the cash report in the problem section (October, today: $58,030).

// Logos are from simple-icons (CC0); Gusto and Plaid are not in it, so they show as names.
const sources: { name: string; icon?: SimpleIcon; brings: string }[] = [
  { name: "Stripe", icon: siStripe, brings: "payouts, fees and refunds" },
  { name: "QuickBooks", icon: siQuickbooks, brings: "the invoices and bills you already track" },
  { name: "Xero", icon: siXero, brings: "invoices, bills and your chart of accounts" },
  { name: "Shopify", icon: siShopify, brings: "orders, payouts and refunds" },
  { name: "Gusto", brings: "payroll runs and payroll taxes" },
  { name: "Plaid", brings: "every bank and card transaction" },
];
const views = ["Dashboard", "Forecasts", "Reports"];

function Tile({
  title,
  body,
  label,
  className,
  children,
}: {
  title: string;
  body: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <li data-reveal className={cn("flex min-w-0 flex-col rounded-[28px] border border-line p-2", className)}>
      <div className="px-4 pt-4 pb-6 sm:px-5">
        <h3 className="text-[1.3rem] leading-tight tracking-[-0.02em]">{title}</h3>
        <p className="mt-2 max-w-md leading-relaxed text-pretty text-mute">{body}</p>
      </div>
      <div
        role="group"
        aria-label={label}
        className="dashed mt-auto flex h-80 flex-col justify-center overflow-hidden rounded-[22px] bg-cloud/60 p-4 sm:p-6"
      >
        {children}
      </div>
    </li>
  );
}

/** A white panel inside a tile, like a card in the product. */
function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-line bg-paper", className)}>{children}</div>;
}

function LiveCash() {
  const [off, setOff] = useState<string[]>([]);
  const largest = Math.max(...balances.map((b) => Math.abs(b.amount)));
  const total = balances.reduce((sum, b) => sum + (off.includes(b.name) ? 0 : b.amount), 0);
  const toggle = (name: string) => setOff((now) => (now.includes(name) ? now.filter((n) => n !== name) : [...now, name]));
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="leading-tight">
          <span className="block text-sm text-mute">Cash on hand</span>
          <AnimatedNumber value={total} format={money} className="mt-1 block font-display text-[2rem] tracking-[-0.03em] tabular-nums" />
        </span>
        <Badge variant="success" className="h-6 gap-1.5 px-2.5">
          <span className="size-1.5 animate-pulse rounded-full bg-good" /> Live
        </Badge>
      </div>
      <p className={cn("mt-1 text-xs", off.length ? "text-mute" : "text-good")}>
        {off.length ? `Leaving out ${off.join(" and ")}` : "+$2,330 this month · tap an account to leave it out"}
      </p>
      <ul className="mt-4 grid gap-1 text-sm">
        {balances.map((b) => {
          const on = !off.includes(b.name);
          return (
            <li key={b.name}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(b.name)}
                className="-mx-2 grid w-[calc(100%+1rem)] grid-cols-[minmax(0,8.5rem)_1fr_auto] items-center gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-cloud"
              >
                <span className={cn("truncate transition-colors", !on && "text-mute")}>{b.name}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-cloud">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-[width,background-color] duration-500",
                      !on ? "bg-line" : b.amount < 0 ? "bg-ember/70" : "bg-peri-deep",
                    )}
                    style={{ width: `${on ? (Math.abs(b.amount) / largest) * 100 : 0}%` }}
                  />
                </span>
                <span className={cn("text-right tabular-nums", !on ? "text-mute line-through" : b.amount < 0 && "text-ember")}>
                  {money(b.amount)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function Projections() {
  const [hire, setHire] = useState(false);
  const s = scenarios[hire ? "hire" : "base"];
  return (
    <div className="grid gap-3">
      <Panel className="grid grid-cols-2 divide-x divide-line">
        <span className="px-4 py-3 leading-tight">
          <span className="block text-xs text-mute">Runway</span>
          <span className="mt-1 block text-lg tabular-nums">
            <AnimatedNumber value={s.runway} format={(v) => v.toFixed(1)} /> months
          </span>
        </span>
        <span className="px-4 py-3 leading-tight">
          <span className="block text-xs text-mute">Jan 31, projected</span>
          <AnimatedNumber value={s.janCash} format={money} className="mt-1 block text-lg tabular-nums" />
        </span>
      </Panel>
      <Panel className="text-sm">
        <p className="px-4 pt-3 pb-1 text-xs text-mute">Coming up</p>
        {upcoming.map((u) => (
          <div key={u.what} className="flex items-center gap-3 border-t border-line px-4 py-2.5 first-of-type:border-t-0">
            <span className="w-12 shrink-0 text-xs text-mute">{u.date}</span>
            <span className="min-w-0 flex-1 truncate">{u.what}</span>
            <span className={cn("tabular-nums", u.amount > 0 && "text-good")}>{u.amount > 0 ? "+" : ""}{money(u.amount)}</span>
          </div>
        ))}
      </Panel>
      <label
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5 text-sm transition-colors",
          hire ? "bg-peri-deep text-paper" : "bg-peri-deep/[0.08] text-peri-deep hover:bg-peri-deep/[0.12]",
        )}
      >
        <Sparkle className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">What if you hire in December?</span>
        <Switch
          checked={hire}
          onCheckedChange={setHire}
          className="data-checked:bg-paper/30 data-unchecked:bg-peri-deep/25"
        />
      </label>
    </div>
  );
}

const reportTabs = [
  { id: "pnl", label: "P&L" },
  { id: "cashflow", label: "Cash flow" },
  { id: "balance", label: "Balance sheet" },
] as const;

function Reporting() {
  const [tab, setTab] = useState<(typeof reportTabs)[number]["id"]>("pnl");
  const [exported, setExported] = useState(false);
  const report = statements[tab];
  const exportReport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 1800);
  };
  return (
    <Panel className="text-sm">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <div role="tablist" aria-label="Report" className="flex gap-1.5">
          {reportTabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors",
                tab === id ? "bg-ink text-paper" : "text-mute hover:bg-cloud hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportReport}
          className="ml-auto flex items-center gap-1 rounded-full px-2 py-1 text-xs text-mute transition-colors hover:bg-cloud hover:text-ink"
        >
          {exported ? <Check className="size-3.5 text-good" /> : <Share className="size-3.5" />}
          {exported ? "Exported" : "Export"}
        </button>
      </div>
      <div role="tabpanel" key={tab} className="animate-in duration-300 fade-in">
        <p className="px-4 pt-3 pb-1 text-xs text-mute">{report.title}</p>
        {report.rows.map((row) => (
          <div key={row.line} className="flex items-center gap-3 border-t border-line px-4 py-2.5 first-of-type:border-t-0">
            <span className="min-w-0 flex-1 truncate">{row.line}</span>
            <span className="tabular-nums">{money(row.amount)}</span>
            {row.change && (
              <Badge
                variant={row.good === undefined ? "secondary" : row.good ? "success" : "ember"}
                className="h-5 w-12 px-1.5 tabular-nums"
              >
                {row.change}
              </Badge>
            )}
          </div>
        ))}
        <div className="flex items-center gap-3 border-t border-line px-4 py-2.5 font-medium">
          <span className="flex-1">{report.total.line}</span>
          <span className="tabular-nums">{money(report.total.amount)}</span>
          {report.total.change && (
            <Badge variant="success" className="h-5 w-12 px-1.5 tabular-nums">
              {report.total.change}
            </Badge>
          )}
        </div>
      </div>
    </Panel>
  );
}

/** A point on a ring, as a percentage offset from the centre of a square box. */
const onRing = (radius: number, degrees: number): CSSProperties => {
  const a = (degrees * Math.PI) / 180;
  return { left: `${50 + radius * Math.cos(a)}%`, top: `${50 + radius * Math.sin(a)}%` };
};

/** The same ring point, in the 0–100 units of the SVG overlay. */
const ringXY = (radius: number, degrees: number) => {
  const a = (degrees * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(a), y: 50 + radius * Math.sin(a) };
};

function SourceOfTruth() {
  const [active, setActive] = useState<number | null>(null);
  const source = active === null ? null : sources[active];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="relative mx-auto aspect-square h-full max-h-52 min-h-0 sm:max-h-60" onPointerLeave={() => setActive(null)}>
        <span className="absolute inset-[4%] rounded-full border border-dashed border-dash" />
        <span className="absolute inset-[24%] rounded-full border border-line bg-paper/60" />

        {/* Spokes: each source into the core, and the core out to every view. */}
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
          {sources.map((s, i) => {
            const p = ringXY(45, -90 + i * 60);
            const on = active === i;
            return (
              <line
                key={s.name}
                x1={p.x}
                y1={p.y}
                x2="50"
                y2="50"
                stroke={on ? "var(--color-peri-deep)" : "var(--color-line)"}
                strokeWidth={on ? 0.9 : 0.5}
                strokeDasharray={on ? "2 1.5" : undefined}
                className={cn("transition-[stroke]", on && "animate-flow")}
              />
            );
          })}
          {views.map((v, i) => {
            const p = ringXY(26, -90 + i * 120);
            return (
              <line
                key={v}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke="var(--color-peri-deep)"
                strokeOpacity={active === null ? 0 : 0.7}
                strokeWidth="0.9"
                strokeDasharray="2 1.5"
                className="animate-flow transition-[stroke-opacity] duration-300"
              />
            );
          })}
        </svg>

        {sources.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(i)}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border bg-paper px-2 py-1 text-[0.7rem] font-medium whitespace-nowrap shadow-sm transition-[border-color,box-shadow,scale] sm:px-2.5 sm:py-1.5 sm:text-xs",
              active === i ? "scale-105 border-peri-deep/50 shadow-[0_6px_18px_-8px_rgb(91_108_240/0.6)]" : "border-line",
            )}
            style={onRing(45, -90 + i * 60)}
          >
            {s.icon && (
              <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
                <path d={s.icon.path} fill={`#${s.icon.hex}`} />
              </svg>
            )}
            {s.name}
          </button>
        ))}

        {views.map((v, i) => (
          <span
            key={v}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors duration-300",
              active === null ? "bg-peri-deep/10 text-peri-deep" : "bg-peri-deep text-paper",
            )}
            style={onRing(26, -90 + i * 120)}
          >
            {v}
          </span>
        ))}

        <span
          className={cn(
            "absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-ink text-paper shadow-[0_12px_30px_-10px_rgb(13_13_18/0.6)] transition-[scale] duration-300",
            active !== null && "scale-110",
          )}
        >
          <LogoMark className="size-7" />
        </span>
      </div>
      <p className="h-5 text-center text-xs text-mute" aria-live="polite">
        {source ? (
          <>
            <span className="font-medium text-ink">{source.name}</span> brings {source.brings}.
          </>
        ) : (
          "Point at a source to follow its numbers."
        )}
      </p>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <SectionHeading className="max-w-3xl">Drop the spreadsheets. <Soft>Keep every answer.</Soft></SectionHeading>

      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Tile
          className="lg:col-span-3"
          title="Live cash view"
          body="Balances, inflows and outflows across every account, always up to date."
          label="Cash on hand of $58,030, live, split across a checking account, Stripe, savings and a card balance."
        >
          <LiveCash />
        </Tile>
        <Tile
          className="lg:col-span-2"
          title="Sensible projections"
          body="See your runway, upcoming obligations and what-if scenarios before they become surprises."
          label="14.2 months of runway, payroll, an invoice and quarterly tax coming up, and a what-if for hiring in December."
        >
          <Projections />
        </Tile>
        <Tile
          className="lg:col-span-2"
          title="Reporting, covered"
          body="P&L, cash flow and balance sheet, generated on demand and ready to share."
          label="A profit and loss statement for September with the change on each line, ready to export."
        >
          <Reporting />
        </Tile>
        <Tile
          className="lg:col-span-3"
          title="One source of truth"
          body="Your dashboard, forecasts and reports all come from the same numbers, so they never disagree."
          label="Stripe, QuickBooks, Xero, Shopify, Gusto and Plaid feeding one Lightcash core that serves the dashboard, forecasts and reports."
        >
          <SourceOfTruth />
        </Tile>
      </ul>
    </section>
  );
}
