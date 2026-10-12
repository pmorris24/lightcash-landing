import { ChevronDown } from "@/components/icons";
import { SectionHeading } from "@/components/ui";
import { wrap } from "@/lib/site";

// Keep these answers precise: do not claim Lightcash replaces an accountant for tax.
const faqs = [
  {
    q: "Do I still need an accountant?",
    a: "For day-to-day bookkeeping and reporting, no. For tax filing, we’ll tell you exactly what to hand over.",
  },
  { q: "Is my data secure?", a: "Yes." },
  { q: "How much does it cost?", a: "Basically free compared to the cost of your bookkeepers." },
];

/** Native disclosure widgets; globals.css animates their height where the browser supports it. */
export function Faq() {
  return (
    <section id="faq" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading>Frequently asked questions</SectionHeading>
        <div data-reveal className="border-t border-line">
          {faqs.map(({ q, a }) => (
            <details key={q} className="faq group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.2rem] leading-snug tracking-[-0.01em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-peri-deep [&::-webkit-details-marker]:hidden">
                {q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color] duration-300 group-open:rotate-180 group-open:bg-cloud">
                  <ChevronDown className="size-4" />
                </span>
              </summary>
              <p className="max-w-xl pb-7 text-[1.05rem] leading-relaxed text-pretty text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
