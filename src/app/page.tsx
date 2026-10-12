import { AfterSync } from "@/components/after-sync";
import { AgentShowcase } from "@/components/agent-showcase";
import { Enhancer } from "@/components/enhancer";
import { FinalCta } from "@/components/final-cta";
import { GetSave } from "@/components/get-save";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Personas } from "@/components/personas";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <Personas />
        <HowItWorks />
        <AgentShowcase />
        <AfterSync />
        <GetSave />
        <FinalCta />
      </main>
      <SiteFooter />
      <Enhancer />
    </>
  );
}
