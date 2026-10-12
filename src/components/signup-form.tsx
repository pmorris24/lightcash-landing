"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { site } from "@/lib/site";

gsap.registerPlugin(useGSAP);

const roles = ["Small business", "Solo builder", "Something else"];

// Glass fields on the dark call-to-action panel.
const field =
  "h-12 rounded-full border-white/25 bg-white/12 px-5 text-[0.95rem] text-white backdrop-blur-md placeholder:text-white/65 hover:bg-white/16 focus-visible:border-white/70 aria-invalid:border-[#ffb4a3] md:text-[0.95rem]";
const label = "mb-1.5 block pl-5 text-xs font-normal tracking-wider text-white/75 uppercase";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Sign-up form for the closing call to action. Posts the fields as JSON to site.signupEndpoint; while
 * that is empty it tells visitors sign-ups open soon and sends nothing. Without JavaScript the form
 * posts straight to the endpoint.
 */
export function SignupForm() {
  const root = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState(roles[0]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState("");

  const { contextSafe } = useGSAP({ scope: root });
  const shake = contextSafe(() => {
    if (!reduceMotion()) gsap.fromTo("form", { x: 0 }, { keyframes: { x: [-8, 7, -5, 3, 0] }, duration: 0.45, ease: "power1.out" });
  });

  // The confirmation arrives, then takes focus so screen readers announce it.
  useGSAP(
    () => {
      const panel = root.current?.querySelector<HTMLElement>("[data-signup-done]");
      if (!done || !panel) return;
      const announce = () => panel.focus({ preventScroll: true });
      if (reduceMotion()) return announce();
      gsap
        .timeline({ onComplete: announce })
        .from(panel, { autoAlpha: 0, y: 16, duration: 0.7, ease: "expo.out" })
        .from("[data-signup-check]", { scale: 0, rotation: -90, duration: 0.8, ease: "back.out(2)" }, "<0.1");
    },
    { scope: root, dependencies: [done] },
  );

  // "Get started free" links scroll here; put the cursor in the email field on desktop.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest('a[href="#get-started"]');
      if (link && window.matchMedia("(pointer: fine)").matches) emailRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = emailRef.current;
    if (!email) return;
    if (!email.checkValidity()) {
      setInvalid(true);
      setMessage(email.value ? "That email doesn’t look right. Check it and try again." : "Enter your email to get started.");
      email.focus();
      shake();
      return;
    }
    if (!site.signupEndpoint) {
      setMessage("Sign-ups open soon. We’re connecting the list, so please check back shortly.");
      return;
    }

    const data = Object.fromEntries(new FormData(event.currentTarget));
    // Bots fill the hidden field; treat them as signed up and send nothing.
    if (data._gotcha) return setDone(true);
    delete data._gotcha;

    setSending(true);
    setMessage("");
    try {
      const response = await fetch(site.signupEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Sign-up failed with ${response.status}`);
      setDone(true);
    } catch {
      setMessage("Something went wrong on our side. Please try again in a moment.");
      shake();
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={root} data-reveal className="mx-auto mt-10 max-w-xl text-left">
      {done ? (
        <div
          data-signup-done
          tabIndex={-1}
          className="rounded-[28px] border border-white/15 bg-black/15 px-6 py-10 text-center outline-none backdrop-blur-md"
        >
          <span data-signup-check className="mx-auto grid size-14 place-items-center rounded-full bg-paper text-ink">
            <Check className="size-6" />
          </span>
          <p className="mt-5 text-[1.6rem] leading-tight tracking-[-0.02em]">You’re in.</p>
          <p className="mx-auto mt-2 max-w-sm leading-relaxed text-white/85">
            Thanks for signing up. We’ll email you to get your accounts connected.
          </p>
        </div>
      ) : (
        <form
          action={site.signupEndpoint || undefined}
          method="post"
          noValidate
          onSubmit={onSubmit}
          className="grid gap-3 rounded-[28px] border border-white/15 bg-black/15 p-3 backdrop-blur-md sm:p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="signup-name" className={label}>
                Name
              </Label>
              <Input id="signup-name" name="name" type="text" autoComplete="name" placeholder="Maya Patel" className={field} />
            </div>
            <div>
              <Label htmlFor="signup-email" className={label}>
                Work email
              </Label>
              <Input
                ref={emailRef}
                id="signup-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="maya@northwind.studio"
                aria-invalid={invalid || undefined}
                aria-describedby="signup-status"
                onChange={(event) => {
                  if (invalid && event.currentTarget.checkValidity()) {
                    setInvalid(false);
                    setMessage("");
                  }
                }}
                className={field}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="signup-role" className={label}>
              I am a
            </Label>
            <Select name="role" value={role} onValueChange={setRole}>
              <SelectTrigger
                id="signup-role"
                className={`${field} w-full pr-5 data-[size=default]:h-12 [&_svg]:text-white/75`}
              >
                {/* Rendered explicitly so the static HTML shows the choice before React loads. */}
                <SelectValue>{role}</SelectValue>
              </SelectTrigger>
              <SelectContent position="popper" className="rounded-2xl p-1">
                {roles.map((r) => (
                  <SelectItem key={r} value={r} className="rounded-xl py-2 pl-3 text-[0.95rem]">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Spam trap: people never see or fill this field. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="signup-company">Company website</label>
            <input id="signup-company" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <input type="hidden" name="source" value="landing-page" />

          <Button type="submit" variant="inverse" size="pill" disabled={sending} className="mt-1 w-full disabled:cursor-progress">
            {sending ? "Joining…" : "Get started free"}
            <ArrowRight />
          </Button>
          <p
            id="signup-status"
            role="status"
            aria-live="polite"
            className="min-h-5 px-5 text-sm text-white/90 empty:-mt-3 empty:min-h-0"
          >
            {message}
          </p>
        </form>
      )}
    </div>
  );
}
