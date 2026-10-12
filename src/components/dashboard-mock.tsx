"use client";

import { useEffect, useRef, useState, type ComponentType, type FormEvent, type ReactNode, type SVGProps } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { CashChart } from "@/components/cash-chart";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  FileText,
  Home,
  List,
  Search,
  Share,
  Sparkle,
  TrendUp,
  Wallet,
} from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { Switch } from "@/components/ui/switch";
import { balances, cents, money, scenarios, signed, statements, transactions, upcoming, type Scenario } from "@/lib/demo";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type View = "overview" | "cash" | "projections" | "reports" | "transactions" | "ask";

const menu: { id: View; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "cash", label: "Cash", icon: Wallet },
  { id: "projections", label: "Projections", icon: TrendUp },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "transactions", label: "Transactions", icon: List },
  { id: "ask", label: "Ask Lightcash", icon: Sparkle },
];

const accounts = [
  { label: "Chase Business", color: "bg-peri-deep" },
  { label: "Stripe", color: "bg-ember" },
  { label: "Gusto payroll", color: "bg-good" },
];

const kpis: { label: string; value: string; unit?: string; change: string; note: string; opens: View }[] = [
  { label: "Cash on hand", value: "$58,030", change: "+4.2%", note: "Up $2,330 since last month", opens: "cash" },
  { label: "Monthly burn", value: "$21,400", change: "−3.1%", note: "Software costs fell $640", opens: "transactions" },
  { label: "Runway", value: "14.2", unit: "months", change: "+0.8", note: "At the current burn", opens: "projections" },
];

/** Canned answers for the Ask view, matched by keyword. */
const answers = [
  {
    q: "How long is my runway?",
    match: /runway|last|how long/i,
    a: "At today’s burn you have 14.2 months of runway, into mid-December 2027. That’s 0.8 months more than last month, mostly because software costs fell $640.",
  },
  {
    q: "What did we spend on software?",
    match: /software|spend|aws|tools/i,
    a: "You spent $3,100 on software and hosting in September, 8% less than August. AWS was the biggest line at $1,240.",
  },
  {
    q: "Can I afford a hire in December?",
    match: /hire|afford|salary|hiring/i,
    a: "Yes, with room to spare. Hiring in December takes runway from 14.2 to 11.6 months, and cash bottoms out around $51,800 in January.",
    action: "projections" as const,
  },
];

const frame = "rounded-lg border border-line px-2.5 py-1.5 text-[0.7rem] transition-colors hover:bg-cloud";

/**
 * The hero product shot, built in HTML and fully clickable: the sidebar switches views, the search
 * filters transactions, KPIs open their detail, and Ask Lightcash answers a few questions. Every view
 * is stacked in the same box (the overview sets its size), so switching never changes the layout.
 */
