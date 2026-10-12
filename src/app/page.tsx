import { Audience } from "@/components/audience";
import { Enhancer } from "@/components/enhancer";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Problem } from "@/components/problem";
import { SiteFooter } from "@/components/site-footer";
import { Testimonial } from "@/components/testimonial";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <Problem />
        <HowItWorks />
        <Features />
        <Audience />
        <Testimonial />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <Enhancer />
    </>
  );
}
