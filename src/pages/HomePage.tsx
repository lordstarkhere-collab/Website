import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { Paradigm } from "../components/Paradigm";
import { SystemCore } from "../components/SystemCore";
import { AutomationCore } from "../components/AutomationCore";
import { ScrollTextReveal } from "../components/ScrollTextReveal";
import { Lifecycle } from "../components/Lifecycle";
import { Modules } from "../components/Modules";
import { DashboardShowcase } from "../components/DashboardShowcase";
import { ZoomSection } from "../components/ZoomSection";
import { Analytics } from "../components/Analytics";
import { DiscordIntegration } from "../components/DiscordIntegration";
import { Testimonials } from "../components/Testimonials";
import { Pricing as PricingSection } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { CTA } from "../components/CTA";
import { InteractiveSim } from "../components/InteractiveSim";
import { SectionSeam } from "../components/ui";
import { ExploreTeaser } from "../components/site/ExploreTeaser";

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Paradigm />
      <SectionSeam label="engine" />
      <SystemCore />
      <InteractiveSim />
      <ScrollTextReveal />
      <AutomationCore />
      <SectionSeam label="lifecycle" />
      <Lifecycle />
      <ZoomSection id="modules-zoom" rotate={2}>
        <Modules />
      </ZoomSection>
      <ZoomSection id="dashboard-zoom" rotate={-1.5}>
        <DashboardShowcase />
      </ZoomSection>
      <Analytics />
      <DiscordIntegration />
      <ExploreTeaser />
      <SectionSeam label="proof" />
      <ZoomSection id="testimonials-zoom" rotate={1.8}>
        <Testimonials />
      </ZoomSection>
      <PricingSection />
      <FAQ />
      <CTA />
    </>
  );
}
