import { Field } from "@/components/field";
import { wrap } from "@/lib/site";

export function Testimonial() {
  return (
    <section className={`${wrap} pb-24 sm:pb-32`}>
      <figure className="relative isolate overflow-hidden rounded-[28px] px-6 py-20 text-ink sm:px-14 sm:py-28">
        <Field palette="twilight" className="-z-10" />
        <blockquote
          data-reveal
          className="mx-auto max-w-4xl text-center font-display text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.08] tracking-[-0.03em] text-balance"
        >
          <p>“Lightcash saved us thousands in bookkeeping costs and hours of work every month.”</p>
        </blockquote>
        <figcaption data-reveal className="mt-10 flex items-center justify-center gap-3 text-[0.95rem]">
          <span className="grid size-11 place-items-center rounded-full bg-ink font-medium text-paper" aria-hidden="true">
            I
          </span>
          <span className="text-left leading-tight">
            <span className="block font-medium">Ilonna</span>
            <span className="block text-ink-soft">Head of Operations at Lightdash</span>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
