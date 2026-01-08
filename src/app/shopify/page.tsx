"use client"

import React from "react"

const HeroSection = () => {
  return (
    <section className="bg-[#faf4e5] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#050504] leading-tight">
              Strategy-Led Shopify — Development Backed by Experience
            </h1>
            <p className="text-xl text-[#31302f] leading-relaxed font-light">
              Transform your store with custom Shopify solutions that drive sales, speed, and seamless user experiences.
            </p>
            <button className="w-fit bg-[#f7af00] hover:bg-[#e09a00] text-[#050504] px-8 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get Started Today
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {[
              { icon: "🎯", title: "CRO Optimization", desc: "Boost conversions with data-driven tweaks" },
              { icon: "⚡", title: "Performance Tuning", desc: "Lightning-fast loading times that convert" },
              { icon: "🛍️", title: "Store Design", desc: "Stunning layouts that showcase your brand" },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border-l-4 border-[#f7af00] shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-4 items-start">
                  <span className="text-4xl">{service.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#050504]">{service.title}</h3>
                    <p className="text-[#31302f] text-sm mt-1">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const BrandTrustSection = () => {
  const brands = ["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"]

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[#31302f] text-lg mb-12 font-light">
          Trusted by leading brands to power their e-commerce success.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="bg-[#faf4e5] h-24 rounded-lg flex items-center justify-center font-semibold text-[#050504] hover:bg-[#f0eadd] transition-colors duration-300"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ServiceIntro = () => {
  return (
    <section className="bg-[#f0eadd] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] leading-tight">
              Why Choose Our Shopify Service
            </h2>
            <p className="text-lg text-[#31302f] leading-relaxed font-light">
              We help ambitious brands launch, optimize, and scale Shopify stores that convert visitors into loyal
              customers.
            </p>
            <ul className="space-y-4">
              {[
                "Expert team with 50+ successful launches",
                "Data-driven approach to CRO",
                "Ongoing support and optimization",
              ].map((benefit, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="text-[#f7af00] text-xl font-bold mt-1">✓</span>
                  <span className="text-[#31302f]">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#f7af00]/20 to-[#f0eadd] h-80 lg:h-96 rounded-2xl flex items-center justify-center text-[#31302f] font-semibold">
            Dashboard Image
          </div>
        </div>
      </div>
    </section>
  )
}

const ServiceDetails = () => {
  const services = [
    { title: "Shopify Store Setup", desc: "From zero to launch-ready in weeks" },
    { title: "Custom Development", desc: "Bespoke features tailored to your brand" },
    { title: "Migration Services", desc: "Seamless transition from existing platforms" },
    { title: "Performance Optimization", desc: "Speed optimization for better conversions" },
  ]

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">
          What We Deliver for Your Shopify Store
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-[#faf4e5] p-8 rounded-xl hover:shadow-xl transition-all duration-300 border border-[#f0eadd] group"
            >
              <div className="text-5xl font-bold text-[#f7af00] mb-4 group-hover:scale-110 transition-transform duration-300">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-bold text-[#050504] mb-3">{service.title}</h3>
              <p className="text-[#31302f] leading-relaxed">{service.desc}</p>
              <div className="h-1 w-12 bg-[#f7af00] mt-6 group-hover:w-24 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ProblemsSection = () => {
  const problems = [
    { title: "Low Conversions", solution: "A/B tested CRO strategies lifting rates by 20-50%" },
    { title: "Slow Performance", solution: "Optimized code and caching for sub-2s load times" },
    { title: "Poor UX", solution: "Redesigned experiences that users actually love" },
    { title: "Complex Integration", solution: "Seamless API connections with tools you use" },
  ]

  return (
    <section className="bg-[#faf4e5] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">
          Struggling with These Common Shopify Challenges?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-xl border-l-4 border-[#f7af00] shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-[#050504] mb-4">{problem.title}</h3>
              <p className="text-[#31302f] leading-relaxed">{problem.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const MidPageCTA = () => {
  return (
    <section className="bg-[#f7af00] py-20 lg:py-28">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl lg:text-6xl font-bold text-[#050504] mb-6">Ready to scale?</h2>
        <p className="text-xl text-[#050504] mb-12 font-light">Let's discuss your store in 15 minutes.</p>
        <button className="bg-[#050504] hover:bg-[#1a1a19] text-white px-10 py-5 rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105 shadow-lg">
          Schedule a Free Strategy Call
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </button>
      </div>
    </section>
  )
}

const CoreFeatures = () => {
  const features = [
    { icon: "📱", title: "Responsive Design", desc: "Perfect on all devices" },
    { icon: "⚙️", title: "Easy Integration", desc: "Connect your favorite tools" },
    { icon: "🔒", title: "Secure & Compliant", desc: "Payment processing built-in" },
    { icon: "🚀", title: "Lightning Fast", desc: "Optimized for speed" },
  ]

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">
          Creative Intuitive Shopify Experience for Every User
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#faf4e5] p-8 rounded-xl text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#050504] mb-3">{feature.title}</h3>
              <p className="text-[#31302f] text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const WorkflowSection = () => {
  const steps = [
    { num: "1", title: "Discovery & Scoping", desc: "Audit and plan (1 week)" },
    { num: "2", title: "Design & Strategy", desc: "Wireframes and testing plan (1 week)" },
    { num: "3", title: "Development", desc: "Building your custom store (2-3 weeks)" },
    { num: "4", title: "Testing & QA", desc: "Thorough testing across devices (1 week)" },
    { num: "5", title: "Launch & Support", desc: "Go live with ongoing support" },
  ]

  return (
    <section className="bg-[#f0eadd] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">Our Proven 5-Step Process</h2>
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div key={idx}>
              <div className="flex gap-8 items-start">
                <div className="bg-[#f7af00] text-[#050504] font-bold text-2xl w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  {step.num}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold text-[#050504] mb-2">{step.title}</h3>
                  <p className="text-[#31302f]">{step.desc}</p>
                </div>
              </div>
              {idx < steps.length - 1 && <div className="ml-8 h-12 border-l-2 border-[#f7af00] mt-4" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CaseStudies = () => {
  const cases = [
    { name: "Store A", result: "+45% conversion", image: "Case 1" },
    { name: "Store B", result: "-2.3s load time", image: "Case 2" },
    { name: "Store C", result: "+$120k MRR", image: "Case 3" },
  ]

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">Live Store Examples</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((caseItem, idx) => (
            <div
              key={idx}
              className="bg-[#faf4e5] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-br from-[#f7af00]/30 to-[#f0eadd] h-48 flex items-center justify-center text-[#31302f] font-semibold">
                {caseItem.image}
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-[#050504] mb-2">{caseItem.name}</h3>
                <p className="text-[#f7af00] font-bold text-lg">{caseItem.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PerformanceMetrics = () => {
  const metrics = [
    { value: "30-60%", label: "Conversion Lift" },
    { value: "2.3s", label: "Avg Load Time" },
    { value: "98%", label: "Uptime SLA" },
    { value: "50+", label: "Projects Delivered" },
  ]

  return (
    <section className="bg-[#faf4e5] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">
          Proven Results Across Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white p-10 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-5xl font-bold text-[#f7af00] mb-4">{metric.value}</div>
              <div className="text-lg font-semibold text-[#050504]">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TechStack = () => {
  const tools = ["Shopify Plus", "React", "Node.js", "Liquid", "Vercel", "Stripe"]

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">Powered by the Best Tools</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-[#faf4e5] px-8 py-4 rounded-full font-semibold text-[#050504] hover:bg-[#f7af00] hover:text-[#050504] transition-all duration-300 shadow-md"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TargetAudience = () => {
  const audiences = [
    { title: "New Brands", desc: "Launching their first store" },
    { title: "Growing Brands", desc: "Ready to scale beyond limits" },
    { title: "Enterprise", desc: "Complex integrations and scale" },
  ]

  return (
    <section className="bg-[#f0eadd] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">Perfect For...</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, idx) => (
            <div
              key={idx}
              className="bg-white p-10 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#f7af00]"
            >
              <h3 className="text-2xl font-bold text-[#050504] mb-4">{audience.title}</h3>
              <p className="text-[#31302f] leading-relaxed">{audience.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Testimonials = () => {
  const testimonials = [
    { text: "Absolutely transformed our store performance.", author: "Sarah, Founder" },
    { text: "The team was professional and delivery was on time.", author: "John, CEO" },
    { text: "Our conversion rates doubled within 3 months.", author: "Emily, CMO" },
  ]

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-[#faf4e5] p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-lg text-[#31302f] italic mb-6 leading-relaxed">"{testimonial.text}"</p>
              <p className="text-[#050504] font-semibold">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQSection = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const faqs = [
    { q: "Do you only work on Shopify?", a: "No, we specialize but handle full-stack solutions." },
    { q: "What is the typical timeline?", a: "Most projects take 4-8 weeks from discovery to launch." },
    { q: "Do you offer ongoing support?", a: "Yes, we include 3 months of post-launch support." },
  ]

  return (
    <section className="bg-[#faf4e5] py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">
          Got Questions? We've Got Answers.
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <button
                className="w-full flex items-center justify-between p-6 hover:bg-[#f0eadd] transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-lg font-semibold text-[#050504]">{faq.q}</span>
                <svg
                  className={`w-6 h-6 text-[#f7af00] transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-[#31302f] border-t border-[#f0eadd] pt-4 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const RelatedServices = () => {
  const services = [
    { title: "Shopify + GHL Automation", desc: "Email/SMS automation integration" },
    { title: "Advanced Analytics", desc: "Real-time insights and reporting" },
    { title: "A/B Testing Suite", desc: "Data-driven optimization tools" },
  ]

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#050504] mb-16 text-center">
          Supercharge with Integrations
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-[#faf4e5] p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-[#f0eadd]"
            >
              <h3 className="text-xl font-bold text-[#050504] mb-3">{service.title}</h3>
              <p className="text-[#31302f] leading-relaxed">{service.desc}</p>
              <div className="h-1 w-12 bg-[#f7af00] mt-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FinalCTA = () => {
  return (
    <section className="bg-[#f7af00] py-20 lg:py-28">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl lg:text-6xl font-bold text-[#050504] mb-6">Don't settle for average.</h2>
        <p className="text-xl text-[#050504] mb-12 font-light">Build a store that sells.</p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="bg-[#050504] hover:bg-[#1a1a19] text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            Get Quote
          </button>
          <button className="border-2 border-[#050504] bg-transparent hover:bg-[#050504]/10 text-[#050504] px-10 py-4 rounded-xl font-semibold transition-all duration-300">
            View Portfolio
          </button>
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-[#050504] text-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <p className="text-[#faf4e5]">Email: contact@farziengineer.com</p>
            <p className="text-[#faf4e5]">Phone: +1 (555) 123-4567</p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <a href="#" className="text-[#faf4e5] hover:text-[#f7af00] transition-colors duration-200">
              Services
            </a>
            <a href="#" className="text-[#faf4e5] hover:text-[#f7af00] transition-colors duration-200">
              Portfolio
            </a>
            <a href="#" className="text-[#faf4e5] hover:text-[#f7af00] transition-colors duration-200">
              About
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">Legal</h3>
            <a href="#" className="text-[#faf4e5] hover:text-[#f7af00] transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-[#faf4e5] hover:text-[#f7af00] transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="border-t border-[#31302f] pt-8 text-center text-[#f0eadd]">
          <p>&copy; 2026 Shopify Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

const ShopifyServicePage = () => {
  return (
    <div className="shopify-service-page">
      <HeroSection />
      <BrandTrustSection />
      <ServiceIntro />
      <ServiceDetails />
      <ProblemsSection />
      <MidPageCTA />
      <CoreFeatures />
      <WorkflowSection />
      <CaseStudies />
      <PerformanceMetrics />
      <TechStack />
      <TargetAudience />
      <Testimonials />
      <FAQSection />
      <RelatedServices />
      <FinalCTA />
      <Footer />
    </div>
  )
}

export default ShopifyServicePage
