import { ArrowRight, Check, ChevronDown } from "@/components/icons";
import { site } from "@/lib/site";

const roles = ["Small business owner", "Solo builder or freelancer", "Founder or start-up"];

const field =
  "h-12 w-full rounded-full border border-white/25 bg-white/12 px-5 text-[0.95rem] text-white backdrop-blur-md transition-colors placeholder:text-white/55 hover:bg-white/16 focus-visible:border-white/70 focus-visible:outline-none aria-invalid:border-[#ffb4a3]";
const label = "mb-1.5 block pl-5 text-xs tracking-wider text-white/75 uppercase";

/**
 * Early-access sign-up. The markup is static; `mountSignup` in src/lib/enhance.ts handles submit,
 * validation and the success state. Without JavaScript the form posts straight to the endpoint.
 */
export function SignupForm() {
  return (
    <div data-reveal className="mx-auto mt-10 max-w-xl text-left">
      <form
        data-signup
        action={site.signupEndpoint || undefined}
        method="post"
        noValidate
        className="grid gap-3 rounded-[28px] border border-white/15 bg-black/15 p-3 backdrop-blur-md sm:p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="signup-name" className={label}>
              Name
            </label>
            <input id="signup-name" name="name" type="text" autoComplete="name" placeholder="Maya Patel" className={field} />
          </div>
          <div>
            <label htmlFor="signup-email" className={label}>
              Work email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="maya@northwind.studio"
              aria-describedby="signup-status"
              className={field}
            />
          </div>
        </div>
        <div>
          <label htmlFor="signup-role" className={label}>
            I am a
          </label>
          <div className="relative">
            <select id="signup-role" name="role" defaultValue={roles[0]} className={`${field} appearance-none pr-12`}>
              {roles.map((role) => (
                <option key={role} className="text-ink">
                  {role}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2 text-white/75" />
          </div>
        </div>

        {/* Spam trap: people never see or fill this field. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="signup-company">Company website</label>
          <input id="signup-company" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="source" value="landing-page" />

        <button
          type="submit"
          className="mt-1 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-paper px-6 text-[0.95rem] font-medium text-ink transition-colors hover:bg-cloud focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-progress disabled:opacity-80"
        >
          <span data-signup-label>Get free early access</span>
          <ArrowRight className="size-4" />
        </button>
        <p id="signup-status" data-signup-status role="status" aria-live="polite" className="min-h-5 px-5 text-sm text-white/85" />
      </form>

      <div data-signup-done hidden className="rounded-[28px] border border-white/15 bg-black/15 px-6 py-10 text-center backdrop-blur-md">
        <span data-signup-check className="mx-auto grid size-14 place-items-center rounded-full bg-paper text-ink">
          <Check className="size-6" />
        </span>
        <p className="mt-5 text-[1.6rem] leading-tight tracking-[-0.02em]">You’re on the list.</p>
        <p className="mx-auto mt-2 max-w-sm leading-relaxed text-white/80">
          We will email you when your early access is ready.
        </p>
      </div>

      <p className="mt-5 text-center text-sm text-white/75">
        Prefer to talk it through?{" "}
        <a href={site.bookCallUrl} className="font-medium text-white underline underline-offset-4 hover:text-white/85">
          Book a call
        </a>
      </p>
    </div>
  );
}
