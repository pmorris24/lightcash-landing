import { Field } from "@/components/field";
import { ButtonLink } from "@/components/ui";
import { site, wrap } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="early-access" className={`${wrap} scroll-mt-6 pb-16`}>
      <div className="relative isolate overflow-hidden rounded-[28px] px-6 py-20 text-center text-white sm:py-28">
        <Field palette="ember" className="-z-10" />
        <p className="font-mono text-xs tracking-wider text-white/75 uppercase">Free early access</p>
        <h2 className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.04em] text-balance">
          Stop running the business on spreadsheets and hope.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[1.05rem] leading-relaxed text-white/85">
          Early access is free while we launch. Tell us about your business and we will set you up.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          <ButtonLink href={site.earlyAccessUrl} variant="light" arrow>
            Get free early access
          </ButtonLink>
          <ButtonLink href={site.bookCallUrl} variant="glass">
            Book a call
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
