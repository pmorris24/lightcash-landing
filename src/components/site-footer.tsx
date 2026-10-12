import { Logo } from "@/components/logo";
import { nav, site, wrap } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className={`${wrap} flex flex-col gap-6 border-t border-line py-10 sm:flex-row sm:items-center`}>
      <div>
        <Logo />
        <p className="mt-7 text-sm text-mute">{site.tagline}</p>
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft sm:ml-auto">
        {nav.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="hover:text-ink">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-mute">© 2026 Lightcash</p>
    </footer>
  );
}
