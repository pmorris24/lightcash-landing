import { SectionHeading, Soft } from "@/components/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

export function Faq() {
  return (
    <section id="faq" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading>
          Before you <Soft>connect anything.</Soft>
        </SectionHeading>
        <Accordion data-reveal type="multiple" className="border-t">
          {faqs.map(({ q, a }) => (
            <AccordionItem key={q} value={q} className="border-b">
              <AccordionTrigger className="py-6 text-[1.2rem] leading-snug font-normal tracking-[-0.01em]">
                {q}
              </AccordionTrigger>
              <AccordionContent className="max-w-xl pb-7 text-[1.05rem] leading-relaxed text-pretty text-ink-soft">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