export function DashboardMock({ className = "" }: { className?: string }) {
  const [view, setView] = useState<View>("overview");
  const [query, setQuery] = useState("");
  const [scenario, setScenario] = useState<Scenario>("base");
  const [shared, setShared] = useState(false);
  const search = useRef<HTMLInputElement>(null);

  const share = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  return (
    <section
      aria-label="Interactive Lightcash demo"
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
          event.preventDefault();
          search.current?.focus();
        }
      }}
      className={`@container overflow-hidden rounded-2xl border border-line bg-paper text-left text-ink shadow-[0_30px_80px_-30px_rgb(13_13_18/0.45)] ${className}`}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Wordmark className="h-5 shrink-0" />
        <label className="ml-6 hidden h-8 flex-1 items-center gap-2 rounded-lg border border-line px-3 text-[0.7rem] text-mute transition-colors focus-within:border-peri-deep/50 focus-within:ring-2 focus-within:ring-peri-deep/15 @2xl:flex @2xl:max-w-72">
          <Search className="size-3.5 shrink-0" />
          <span className="sr-only">Search transactions</span>
          <input
            ref={search}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setView("transactions");
            }}
            placeholder="Search transactions or reports…"
            className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-mute"
          />
          <kbd className="ml-auto rounded border border-line px-1 font-mono text-[0.6rem]">⌘K</kbd>
        </label>
        <button type="button" onClick={share} className={cn(frame, "ml-auto hidden items-center gap-1.5 @xl:flex")}>
          {shared ? <Check className="size-3.5 text-good" /> : <Share className="size-3.5" />}
          {shared ? "Link copied" : "Share"}
        </button>
        <span className="flex items-center gap-2 rounded-lg border border-line py-1 pr-2 pl-1 @max-xl:ml-auto">
          <span className="grid size-6 place-items-center rounded-full bg-[#f3d9cf] text-[0.6rem] font-semibold text-[#8c3326]">MP</span>
          <span className="hidden leading-tight @xl:block">
            <span className="block text-[0.7rem] font-medium">Maya Patel</span>
            <span className="block text-[0.6rem] text-mute">Northwind Studio</span>
          </span>
          <ChevronDown className="size-3.5 text-mute" />
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-48 shrink-0 border-r border-line px-3 py-4 @3xl:block">
          <p className="px-2 font-mono text-[0.6rem] tracking-wider text-mute uppercase">General</p>
          <nav aria-label="Demo views">
            <ul className="mt-2 grid gap-0.5">
              {menu.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    type="button"
                    aria-current={view === id ? "page" : undefined}
                    onClick={() => setView(id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[0.75rem] transition-colors",
                      view === id ? "bg-cloud font-medium" : "text-ink-soft hover:bg-cloud/60 hover:text-ink",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-5 px-2 font-mono text-[0.6rem] tracking-wider text-mute uppercase">Accounts</p>
          <ul className="mt-2 grid gap-0.5">
            {accounts.map(({ label, color }) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => setView("cash")}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[0.75rem] text-ink-soft transition-colors hover:bg-cloud/60 hover:text-ink"
                >
                  <span className={`size-2 rounded-sm ${color}`} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Views as a tab strip where there is no room for the sidebar. */}
          <nav aria-label="Demo views" className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 [scrollbar-width:none] @3xl:hidden">
            {menu.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-current={view === id ? "page" : undefined}
                onClick={() => setView(id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] transition-colors",
                  view === id ? "bg-ink text-paper" : "text-ink-soft hover:bg-cloud",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </nav>

          <div className="relative">
            <Pane active={view === "overview"} flow>
              <Overview open={setView} />
            </Pane>
            <Pane active={view === "cash"}>
              <CashView />
            </Pane>
            <Pane active={view === "projections"}>
              <ProjectionsView scenario={scenario} setScenario={setScenario} />
            </Pane>
            <Pane active={view === "reports"}>
              <ReportsView />
            </Pane>
            <Pane active={view === "transactions"}>
              <TransactionsView query={query} setQuery={setQuery} />
            </Pane>
            <Pane active={view === "ask"}>
              <AskView
                active={view === "ask"}
                showProjection={() => {
                  setScenario("hire");
                  setView("projections");
                }}
              />
            </Pane>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One view. The overview stays in flow (hidden, not removed) so it sets the box size for the rest. */
function Pane({ active, flow = false, children }: { active: boolean; flow?: boolean; children: ReactNode }) {
  return (
    <div
      inert={!active}
      aria-hidden={!active}
      className={cn(
        "p-4 transition-[opacity,translate] duration-300 ease-out @xl:p-5",
        !flow && "absolute inset-0 overflow-y-auto [scrollbar-width:thin]",
        active ? "opacity-100" : "invisible translate-y-1 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function Header({ title, note, children }: { title: string; note: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="min-w-0">
        <p className="text-[0.95rem] font-medium">{title}</p>
        <p className="text-[0.7rem] text-mute">{note}</p>
      </div>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}

function Overview({ open }: { open: (view: View) => void }) {
  return (
    <>
      <Header title="Cash overview" note="Live cash, burn and runway across every account.">
        <span className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[0.7rem]">
          <Calendar className="size-3.5" />
          Oct 12, 2026
        </span>
        <button
          type="button"
          onClick={() => open("ask")}
          className="flex items-center gap-1.5 rounded-lg bg-ink px-2.5 py-1.5 text-[0.7rem] text-paper transition-colors hover:bg-ink/80"
        >
          <Sparkle className="size-3.5" />
          Ask Lightcash
        </button>
      </Header>

      <div className="mt-4 grid grid-cols-3 gap-2 @xl:gap-3">
        {kpis.map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => open(kpi.opens)}
            className="group min-w-0 rounded-xl border border-line p-2.5 text-left transition-[border-color,box-shadow,translate] hover:-translate-y-0.5 hover:border-peri-deep/40 hover:shadow-[0_8px_20px_-12px_rgb(91_108_240/0.5)] @lg:p-3"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-[0.65rem] font-medium text-ink-soft @lg:text-[0.7rem]">{kpi.label}</span>
              <ArrowRight className="size-3 shrink-0 -translate-x-1 text-peri-deep opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </span>
            <span className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
              <span data-count className="text-lg font-medium tracking-tight tabular-nums @lg:text-2xl">{kpi.value}</span>
              {kpi.unit && <span className="text-[0.7rem] text-mute">{kpi.unit}</span>}
              <span className="rounded bg-good-soft px-1 text-[0.6rem] font-medium text-good">{kpi.change}</span>
            </span>
            <span className="mt-1 hidden truncate text-[0.6rem] text-mute @lg:block">{kpi.note}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 @4xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-line p-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-[0.75rem] font-medium">Cash projection</p>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-mute">
              <span className="h-0.5 w-4 rounded bg-peri-deep" /> Actual
            </span>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-mute">
              <span className="w-4 border-t-2 border-dashed border-peri-deep" /> Projected, with likely range
            </span>
            <span className="ml-auto text-[0.65rem] text-mute">Next 90 days</span>
          </div>
          <CashChart />
        </div>

        {/* Side column on wide screens: what's due next and what just moved. */}
        <div className="hidden grid-rows-2 gap-3 @4xl:grid">
          <MiniList title="Coming up" more="Projections" onMore={() => open("projections")}>
            {upcoming.map((u) => (
              <li key={u.what} className="flex items-center gap-2 border-t border-line px-3 py-1.5 first:border-t-0">
                <span className="w-10 shrink-0 text-[0.62rem] text-mute">{u.date}</span>
                <span className="min-w-0 flex-1 truncate">{u.what}</span>
                <span className={cn("tabular-nums", u.amount > 0 && "text-good")}>{signed(u.amount)}</span>
              </li>
            ))}
          </MiniList>
          <MiniList title="Latest transactions" more="All" onMore={() => open("transactions")}>
            {transactions.slice(0, 3).map((t) => (
              <li key={t.id} className="flex items-center gap-2 border-t border-line px-3 py-1.5 first:border-t-0">
                <span className="min-w-0 flex-1 truncate">{t.what}</span>
                <span className={cn("tabular-nums", t.amount > 0 && "text-good")}>{cents(t.amount)}</span>
              </li>
            ))}
          </MiniList>
        </div>
      </div>
    </>
  );
}

function MiniList({ title, more, onMore, children }: { title: string; more: string; onMore: () => void; children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-col rounded-xl border border-line text-[0.7rem]">
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <p className="text-[0.75rem] font-medium">{title}</p>
        <button type="button" onClick={onMore} className="flex items-center gap-0.5 text-[0.65rem] text-peri-deep hover:underline">
          {more} <ArrowRight className="size-3" />
        </button>
      </div>
      <ul>{children}</ul>
    </div>
  );
}

function CashView() {
  const [included, setIncluded] = useState(() => new Set(balances.map((b) => b.name)));
  const total = balances.reduce((sum, b) => sum + (included.has(b.name) ? b.amount : 0), 0);
  const largest = Math.max(...balances.map((b) => Math.abs(b.amount)));
  const toggle = (name: string) =>
    setIncluded((now) => {
      const next = new Set(now);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  return (
    <>
      <Header title="Cash" note="Switch accounts on and off to see what’s really yours to spend." />
      <div className="mt-4 rounded-xl border border-line p-4">
        <p className="text-[0.7rem] text-mute">
          Cash on hand · {included.size} of {balances.length} accounts
        </p>
        <AnimatedNumber value={total} format={money} className="mt-1 block text-3xl font-medium tracking-tight tabular-nums" />
      </div>
      <ul className="mt-3 grid gap-2">
        {balances.map((b) => {
          const on = included.has(b.name);
          return (
            <li key={b.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-line px-3 py-2.5 @lg:grid-cols-[minmax(0,10rem)_1fr_auto_auto]">
              <span className="min-w-0 leading-tight">
                <span className={cn("block truncate text-[0.8rem] font-medium transition-colors", !on && "text-mute")}>{b.name}</span>
                <span className="block text-[0.65rem] text-mute">{b.kind}</span>
              </span>
              <span className="hidden h-1.5 overflow-hidden rounded-full bg-cloud @lg:block">
                <span
                  className={cn(
                    "block h-full rounded-full transition-[width,background-color] duration-500",
                    !on ? "bg-line" : b.amount < 0 ? "bg-ember/70" : "bg-peri-deep",
                  )}
                  style={{ width: `${on ? (Math.abs(b.amount) / largest) * 100 : 0}%` }}
                />
              </span>
              <span className={cn("hidden text-right text-[0.8rem] tabular-nums @lg:block", !on ? "text-mute line-through" : b.amount < 0 && "text-ember")}>
                {money(b.amount)}
              </span>
              <Switch size="sm" checked={on} onCheckedChange={() => toggle(b.name)} aria-label={`Include ${b.name}`} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

function ProjectionsView({ scenario, setScenario }: { scenario: Scenario; setScenario: (s: Scenario) => void }) {
  const s = scenarios[scenario];
  return (
    <>
      <Header title="Projections" note="Where your cash is heading, and what changes if you act.">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-[0.7rem]">
          <Sparkle className="size-3.5 text-peri-deep" />
          Hire in December
          <Switch size="sm" checked={scenario === "hire"} onCheckedChange={(on) => setScenario(on ? "hire" : "base")} />
        </label>
      </Header>
      <div className="mt-4 grid grid-cols-2 gap-2 @xl:gap-3">
        <div className="rounded-xl border border-line p-3">
          <p className="text-[0.7rem] text-mute">Runway</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <AnimatedNumber value={s.runway} format={(v) => v.toFixed(1)} className="text-2xl font-medium tracking-tight tabular-nums" />
            <span className="text-[0.7rem] text-mute">months</span>
          </p>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="text-[0.7rem] text-mute">Jan 31, projected</p>
          <AnimatedNumber value={s.janCash} format={money} className="mt-1 block text-2xl font-medium tracking-tight tabular-nums" />
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-line p-3">
        <p className="text-[0.75rem] font-medium">
          Cash projection · <span className="text-mute">{s.label}</span>
        </p>
        <CashChart scenario={scenario} />
      </div>
    </>
  );
}

function ReportsView() {
  const [tab, setTab] = useState<keyof typeof statements>("pnl");
  const report = statements[tab];
  return (
    <>
      <Header title="Reports" note="Generated from the same ledger as everything else.">
        <div role="tablist" aria-label="Report" className="flex gap-1 rounded-lg bg-cloud p-0.5">
          {(
            [
              ["pnl", "P&L"],
              ["cashflow", "Cash flow"],
              ["balance", "Balance sheet"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn("rounded-md px-2 py-1 text-[0.7rem] transition-colors", tab === id ? "bg-paper font-medium shadow-sm" : "text-mute hover:text-ink")}
            >
              {label}
            </button>
          ))}
        </div>
      </Header>
      <div className="mt-4 rounded-xl border border-line text-[0.8rem]" role="tabpanel">
        <p className="px-4 pt-3 pb-1 text-[0.7rem] text-mute">{report.title}</p>
        {report.rows.map((row) => (
          <div key={row.line} className="flex items-center gap-3 border-t border-line px-4 py-2 first-of-type:border-t-0">
            <span className="min-w-0 flex-1 truncate">{row.line}</span>
            <span className="tabular-nums">{money(row.amount)}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 border-t border-line bg-cloud/50 px-4 py-2 font-medium">
          <span className="flex-1">{report.total.line}</span>
          <span className="tabular-nums">{money(report.total.amount)}</span>
        </div>
      </div>
    </>
  );
}

const filters = ["All", "Income", "Spending"] as const;

function TransactionsView({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const q = query.trim().toLowerCase();
  const rows = transactions.filter(
    (t) =>
      (filter === "All" || (filter === "Income" ? t.amount > 0 : t.amount < 0)) &&
      (!q || t.what.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)),
  );
  return (
    <>
      <Header title="Transactions" note="Every line arrives categorized. Try searching “software”.">
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn("rounded-full px-2.5 py-1 text-[0.7rem] transition-colors", filter === f ? "bg-ink text-paper" : "text-ink-soft hover:bg-cloud")}
            >
              {f}
            </button>
          ))}
        </div>
      </Header>
      <label className="mt-3 flex h-8 items-center gap-2 rounded-lg border border-line px-3 text-[0.7rem] @2xl:hidden">
        <Search className="size-3.5 shrink-0 text-mute" />
        <span className="sr-only">Search transactions</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search…"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-mute"
        />
      </label>
      <ul className="mt-3 overflow-hidden rounded-xl border border-line">
        {rows.map((t, i) => (
          <li key={t.id} className={cn("flex items-center gap-3 px-3 py-2", i && "border-t border-line")}>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[0.8rem] font-medium">{t.what}</span>
              <span className="block truncate text-[0.65rem] text-mute">{t.category}</span>
            </span>
            <span className="text-right leading-tight">
              <span className={cn("block text-[0.8rem] tabular-nums", t.amount > 0 && "text-good")}>{cents(t.amount)}</span>
              <span className="block text-[0.65rem] text-mute">{t.when}</span>
            </span>
          </li>
        ))}
        {!rows.length && <li className="px-3 py-6 text-center text-[0.75rem] text-mute">No transactions match “{query}”.</li>}
      </ul>
    </>
  );
}

type Message = { from: "you" | "lightcash"; text: string; action?: "projections" };

function AskView({ active, showProjection }: { active: boolean; showProjection: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typed, setTyped] = useState(0);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const latest = messages.at(-1);
  const typing = !reduced && latest?.from === "lightcash" && typed < latest.text.length;

  useEffect(() => {
    if (active && window.matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
  }, [active]);

  // Type the latest answer out a few characters at a time.
  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => setTyped((n) => n + 3), 18);
    return () => clearTimeout(timer);
  }, [typing, typed]);

  // Keep the newest line in view (scrolling the thread only, never the page).
  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typed]);

  const ask = (question: string) => {
    const hit = answers.find((a) => a.match.test(question));
    setMessages((m) => [
      ...m,
      { from: "you", text: question },
      hit
        ? { from: "lightcash", text: hit.a, action: hit.action }
        : { from: "lightcash", text: "This demo knows about runway, software spend and hiring. Try one of the suggestions below." },
    ]);
    setTyped(0);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim() || typing) return;
    ask(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Header title="Ask Lightcash" note="Plain-English answers from your live numbers." />
      <div ref={thread} className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto" aria-live="polite">
        {!messages.length && (
          <div className="grid place-items-center rounded-xl border border-dashed border-dash px-4 py-6 text-center text-[0.75rem] text-mute">
            <Sparkle className="mb-2 size-5 text-peri-deep" />
            Ask about your cash, spending or plans.
          </div>
        )}
        {messages.map((m, i) => {
          const last = i === messages.length - 1;
          const text = last && typing ? m.text.slice(0, typed) : m.text;
          return (
            <div key={i} className={cn("flex", m.from === "you" && "justify-end")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-[0.78rem] leading-relaxed",
                  m.from === "you" ? "bg-ink text-paper" : "bg-peri-deep/[0.08] text-ink",
                )}
              >
                {text}
                {m.action && (!last || !typing) && (
                  <button type="button" onClick={showProjection} className="mt-1.5 flex items-center gap-1 font-medium text-peri-deep hover:underline">
                    Show it in projections <ArrowRight className="size-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {answers.map((a) => (
          <button
            key={a.q}
            type="button"
            disabled={typing}
            onClick={() => ask(a.q)}
            className="rounded-full border border-line px-2.5 py-1 text-[0.7rem] text-ink-soft transition-colors hover:border-peri-deep/40 hover:text-ink disabled:opacity-50"
          >
            {a.q}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="mt-2 flex h-9 items-center gap-2 rounded-lg border border-line pr-1 pl-3 focus-within:border-peri-deep/50">
        <input
          ref={input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask anything about your finances…"
          aria-label="Ask Lightcash"
          className="min-w-0 flex-1 bg-transparent text-[0.75rem] outline-none placeholder:text-mute"
        />
        <button type="submit" disabled={typing || !draft.trim()} className="grid size-7 place-items-center rounded-md bg-ink text-paper disabled:opacity-40" aria-label="Send">
          <ArrowRight className="size-3.5" />
        </button>
      </form>
    </div>
  );
}
