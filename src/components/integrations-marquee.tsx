import { siQuickbooks, siShopify, siStripe, siXero, type SimpleIcon } from "simple-icons";

// TODO: confirm this list matches the integrations that ship at launch.
// Logos are from simple-icons (CC0). Plaid is not in that set and Gusto's entry is its wordmark,
// so both show as their names only.
const integrations: { name: string; icon?: SimpleIcon }[] = [
  { name: "Stripe", icon: siStripe },
  { name: "QuickBooks", icon: siQuickbooks },
  { name: "Xero", icon: siXero },
  { name: "Shopify", icon: siShopify },
  { name: "Gusto" },
  { name: "Plaid" },
];

/**
 * An endless row of integration logos. The list is rendered twice and slides left by half its width,
 * so the loop is seamless; it pauses on hover and stands still (one centred, wrapping copy) for
 * reduced motion.
 */
export function IntegrationsMarquee() {
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:[mask-image:none]">
      <ul
        aria-label="Integrations"
        className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4"
      >
        {[...integrations, ...integrations].map(({ name, icon }, i) => {
          const copy = i >= integrations.length;
          return (
            <li
              key={`${name}-${i}`}
              aria-hidden={copy || undefined}
              className={`flex items-center gap-3 px-7 sm:px-9 ${copy ? "motion-reduce:hidden" : ""}`}
            >
              {icon && (
                <svg viewBox="0 0 24 24" className="size-6 shrink-0 sm:size-7" fill="currentColor" aria-hidden="true">
                  <path d={icon.path} />
                </svg>
              )}
              <span className="text-[1.45rem] font-semibold tracking-[-0.03em] whitespace-nowrap sm:text-[1.75rem]">
                {name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
