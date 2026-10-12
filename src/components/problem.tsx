import { CircleCheck, CircleHelp, FileText, Wallet, Zap, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/section";
import { wrap } from "@/lib/site";

type Tone = "plain" | "late" | "live";
type Moment = { at: number; label: string; icon: LucideIcon; tone?: Tone; above?: boolean };
type Row = { name: string; note: string; tone: Exclude<Tone, "plain">; moments: Moment[]; blind?: boolean; pulses?: number[] };

// One month on a shared axis. "Decision made" sits at the same point on both rows, mid-month,
// so the eye can compare when the numbers arrive. Positions are fractions of the month.
const DECISION = 0.5;

const rows: Row[] = [
  {
    name: "Monthly spreadsheet",
    note: "Numbers arrive a month late",
    tone: "late",
    blind: true,
    moments: [
      { at: 0, label: "Money moves", icon: Wallet },
      { at: DECISION, label: "Decision made", icon: CircleHelp, tone: "late" },
      { at: 1, label: "Numbers arrive", icon: FileText, tone: "late", above: true },
    ],
  },
  {
    name: "Lightcash",
    note: "Numbers update as money moves",
    tone: "live",
    moments: [
      { at: 0, label: "Money moves", icon: Wallet },
      { at: 0.07, label: "Numbers update", icon: Zap, tone: "live", above: true },
      { at: DECISION, label: "Decision made", icon: CircleCheck, tone: "live" },
    ],
    // Every new transaction updates the numbers, all month long.
    pulses: Array.from({ length: 14 }, (_, i) => 0.07 + i * 0.0715),
  },
];

const axis = [
  { at: 0, label: "Day 1" },
  { at: 0.5, label: "Day 15" },
  { at: 1, label: "Day 30" },
];

const tones = {
  plain: { dot: "bg-white", text: "text-white/80", icon: "text-white/60" },
  late: { dot: "bg-ember", text: "text-[#ff9a82]", icon: "text-[#ff9a82]" },
  live: { dot: "bg-peri", text: "text-peri", icon: "text-peri" },
};

/** Labels near either end hang inward so they never overflow the track. */
const anchor = (at: number) => (at < 0.15 ? "-left-2" : at > 0.85 ? "-right-2" : "left-0 -translate-x-1/2");

function Track({ row }: { row: Row }) {
  const line = row.tone === "live" ? "bg-peri" : "bg-white/70";
  return (
    <div className="relative h-28">
      {/* The month, then what has happened so far (drawn by motion.ts). */}
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />
      {row.blind && (
        <div
          data-lag-line
          className="absolute inset-x-0 top-1/2 h-9 origin-left -translate-y-1/2 rounded-full border border-ember/30 bg-[repeating-linear-gradient(135deg,rgb(224_86_59/0.22)_0_6px,transparent_6px_12px)]"
        />
      )}
      <div data-lag-line className={`absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 ${line}`} />
      {row.blind && (
        <span
          data-moment={0.25}
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink px-2 text-[0.7rem] tracking-wider text-[#ff9a82] uppercase max-sm:hidden"
        >
          Flying blind
        </span>
      )}

      {row.pulses?.map((at) => (
        <span
          key={at}
          data-pulse={at}
          className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-peri shadow-[0_0_10px_2px_rgb(154_165_255/0.7)]"
          style={{ left: `${at * 100}%` }}
        />
      ))}

      {row.moments.map((m) => {
        const tone = tones[m.tone ?? "plain"];
        const Icon = m.icon;
        return (
          <div key={m.label} data-moment={m.at} className="absolute inset-y-0" style={{ left: `${m.at * 100}%` }}>
            <span className={`absolute top-1/2 left-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-ink ${tone.dot}`} />
            <span
              className={`absolute inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[0.7rem] whitespace-nowrap backdrop-blur sm:text-[0.8rem] ${tone.text} ${
                m.above ? "bottom-[calc(50%+1.1rem)]" : "top-[calc(50%+1.1rem)]"
              } ${anchor(m.at)}`}
            >
              <Icon className={`size-3.5 shrink-0 max-sm:hidden ${tone.icon}`} aria-hidden="true" />
              {m.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RowLabel({ row, className = "" }: { row: Row; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[1.05rem] font-medium text-white">{row.name}</p>
      <p className={`mt-1 text-sm ${tones[row.tone].text}`}>{row.note}</p>
    </div>
  );
}

/**
 * The month played out twice on one axis. src/lib/motion.ts plays it on scroll: a playhead sweeps
 * across, the blind spot and the live line grow behind it, and each moment lights up as it is reached.
 */
function LagDiagram() {
  return (
    <div
      data-lag
      role="img"
      aria-label="Over one month: with a monthly spreadsheet, the decision is made mid-month, before the numbers arrive at the end of the month. With Lightcash, the numbers update as money moves, so the decision is made with current numbers."
      className="relative mt-14 overflow-hidden rounded-[28px] bg-ink px-5 py-8 text-white shadow-[0_30px_80px_-30px_rgb(13_13_18/0.55)] sm:px-10 sm:py-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgb(91_108_240/0.22),transparent_60%),radial-gradient(50%_70%_at_0%_100%,rgb(224_86_59/0.16),transparent_60%)]" />

      <div className="relative grid gap-x-10 lg:grid-cols-[14rem_1fr]">
        {/* Row labels, aligned to the tracks on wide screens. */}
        <div className="hidden lg:grid lg:grid-rows-[2rem_7rem_7rem] lg:gap-y-6">
          <span />
          {rows.map((row) => (
            <RowLabel key={row.name} row={row} className="self-center" />
          ))}
        </div>

        <div className="relative grid grid-rows-[2rem_auto_auto] gap-y-6 sm:mx-2">
          {/* Axis */}
          <div className="relative border-b border-white/10 text-xs text-white/50">
            {axis.map((a) => (
              <span
                key={a.label}
                className={`absolute top-0 whitespace-nowrap ${a.at === 0 ? "left-0" : a.at === 1 ? "right-0" : "left-1/2 -translate-x-1/2"}`}
              >
                {a.label}
              </span>
            ))}
          </div>

          {/* Both decisions happen at the same moment. */}
          <div
            className="pointer-events-none absolute top-8 bottom-0 border-l border-dashed border-white/25"
            style={{ left: `${DECISION * 100}%` }}
          />
          {/* The playhead that sweeps across when the diagram plays. */}
          <div data-playhead className="pointer-events-none absolute inset-y-0 left-0 w-full opacity-0">
            <div className="absolute inset-y-0 left-0 w-px bg-white shadow-[0_0_14px_3px_rgb(255_255_255/0.45)]" />
          </div>

          {rows.map((row) => (
            <div key={row.name}>
              <RowLabel row={row} className="mb-1 lg:hidden" />
              <Track row={row} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Problem() {
  return (
    <section className={`${wrap} py-24 sm:py-32`}>
      <div data-reveal className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
        <SectionHeading>You shouldn’t have to wait to know your numbers.</SectionHeading>
        <div className="grid max-w-xl gap-4 text-[1.05rem] leading-relaxed text-pretty text-ink-soft">
          <p>
            Most small businesses only see their finances in the rearview mirror: a monthly spreadsheet, a quarterly
            report, an accountant’s bill. By the time the numbers arrive, the decision has already been made.
          </p>
          <p className="text-ink">Lightcash puts your finances in real time, so you always know where you stand.</p>
        </div>
      </div>
      <LagDiagram />
    </section>
  );
}
