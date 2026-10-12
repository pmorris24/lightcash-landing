/**
 * Progressive enhancement for the static page. The markup is complete without it;
 * this adds the animated gradient + ASCII fields and the persona switcher.
 *
 * It is plain DOM code so the same module runs inside Next.js (via <Enhancer />)
 * and in the single-file preview that scripts/build-preview.mjs bundles.
 */

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
const FPS = 12;

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

function mountField(host: HTMLElement): () => void {
  const palette = PALETTES[host.dataset.field ?? ""] ?? PALETTES.dusk;
  const [haze, glyphs] = Array.from(host.querySelectorAll("canvas"));
  const hazeCtx = haze?.getContext("2d");
  const glyphCtx = glyphs?.getContext("2d");
  if (!hazeCtx || !glyphCtx) return () => {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fontFamily = getComputedStyle(host).fontFamily;
  const sample = [0, 0, 0];

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

        const mask = glyphMask(u * aspect, v, t);
        if (mask < 0.04) continue;
        const x = col * cell;
        const y = row * cell;
        // Faint blocks behind the strongest glyph patches.
        if (mask > 0.85 && hash(col, row) > 0.55) {
          glyphCtx.fillStyle = `rgba(255,255,255,${0.035 + 0.03 * hash(row, col)})`;
          glyphCtx.fillRect(x, y, cell - 1, cell - 1);
        }
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const glyph = RAMP[Math.min(RAMP.length - 1, Math.floor(lum * RAMP.length))];
        if (glyph === " ") continue;
        const tint = 0.32;
        glyphCtx.fillStyle = `rgba(${Math.round(r + (255 - r) * tint)},${Math.round(g + (255 - g) * tint)},${Math.round(b + (255 - b) * tint)},${0.16 + 0.34 * mask})`;
        glyphCtx.fillText(glyph, x + cell / 2, y + cell / 2 + 0.5);
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
    if (dirty || now - last >= 1000 / FPS) {
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
    resizeObserver.disconnect();
    visibility.disconnect();
  };
}

/** Persona switcher: a button with data-select="x" activates the card with data-option="x". */
function mountSwitcher(root: HTMLElement): () => void {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-select]"));
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-option]"));

  const select = (id: string) => {
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.select === id)));
    cards.forEach((card) => card.setAttribute("data-active", String(card.dataset.option === id)));
  };

  const onClick = (event: Event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-select]");
    if (button?.dataset.select) select(button.dataset.select);
  };
  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}

export function enhance(root: ParentNode = document): () => void {
  const cleanups = [
    ...Array.from(root.querySelectorAll<HTMLElement>("[data-field]")).map(mountField),
    ...Array.from(root.querySelectorAll<HTMLElement>("[data-switcher]")).map(mountSwitcher),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}
