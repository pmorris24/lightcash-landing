import { ArrowRight } from "@/components/icons";
import { Mute, Pill, SectionHeading } from "@/components/ui";
import { wrap } from "@/lib/site";

const gets = [
  "Your full cash and finance picture, live, in one place",
  "Projections that show where you’ll be next month, not just where you were last month",
  "Reports ready when you need them, without waiting on anyone",
];

const saves = ["The monthly bookkeeping bill", "The end-of-quarter scramble", "The guesswork behind every big decision"];

export function GetSave() {
  return (
    <section className={`${wrap} pb-24 sm:pb-32`}>
      <div className="flex flex-col items-center text-center">
        <Pill>Why Lightcash</Pill>
        <SectionHeading className="mt-5 max-w-3xl">
          What You Get. <Mute>What You Save.</Mute>
        </SectionHeading>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-line p-6 sm:p-8">
          <p className="font-mono text-xs tracking-wider text-mute uppercase">You get</p>
          <ul className="mt-6 grid gap-5">
            {gets.map((item) => (
              <li key={item} className="flex gap-3 text-[1.1rem] leading-snug">
                <ArrowRight className="mt-1 size-4 shrink-0 text-peri-deep" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-cloud p-6 sm:p-8">
          <p className="font-mono text-xs tracking-wider text-mute uppercase">You save</p>
          <ul className="mt-6 grid gap-5">
            {saves.map((item) => (
              <li key={item} className="flex gap-3 text-[1.1rem] leading-snug text-ink-soft">
                <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-ember" />
                <span className="line-through decoration-ember/70 decoration-[1.5px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
