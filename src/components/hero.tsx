import { DashboardMock } from "@/components/dashboard-mock";
import { Field } from "@/components/field";
import { SignIn } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui";
import { nav, site } from "@/lib/site";

// TODO: confirm this list matches the integrations that ship at launch.
const integrations = ["Stripe", "QuickBooks", "Xero", "Shopify", "Gusto", "Plaid"];

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
              href={site.earlyAccessUrl}
              className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper hover:bg-ink-soft"
            >
              Get early access
            </a>
          </div>
        </nav>

        <div className="flex flex-col items-center px-4 pt-10 text-center sm:pt-14">
          <p data-intro="badge" className="inline-flex items-center gap-2 rounded-full bg-white/85 p-1 text-xs whitespace-nowrap shadow-sm backdrop-blur sm:pr-3">
            <span className="rounded-full bg-ink px-2.5 py-1 font-medium text-paper">Launching today</span>
            <span className="hidden font-mono text-[0.72rem] text-ink-soft sm:inline">Live cash · projections · reports</span>
          </p>

          <h1 data-intro="title" className="mt-7 font-display text-[clamp(3.1rem,9vw,6.4rem)] leading-[0.92] tracking-[-0.035em] text-balance">
            Know your cash.
            <br />
            See what’s next.
          </h1>
          <p data-intro="copy" className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
            Lightcash connects your bank, payments and accounting tools, then keeps a live picture of your
            finances. No bookkeeper wait, no spreadsheets.
          </p>

          <div data-intro="actions" className="mt-8 flex flex-wrap justify-center gap-2.5">
            <ButtonLink href={site.earlyAccessUrl} arrow>
              Get free early access
            </ButtonLink>
            <ButtonLink href={site.bookCallUrl} variant="light">
              Book a call
            </ButtonLink>
          </div>
        </div>

        <div data-intro="product" className="relative mx-auto mt-14 w-full max-w-5xl px-3 sm:mt-16 sm:px-8">
          <DashboardMock className="[mask-image:linear-gradient(to_bottom,black_45%,transparent_80%)]" />
        </div>

        <div data-intro="logos" className="relative -mt-20 px-4 pb-12 text-center text-white sm:-mt-28 sm:pb-16">
          <p className="text-[0.95rem] text-white/85">Connects to the tools you already use:</p>
          <ul className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
            {integrations.map((name) => (
              <li key={name} className="text-[1.45rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.75rem]">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}
