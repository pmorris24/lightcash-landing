import type { ReactNode } from "react";
import { Field } from "@/components/field";
import { Logo } from "@/components/logo";
import { Mute, Pill, SectionHeading } from "@/components/ui";
import { wrap } from "@/lib/site";

const accounts = [
  { name: "Chase Business ··4821", kind: "Checking", status: "Updated 2m ago", selected: true },
  { name: "Chase Personal ··1190", kind: "Personal", status: "Skipped", selected: false },
];

function GlassCard({ children }: { children: ReactNode }) {
  return (
    <div data-reveal className="flex items-start gap-4 rounded-[26px] bg-glass px-5 py-5 text-white shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl sm:gap-5 sm:px-7 sm:py-6">
      {children}
    </div>
  );
}

/** 4×3 dot grid that pulses left to right, like a scanner. */
function DotLoader() {
  return (
    <span className="mt-1 grid shrink-0 grid-cols-4 gap-1 sm:mt-1.5" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="size-1.5 rounded-[1px] bg-white animate-dot"
          style={{ animationDelay: `${(i % 4) * 0.18 + Math.floor(i / 4) * 0.06}s` }}
        />
      ))}
    </span>
  );
}

export function AgentShowcase() {
  return (
    <section id="agent" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <Pill>Agent-native</Pill>
          <SectionHeading className="mt-5">
            Connect Once. <Mute>Your Numbers</Mute> Keep Up.
          </SectionHeading>
        </div>
        <p data-reveal className="max-w-md text-[1.05rem] leading-relaxed text-mute lg:justify-self-end">
          Lightcash finds your accounts, selects the ones that belong to the business and keeps them in sync. You review
          once, and the agent does the routine work every day.
        </p>
      </div>

      <div className="relative isolate mt-12 overflow-hidden rounded-[28px] px-4 py-6 sm:px-8 sm:py-8">
        <Field palette="twilight" className="-z-10" />
        <Logo className="text-white" />

        <div className="mx-auto grid max-w-xl gap-3 py-20 sm:py-28">
          {accounts.map((account) => (
            <GlassCard key={account.name}>
              <span
                className={`mt-1 grid size-7 shrink-0 place-items-center rounded-lg sm:size-8 ${
                  account.selected ? "bg-peri" : "border-2 border-white/30"
                }`}
              >
                {account.selected && <span className="size-2.5 rounded-full bg-[#1b1720] sm:size-3" />}
                <span className="sr-only">{account.selected ? "Selected" : "Not selected"}</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[1.35rem] leading-tight sm:text-[1.75rem]">{account.name}</span>
                <span className="mt-1.5 flex gap-4 text-[0.95rem] text-white/60 sm:text-lg">
                  <span>{account.kind}</span>
                  <span>{account.status}</span>
                </span>
              </span>
            </GlassCard>
          ))}
          <GlassCard>
            <DotLoader />
            <span className="text-[1.35rem] leading-tight sm:text-[1.75rem]">Matching 1,284 transactions</span>
          </GlassCard>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-[0.95rem]">
          Lightcash pre-selects business accounts and skips personal ones. You confirm once. “Start sync” is the only
          input you give.
        </p>
      </div>
    </section>
  );
}
