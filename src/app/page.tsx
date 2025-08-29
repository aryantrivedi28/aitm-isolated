import Hero from "../components/home/Hero";
import WhatWeDo from "../components/home/WhatWeDo";
import HowItWorks from "../components/home/HowItWorks";
import ClientLogos from "../components/home/ClientLogo";
import Testimonials from "../components/home/Testimonials";
import WhyUs from "../components/home/WhyUs";
import ServiceCategories from "../components/home/ServiceCategories";
import FAQ from "../components/home/FAQ";
import BottomCTA from "../components/home/BottomCTA";

const Index = () => {
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
};

export default Index;