"use client";

import { BookOpen, ChartLine, FileText, LayoutDashboard, PenOff, RefreshCw, Sparkles, type LucideIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { siChase, siGusto, siQuickbooks, siShopify, siStripe, type SimpleIcon } from "simple-icons";
import { ArrowRight, Check } from "@/components/icons";
import { LogoTile } from "@/components/logo";
import { SectionHeading, Soft } from "@/components/section";
import { cents } from "@/lib/demo";
import { cn } from "@/lib/utils";
import { wrap } from "@/lib/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// TODO: check this against how the product really works before launch. It describes the pipeline at the
// level the rest of the page already promises (live sync, automatic categories, one source of truth).

type Source = { id: string; name: string; logo: SimpleIcon; idle: string; says: string; wordmark?: boolean };
type Output = { id: string; name: string; icon: LucideIcon; says: string };

const sources: Source[] = [
  { id: "chase", name: "Chase", logo: siChase, idle: "Checking ··4821", says: "Bank and card transactions, as the bank posts them." },
  { id: "stripe", name: "Stripe", logo: siStripe, idle: "Payments", says: "Charges, payouts, fees and refunds." },
  { id: "shopify", name: "Shopify", logo: siShopify, idle: "Store", says: "Orders, payouts and refunds from your store." },
  { id: "quickbooks", name: "QuickBooks", logo: siQuickbooks, idle: "Invoices & bills", says: "Open invoices and bills, before the money moves." },
  { id: "gusto", name: "Gusto", logo: siGusto, idle: "Payroll", says: "Payroll runs and taxes, including scheduled ones.", wordmark: true },
];

const outputs: Output[] = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, says: "Live cash, burn and runway across every account." },
  { id: "projections", name: "Projections", icon: ChartLine, says: "Runway, what’s coming up, and what-ifs." },
  { id: "reports", name: "Reports", icon: FileText, says: "P&L, cash flow and balance sheet, on demand." },
  { id: "ask", name: "Ask Lightcash", icon: Sparkles, says: "Plain-English answers from your live numbers." },
];

// Transactions the diagram keeps sending through, one every few seconds. Amounts match the rest of the page.
const events = [
  { source: "stripe", what: "Stripe payout", category: "Income", amount: 6_940.2, output: "dashboard" },
  { source: "chase", what: "AWS", category: "Software", amount: -1_240, output: "reports" },
  { source: "quickbooks", what: "Acme Co. invoice", category: "Matched · paid", amount: 4_800, output: "projections" },
  { source: "gusto", what: "Payroll, Oct 15", category: "Payroll · scheduled", amount: -18_400, output: "projections" },
  { source: "shopify", what: "Shopify payout", category: "Income", amount: 2_315.4, output: "dashboard" },
  { source: "chase", what: "Figma", category: "Software", amount: -75, output: "ask" },
];

const steps = ["Match", "Categorize", "Reconcile"];
const CYCLE = 3400;

const features = [
  { icon: PenOff, title: "No manual entry", body: "Connect each account once. Nothing to upload, export or type in." },
  { icon: BookOpen, title: "One source of truth", body: "Every view reads from the same ledger, so the numbers never disagree." },
  { icon: RefreshCw, title: "Live, not monthly", body: "Every view updates as money moves, not when a bookkeeper gets to it." },
];

type Geometry = { w: number; h: number; inbound: Record<string, string>; outbound: Record<string, string>; ports: { x: number; y: number }[] };

/** A horizontal S-curve between two points. */
const curve = (ax: number, ay: number, bx: number, by: number) => {
  const dx = (bx - ax) * 0.55;
  return `M${ax},${ay} C${ax + dx},${ay} ${bx - dx},${by} ${bx},${by}`;
};

/**
 * How Lightcash works, as a live diagram: your tools feed one ledger, and every view reads from it.
 * A transaction runs through every few seconds (pulse in, matched and categorized in the core, pulse out
 * to the view it changes). Clicking a source sends one of its transactions; hovering pauses and explains.
 *
 * On large screens the connectors are drawn between the measured cards; on small screens the three
 * groups stack with a pulse running down between them.
 */
