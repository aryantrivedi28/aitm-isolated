"use client"; // <-- makes this a client component

import dynamic from "next/dynamic";

// Lazy load below-the-fold sections
export const WhatWeDo = dynamic(() => import("../components/home/WhatWeDo"), { ssr: false });
export const HowItWorks = dynamic(() => import("../components/home/HowItWorks"), { ssr: false });
export const ClientLogos = dynamic(() => import("../components/home/ClientLogo"), { ssr: false });
export const Testimonials = dynamic(() => import("../components/home/Testimonials"), { ssr: false });
export const WhyUs = dynamic(() => import("../components/home/WhyUs"), { ssr: false });
export const ServiceCategories = dynamic(() => import("../components/home/ServiceCategories"), { ssr: false });
export const FAQ = dynamic(() => import("../components/home/FAQ"), { ssr: false });
export const BottomCTA = dynamic(() => import("../components/home/BottomCTA"), { ssr: false });
