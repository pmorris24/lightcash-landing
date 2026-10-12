export const site = {
  name: "Lightcash",
  // Every "Get early access" button scrolls to the sign-up form in the closing call to action.
  earlyAccessUrl: "#early-access",
  // TODO: point this at the real booking page (Cal.com, Calendly).
  bookCallUrl: "#early-access",
  signInUrl: "#",
  /**
   * Where the early-access form sends sign-ups: any endpoint that accepts a JSON POST, such as a
   * Formspree form URL (https://formspree.io/f/<id>). The body is { name, email, role, source }.
   * TODO: set this. While it is empty the form tells visitors sign-ups open soon and collects nothing.
   */
  signupEndpoint: "",
};

export const nav = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Agent", href: "#agent" },
  { label: "Early access", href: "#early-access" },
];

/** Shared page gutter and max width. */
export const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";
