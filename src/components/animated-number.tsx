"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A number that tweens to each new value. On first sight it counts up from zero, like `data-count` in
 * src/lib/motion.ts; use this one instead when the value can change, since React owns the text here.
 *
 * React only ever renders the first value, so it never touches the text node GSAP writes to.
 */
export function AnimatedNumber({
  value,
  format,
  delay = 0,
  className,
}: {
  value: number;
  format: (v: number) => string;
  /** Seconds to wait before the first count-up, e.g. to land with an intro. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [first] = useState(value);
  const shown = useRef({ value });
  const seen = useRef(false);
  const formatRef = useRef(format);
  useLayoutEffect(() => {
    formatRef.current = format;
  });

  const tweenTo = (target: number, from?: number, wait = 0) => {
    const el = ref.current;
    if (!el) return;
    const counter = shown.current;
    const render = () => (el.textContent = formatRef.current(counter.value));
    gsap.killTweensOf(counter);
    if (reduced()) {
      counter.value = target;
      render();
      return;
    }
    if (from !== undefined) counter.value = from;
    render();
    gsap.to(counter, { value: target, duration: from === undefined ? 0.6 : 1.6, delay: wait, ease: "power3.out", onUpdate: render });
  };

  // Count up the first time it scrolls into view.
  useEffect(() => {
    const el = ref.current;
    const counter = shown.current;
    if (!el || reduced()) {
      seen.current = true;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.current = true;
        tweenTo(shown.current.value, 0, delay);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -5% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      gsap.killTweensOf(counter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value === shown.current.value && !gsap.isTweening(shown.current)) return;
    if (!seen.current) {
      shown.current.value = value;
      return;
    }
    tweenTo(value);
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {format(first)}
    </span>
  );
}
