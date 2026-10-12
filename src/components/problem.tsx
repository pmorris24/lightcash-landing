import { SectionHeading } from "@/components/section";
import { wrap } from "@/lib/site";

type Moment = { at: number; label: string; tone?: "late" | "live" };

// One shared time axis: "Decision made" sits at the same point on both rows, so the eye can compare
// when the numbers arrive. Positions are fractions of the axis.
const rows: { name: string; moments: Moment[] }[] = [
  {
    name: "The monthly spreadsheet",
    moments: [
      { at: 0, label: "Money moves" },
      { at: 0.42, label: "Decision made" },
      { at: 1, label: "Numbers arrive", tone: "late" },
    ],
  },
  {
    name: "Lightcash",
    moments: [
      { at: 0, label: "Money moves" },
      { at: 0.05, label: "Numbers update", tone: "live" },
      { at: 0.42, label: "Decision made" },
    ],
  },
];

const tones = {
  late: { dot: "bg-ember", text: "text-ember" },
  live: { dot: "bg-peri-deep", text: "text-peri-deep" },
  plain: { dot: "bg-ink", text: "text-ink-soft" },
};

/**
 * Two timelines on one axis. src/lib/motion.ts plays it: the lines draw at the same speed and each
 * moment lights up as its line reaches it, so the old way's numbers land after the decision.
 */
function LagDiagram() {
  return (
    <div
      data-lag
      role="img"
      aria-label="With a monthly spreadsheet, the decision is made before the numbers arrive. With Lightcash, the numbers update as money moves, before the decision."
      className="dashed mt-14 grid gap-12 rounded-3xl bg-cloud/60 px-5 py-10 sm:px-10 sm:py-12"
    >
      {rows.map((row) => (
        <div key={row.name}>
          <p className="text-[0.95rem] font-medium">{row.name}</p>
          {/* Numbers sit above the line, everything else below. */}
          <div className="relative mt-3 h-24 sm:mx-2">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
            <div
              data-lag-line
              className={`absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 ${row.name === "Lightcash" ? "bg-peri-deep" : "bg-ink/70"}`}
            />
            {row.moments.map((m) => {
              const tone = tones[m.tone ?? "plain"];
              // Labels near either end hang inward so they never overflow the row.
              const anchor = m.at < 0.15 ? "-left-1.5" : m.at > 0.85 ? "-right-1.5 text-right" : "left-0 -translate-x-1/2";
              const side = m.tone ? "bottom-[calc(50%+0.9rem)]" : "top-[calc(50%+0.9rem)]";
              return (
                <div key={m.label} data-moment={m.at} className="absolute inset-y-0" style={{ left: `${m.at * 100}%` }}>
                  <span
                    className={`absolute top-1/2 left-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-cloud ${tone.dot}`}
                  />
                  <span
                    className={`absolute whitespace-nowrap text-xs sm:text-sm ${side} ${anchor} ${m.tone ? `font-medium ${tone.text}` : "text-ink-soft"}`}
                  >
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
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
