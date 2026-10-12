/**
 * Page motion. The focal moment is the hero: the headline rises word by word and, as "at the speed of
 * light" lands, a beam of light sweeps across the hero's ASCII field. Everything else is quieter and
 * explains something: the projection draws in, a new transaction lands.
 *
 * Elements opt in with data attributes. An inline script in the layout hides the intro, split and reveal
 * elements (html.motion) until this runs, so nothing flashes before it animates in:
 *   data-intro="nav|title|copy|actions|tagline|product|logos"  hero, played once on load
 *   data-split   heading whose words rise out of a mask when it scrolls into view
 *   data-reveal  block that fades up when it scrolls into view (batched, so a list staggers)
 *   data-count   number that counts up from zero, keeping its prefix, separators and decimals
 *   data-draw    SVG clip rect that uncovers a chart's series left to right
 *   data-feed    transaction rows; the first one arrives as a new transaction
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = "expo.out";

function riseWords(el: HTMLElement, vars: gsap.TweenVars) {
  return SplitText.create(el, {
    type: "words",
    mask: "words",
    wordsClass: "split-word",
    onSplit(self) {
      gsap.set(el, { autoAlpha: 1 });
      // Put the original markup back once the words have landed.
      return gsap.from(self.words, {
        yPercent: 120,
        duration: 1.1,
        ease: EASE,
        stagger: 0.06,
        ...vars,
        onComplete: () => self.revert(),
      });
    },
  });
}

/**
 * Numbers in the hero count up as part of the intro timeline; the rest count up when scrolled to.
 * Returns a function that puts the original text back.
 */
function countUp(el: HTMLElement, intro: gsap.core.Timeline): () => void {
  const original = el.textContent ?? "";
  const match = original.match(/^(\D*)([\d,]+(?:\.(\d+))?)(.*)$/);
  if (!match) return () => {};
  const [, prefix, number, decimals = "", suffix] = match;
  const target = parseFloat(number.replace(/,/g, ""));
  const format = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals.length,
    maximumFractionDigits: decimals.length,
    useGrouping: number.includes(","),
  });
  const counter = { value: 0 };
  const render = () => {
    el.textContent = `${prefix}${format.format(counter.value)}${suffix}`;
  };
  render();
  const vars = { value: target, duration: 1.6, ease: "power3.out", onUpdate: render };
  if (el.closest("[data-intro]")) intro.to(counter, vars, 1.1);
  else gsap.to(counter, { ...vars, scrollTrigger: { trigger: el, start: "top 95%", once: true } });
  return () => {
    el.textContent = original;
  };
}

export function mountMotion(root: ParentNode = document): () => void {
  const html = document.documentElement;
  html.dataset.motionReady = "true";

  const mm = gsap.matchMedia();

  // Hero, tablet and up: scrolling first pins the hero and slides the dashboard up into view while the
  // headline recedes; then the page scrolls on. The dashboard's resting place is the risen one (a
  // negative margin pulls it up), and it starts pushed back down by the same distance, so no gap is left
  // behind it. Created first so later ScrollTriggers account for the pin.
  mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    const hero = root.querySelector<HTMLElement>("[data-hero]");
    const rise = hero?.querySelector("[data-rise]");
    const copy = hero?.querySelector("[data-hero-copy]");
    if (!hero || !rise || !copy) return;
    const lift = () => window.innerHeight * 0.38;
    gsap.set(rise, { marginTop: "-38vh" });
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(rise, { y: lift }, { y: 0 }, 0)
      .to(copy, { y: () => -window.innerHeight * 0.1, scale: 0.97, autoAlpha: 0, duration: 0.75 }, 0);
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const q = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T & HTMLElement>(selector));
    const intro = (name: string) => root.querySelector<HTMLElement>(`[data-intro="${name}"]`);

    // Hero: nav, then the headline rises word by word while the beam crosses the field behind it.
    const tl = gsap.timeline({ defaults: { duration: 1.1, ease: EASE } });
    tl.fromTo(intro("nav"), { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0)
      .call(() => root.querySelector("header [data-field]")?.dispatchEvent(new Event("field:sweep")), [], 0.7)
      .fromTo(intro("copy"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, 0.75)
      .fromTo(intro("actions"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, 0.85)
      .fromTo(intro("tagline"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.0)
      .fromTo(intro("product"), { autoAlpha: 0, y: 90, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.6 }, 0.9)
      .fromTo(intro("logos"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0 }, 1.2);
    const title = intro("title");
    if (title) riseWords(title, { delay: 0.15, stagger: 0.07, duration: 1.3 });

    q("[data-split]").forEach((el) => riseWords(el, { scrollTrigger: { trigger: el, start: "top 88%", once: true } }));

    gsap.set(q("[data-reveal]"), { autoAlpha: 0, y: 20 });
    ScrollTrigger.batch(q("[data-reveal]"), {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.1, overwrite: true }),
    });

    // How it works, step 3: the projection draws in from today.
    q("[data-draw]").forEach((rect) => {
      gsap.fromTo(
        rect,
        { attr: { width: 0 } },
        {
          attr: { width: rect.getAttribute("width") ?? 0 },
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: { trigger: rect.closest("svg"), start: "top 80%", once: true },
        },
      );
    });

    // How it works, step 2: the newest transaction lands at the top of the feed.
    const [newest] = q("[data-feed]");
    if (newest) {
      gsap
        .timeline({ scrollTrigger: { trigger: newest, start: "top 80%", once: true }, delay: 0.4 })
        .from(newest, { autoAlpha: 0, x: -14, duration: 0.6, ease: EASE })
        .fromTo(newest, { backgroundColor: "rgb(230 246 236)" }, { backgroundColor: "rgb(230 246 236 / 0)", duration: 1.8 }, "<");
    }

    const restoreCounts = q("[data-count]").map((el) => countUp(el, tl));
    return () => restoreCounts.forEach((restore) => restore());
  });

  return () => mm.revert();
}
