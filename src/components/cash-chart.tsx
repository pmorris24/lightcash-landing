"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Scenario } from "@/lib/demo";

// Example data for the product mock: month-end cash, actual to today, then a 90-day projection.
const actual = [
  { month: "May", value: 41_200 },
  { month: "Jun", value: 44_800 },
  { month: "Jul", value: 43_100 },
  { month: "Aug", value: 49_600 },
  { month: "Sep", value: 55_700 },
  { month: "Oct", value: 58_030 },
];

type Point = { month: string; value: number; low: number; high: number };

// The projection, as things are and with a hire in December (see `scenarios` in src/lib/demo.ts).
const projections: Record<Scenario, Point[]> = {
  base: [
    { month: "Nov", value: 61_400, low: 57_800, high: 65_000 },
    { month: "Dec", value: 57_900, low: 52_600, high: 63_200 },
    { month: "Jan", value: 63_500, low: 56_200, high: 70_800 },
  ],
  hire: [
    { month: "Nov", value: 61_400, low: 57_800, high: 65_000 },
    { month: "Dec", value: 52_400, low: 47_600, high: 57_200 },
    { month: "Jan", value: 51_800, low: 45_000, high: 58_600 },
  ],
};

const yMin = 30_000;
const yMax = 75_000;
const ticks = [30_000, 45_000, 60_000, 75_000];
const months = [...actual, ...projections.base].map((d) => d.month);
const today = actual.length - 1;
const last = actual[today];
const k = (v: number) => `$${Math.round(v / 1000)}k`;
const k1 = (v: number) => `$${(v / 1000).toFixed(1)}k`;

/** Chart geometry for a given viewBox. The compact one keeps labels legible in narrow cards. */
function layout(W: number, H: number, projected: Point[]) {
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

const geometry = {
  full: { base: layout(600, 220, projections.base), hire: layout(600, 220, projections.hire) },
  compact: { base: layout(330, 210, projections.base), hire: layout(330, 210, projections.hire) },
};

/** Paths morph between scenarios where the browser can transition `d` (the attribute is the fallback). */
const morph = (d: string): CSSProperties => ({ d: `path("${d}")` }) as CSSProperties;

/**
 * Month-end cash with a 90-day projection. Pointing at it, or focusing it and using the arrow keys,
 * reads out each month. `compact` uses a narrower viewBox so the labels stay readable in a small card.
 * `draw` clips the series to a rect that src/lib/motion.ts widens from 0, so the lines draw in left to
 * right when the chart scrolls into view. `scenario` switches the projection.
 */
export function CashChart({
  compact: small = false,
  draw = false,
  scenario = "base",
}: {
  compact?: boolean;
  draw?: boolean;
  scenario?: Scenario;
}) {
  const { W, H, pad, x, y, actualLine, actualArea, projectedLine, band } = geometry[small ? "compact" : "full"][scenario];
  const projected = projections[scenario];
  const points = [...actual.map((d) => ({ ...d, low: d.value, high: d.value })), ...projected];
  const [active, setActive] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const id = useId();

  const pick = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    const px = ((event.clientX - box.left) / box.width) * W;
    const i = Math.round(((px - pad.left) / (W - pad.left - pad.right)) * (months.length - 1));
    setActive(Math.max(0, Math.min(months.length - 1, i)));
  };

  const onKey = (event: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    setActive((i) => Math.max(0, Math.min(months.length - 1, (i ?? today) + step)));
  };

  const point = active === null ? null : points[active];
  const isProjected = active !== null && active > today;
  // Tooltip box: flips to the left of the point in the right half of the chart.
  const tipW = isProjected ? 118 : 86;
  const tipH = isProjected ? 46 : 32;
  const tipX = active === null ? 0 : x(active) + (x(active) > W / 2 ? -tipW - 10 : 10);
  const tipY = pad.top - 4;
  const said =
    point &&
    `${point.month}: ${isProjected ? `projected ${k1(point.value)}, likely ${k1(point.low)} to ${k1(point.high)}` : `${k1(point.value)}${active === today ? ", today" : ""}`}`;

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label="Cash projection chart. Use the left and right arrow keys to read each month."
      onKeyDown={onKey}
      onFocus={() => setActive((i) => i ?? today)}
      onBlur={() => setActive(null)}
      className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-peri-deep/40"
    >
      <span className="sr-only" aria-live="polite">
        {said}
      </span>
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-pan-y select-none"
        aria-hidden="true"
        onPointerMove={pick}
        onPointerDown={pick}
        onPointerLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id={`${id}-area`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--color-peri-deep)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--color-peri-deep)" stopOpacity="0" />
          </linearGradient>
          {draw && (
            <clipPath id={`${id}-draw`}>
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
            fill={i === today || i === active ? "var(--color-ink)" : "var(--color-mute)"}
            fontWeight={i === today || i === active ? 600 : 400}
          >
            {m}
          </text>
        ))}

        <g clipPath={draw ? `url(#${id}-draw)` : undefined}>
          <path
            d={band}
            style={morph(band)}
            className="transition-[d] duration-700 ease-out motion-reduce:transition-none"
            fill="var(--color-peri-deep)"
            fillOpacity={scenario === "hire" ? 0.13 : 0.1}
          />
          <path d={actualArea} fill={`url(#${id}-area)`} />
          <path d={actualLine} fill="none" stroke="var(--color-peri-deep)" strokeWidth="2" strokeLinejoin="round" />
          <path
            d={projectedLine}
            style={morph(projectedLine)}
            className="transition-[d] duration-700 ease-out motion-reduce:transition-none"
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
          {active === null && (
            <text x={x(today) - 8} y={pad.top - 10} textAnchor="end" fontSize="11" fontWeight="600" fill="var(--color-ink)">
              $58.0k today
            </text>
          )}
        </g>

        {point && active !== null && (
          <g pointerEvents="none">
            <line x1={x(active)} x2={x(active)} y1={pad.top - 6} y2={y(yMin)} stroke="var(--color-peri-deep)" strokeOpacity="0.5" />
            {isProjected && (
              <line
                x1={x(active)}
                x2={x(active)}
                y1={y(point.high)}
                y2={y(point.low)}
                stroke="var(--color-peri-deep)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeOpacity="0.35"
              />
            )}
            <circle cx={x(active)} cy={y(point.value)} r="5" fill="var(--color-paper)" stroke="var(--color-peri-deep)" strokeWidth="2.5" />
            <g transform={`translate(${tipX} ${tipY})`}>
              <rect width={tipW} height={tipH} rx="7" fill="var(--color-ink)" />
              <text x="9" y="13" fontSize="10" fill="var(--color-paper)" fillOpacity="0.65">
                {point.month} {active === today ? "· today" : isProjected ? "· projected" : ""}
              </text>
              <text x="9" y="26" fontSize="12" fontWeight="600" fill="var(--color-paper)">
                {money(point.value)}
              </text>
              {isProjected && (
                <text x="9" y="39" fontSize="10" fill="var(--color-paper)" fillOpacity="0.65">
                  {k1(point.low)} – {k1(point.high)} likely
                </text>
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

const money = (v: number) => `$${v.toLocaleString("en-US")}`;
