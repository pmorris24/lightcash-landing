/**
 * Progressive enhancement for the static page, run once by <Enhancer /> after hydration. The markup is
 * complete without it; this adds the animated gradient + ASCII fields (which react to the cursor), the
 * audience card switcher and the page motion in src/lib/motion.ts. Interactive form and FAQ controls are
 * React components (shadcn/ui) instead.
 */

import gsap from "gsap";
import { mountMotion } from "@/lib/motion";

type RGB = [number, number, number];

type Spot = {
  color: RGB;
  /** Centre, as a fraction of width and height. */
  x: number;
  y: number;
  /** Radius, as a fraction of height. */
  r: number;
  /** Drift amplitude and speed. */
  drift: number;
  speed: number;
};

type Palette = { base: RGB; spots: Spot[] };

const hex = (value: string): RGB => [
  parseInt(value.slice(1, 3), 16),
  parseInt(value.slice(3, 5), 16),
  parseInt(value.slice(5, 7), 16),
];

const spot = (color: string, x: number, y: number, r: number, drift = 0.05, speed = 0.08): Spot => ({
  color: hex(color),
  x,
  y,
  r,
  drift,
  speed,
});

// Each palette reads like a blurred dusk photograph. Order matters: later spots paint over earlier ones.
const PALETTES: Record<string, Palette> = {
  // Hero: pale sky behind the headline, ember and maroon along the bottom edge.
  dusk: {
    base: hex("#bccaee"),
    spots: [
      spot("#e6ebf8", 0.5, 0.08, 0.5, 0.04, 0.05),
      spot("#9fb3e8", 0.92, 0.2, 0.32),
      spot("#eaa9c1", 0.08, 0.52, 0.3),
      spot("#c6b6e7", 0.88, 0.55, 0.3),
      spot("#dd5b3e", 0.32, 0.86, 0.3, 0.07),
      spot("#8c3326", 0.78, 0.94, 0.3, 0.06),
      spot("#3b2523", 0.1, 1.02, 0.28),
      spot("#2e2226", 0.62, 1.08, 0.24),
    ],
  },
  // Dark cards and the closing call to action: red on the left, lavender light on the right.
  ember: {
    base: hex("#3a2422"),
    spots: [
      spot("#d8573c", 0.18, 0.3, 0.42, 0.08),
      spot("#a99bd6", 0.82, 0.45, 0.4, 0.06),
      spot("#ddd5f0", 0.95, 0.2, 0.22, 0.05),
      spot("#6e2a25", 0.1, 0.95, 0.35),
      spot("#7488cc", 0.7, 1.0, 0.35),
    ],
  },
  // Agent panel: blue haze, pink on the left, a dark red treeline at the bottom right.
  twilight: {
    base: hex("#8aa3dc"),
    spots: [
      spot("#e8a2c0", 0.05, 0.38, 0.32, 0.07),
      spot("#9db4e8", 0.6, 0.12, 0.38),
      spot("#c9b6e2", 0.2, 0.9, 0.3),
      spot("#8e2e26", 0.86, 0.82, 0.3, 0.05),
      spot("#2b2230", 0.95, 0.98, 0.24),
      spot("#e2643f", 0.98, 0.7, 0.14),
    ],
  },
};

// Sparse to dense. Bright areas get the dense glyphs.
const RAMP = " .:-*oahkbdpqwmW#M&8%B@$";
// Glyphs flicker through these where the cursor stirs the field.
const STIR = "$0123456789%+=#";
// The idle drift redraws at this rate; while the cursor is stirring the field it redraws every frame.
const FPS = 12;

/** Cursor influence, in cells. */
const REACH = 9;
const TRAIL_LIFE = 0.7;
const RIPPLE_LIFE = 1.4;

