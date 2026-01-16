import CaseStudies from "../components/home/CaseStudies";
import Hero from "../components/home/Hero";
import WhoThisIsFor from "../components/home/WhoThisFor";
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
      <WhoThisIsFor />
      {/* <Testimonials /> */}
      <CaseStudies />
      <WhyUs />
      <ServiceCategories />
      <FAQ />
      <BottomCTA />
    </div>
  );
}
