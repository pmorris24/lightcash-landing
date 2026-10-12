import { DashboardMock } from "@/components/dashboard-mock";
import { Field } from "@/components/field";
import { SignIn } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui";
import { nav, site } from "@/lib/site";

export function Hero() {
  return (
    <div className="p-2 sm:p-3">
      <header className="relative isolate overflow-hidden rounded-[22px] sm:rounded-[28px]">
        <Field palette="dusk" className="-z-10" />

        <nav data-intro="nav" className="flex items-center gap-8 px-4 py-4 sm:px-7 sm:py-5" aria-label="Main">
          <a href="#" className="rounded-md focus-visible:outline-2 focus-visible:outline-ink">
            <Logo />
            <span className="sr-only">Lightcash home</span>
          </a>
          <ul className="hidden items-center gap-7 text-[0.92rem] lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-ink/80 transition-colors hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={site.signInUrl}
              className="hidden h-10 items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 text-sm backdrop-blur sm:inline-flex"
            >
              Sign in
              <SignIn className="size-4" />
            </a>
            <a
              href={site.getStartedUrl}
              className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
            >
              Get started free
            </a>
          </div>
        </nav>

        <div className="flex flex-col items-center px-4 pt-14 text-center sm:pt-20">
          <h1
            data-intro="title"
            className="font-display text-[clamp(3rem,8.4vw,6rem)] leading-[0.95] tracking-[-0.04em] text-balance"
          >
            Your finances,
            <br />
            at the speed <span className="whitespace-nowrap">of light.</span>
          </h1>
          <p data-intro="copy" className="mt-7 max-w-xl text-[1.1rem] leading-relaxed text-balance text-ink-soft">
            Lightcash gives you a live view of your cash, sensible projections of where you’re heading, and every
            report you need, without a bookkeeper in the loop.
          </p>

          <div data-intro="actions" className="mt-9 flex flex-wrap justify-center gap-2.5">
            <ButtonLink href={site.getStartedUrl} arrow>
              Get started free
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="light">
              See how it works
            </ButtonLink>
          </div>
          <p data-intro="tagline" className="mt-5 text-sm text-ink-soft">
            {site.tagline}
          </p>
        </div>

        <div data-intro="product" className="relative mx-auto mt-14 w-full max-w-5xl px-3 pb-10 sm:mt-16 sm:px-8 sm:pb-14">
          <DashboardMock className="[mask-image:linear-gradient(to_bottom,black_55%,transparent_96%)]" />
        </div>
      </header>
    </div>
  );
}
