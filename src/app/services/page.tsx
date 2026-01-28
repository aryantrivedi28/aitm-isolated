import { Calendar, ChevronRight, Users, Zap, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  // Services data
  const services = [
    {
      id: 'shopify',
      title: 'Shopify Development & Optimization',
      description: 'High-converting Shopify stores built for performance, scalability, and sales growth.',
      highlights: [
        'Store setup & design',
        'Custom development',
        'Conversion optimization',
        'Speed & performance'
      ],
      ctaText: 'View Shopify Services',
      ctaLink: '/shopify',
    },
    {
      id: 'go-highlevel',
      title: 'GoHighLevel Automation & CRM',
      description: 'Powerful CRM and automation systems that capture, nurture, and convert leads automatically.',
      highlights: [
        'CRM & pipeline setup',
        'Funnels & landing pages',
        'Email & SMS automation',
        'White-label & agency setup'
      ],
      ctaText: 'View GoHighLevel Services',
      ctaLink: '/gohighlevel-crm',
    }
  ];

  // Comparison data
  const comparisonData = [
    { goal: 'Sell products online', fit: 'Shopify' },
    { goal: 'Increase store conversions', fit: 'Shopify' },
    { goal: 'Automate lead follow-ups', fit: 'GoHighLevel' },
    { goal: 'Manage leads & pipelines', fit: 'GoHighLevel' }
  ];

  // Process steps
  const processSteps = [
    {
      step: 1,
      title: 'Business requirement analysis',
      description: 'We dive deep into your business needs and goals to understand your unique challenges.'
    },
    {
      step: 2,
      title: 'Strategy & system planning',
      description: 'We create a customized roadmap and technical plan for your solution.'
    },
    {
      step: 3,
      title: 'Development & automation',
      description: 'Our experts build and implement your system with best practices and latest technologies.'
    },
    {
      step: 4,
      title: 'Testing & launch',
      description: 'Rigorous testing ensures everything works perfectly before going live.'
    },
    {
      step: 5,
      title: 'Ongoing support & scaling',
      description: 'We provide continuous support and help you scale your system as you grow.'
    }
  ];

  // Business types
  const businessTypes = [
    { name: 'Startups', description: 'Build scalable foundations from day one' },
    { name: 'DTC & eCommerce brands', description: 'Optimize online sales and customer experience' },
    { name: 'Agencies', description: 'White-label solutions for your clients' },
    { name: 'Coaches & consultants', description: 'Automate lead capture and client management' },
    { name: 'Local & service businesses', description: 'Streamline operations and customer follow-ups' }
  ];

  // Value propositions
  const valuePropositions = [
    {
      title: 'Specialized Shopify & GHL experts',
      description: 'Deep expertise in both platforms ensures seamless integration and optimal performance.',
      icon: '🎯'
    },
    {
      title: 'Conversion-focused approach',
      description: 'Every solution is designed with your bottom line in mind, maximizing ROI.',
      icon: '📈'
    },
    {
      title: 'Scalable, future-ready systems',
      description: 'Build systems that grow with your business, avoiding costly reworks.',
      icon: '⚡'
    },
    {
      title: 'Clear communication & support',
      description: 'Transparent processes and dedicated support throughout our partnership.',
      icon: '💬'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf4e5]">
      {/* Hero Section */}
      <section className="relative text-[#050504]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
              Our Services
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#050504] mt-4 mb-8 sm:mb-10 max-w-3xl mx-auto">
              End-to-end Shopify and GoHighLevel solutions designed to scale sales,
              automate operations, and drive growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/client-request"
                className="bg-[#f7af00] text-[#050504] hover:bg-[#e69f00] px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                Book a Free Consultation
              </Link>

              <a
                href="#services-overview"
                className="bg-transparent border-2 border-[#f7af00] text-[#f7af00] hover:bg-[#f7af00]/10 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all inline-flex items-center justify-center gap-2"
              >
                Explore Our Services
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services-overview" className="py-12 md:py-20 bg-[#faf4e5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-[#31302f] mb-4 md:mb-6">
              Complete Growth Solutions
            </h2>
            <p className="text-lg md:text-xl text-[#31302f]">
              We help businesses build scalable systems using Shopify for eCommerce growth and GoHighLevel for automation, CRM, and lead management.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <div key={service.id} className="bg-[#f0eadd] rounded-2xl p-6 md:p-8 shadow-lg border border-[#f0eadd] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl md:text-2xl font-medium text-[#050504] mb-4">{service.title}</h3>
                <p className="text-[#31302f] mb-6">{service.description}</p>

                <div className="space-y-3 mb-6 md:mb-8">
                  {service.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#f7af00] rounded-full"></div>
                      <span className="text-[#31302f]">{highlight}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={service.ctaLink}
                  className="inline-flex items-center gap-2 text-[#050504] font-semibold hover:text-[#f7af00] hover:gap-3 transition-all"
                >
                  {service.ctaText}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-[#f0eadd]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-[#f0eadd]">
              <h3 className="text-2xl md:text-3xl font-medium text-[#31302f] mb-6 md:mb-8 text-center">
                Which Service Is Right for You?
              </h3>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-[#f0eadd] bg-white">
                <div className="grid grid-cols-3 bg-[#faf4e5] border-b border-[#f0eadd]">
                  <div className="p-4 font-semibold text-[#050504]">Your Goal</div>
                  <div className="p-4 font-semibold text-[#050504] text-center">Best Fit</div>
                  <div className="p-4 font-semibold text-[#050504] text-center">Platform</div>
                </div>

                {comparisonData.map((item, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 ${index % 2 === 0 ? "bg-white" : "bg-[#faf4e5]"
                      }`}
                  >
                    <div className="p-4 border-r border-[#f0eadd]">
                      <div className="flex items-center gap-3 text-[#31302f]">
                        <Check className="w-5 h-5 text-[#f7af00]" />
                        {item.goal}
                      </div>
                    </div>
                    <div className="p-4 border-r border-[#f0eadd] text-center font-medium text-[#31302f]">
                      {item.fit}
                    </div>
                    <div className="p-4 text-center text-2xl">
                      {item.fit === "Shopify" ? "🛒" : "🚀"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {comparisonData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-[#f0eadd] p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 font-medium text-[#050504]">
                      <Check className="w-4 h-4 text-[#f7af00]" />
                      {item.goal}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#31302f]">Best Fit</span>
                      <span className="font-semibold text-[#050504]">
                        {item.fit}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#31302f]">Platform</span>
                      <span className="text-xl">
                        {item.fit === "Shopify" ? "🛒" : "🚀"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How We Deliver */}
      <section className="py-12 md:py-20 bg-[#faf4e5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-medium text-center text-[#31302f] mb-12 md:mb-16">
            Our Working Process
          </h2>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((step) => (
                <div key={step.step} className="relative">
                  <div className="bg-[#f0eadd] p-6 rounded-2xl shadow-sm border border-[#f0eadd] h-full">
                    <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-[#f7af00] text-[#050504] rounded-full text-lg md:text-xl font-bold mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg md:text-xl font-medium text-[#050504] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#31302f] text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-12 md:py-20 bg-[#f0eadd]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-medium text-center text-[#31302f] mb-12 md:mb-16">
            Businesses We Help
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {businessTypes.map((business, index) => (
              <div
                key={index}
                className="bg-[#faf4e5] p-6 md:p-8 rounded-2xl border border-[#f0eadd] hover:border-[#f7af00] transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#faf4e5] rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <Users className="w-6 h-6 md:w-7 md:h-7 text-[#31302f]" />
                </div>
                <h3 className="text-lg md:text-xl font-medium text-[#050504] mb-2">
                  {business.name}
                </h3>
                <p className="text-[#31302f]">
                  {business.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-[#faf4e5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-medium text-center text-[#31302f] mb-12 md:mb-16">
            Why Clients Choose Us
          </h2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {valuePropositions.map((value, index) => (
              <div
                key={index}
                className="bg-[#f0eadd] p-6 sm:p-8 lg:p-12 rounded-2xl shadow-lg border border-[#f0eadd]"
              >
                <div className="flex items-center gap-4 mb-2 md:mb-3">
                  <h3 className="text-lg md:text-xl font-medium text-[#050504]">
                    {value.title}
                  </h3>
                </div>
                <p className="text-[#31302f]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Growth System */}
      <section className="py-12 md:py-20 bg-[#f0eadd] text-[#050504]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-5xl font-medium mb-6">
              Shopify + GoHighLevel = Complete Growth System
            </h2>

            <p className="text-lg md:text-xl text-[#31302f] mb-8 md:mb-10 max-w-3xl mx-auto">
              We combine Shopify for selling and GoHighLevel for automation and CRM to create end-to-end systems that generate, convert, and retain customers.
            </p>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
              {[
                'Shopify + CRM integration',
                'Abandoned cart automation',
                'Email & SMS marketing flows'
              ].map((example, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20"
                >
                  <Zap className="w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4 mx-auto" />
                  <p className="font-medium text-sm md:text-base">{example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-[#faf4e5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-[#f0eadd] rounded-3xl p-8 md:p-12 text-center border border-[#f0eadd]">
            <h2 className="text-3xl md:text-4xl font-medium text-[#31302f] mb-4 md:mb-6">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-lg md:text-xl text-[#31302f] mb-6 md:mb-10 max-w-2xl mx-auto">
              Let's discuss your goals and find the perfect solution for your business growth.
            </p>
            <Link
              href="/client-request"
              className="inline-flex items-center gap-3 bg-[#f7af00] hover:bg-[#e69f00] text-[#050504] px-8 md:px-10 py-3 md:py-5 rounded-xl font-semibold text-base md:text-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Calendar className="w-5 h-5 md:w-6 md:h-6" />
              Book a Free Strategy Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}