import { DashboardMock } from "@/components/dashboard-mock";
import { Field } from "@/components/field";
import { ArrowRight, SignIn } from "@/components/icons";
import { IntegrationsMarquee } from "@/components/integrations-marquee";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { nav, site } from "@/lib/site";

export function Hero() {
  return (
    <div data-hero className="p-2 sm:p-3">
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
            <Button asChild variant="frosted" size="pill-sm" className="max-sm:hidden">
              <a href={site.signInUrl}>
                Sign in
                <SignIn />
              </a>
            </Button>
            <Button asChild size="pill-sm">
              <a href={site.getStartedUrl}>Get started free</a>
            </Button>
          </div>
        </nav>

        <div data-hero-copy className="flex flex-col items-center px-4 pt-14 text-center sm:pt-20">
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
            <Button asChild size="pill">
              <a href={site.getStartedUrl}>
                Get started free
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" size="pill">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
          <p data-intro="tagline" className="mt-5 text-sm text-ink-soft">
            {site.tagline}
          </p>
        </div>

        {/* Scrolling first slides this up into view while the hero is pinned (motion.ts). */}
        <div data-rise className="relative">
          <div data-intro="product" className="relative mx-auto mt-14 w-full max-w-5xl px-3 sm:mt-16 sm:px-8">
            <DashboardMock className="[mask-image:linear-gradient(to_bottom,black_45%,transparent_80%)]" />
          </div>

          <div data-intro="logos" className="relative -mt-20 pb-12 text-center text-white sm:-mt-28 sm:pb-16">
            <p className="px-4 text-[0.95rem] text-white/85">Connects to the tools you already use:</p>
            <div className="mt-6 text-white/95">
              <IntegrationsMarquee />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