type Mark = { x: number; y: number; born: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function sampleField(palette: Palette, aspect: number, u: number, v: number, t: number, out: number[]) {
  let [r, g, b] = palette.base;
  palette.spots.forEach((s, i) => {
    const sx = s.x + s.drift * Math.sin(t * s.speed * 6.283 + i * 1.7);
    const sy = s.y + s.drift * 0.6 * Math.cos(t * s.speed * 5.1 + i * 2.3);
    const dx = (u - sx) * aspect;
    const dy = v - sy;
    const w = Math.exp(-(dx * dx + dy * dy) / (s.r * s.r)) * 0.95;
    r += (s.color[0] - r) * w;
    g += (s.color[1] - g) * w;
    b += (s.color[2] - b) * w;
  });
  out[0] = r;
  out[1] = g;
  out[2] = b;
}

/** Where glyphs show: drifting patches, like the overlay on the reference photos. */
function glyphMask(u: number, v: number, t: number) {
  const n =
    0.5 +
    0.28 * Math.sin(u * 5.2 + t * 0.12 + Math.sin(v * 3.1)) +
    0.22 * Math.sin(v * 6.4 - t * 0.09 + u * 2.4);
  return smoothstep(0.42, 0.78, n);
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Tracks the cursor over a field's panel: a smoothed pointer with a strength that fades in and out,
 * a short trail of recent positions and click ripples. A "field:sweep" event on the field sends a beam
 * of light across it (the hero plays one as its headline lands). `influence` reads all of these for one cell.
 */
function createStir(panel: HTMLElement, host: HTMLElement, getCell: () => number, onActive: () => void) {
  const pointer = { x: 0, y: 0, power: 0 };
  const moveX = gsap.quickTo(pointer, "x", { duration: 0.3, ease: "power3" });
  const moveY = gsap.quickTo(pointer, "y", { duration: 0.3, ease: "power3" });
  const trail: Mark[] = [];
  const ripples: Mark[] = [];
  const beam = { x: 0, power: 0 };
  const seconds = () => performance.now() / 1000;

  const onSweep = () => {
    const reach = getCell() * REACH;
    gsap
      .timeline({ onUpdate: onActive })
      .set(beam, { x: -reach * 2, power: 1 })
      .to(beam, { x: host.clientWidth + reach * 2, duration: 1.5, ease: "power2.inOut" })
      .to(beam, { power: 0, duration: 0.3 }, "-=0.3");
  };

  const local = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onEnter = (event: PointerEvent) => {
    const { x, y } = local(event);
    moveX(x, x);
    moveY(y, y);
    gsap.to(pointer, { power: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    onActive();
  };
  const onMove = (event: PointerEvent) => {
    const { x, y } = local(event);
    moveX(x);
    moveY(y);
    const last = trail[trail.length - 1];
    if (!last || Math.hypot(x - last.x, y - last.y) > getCell() * 0.8) {
      trail.push({ x, y, born: seconds() });
      if (trail.length > 24) trail.shift();
    }
    onActive();
  };
  const onLeave = () => {
    gsap.to(pointer, { power: 0, duration: 0.8, ease: "power2.out", overwrite: "auto" });
  };
  const onDown = (event: PointerEvent) => {
    ripples.push({ ...local(event), born: seconds() });
    if (ripples.length > 4) ripples.shift();
    onActive();
  };

  panel.addEventListener("pointerenter", onEnter);
  panel.addEventListener("pointermove", onMove, { passive: true });
  panel.addEventListener("pointerleave", onLeave);
  panel.addEventListener("pointerdown", onDown, { passive: true });
  host.addEventListener("field:sweep", onSweep);

  return {
    /** True while anything is still animating, so the field keeps redrawing every frame. */
    active(t: number) {
      while (trail.length && t - trail[0].born > TRAIL_LIFE) trail.shift();
      while (ripples.length && t - ripples[0].born > RIPPLE_LIFE) ripples.shift();
      return pointer.power > 0.002 || beam.power > 0 || trail.length > 0 || ripples.length > 0;
    },
    /** 0–1 strength of the cursor's effect at (x, y), plus the direction to push the glyph. */
    influence(x: number, y: number, t: number, cell: number, out: number[]) {
      const reach = cell * REACH;
      let f = 0;
      let px = x - pointer.x;
      let py = y - pointer.y;
      const d = Math.hypot(px, py);
      if (pointer.power > 0 && d < reach) {
        const k = 1 - d / reach;
        f = pointer.power * k * k * (3 - 2 * k);
      }
      for (const mark of trail) {
        const age = (t - mark.born) / TRAIL_LIFE;
        const dx = x - mark.x;
        const dy = y - mark.y;
        const r = reach * 0.55;
        const w = (1 - age) * Math.exp(-(dx * dx + dy * dy) / (r * r)) * 0.8;
        if (w > f) f = w;
      }
      for (const ripple of ripples) {
        const age = (t - ripple.born) / RIPPLE_LIFE;
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        const ring = (d: number) => (d - age * reach * 4) / (cell * 2.2);
        const band = ring(Math.hypot(dx, dy));
        const w = (1 - age) * Math.exp(-band * band);
        if (w > f) {
          f = w;
          px = dx;
          py = dy;
        }
      }
      if (beam.power > 0) {
        // A slanted band of light moving left to right; glyphs in it are pushed along with it.
        const band = (x - beam.x - y * 0.35) / (cell * 4);
        const w = beam.power * Math.exp(-band * band);
        if (w > f) {
          f = w;
          px = 1;
          py = 0;
        }
      }
      const len = Math.hypot(px, py) || 1;
      out[0] = Math.min(1, f);
      out[1] = px / len;
      out[2] = py / len;
    },
    destroy() {
      panel.removeEventListener("pointerenter", onEnter);
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerleave", onLeave);
      panel.removeEventListener("pointerdown", onDown);
      host.removeEventListener("field:sweep", onSweep);
      gsap.killTweensOf([pointer, beam]);
    },
  };
}

function mountField(host: HTMLElement): () => void {
  const palette = PALETTES[host.dataset.field ?? ""] ?? PALETTES.dusk;
  const [haze, glyphs] = Array.from(host.querySelectorAll("canvas"));
  const hazeCtx = haze?.getContext("2d");
  const glyphCtx = glyphs?.getContext("2d");
  if (!hazeCtx || !glyphCtx) return () => {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fontFamily = getComputedStyle(host).fontFamily;
  const sample = [0, 0, 0];
  const push = [0, 0, 0];

  let width = 0;
  let height = 0;
  let cell = 14;
  let cols = 0;
  let rows = 0;
  let image: ImageData | null = null;
  let visible = true;
  let wasHidden = true;
  let dirty = true;
  let frame = 0;
  let last = 0;
  let stirring = false;

  // The panel the field sits in takes the pointer; the field itself ignores pointer events.
  const panel = host.parentElement;
  const stir =
    reduceMotion || !panel
      ? null
      : createStir(panel, host, () => cell, () => {
          stirring = true;
        });

  const resize = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    cell = width < 640 ? 11 : 14;
    cols = Math.ceil(width / cell);
    rows = Math.ceil(height / cell);
    hazeCtx.canvas.width = cols;
    hazeCtx.canvas.height = rows;
    image = hazeCtx.createImageData(cols, rows);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    glyphCtx.canvas.width = Math.round(width * dpr);
    glyphCtx.canvas.height = Math.round(height * dpr);
    glyphCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dirty = true;
  };

  const draw = (t: number) => {
    if (!image) return;
    stirring = stir?.active(t) ?? false;
    const aspect = width / height;
    const data = image.data;
    glyphCtx.clearRect(0, 0, width, height);
    glyphCtx.font = `${Math.round(cell * 0.92)}px ${fontFamily}`;
    glyphCtx.textAlign = "center";
    glyphCtx.textBaseline = "middle";

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const u = (col + 0.5) / cols;
        const v = (row + 0.5) / rows;
        sampleField(palette, aspect, u, v, t, sample);
        const [r, g, b] = sample;
        const i = (row * cols + col) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;

        const x = col * cell;
        const y = row * cell;
        // Where the cursor is, glyphs show even outside the drifting patches.
        let stirred = 0;
        if (stirring && stir) {
          stir.influence(x + cell / 2, y + cell / 2, t, cell, push);
          stirred = push[0];
        }
        const mask = Math.max(glyphMask(u * aspect, v, t), stirred * 0.9);
        if (mask < 0.04) continue;
        // Faint blocks behind the strongest glyph patches, and under the cursor.
        if ((mask > 0.85 && hash(col, row) > 0.55) || (stirred > 0.45 && hash(row, col) > 0.5)) {
          glyphCtx.fillStyle = `rgba(255,255,255,${0.035 + 0.03 * hash(row, col) + 0.07 * stirred})`;
          glyphCtx.fillRect(x, y, cell - 1, cell - 1);
        }
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        let glyph = RAMP[Math.min(RAMP.length - 1, Math.floor(lum * RAMP.length + stirred * 8))];
        // Strongly stirred cells flicker through cash glyphs, about 15 times a second.
        if (stirred > 0.3) glyph = STIR[Math.floor(hash(col + Math.floor(t * 15), row) * STIR.length)];
        if (glyph === " ") continue;
        const tint = 0.32 + 0.55 * stirred;
        const alpha = Math.min(0.95, 0.16 + 0.34 * mask + 0.45 * stirred);
        // Push stirred glyphs away from the cursor.
        const shift = stirred * cell * 0.9;
        glyphCtx.fillStyle = `rgba(${Math.round(r + (255 - r) * tint)},${Math.round(g + (255 - g) * tint)},${Math.round(b + (255 - b) * tint)},${alpha})`;
        glyphCtx.fillText(glyph, x + cell / 2 + push[1] * shift, y + cell / 2 + 0.5 + push[2] * shift);
      }
    }
    hazeCtx.putImageData(image, 0, 0);
  };

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (!visible) return;
    // A field inside an inactive persona card is hidden, so skip it until the card is selected.
    const hidden = host.closest('[data-active="false"]') !== null;
    if (hidden) {
      wasHidden = true;
      return;
    }
    if (wasHidden) {
      wasHidden = false;
      dirty = true;
    }
    if (reduceMotion) {
      if (dirty) draw(0);
      dirty = false;
      return;
    }
    if (dirty || stirring || now - last >= 1000 / FPS) {
      draw(now / 1000);
      last = now;
      dirty = false;
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  visibility.observe(host);
  resize();
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    stir?.destroy();
    resizeObserver.disconnect();
    visibility.disconnect();
  };
}

/** Audience cards: pointing at or focusing a card with data-option="x" makes it the active one. */
function mountSwitcher(root: HTMLElement): () => void {
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-option]"));

  const onEnter = (event: Event) => {
    const card = (event.target as Element).closest<HTMLElement>("[data-option]");
    if (!card || card.dataset.active === "true") return;
    cards.forEach((c) => c.setAttribute("data-active", String(c === card)));
  };
  // pointerover bubbles (pointerenter does not), so one listener on the container covers every card.
  root.addEventListener("pointerover", onEnter);
  root.addEventListener("focusin", onEnter);
  return () => {
    root.removeEventListener("pointerover", onEnter);
    root.removeEventListener("focusin", onEnter);
  };
}

export function enhance(root: ParentNode = document): () => void {
  const cleanups = [
    ...Array.from(root.querySelectorAll<HTMLElement>("[data-field]")).map(mountField),
    ...Array.from(root.querySelectorAll<HTMLElement>("[data-switcher]")).map(mountSwitcher),
    mountMotion(root),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}
