// Example data for the product mock: month-end cash, actual to today, then a 90-day projection.
const actual = [
  { month: "May", value: 41_200 },
  { month: "Jun", value: 44_800 },
  { month: "Jul", value: 43_100 },
  { month: "Aug", value: 49_600 },
  { month: "Sep", value: 55_700 },
  { month: "Oct", value: 58_030 },
];

const projected = [
  { month: "Nov", value: 61_400, low: 57_800, high: 65_000 },
  { month: "Dec", value: 57_900, low: 52_600, high: 63_200 },
  { month: "Jan", value: 63_500, low: 56_200, high: 70_800 },
];

const yMin = 30_000;
const yMax = 75_000;
const ticks = [30_000, 45_000, 60_000, 75_000];
const months = [...actual, ...projected].map((d) => d.month);
const today = actual.length - 1;
const last = actual[today];
const k = (v: number) => `$${Math.round(v / 1000)}k`;

/** Chart geometry for a given viewBox. The compact one keeps labels legible in narrow cards. */
function layout(W: number, H: number) {
  const pad = { top: 26, right: 14, bottom: 28, left: 42 };
  const x = (i: number) => pad.left + (i / (months.length - 1)) * (W - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - (v - yMin) / (yMax - yMin)) * (H - pad.top - pad.bottom);
  const actualLine = actual.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join("");
  return {
    W,
    H,
    pad,
    x,
    y,
    actualLine,
    actualArea: `${actualLine}L${x(today)},${y(yMin)}L${x(0)},${y(yMin)}Z`,
    projectedLine:
      `M${x(today)},${y(last.value)}` + projected.map((d, i) => `L${x(today + 1 + i)},${y(d.value)}`).join(""),
    band:
      `M${x(today)},${y(last.value)}` +
      projected.map((d, i) => `L${x(today + 1 + i)},${y(d.high)}`).join("") +
      [...projected]
        .reverse()
        .map((d, i) => `L${x(months.length - 1 - i)},${y(d.low)}`)
        .join("") +
      "Z",
  };
}

const full = layout(600, 220);
const compact = layout(330, 210);

/**
 * `compact` uses a narrower viewBox so the labels stay readable in a small card. `draw` clips the series
 * to a rect that src/lib/motion.ts widens from 0, so the lines draw in left to right when the chart
 * scrolls into view. Only one chart on the page should use it (the clip id is fixed).
 */
export function CashChart({ compact: small = false, draw = false }: { compact?: boolean; draw?: boolean }) {
  const { W, H, pad, x, y, actualLine, actualArea, projectedLine, band } = small ? compact : full;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="cash-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-peri-deep)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--color-peri-deep)" stopOpacity="0" />
        </linearGradient>
        {draw && (
          <clipPath id="cash-draw">
            <rect data-draw x="0" y="0" width={W} height={H} />
          </clipPath>
        )}
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth="1" />
          <text x={pad.left - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill="var(--color-mute)">
            {k(t)}
          </text>
        </g>
      ))}

      {months.map((m, i) => (
        <text
          key={m}
          x={x(i)}
          y={H - 8}
          textAnchor="middle"
          fontSize="11"
          fill={i === today ? "var(--color-ink)" : "var(--color-mute)"}
          fontWeight={i === today ? 600 : 400}
        >
          {m}
        </text>
      ))}

      <g clipPath={draw ? "url(#cash-draw)" : undefined}>
        <path d={band} fill="var(--color-peri-deep)" fillOpacity="0.1" />
        <path d={actualArea} fill="url(#cash-area)" />
        <path d={actualLine} fill="none" stroke="var(--color-peri-deep)" strokeWidth="2" strokeLinejoin="round" />
        <path
          d={projectedLine}
          fill="none"
          stroke="var(--color-peri-deep)"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinejoin="round"
        />

        <line
          x1={x(today)}
          x2={x(today)}
          y1={pad.top - 6}
          y2={y(yMin)}
          stroke="var(--color-ink)"
          strokeOpacity="0.25"
          strokeDasharray="2 3"
        />
        <circle cx={x(today)} cy={y(last.value)} r="5" fill="var(--color-peri-deep)" stroke="var(--color-paper)" strokeWidth="2" />
        <text x={x(today) - 8} y={pad.top - 10} textAnchor="end" fontSize="11" fontWeight="600" fill="var(--color-ink)">
          $58.0k today
        </text>
      </g>
    </svg>
  );
}
