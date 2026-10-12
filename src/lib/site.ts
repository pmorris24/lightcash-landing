export const site = {
  name: "Lightcash",
  tagline: "Built for solo builders and small businesses.",
  // Every "Get started free" button scrolls to the sign-up form in the closing call to action.
  getStartedUrl: "#get-started",
  signInUrl: "#",
  /**
   * Where the sign-up form sends sign-ups: any endpoint that accepts a JSON POST, such as a
   * Formspree form URL (https://formspree.io/f/<id>). The body is { name, email, role, source }.
   * TODO: set this. While it is empty the form tells visitors sign-ups open soon and collects nothing.
   */
  signupEndpoint: "",
};

export const nav = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Who it’s for", href: "#who-its-for" },
  { label: "FAQ", href: "#faq" },
];

/** Shared page gutter and max width. */
export const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";
