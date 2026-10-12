import { DashboardMock } from "@/components/dashboard-mock";
import { SectionHeading } from "@/components/ui";
import { wrap } from "@/lib/site";

const features = [
  {
    title: "Live cash view",
    body: "Balances, inflows and outflows across every account, always up to date.",
  },
  {
    title: "Sensible projections",
    body: "See your runway, upcoming obligations and what-if scenarios before they become surprises.",
  },
  {
    title: "Reporting, covered",
    body: "P&L, cash flow and balance sheet, generated on demand and ready to share.",
  },
  {
    title: "One source of truth",
    body: "Your dashboard, forecasts and reports all come from the same numbers, so they never disagree.",
  },
];

export function Features() {
  return (
    <section id="features" className={`${wrap} scroll-mt-6 pb-24 sm:pb-32`}>
      <SectionHeading className="max-w-3xl">Everything your bookkeeper did, and more.</SectionHeading>

      <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        <div data-reveal className="min-w-0 rounded-[28px] border border-line p-2">
          <div className="overflow-hidden rounded-[22px] bg-ink px-3 pt-3 sm:px-5 sm:pt-5">
            <div className="max-h-[22rem] overflow-hidden rounded-t-xl sm:max-h-[27rem]">
              <DashboardMock className="rounded-b-none" />
            </div>
          </div>
        </div>

        <dl data-reveal className="grid">
          {features.map((f, i) => (
            <div key={f.title} className={`py-6 ${i ? "border-t border-line" : "pt-0 lg:pt-2"}`}>
              <dt className="text-[1.3rem] leading-tight tracking-[-0.02em]">{f.title}</dt>
              <dd className="mt-2 leading-relaxed text-pretty text-mute">{f.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
