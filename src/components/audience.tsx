import { Field } from "@/components/field";
import { ArrowRight, Store, User } from "@/components/icons";
import { SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site, wrap } from "@/lib/site";

const audiences = [
  {
    id: "solo",
    icon: User,
    title: "Solo builders",
    body: "Know exactly what you’re earning, spending and keeping, without becoming an accountant.",
  },
  {
    id: "teams",
    icon: Store,
    title: "Small businesses",
    body: "Replace the monthly bookkeeping bill with a live view your whole team can trust.",
  },
];

const initial = "teams";

/** Two audience cards. Hovering or focusing one lights it up (mountSwitcher in src/lib/enhance.ts). */
export function Audience() {
  return (
    <section id="who-its-for" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <SectionHeading className="max-w-3xl">Made for people who’d rather be building.</SectionHeading>

      <div data-switcher className="mt-14 grid gap-4 md:grid-cols-2">
        {audiences.map(({ id, icon: Icon, title, body }) => (
          <Card
            key={id}
            data-option={id}
            data-active={id === initial}
            data-reveal
            className="group relative isolate min-h-80 gap-0 rounded-3xl p-6 text-base transition-[color,box-shadow] duration-300 data-[active=true]:text-white data-[active=true]:ring-transparent sm:p-8"
          >
            <Field
              palette="ember"
              className="-z-10 opacity-0 transition-opacity duration-500 group-data-[active=true]:opacity-100"
            />
            <span className="grid size-12 place-items-center rounded-full bg-ink text-paper transition-colors group-data-[active=true]:bg-paper group-data-[active=true]:text-ink">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-auto pt-16 text-[1.9rem] leading-tight tracking-[-0.025em]">{title}</h3>
            <p className="mt-3 max-w-md text-[1.05rem] leading-relaxed text-pretty text-mute transition-colors group-data-[active=true]:text-white/85">
              {body}
            </p>
            <Button asChild variant="link" className="mt-7 h-auto self-start px-0 text-[0.95rem] text-current">
              <a href={site.getStartedUrl}>
                Get started free <ArrowRight />
              </a>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
