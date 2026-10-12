/**
 * Page motion: the hero intro, word-by-word heading reveals, scroll reveals and KPI count-ups.
 *
 * Elements opt in with data attributes, and an inline script in the layout hides them (html.motion)
 * until this runs, so nothing flashes before it animates in:
 *   data-intro="nav|badge|title|copy|actions|product|logos"  hero, played once on load
 *   data-split   heading whose words rise out of a mask when it scrolls into view
 *   data-reveal  block that fades up when it scrolls into view (batched, so neighbours stagger)
 *   data-count   number that counts up from zero, keeping its prefix, separators and decimals
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
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const q = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T & HTMLElement>(selector));
    const intro = (name: string) => root.querySelector<HTMLElement>(`[data-intro="${name}"]`);

    // Hero intro: nav and badge first, the headline rises word by word, then copy, buttons and product.
    const tl = gsap.timeline({ defaults: { duration: 1.1, ease: EASE } });
    tl.fromTo(intro("nav"), { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0)
      .fromTo(intro("badge"), { autoAlpha: 0, y: 16, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1 }, 0.1)
      .fromTo(intro("copy"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.55)
      .fromTo(intro("actions"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.65)
      .fromTo(intro("product"), { autoAlpha: 0, y: 90, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.6 }, 0.7);
    const logos = intro("logos");
    if (logos) {
      tl.fromTo(logos, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.0).from(
        logos.querySelectorAll("li"),
        { autoAlpha: 0, y: 18, stagger: 0.06, duration: 0.9 },
        "<",
      );
    }
    const title = intro("title");
    if (title) riseWords(title, { delay: 0.2, stagger: 0.08, duration: 1.3 });

    // Headings further down rise into view as they are reached.
    q("[data-split]").forEach((el) => riseWords(el, { scrollTrigger: { trigger: el, start: "top 88%", once: true } }));

    gsap.set(q("[data-reveal]"), { autoAlpha: 0, y: 32 });
    ScrollTrigger.batch(q("[data-reveal]"), {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: EASE, stagger: 0.09, overwrite: true }),
    });

    const restoreCounts = q("[data-count]").map((el) => countUp(el, tl));
    return () => restoreCounts.forEach((restore) => restore());
  });

  return () => mm.revert();
}
