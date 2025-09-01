import Hero from "../components/home/Hero";
import {
  WhatWeDo,
  HowItWorks,
  ClientLogos,
  Testimonials,
  WhyUs,
  ServiceCategories,
  FAQ,
  BottomCTA,
} from "./home-sections";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhatWeDo />
      <HowItWorks />
      <ClientLogos />
      <Testimonials />
      <WhyUs />
      <ServiceCategories />
      <FAQ />
      <BottomCTA />
    </div>
  );
}
