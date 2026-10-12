import { DashboardMock } from "@/components/dashboard-mock";
import { ArrowRight, Check, ChevronDown, FileText } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { Mute, Pill, SectionHeading, StepNumber } from "@/components/ui";
import { wrap } from "@/lib/site";

const updates = [
  {
    who: "Lightcash agent",
    avatar: <LogoMark className="size-3.5" />,
    avatarClass: "bg-ink text-paper",
    status: "Alert",
    what: "Cash dips below $20k on Nov 3 if the Acme invoice is late",
    when: "5 min ago",
  },
  {
    who: "Maya Patel",
    avatar: "MP",
    avatarClass: "bg-[#f3d9cf] text-[#8c3326]",
    status: "Downloaded",
    what: "Q3 profit and loss",
    when: "12 min ago",
  },
];

export function AfterSync() {
  return (
    <section className={`${wrap} pb-24 sm:pb-32`}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <Pill>Always current</Pill>
          <SectionHeading className="mt-5">
            No Surprises <Mute>At</Mute> Month-End
          </SectionHeading>
        </div>
        <p className="max-w-md text-[1.05rem] leading-relaxed text-mute lg:justify-self-end">
          Reports, projections and alerts update as money moves. Your accountant gets clean books at tax time, and you
          get answers today.
        </p>
      </div>

      <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0 rounded-[28px] border border-line p-2">
          <div className="overflow-hidden rounded-[22px] bg-ink px-3 pt-3 sm:px-5 sm:pt-5">
            <div className="max-h-[22rem] overflow-hidden rounded-t-xl sm:max-h-[26rem]">
              <DashboardMock className="rounded-b-none" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 px-3 pt-3 pb-1 text-[0.95rem]">
            <span className="flex items-center gap-2 rounded-full bg-cloud px-3 py-1.5">
              <FileText className="size-4" /> October report ready
            </span>
            <a href="#early-access" className="inline-flex items-center gap-1.5 font-medium hover:underline">
              Learn more <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <StepNumber n="04" />
          <h3 className="mt-8 text-[1.75rem] leading-tight tracking-[-0.02em] text-balance">
            Nothing Waits On The Bookkeeper
          </h3>
          <p className="mt-4 max-w-md leading-relaxed text-mute">
            Lightcash writes the monthly report, flags cash risks early and answers questions in plain language. Ask
            “Can I hire in January?” and get an answer based on your real numbers.
          </p>

          <div className="mt-10 grid gap-4">
            {updates.map((u) => (
              <div key={u.what} className="rounded-3xl border-[1.5px] border-dashed border-ink/70 p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[0.6rem] font-semibold ${u.avatarClass}`}>
                    {u.avatar}
                  </span>
                  <span className="font-medium">{u.who}</span>
                  <ChevronDown className="size-3.5 text-mute" />
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-cloud px-2.5 py-0.5 text-xs font-medium">
                    <Check className="size-3" /> {u.status}
                  </span>
                </div>
                <p className="mt-3 flex items-baseline justify-between gap-4 text-[0.95rem] text-ink-soft">
                  <span className="min-w-0">{u.what}</span>
                  <span className="shrink-0 text-sm text-mute">{u.when}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
