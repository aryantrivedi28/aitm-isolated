"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useAnimation, type Variants } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronDown, Star, Quote, ArrowRight, CheckCircle, Users, Zap, Shield, Clock } from "lucide-react"

// Animation variants with proper typing
const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99], // Custom cubic-bezier easing
    },
  },
}

const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

export default function ClientLandingPage() {
  const router = useRouter()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechStart Inc.",
      content:
        "Finzie connected us with an amazing full-stack developer who delivered our MVP in just 3 weeks. The quality exceeded our expectations!",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Marcus Rodriguez",
      role: "Founder, GrowthLab",
      content:
        "The AI-powered matching was spot on. We found the perfect designer who understood our vision immediately. Highly recommend!",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Watson",
      role: "Product Manager, InnovateCorp",
      content:
        "Working with Finzie's team was seamless. They handled everything from contracts to delivery. We'll definitely use them again.",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "David Kim",
      role: "CEO, StartupFlow",
      content:
        "The freelancer we got through Finzie became an integral part of our team. The vetting process really shows - top-tier talent only!",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Lisa Thompson",
      role: "Marketing Director, BrandBoost",
      content:
        "Our video marketing campaign was delivered ahead of schedule and exceeded all our KPIs. Finzie's talent pool is incredible!",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Alex Johnson",
      role: "Founder, DevTools Pro",
      content:
        "From AI automation to full-stack development, Finzie has been our go-to for scaling our technical team quickly and efficiently.",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Maria Garcia",
      role: "Head of Design, CreativeHub",
      content:
        "The UI/UX designer we worked with transformed our entire product experience. Professional, creative, and delivered on time!",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "James Wilson",
      role: "CTO, DataDriven",
      content:
        "Finzie's AI matching algorithm is impressive. We got exactly the machine learning expert we needed for our complex project.",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Sophie Brown",
      role: "Product Owner, FinTech Solutions",
      content:
        "The blockchain developer we hired through Finzie helped us launch our DeFi platform successfully. Exceptional technical skills!",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Davis",
      role: "Founder, EcomGrowth",
      content:
        "Our e-commerce platform redesign was flawless. The developer understood our requirements perfectly and delivered beyond expectations.",
      rating: 5,
      // avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const faqs = [
    {
      question: "How quickly can I get matched with a freelancer?",
      answer:
        "Our AI-powered matching system typically finds and verifies the perfect freelancer for your project within 24 hours. For urgent projects, we can often match you even faster.",
    },
    {
      question: "What if I'm not satisfied with the freelancer's work?",
      answer:
        "We offer a satisfaction guarantee. If you're not happy with the work, we'll find you a replacement freelancer at no additional cost and ensure your project gets completed to your standards.",
    },
    {
      question: "How does your pricing work?",
      answer:
        "Our pricing is flexible and transparent. We provide custom quotes based on your project requirements with no hidden fees. You only pay for the work delivered, and we handle all invoicing and payments.",
    },
    {
      question: "Do you offer ongoing support after project completion?",
      answer:
        "Yes! We provide ongoing support and can help you scale your team as needed. Many of our clients work with the same freelancers on multiple projects through our platform.",
    },
    {
      question: "What makes Finzie different from other freelance platforms?",
      answer:
        "We're the world's first AI talent aggregator with rigorous vetting, 24-hour matching, integrated team management, and end-to-end project handling. We become part of your team, not just a marketplace.",
    },
  ]

  // Start the continuous animation
  useEffect(() => {
    const startAnimation = () => {
      controls.start({
        x: [0, -100 * testimonials.length],
        transition: {
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: testimonials.length * 8,
            ease: "linear",
          },
        },
      })
    }

    if (!isHovered) {
      startAnimation()
    } else {
      controls.stop()
    }
  }, [isHovered, controls, testimonials.length])

  return (
    <main className="flex flex-col bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-5 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute top-1/2 -left-40 w-64 h-64 bg-[#FFE01B]/60 backdrop-blur-md rounded-full"
        />
      </div>

      {/* Hero Section */}
      <section className="relative bg-[#241C15] text-white py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#241C15] via-[#2a1f16] to-[#241C15]" />

        <motion.div
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="text-start space-y-6" initial="hidden" animate="visible" variants={fadeInLeft}>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              About{" "}
              <span className="bg-gradient-to-r from-[#FFE01B] to-yellow-300 bg-clip-text text-transparent font-extrabold text-5xl">
                Finzie
              </span>
            </motion.h1>

            <motion.h2
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold mb-4"
            >
              On-demand talent for fast-moving startups
            </motion.h2>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg md:text-xl mb-10 max-w-xl text-gray-300"
            >
              Pre-vetted freelancers & AI-smart teams for development, design, video & more. Match and onboard in 24
              hours
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/client-request" passHref>
                <motion.button
                  className="bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Post a Request
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/all-freelancer" passHref>
                <motion.button
                  className="border-2 border-[#FFE01B] text-[#FFE01B] hover:bg-[#FFE01B] hover:text-black font-semibold px-8 py-3 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join as a Freelancer
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* How Finzie Works */}
      <section className="py-16 px-4 bg-gray-50">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-semibold text-[#241C15]">How Finzie Works</h2>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            {
              img: "/xyz.png",
              title: "Share your requirements",
              desc: "Fill out our simple form, and our team will reach out to clarify your project's requirements",
            },
            {
              img: "/match.png",
              title: "Get matched",
              desc: "Our AI engine analyzes your project profile & finds the perfect expert with manual verification within the next 24 hours",
            },
            {
              img: "/manage.png",
              title: "Deliver & manage",
              desc: "We assign the right freelancer, manage delivery end to end & integrate our agile teams into your stack",
            },
          ].map((step, index) => (
            <motion.div key={index} initial="hidden" animate="visible" variants={scaleIn} className="text-center group">
              <motion.div className="relative mb-6" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <div className="absolute inset-0 bg-[#FFE01B] rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <img
                  src={step.img || "/placeholder.svg"}
                  alt={step.title}
                  className="relative mx-auto rounded-lg w-full h-40 object-contain border-2 border-gray-200 group-hover:border-[#FFE01B] transition-colors duration-300"
                />
              </motion.div>
              <h3 className="mt-4 font-semibold text-lg text-[#241C15] group-hover:text-[#FFE01B] transition-colors duration-300">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why Us Section */}
      <section className="bg-[#241C15] text-white py-16 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 initial="hidden" animate="visible" variants={fadeUp} className="text-3xl font-semibold mb-10">
            Why Us?
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {[
              {
                icon: Shield,
                title: "Pre-vetted experts ready to jump in",
                desc: "Rigorous screening ensures top-tier talent every time",
              },
              {
                icon: Zap,
                title: "AI-driven matching for a perfect fit",
                desc: "Data-powered pairings deliver the exact skills you need",
              },
              {
                icon: Users,
                title: "Integrated agile teams",
                desc: "Our freelancers become part of your team in the communication channel of your choice",
              },
              {
                icon: Clock,
                title: "Flexible pricing that adapts to your budget",
                desc: "Tailored quotes with no hidden fees",
              },
              {
                icon: Star,
                title: "World's first AI talent aggregator",
                desc: "Whether it's workflow automation or a full autonomous agent, we've got the specialists to build it",
              },
              {
                icon: CheckCircle,
                title: "We handle the dirty work",
                desc: "From agreements and onboarding to invoicing, Finzie takes care of it all so you can focus on growing your business",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300"
                whileHover={{ x: 10 }}
              >
                <motion.div
                  className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="w-6 h-6 text-[#FFE01B]" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-[#FFE01B] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-gray-300">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50 overflow-hidden">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeUp}>
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <motion.div
                className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Quote className="w-6 h-6 text-[#FFE01B]" />
              </motion.div>
              <span className="text-[#FFE01B] font-semibold text-lg">Testimonials</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-[#241C15] mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about working with Finzie.
            </p>
          </motion.div>

          {/* Moving Testimonials Container */}
          <div className="relative">
            <motion.div
              className="flex gap-6"
              animate={controls}
              style={{
                width: `${testimonials.length * 400}px`,
              }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* First set of testimonials */}
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={`first-${index}`}
                  className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-[#FFE01B]/50 hover:shadow-xl transition-all duration-500 flex-shrink-0"
                  style={{ width: "380px" }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-[#FFE01B] text-[#FFE01B]" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-700 mb-6 leading-relaxed italic min-h-[80px]">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <motion.div whileHover={{ scale: 1.1 }} className="relative">
                        <div className="absolute inset-0 bg-[#FFE01B] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        {/* <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="relative w-12 h-12 rounded-full object-cover border-2 border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500"
                        /> */}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-[#241C15] group-hover:text-[#FFE01B] transition-colors duration-500">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Duplicate set for seamless loop */}
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={`second-${index}`}
                  className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-[#FFE01B]/50 hover:shadow-xl transition-all duration-500 flex-shrink-0"
                  style={{ width: "380px" }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-[#FFE01B] text-[#FFE01B]" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-700 mb-6 leading-relaxed italic min-h-[80px]">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <motion.div whileHover={{ scale: 1.1 }} className="relative">
                        <div className="absolute inset-0 bg-[#FFE01B] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        {/* <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="relative w-12 h-12 rounded-full object-cover border-2 border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500"
                        /> */}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-[#241C15] group-hover:text-[#FFE01B] transition-colors duration-500">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient Overlays for smooth edges */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
          </div>

          {/* Pause instruction */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                👆
              </motion.span>
              Hover over testimonials to pause and read
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-4 bg-white">
        <motion.div
          className="max-w-6xl mx-auto mb-12 text-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2 className="text-4xl md:text-4xl font-bold text-[#241C15]">Service Categories</h2>
          <p className="mt-3 max-w-6xl mx-auto font-semibold text-gray-600">
            Explore a diverse range of services to empower your business, executed by skilled freelancers across
            categories.
          </p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            {
              icon: "< />",
              title: "Development",
              items: ["Database Management", "Frontend Technologies", "Backend Frameworks"],
            },
            {
              icon: "🔈",
              title: "Marketing",
              items: ["Digital Marketing", "SEO", "Content Creation"],
            },
            {
              icon: "✏️",
              title: "Design",
              items: ["UI/UX", "Graphic Design", "Pitch Deck Designing"],
            },
            {
              icon: "🎥",
              title: "Video Editing",
              items: ["Motion Graphics", "2D/3D Animations", "Video Creation"],
            },
            {
              icon: "🤖",
              title: "AI",
              items: ["AI Agent Creation", "Workflow Automation", "AI Freelancer Outsourcing"],
            },
          ].map((service, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="group rounded-xl p-6 border-[3px] border-gray-200 hover:border-[#FFE01B] hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-4 justify-center">
                <motion.span
                  className="text-2xl mr-2 text-gray-600 group-hover:text-[#FFE01B] transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {service.icon}
                </motion.span>
                <h3 className="text-lg font-semibold text-gray-700 group-hover:text-[#241C15] transition-colors duration-300">
                  {service.title}
                </h3>
              </div>
              <ul className="text-gray-600 list-disc list-inside space-y-1 text-sm">
                {service.items.map((item, idx) => (
                  <li key={idx} className="group-hover:text-gray-700 transition-colors duration-300">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-[#241C15] text-white">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeUp}>
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <motion.div
                className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                whileHover={{ scale: 1.1, rotate: -10 }}
              >
                <ChevronDown className="w-6 h-6 text-[#FFE01B]" />
              </motion.div>
              <span className="text-[#FFE01B] font-semibold text-lg">FAQ</span>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Got questions? We've got answers. Here are the most common questions about working with Finzie.
            </p>
          </motion.div>

          <motion.div className="space-y-4" initial="hidden" animate="visible" variants={staggerContainer}>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
              >
                <motion.button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  whileHover={{ x: 5 }}
                >
                  <span className="font-semibold text-lg text-white">{faq.question}</span>
                  <motion.div animate={{ rotate: openFAQ === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-[#FFE01B]" />
                  </motion.div>
                </motion.button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openFAQ === index ? "auto" : 0,
                    opacity: openFAQ === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-[#FFE01B] to-yellow-400 text-center relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-32 h-32 bg-[#241C15]/10 rounded-full"
        />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h3
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-[#241C15] mb-6"
          >
            Ready to Transform Your Business?
          </motion.h3>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-xl text-[#241C15]/80 mb-10 max-w-2xl mx-auto"
          >
            Join hundreds of successful startups who've accelerated their growth with Finzie's expert talent.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Link href="/client-request" passHref>
              <motion.button
                className="bg-[#241C15] text-[#FFE01B] font-bold px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start a Project Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
