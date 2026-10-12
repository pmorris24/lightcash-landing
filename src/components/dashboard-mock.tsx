import { CashChart } from "@/components/cash-chart";
import { Calendar, ChevronDown, FileText, Home, List, Search, Share, Sparkle, TrendUp, Wallet } from "@/components/icons";
import { LogoMark } from "@/components/logo";

const menu = [
  { label: "Overview", icon: Home, active: true },
  { label: "Cash", icon: Wallet },
  { label: "Projections", icon: TrendUp },
  { label: "Reports", icon: FileText },
  { label: "Transactions", icon: List },
  { label: "Ask Lightcash", icon: Sparkle },
];

const accounts = [
  { label: "Chase Business", color: "bg-peri-deep" },
  { label: "Stripe", color: "bg-ember" },
  { label: "Gusto payroll", color: "bg-good" },
];

const kpis = [
  { label: "Cash on hand", value: "$58,030", change: "+4.2%", good: true, note: "Up $2,330 since last month" },
  { label: "Monthly burn", value: "$21,400", change: "−3.1%", good: true, note: "Software costs fell $640" },
  { label: "Runway", value: "14.2", unit: "months", change: "+0.8", good: true, note: "At the current burn" },
];

/** Static product screenshot built in HTML, so it stays sharp and needs no image files. */
export function DashboardMock({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="The Lightcash overview: cash on hand, monthly burn, runway and a cash projection for the next 90 days."
      className={`@container overflow-hidden rounded-2xl border border-line bg-paper text-left text-ink shadow-[0_30px_80px_-30px_rgb(13_13_18/0.45)] ${className}`}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="grid size-8 place-items-center rounded-lg bg-ink text-paper">
          <LogoMark className="size-4" />
        </span>
        <span className="text-sm font-medium">Lightcash</span>
        <span className="ml-6 hidden h-8 flex-1 items-center gap-2 rounded-lg border border-line px-3 text-[0.7rem] whitespace-nowrap text-mute @2xl:flex @2xl:max-w-72">
          <Search className="size-3.5" />
          Search transactions or reports…
          <span className="ml-auto rounded border border-line px-1 font-mono text-[0.6rem]">⌘K</span>
        </span>
        <span className="ml-auto hidden items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[0.7rem] @xl:flex">
          <Share className="size-3.5" />
          Share
        </span>
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
          <ul className="mt-2 grid gap-0.5">
            {menu.map(({ label, icon: Icon, active }) => (
              <li
                key={label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.75rem] ${active ? "bg-cloud font-medium" : "text-ink-soft"}`}
              >
                <Icon className="size-3.5" />
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-5 px-2 font-mono text-[0.6rem] tracking-wider text-mute uppercase">Accounts</p>
          <ul className="mt-2 grid gap-0.5">
            {accounts.map(({ label, color }) => (
              <li key={label} className="flex items-center gap-2 px-2 py-1.5 text-[0.75rem] text-ink-soft">
                <span className={`size-2 rounded-sm ${color}`} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1 p-4 @xl:p-5">
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0">
              <p className="text-[0.95rem] font-medium">Cash overview</p>
              <p className="text-[0.7rem] text-mute">Live cash, burn and runway across every account.</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[0.7rem]">
              <Calendar className="size-3.5" />
              Oct 12, 2026
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-ink px-2.5 py-1.5 text-[0.7rem] text-paper">
              <Sparkle className="size-3.5" />
              Ask Lightcash
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 @xl:gap-3">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="min-w-0 rounded-xl border border-line p-2.5 @lg:p-3">
                <p className="truncate text-[0.65rem] font-medium text-ink-soft @lg:text-[0.7rem]">{kpi.label}</p>
                <p className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
                  <span className="text-lg font-medium tracking-tight @lg:text-2xl">{kpi.value}</span>
                  {kpi.unit && <span className="text-[0.7rem] text-mute">{kpi.unit}</span>}
                  <span className="rounded bg-good-soft px-1 text-[0.6rem] font-medium text-good">{kpi.change}</span>
                </p>
                <p className="mt-1 hidden truncate text-[0.6rem] text-mute @lg:block">{kpi.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-line p-3">
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
        </div>
      </div>
    </div>
  );
}