export function Architecture() {
  const frame = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<string, HTMLElement>());
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  // Newest last. The starting rows are history, so they don't animate (negative keys).
  const [log, setLog] = useState([
    { key: -3, ev: 3 },
    { key: -2, ev: 4 },
    { key: -1, ev: 5 },
  ]);
  const [count, setCount] = useState(1_284);
  const nextKey = useRef(0);
  const nextEvent = useRef(0);
  const motion = !useReducedMotion();

  const send = (ev: number) => {
    setLog((now) => [...now.slice(-2), { key: nextKey.current++, ev }]);
    setCount((c) => c + 1);
  };

  // Lay the connectors out between the measured cards.
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      if (!wide.matches || !core.current) return setGeo(null);
      const f = el.getBoundingClientRect();
      const rect = (node: HTMLElement) => {
        const r = node.getBoundingClientRect();
        return { l: r.left - f.left, r: r.right - f.left, t: r.top - f.top, h: r.height, cy: r.top - f.top + r.height / 2 };
      };
      const c = rect(core.current);
      const portY = (i: number, n: number, spread: number) => c.t + c.h * (0.5 - spread / 2 + (spread * i) / (n - 1));
      const ports: { x: number; y: number }[] = [];
      const inbound = Object.fromEntries(
        sources.map((s, i) => {
          const a = rect(cards.current.get(s.id)!);
          const y = portY(i, sources.length, 0.5);
          ports.push({ x: c.l, y });
          return [s.id, curve(a.r, a.cy, c.l, y)];
        }),
      );
      const outbound = Object.fromEntries(
        outputs.map((o, i) => {
          const b = rect(cards.current.get(o.id)!);
          const y = portY(i, outputs.length, 0.4);
          ports.push({ x: c.r, y });
          return [o.id, curve(c.r, y, b.l, b.cy)];
        }),
      );
      setGeo({ w: f.width, h: f.height, inbound, outbound, ports });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    wide.addEventListener("change", measure);
    document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", measure);
    };
  }, []);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Send the next transaction every few seconds while on screen, unless paused or being read.
  const running = motion && visible && !paused && hot === null;
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => send(nextEvent.current++ % events.length), log.at(-1)!.key < 0 ? 900 : CYCLE);
    return () => clearTimeout(timer);
  }, [running, log]);

  const current = log.at(-1)!;
  const ev = events[current.ev];
  const fresh = current.key >= 0 && motion;
  // Inline animations restart whenever the current transaction changes (they're keyed on it).
  const play = (animation: string): CSSProperties | undefined => (fresh ? { animation } : undefined);

  const litIn = (id: string) => hot === id || hot === "core" || ev.source === id;
  const litOut = (id: string) => hot === id || hot === "core" || ev.output === id;
  const said = [...sources, ...outputs].find((c) => c.id === hot)?.says;

  const register = (id: string) => (el: HTMLElement | null) => {
    if (el) cards.current.set(id, el);
    else cards.current.delete(id);
  };
  const hover = (id: string) => ({
    onPointerEnter: () => setHot(id),
    onPointerLeave: () => setHot(null),
    onFocus: () => setHot(id),
    onBlur: () => setHot(null),
  });

  /** Clicking a source sends its next transaction through. */
  const fire = (source: string) => {
    const mine = events.map((e, i) => ({ e, i })).filter(({ e }) => e.source === source);
    const pick = mine.find(({ i }) => i !== current.ev) ?? mine[0];
    send(pick.i);
  };

  return (
    <section id="architecture" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <div data-reveal className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <SectionHeading>
          One ledger underneath. <Soft>Every number traces back to it.</Soft>
        </SectionHeading>
        <div className="lg:pt-2">
          <p className="text-[1.1rem] leading-relaxed text-pretty text-ink-soft">
            Lightcash connects to your bank, payments, accounting and payroll, then matches, categorizes and reconciles
            every transaction into one ledger. Your dashboard, projections and reports all read from it, so they’re always
            live and never disagree.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-medium">
            <a href="#how-it-works" className="group inline-flex items-center gap-2">
              How it works <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#features" className="group inline-flex items-center gap-2">
              Features <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>

      <div data-reveal className="relative isolate mt-14 overflow-hidden rounded-[28px] border border-line bg-[#f8f8fc] lg:mt-16">
        {/* Stage: a fading dot grid and a soft glow behind the core. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(#d4d4e2_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,black,transparent)]"
        />
        <div aria-hidden="true" className="absolute top-[42%] left-1/2 -z-10 size-[30rem] -translate-1/2 rounded-full bg-peri/30 blur-[90px]" />

        <p className="sr-only">
          Your bank, Stripe, Shopify, QuickBooks and Gusto feed Lightcash, which matches, categorizes and reconciles every
          transaction into one ledger. The dashboard, projections, reports and Ask Lightcash all read from that ledger.
        </p>

        <div ref={frame} className="relative px-4 py-8 sm:px-8 lg:px-12 lg:py-12" onPointerLeave={() => setHot(null)}>
          {geo && (
            <svg
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={geo.w}
              height={geo.h}
              viewBox={`0 0 ${geo.w} ${geo.h}`}
              aria-hidden="true"
            >
              <defs>
                <filter id="arch-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
              {[
                ...sources.map((s, i) => ({ id: s.id, d: geo.inbound[s.id], lit: litIn(s.id), active: ev.source === s.id, delay: 0, i })),
                ...outputs.map((o, i) => ({ id: o.id, d: geo.outbound[o.id], lit: litOut(o.id), active: ev.output === o.id, delay: 1.8, i: i + 5 })),
              ].map((e) => (
                <g key={e.id}>
                  <path
                    d={e.d}
                    fill="none"
                    stroke={e.lit ? "var(--color-peri-deep)" : "#d3d2e6"}
                    strokeOpacity={e.lit ? 0.55 : 1}
                    strokeWidth="1.5"
                    className="transition-[stroke,stroke-opacity] duration-500"
                  />
                  {/* Ambient light running down every line. */}
                  {motion && (
                    <path
                      d={e.d}
                      pathLength={100}
                      fill="none"
                      stroke="var(--color-peri-deep)"
                      strokeOpacity="0.35"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="6 100"
                      style={{ animation: `light-pulse 3.6s linear ${-e.i * 0.65}s infinite` }}
                    />
                  )}
                  {/* The current transaction: a bright pulse with a glow. */}
                  {fresh && e.active && (
                    <g key={current.key}>
                      <path
                        d={e.d}
                        pathLength={100}
                        fill="none"
                        stroke="var(--color-peri)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray="16 100"
                        filter="url(#arch-glow)"
                        style={{ animation: `light-pulse 0.9s ease-in ${e.delay}s both` }}
                      />
                      <path
                        d={e.d}
                        pathLength={100}
                        fill="none"
                        stroke="var(--color-peri-deep)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="16 100"
                        style={{ animation: `light-pulse 0.9s ease-in ${e.delay}s both` }}
                      />
                    </g>
                  )}
                </g>
              ))}
              {geo.ports.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--color-peri-deep)" stroke="#f8f8fc" strokeWidth="2" />
              ))}
            </svg>
          )}

          <div className="relative grid gap-2 lg:grid-cols-[minmax(0,14.5rem)_minmax(2.5rem,1fr)_minmax(0,19.5rem)_minmax(2.5rem,1fr)_minmax(0,15rem)] lg:gap-0">
            {/* 01 Connect */}
            <Column n="01" label="Connect">
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {sources.map((s) => {
                  const active = fresh && ev.source === s.id;
                  return (
                    <button
                      key={s.id}
                      ref={register(s.id)}
                      type="button"
                      onClick={() => fire(s.id)}
                      {...hover(s.id)}
                      aria-label={`${s.name}: send a transaction through`}
                      className={cn(
                        "group flex w-full min-w-0 items-center gap-3 rounded-2xl border bg-paper p-2 pr-3 text-left shadow-[0_1px_2px_rgb(13_13_18/0.04),0_10px_24px_-16px_rgb(13_13_18/0.3)] transition-[border-color,box-shadow] duration-300",
                        hot === s.id || active ? "border-peri-deep/60" : "border-line hover:border-peri-deep/40",
                      )}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-paper">
                        <svg viewBox="0 0 24 24" className={s.wordmark ? "size-9" : "size-5"} aria-hidden="true">
                          <path d={s.logo.path} fill={`#${s.logo.hex}`} />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="flex items-center gap-1.5 text-[0.92rem] font-medium">
                          {s.name}
                          <span className="size-1.5 rounded-full bg-good" aria-hidden="true" />
                        </span>
                        {active ? (
                          <span key={current.key} className="block truncate text-[0.72rem] tabular-nums" style={play("arrive .4s ease-out both")}>
                            <span className={ev.amount > 0 ? "text-good" : "text-ink"}>{cents(ev.amount)}</span>
                            <span className="text-mute"> · just now</span>
                          </span>
                        ) : (
                          <span className="block truncate text-[0.72rem] text-mute">{s.idle}</span>
                        )}
                      </span>
                      <span className="text-[0.65rem] text-mute opacity-0 transition-opacity group-hover:opacity-100 max-lg:hidden">Send</span>
                    </button>
                  );
                })}
              </div>
            </Column>

            <Down />
            <span className="hidden lg:block" aria-hidden="true" />

            {/* 02 Reconcile: the core. */}
            <Column n="02" label="Reconcile">
              <div
                ref={core}
                tabIndex={0}
                {...hover("core")}
                className="rounded-[23px] bg-[linear-gradient(150deg,#9aa5ff_0%,rgb(154_165_255/0.15)_35%,rgb(224_86_59/0.15)_70%,#e0563b_100%)] p-px shadow-[0_30px_70px_-30px_rgb(13_13_18/0.65)] outline-none focus-visible:ring-2 focus-visible:ring-peri-deep/50"
              >
                <div className="rounded-[22px] bg-ink p-4 text-paper">
                  <div className="flex items-center gap-2.5">
                    <LogoTile className="size-8" />
                    <span className="leading-tight">
                      <span className="block text-[0.95rem] font-medium">Lightcash</span>
                      <span className="block text-[0.68rem] text-white/50">Northwind Studio ledger</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      aria-label={paused ? "Resume the live demo" : "Pause the live demo"}
                      className="ml-auto flex h-6 items-center gap-1.5 rounded-full bg-white/10 px-2.5 text-[0.68rem] text-white/80 transition-colors hover:bg-white/15"
                    >
                      <span className={cn("size-1.5 rounded-full", paused || !motion ? "bg-white/40" : "animate-pulse bg-[#6ee7a0]")} />
                      {paused ? "Paused" : "Live"}
                    </button>
                  </div>

                  <ol className="mt-4 grid grid-cols-3 gap-1.5" aria-label="Every transaction is">
                    {steps.map((step, i) => (
                      <li
                        key={`${step}-${current.key}`}
                        className="flex items-center justify-center gap-1 rounded-lg bg-white/[0.08] py-1.5 text-[0.68rem] text-white/50"
                        style={play(`stage .25s ease-out ${0.9 + i * 0.28}s both`)}
                      >
                        <Check className="size-3" />
                        {step}
                      </li>
                    ))}
                  </ol>

                  <p className="mt-4 mb-1.5 text-[0.65rem] tracking-wider text-white/40 uppercase">Ledger</p>
                  <ul className="grid gap-1">
                    {[...log].reverse().map((row, i) => {
                      const e = events[row.ev];
                      return (
                        <li
                          key={row.key}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-2 text-[0.75rem] transition-colors duration-700",
                            i === 0 ? "bg-white/[0.07]" : "bg-transparent",
                          )}
                          style={i === 0 && row.key >= 0 && motion ? { animation: "arrive .4s ease-out .5s both" } : undefined}
                        >
                          <span className="min-w-0 flex-1 truncate">{e.what}</span>
                          <span
                            className="shrink-0 rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[0.62rem] text-white/60"
                            style={i === 0 && row.key >= 0 && motion ? { animation: "arrive .3s ease-out 1.75s both" } : undefined}
                          >
                            {e.category}
                          </span>
                          <span className={cn("w-[5.2rem] shrink-0 text-right tabular-nums", e.amount > 0 ? "text-[#6ee7a0]" : "text-white/85")}>
                            {cents(e.amount)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-3 flex min-h-8 items-center gap-2 border-t border-white/10 pt-3 text-[0.7rem] text-white/55" aria-live="polite">
                    {said ?? (
                      <>
                        <span className="tabular-nums">{count.toLocaleString("en-US")} transactions</span>
                        <span className="text-white/25">·</span>
                        <span className="flex items-center gap-1 text-[#6ee7a0]">
                          <Check className="size-3" /> Balanced
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Column>

            <Down />
            <span className="hidden lg:block" aria-hidden="true" />

            {/* 03 See */}
            <Column n="03" label="See">
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {outputs.map((o) => {
                  const Icon = o.icon;
                  const target = fresh && ev.output === o.id;
                  return (
                    <button
                      key={o.id}
                      ref={register(o.id)}
                      type="button"
                      {...hover(o.id)}
                      className={cn(
                        "w-full min-w-0 rounded-2xl border bg-paper px-3.5 py-3 text-left shadow-[0_1px_2px_rgb(13_13_18/0.04),0_10px_24px_-16px_rgb(13_13_18/0.3)] transition-[border-color] duration-300",
                        hot === o.id ? "border-peri-deep/60" : "border-line hover:border-peri-deep/40",
                      )}
                      style={target ? { animation: "received 1.1s ease-out 2.65s both" } : undefined}
                    >
                      <span className="flex items-center gap-1.5 text-[0.72rem] text-mute">
                        <Icon className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                        {o.name}
                        {target && (
                          <span key={current.key} className="ml-auto text-[0.65rem] text-peri-deep" style={{ animation: "arrive .3s ease-out 2.65s both" }}>
                            Updated
                          </span>
                        )}
                      </span>
                      <Preview id={o.id} />
                    </button>
                  );
                })}
              </div>
            </Column>
          </div>
        </div>

        <ul className="relative grid border-t border-line bg-paper/70 backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-line">
          {features.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3.5 px-5 py-5 max-sm:border-t max-sm:border-line max-sm:first:border-t-0 sm:px-7 sm:py-6">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-peri-deep/10 text-peri-deep">
                <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium">{title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-pretty text-mute">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Column({ n, label, children }: { n: string; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="mb-3 flex items-center gap-2 px-1 text-[0.68rem] font-medium tracking-wider text-mute uppercase lg:mb-5">
        <span className="text-peri-deep tabular-nums">{n}</span>
        {label}
      </p>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

/** Small screens: a line with light running down it, between the groups. */
function Down() {
  return (
    <div aria-hidden="true" className="relative mx-auto my-2 h-12 w-px overflow-hidden bg-dash lg:hidden">
      <span className="absolute inset-x-0 -top-4 h-4 animate-[drop_1.6s_linear_infinite] bg-[linear-gradient(transparent,var(--color-peri-deep),transparent)] motion-reduce:hidden" />
    </div>
  );
}

/** The little product glimpse inside each output card. */
function Preview({ id }: { id: string }) {
  if (id === "ask") {
    return (
      <span className="mt-2 grid gap-1 text-[0.72rem] leading-snug">
        <span className="justify-self-end rounded-lg rounded-br-sm bg-ink px-2 py-1 text-paper">Can I afford a hire in Dec?</span>
        <span className="justify-self-start rounded-lg rounded-bl-sm bg-peri-deep/10 px-2 py-1 text-peri-deep">Yes. Runway goes to 11.6 months.</span>
      </span>
    );
  }
  const values = {
    dashboard: { big: "$58,030", small: "cash on hand" },
    projections: { big: "14.2 mo", small: "runway" },
    reports: { big: "$17,100", small: "net income · Sep" },
  }[id]!;
  return (
    <span className="mt-1.5 flex items-end justify-between gap-3">
      <span className="leading-tight">
        <span className="block text-[1.15rem] font-medium tracking-[-0.01em] tabular-nums">{values.big}</span>
        <span className="block text-[0.68rem] text-mute">{values.small}</span>
      </span>
      <svg viewBox="0 0 64 26" className="h-[26px] w-16 shrink-0 overflow-visible" aria-hidden="true">
        {id === "dashboard" && (
          <>
            <path d="M0,20 L13,16 L26,18 L38,11 L51,6 L64,4 L64,26 L0,26Z" fill="var(--color-peri-deep)" fillOpacity="0.12" />
            <path d="M0,20 L13,16 L26,18 L38,11 L51,6 L64,4" fill="none" stroke="var(--color-peri-deep)" strokeWidth="1.6" strokeLinejoin="round" />
          </>
        )}
        {id === "projections" && (
          <>
            <path d="M0,19 L12,15 L24,16 L34,10" fill="none" stroke="var(--color-peri-deep)" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M34,10 L46,7 L56,11 L64,5" fill="none" stroke="var(--color-peri-deep)" strokeWidth="1.6" strokeDasharray="3 2.5" />
            <circle cx="34" cy="10" r="2.4" fill="var(--color-peri-deep)" />
          </>
        )}
        {id === "reports" &&
          [22, 9, 6, 14].map((h, i) => (
            <rect key={i} x={i * 17} y={26 - h} width="11" height={h} rx="2" fill={i === 0 ? "var(--color-peri-deep)" : "var(--color-ember)"} fillOpacity={i === 0 ? 0.9 : 0.55} />
          ))}
      </svg>
    </span>
  );
}
