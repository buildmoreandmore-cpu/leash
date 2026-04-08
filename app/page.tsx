import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { InlineDemo } from "@/components/marketing/inline-demo";
import { Problem } from "@/components/marketing/problem";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { DemoTeaser } from "@/components/marketing/demo-teaser";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <InlineDemo />
        <Problem />
        <Features />
        <HowItWorks />
        <DemoTeaser />
        <PricingCards />
        <WaitlistForm />
      </main>
      <Footer />
    </div>
  );
}
