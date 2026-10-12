import { Field } from "@/components/field";
import { ArrowRight, Diamond, Rocket, Store, User } from "@/components/icons";
import { Mute, Pill, SectionHeading } from "@/components/ui";
import { wrap } from "@/lib/site";

const personas = [
  {
    id: "solo",
    tab: "Solo builders",
    icon: User,
    title: "Solo Builders & Freelancers",
    body: "See what you earned, what you owe and what you can pay yourself this month.",
    points: ["Tax set-aside estimate", "Income by client"],
    footer: "Set up in one sitting",
  },
  {
    id: "owners",
    tab: "Small business owners",
    icon: Store,
    title: "Small Business Owners",
    body: "Replace the monthly bookkeeping bill with a live view of cash, costs and margin.",
    points: ["Live profit and loss", "Reports in one click"],
    footer: "Free early access",
  },
  {
    id: "founders",
    tab: "Founders",
    icon: Rocket,
    title: "Founders & Start-ups",
    body: "Know your runway every day and send investor updates without the end-of-quarter scramble.",
    points: ["Burn and runway", "Investor-ready reports"],
    footer: "Board-ready in minutes",
  },
];

const initial = "owners";

export function Personas() {
  return (
    <section id="product" className={`${wrap} scroll-mt-6 py-24 sm:py-32`} data-switcher>
      <div className="flex flex-col items-center text-center">
        <Pill>Built for people who run the business</Pill>
        <SectionHeading className="mt-5 max-w-3xl">
          Lightcash Turns Scattered Accounts Into <Mute>Clear</Mute> Numbers
        </SectionHeading>

        <div className="mt-8 flex max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-line bg-paper p-1 shadow-[0_8px_30px_-12px_rgb(13_13_18/0.12)]">
          {personas.map(({ id, tab, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-select={id}
              aria-pressed={id === initial}
              className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-cloud focus-visible:outline-2 focus-visible:outline-peri-deep aria-pressed:bg-cloud aria-pressed:text-ink"
            >
              <span className="grid size-6 place-items-center rounded-full bg-cloud text-ink-soft group-aria-pressed:bg-ink group-aria-pressed:text-paper">
                <Icon className="size-3.5" />
              </span>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {personas.map(({ id, icon: Icon, title, body, points, footer }) => (
          <article
            key={id}
            data-option={id}
            data-active={id === initial}
            className="group relative isolate flex flex-col overflow-hidden rounded-3xl border border-line bg-paper p-6 transition-colors duration-300 data-[active=true]:border-transparent data-[active=true]:text-white sm:p-7"
          >
            <Field
              palette="ember"
              className="-z-10 opacity-0 transition-opacity duration-500 group-data-[active=true]:opacity-100"
            />
            <span className="grid size-12 place-items-center rounded-full bg-ink text-paper shadow-[0_8px_20px_-6px_rgb(13_13_18/0.5)] group-data-[active=true]:bg-paper group-data-[active=true]:text-ink">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-10 text-[1.55rem] leading-tight tracking-[-0.02em]">{title}</h3>
            <p className="mt-3 leading-relaxed text-mute group-data-[active=true]:text-white/80">{body}</p>
            <ul className="mt-6 grid gap-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-[0.95rem]">
                  <Diamond className="size-3.5" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between gap-3 pt-8 text-[0.95rem]">
              <span className="rounded-full bg-cloud px-3 py-1 text-xs text-ink-soft group-data-[active=true]:bg-white/15 group-data-[active=true]:text-white">
                {footer}
              </span>
              <a href="#how-it-works" className="inline-flex items-center gap-1.5 font-medium hover:underline">
                Learn more <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
