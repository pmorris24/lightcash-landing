import { Field } from "@/components/field";
import { SignupForm } from "@/components/signup-form";
import { wrap } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="get-started" className={`${wrap} scroll-mt-6 pb-16`}>
      <div className="relative isolate overflow-hidden rounded-[28px] px-6 py-20 text-center text-white sm:py-28">
        <Field palette="ember" className="-z-10" />
        <h2
          data-split
          className="mx-auto max-w-3xl font-display text-[clamp(2.75rem,7vw,5rem)] leading-[0.98] tracking-[-0.04em] text-balance"
        >
          Stop guessing. Start seeing.
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-md text-[1.15rem] leading-relaxed text-white/85">
          Your full financial picture, live, from today.
        </p>
        <SignupForm />
      </div>
    </section>
  );
}
