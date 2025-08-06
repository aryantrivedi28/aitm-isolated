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
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null)
  const controls = useAnimation()

  const testimonials = [
    {
      name: "Apratim Sinha",
      role: "Founder, Alevia Wellness",
      content:
        "I had the pleasure of working with the Finzie team for the development of our new website, and I couldn't be more impressed with the results. They sourced the best-fit talent for the project and ensured everything was executed smoothly through their project management support. The team demonstrated professionalism, creativity, and a clear understanding of our brand's needs throughout the process. The final website is not only visually impressive but also user-friendly, optimized for speed, and fully responsive across all devices. Their structured approach and timely delivery made the entire experience seamless.",
      rating: 5,
      avatar: "/apratim.jpeg?height=60&width=60",
    },
    {
      name: "Mohmad Zakariya",
      role: "Student, NYU Stern",
      content:
        "The team at Finzie has helped me bring to life several ideas that were a manifestation of my personal intellectual evolution and ambition to contribute to society. Since I graduated from NYU Stern, I have been interested in launching a platform along the realms of media, research, and sociology. One of the key ways Finzie has supported me is by identifying and onboarding the best-fit resources for each project, ensuring both quality and alignment with my vision. My accumulated technical exposure through academic and professional experience has enabled me to form a strong partnership with Finzie, where we have collaborated on multiple projects now, with a push for commercial markets coming in 2025. I plan to continue my relationship with Finzie — a team that is reliable, trustworthy, and capable of delivering on projects of varying complexities.",
      rating: 5,
      avatar: "/zakariya.jpeg?height=60&width=60",
    },
    {
      name: "Minakshi Samant",
      role: "",
      content:
        "It was wonderful working with Finzie for our SEO-related needs. They quickly understood the deliverables and provided us with a highly skilled SEO resource who not only optimized but also redesigned key pages of our website. The quality of work, thought process, and overall execution far exceeded our expectations. The results spoke for themselves, and we're very happy with the outcome.",
      rating: 5,
      avatar: "/Minakshi.jpeg?height=60&width=60",
    },
    {
      name: "Akshadeep",
      role: "Founder, Kalayansparsh",
      content:
        "It's been a great experience working with Finzie on our social media efforts. They helped us build a strong foundation by bringing in the right resources who understood our brand and consistently delivered high-quality content. With their support, we were able to scale our social media presence significantly. Our collaboration has now lasted over a year, and throughout, the Finzie team has been proactive, reliable, and focused on driving real results for us.",
      rating: 5,
      avatar: "/akshadeep.jpeg?height=60&width=60",
    },
  ]

  const faqs = [
    {
      question: "How quickly can I get matched with a freelancer?",
      answer:
        "Our AI-powered matching system typically finds and verifies the perfect freelancer for your international freelance jobs within 24 hours. For urgent projects, we can also match you even faster.",
    },
    {
      question: "How much do freelancers charge per hour?",
      answer: "Freelance hourly rates vary based on expertise and project scope. Finzie provides transparent freelancer quotes, allowing you to connect with freelancers needed for diverse roles at a price tailored to your budget.",
    },
    {
      question: "Do freelancers earn more than employees?",
      answer:
        "Freelancers often enjoy higher earning potential due to the flexibility of freelance work. By joining Finzie’s freelancers hub, you can earn competitive pay from international freelance jobs, often surpassing traditional employee salaries.",
    },
    {
      question: "What are the advantages of hiring freelancers?",
      answer:
        "The benefits of hiring freelancers include cost-efficiency, access to specialized skills, and scalability. Finzie’s freelancers portal connects you with freelance web developers, freelancers graphic designers, and more, ensuring high-quality results for your projects.",
    },
    
    {
      question: "How do you ensure quality in your freelancers?",
      answer:
        "We have a rigorous vetting process that includes technical assessments, portfolio reviews, and interviews. Only the top 5% of applicants make it onto our platform, ensuring you work with the best freelancers.",
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

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

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
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute top-1/2 -left-40 w-64 h-64 bg-[#FFE01B] opacity-5 rounded-full"
        />
      </div>

      {/* Hero Section */}
      <section className="relative bg-[#241C15] text-white py-32 px-4">
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
              Finzie – Managed Freelancers Hub for Scaling Organizations
            </motion.h2>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg md:text-xl mb-10 max-w-xl text-gray-300"
            >
              Join Finzie, the premier freelancers' hub for top-tier freelance work. Enjoy the benefits of a seamless candidate hiring experience and access to international freelance jobs.
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
          className="relative max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            {
              img: "/xyz.png",
              title: "Share your requirements",
              desc: "Fill out our simple form to outline your project needs & our crew will reach out to clarify details, ensuring a tailored candidate hiring experience aligning with your goals.",
            },
            {
              img: "/match.png",
              title: "Get matched",
              desc: "Our matchmaking algorithm digs through our pool of pre-vetted talent to find your perfect freelancer fit; no more endless scrolling for freelancers on Fiverr, Upwork or anywhere else!",
            },
            {
              img: "/manage.png",
              title: "Deliver & manage",
              desc: "We don’t just leave you there. Holding your hand, we ensure timely delivery with the highest quality, managing the process end-to-end so you can focus on outcomes.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              whileInView="visible"
              variants={scaleIn}
              viewport={{ once: true, amount: 0.2 }}
              className="text-center group"
            >
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
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 initial="hidden" animate="visible" variants={fadeUp} className="text-3xl font-semibold mb-10">
            Why Us?
          </motion.h2>
          <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg md:text-xl mb-10 max-w-3xl text-gray-300"
            >
              Our diverse talent pool supports freelance WFH jobs and international freelance jobs, ensuring flexibility and access to global expertise with zero hassles
            </motion.p>
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
                desc: "Only the best freelancers make the cut - our rigorous screening ensures you can access the most appropriate freelancers portfolios who excel in their craft.",
              },
              {
                icon: Zap,
                title: "AI-driven matching for a perfect fit",
                desc: "Data-powered pairings deliver the exact skills you need",
              },
              {
                icon: Users,
                title: "Integrated agile teams",
                desc: "Our freelancers seamlessly join your team in your preferred communication channels, enhancing the candidate hiring experience for freelance work.",
              },
              {
                icon: Clock,
                title: "Flexible pricing that adapts to your budget",
                desc: "Get tailored freelancers quotes with no hidden fees, making Finzie the best site for hiring freelancers online.",
              },
              {
                icon: Star,
                title: "World's first AI talent aggregator",
                desc: "Whether it's workflow automation or a full autonomous agent, we've got the specialists to build it",
              },
              {
                icon: CheckCircle,
                title: "Matchmaking System that Ensures Exact Match",
                desc: "Our proprietary system guarantees the perfect freelancer for your requirements, every time.",
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
                  <feature.icon className="w-12 h-6 text-[#FFE01B]" />
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
              We’ll make you fall in love with our offering—at least, that’s what our existing clients say!
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
                  className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-[#FFE01B]/50 hover:shadow-xl transition-all duration-500 flex-shrink-0 flex flex-col"
                  style={{
                    width: "380px",
                    minHeight: expandedTestimonial === index ? "auto" : "420px",
                    height: expandedTestimonial === index ? "auto" : "420px",
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col h-full">
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

                    {/* Quote - with consistent height and scroll */}
                    <div className={`mb-6 ${expandedTestimonial === index ? "flex-none" : "flex-1"}`}>
                      <div className="relative">
                        <blockquote className="text-gray-700 leading-relaxed italic">
                          {expandedTestimonial === index
                            ? `"${testimonial.content}"`
                            : `"${truncateText(testimonial.content, 180)}"`}
                        </blockquote>
                        {testimonial.content.length > 180 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedTestimonial(expandedTestimonial === index ? null : index)
                            }}
                            className="text-[#FFE01B] hover:text-[#241C15] font-medium text-sm mt-2 transition-colors duration-300"
                          >
                            {expandedTestimonial === index ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Author - Fixed at bottom */}
                    <div className="flex items-center gap-4 mt-auto">
                      <motion.div whileHover={{ scale: 1.1 }} className="relative">
                        <div className="absolute inset-0 bg-[#FFE01B] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        <img
                          src={testimonial.avatar || "/placeholder.svg?height=48&width=48"}
                          alt={testimonial.name}
                          className="relative w-12 h-12 rounded-full object-cover border-2 border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500"
                        />
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
                  className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-[#FFE01B]/50 hover:shadow-xl transition-all duration-500 flex-shrink-0 flex flex-col"
                  style={{
                    width: "380px",
                    minHeight: expandedTestimonial === index + testimonials.length ? "auto" : "420px",
                    height: expandedTestimonial === index + testimonials.length ? "auto" : "420px",
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col h-full">
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

                    {/* Quote - with consistent height and scroll */}
                    <div
                      className={`mb-6 ${expandedTestimonial === index + testimonials.length ? "flex-none" : "flex-1"}`}
                    >
                      <div className="relative">
                        <blockquote className="text-gray-700 leading-relaxed italic">
                          {expandedTestimonial === index + testimonials.length
                            ? `"${testimonial.content}"`
                            : `"${truncateText(testimonial.content, 180)}"`}
                        </blockquote>
                        {testimonial.content.length > 180 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedTestimonial(
                                expandedTestimonial === index + testimonials.length
                                  ? null
                                  : index + testimonials.length,
                              )
                            }}
                            className="text-[#FFE01B] hover:text-[#241C15] font-medium text-sm mt-2 transition-colors duration-300"
                          >
                            {expandedTestimonial === index + testimonials.length ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Author - Fixed at bottom */}
                    <div className="flex items-center gap-4 mt-auto">
                      <motion.div whileHover={{ scale: 1.1 }} className="relative">
                        <div className="absolute inset-0 bg-[#FFE01B] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        <img
                          src={testimonial.avatar || "/placeholder.svg?height=48&width=48"}
                          alt={testimonial.name}
                          className="relative w-12 h-12 rounded-full object-cover border-2 border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500"
                        />
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
              Hover over testimonials to pause and read • Click "Read more" for full testimonials
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Service Categories */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <motion.div
          className="relative max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Header Section */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-[#FFE01B]/10 rounded-full border border-[#FFE01B]/30"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-8 h-8 bg-[#FFE01B] rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-[#241C15] font-bold text-sm">⚡</span>
              </motion.div>
              <span className="text-[#241C15] font-semibold text-sm uppercase tracking-wider">Our Services</span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold text-[#241C15] mb-6 leading-tight">
              Service{" "}
              <span className="bg-gradient-to-r from-[#FFE01B] to-yellow-400 bg-clip-text text-transparent">
                Categories
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We offer Diverse Temporary Contract Hiring Services to Supercharge Your Business{" "}
              <span className="font-semibold text-[#241C15]">skilled freelancers</span> across categories.
            </p>
          </motion.div>

          {/* Services Row */}
          <motion.div
            className="flex justify-center gap-4 overflow-x-auto pb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              {
                icon: "💻",
                title: "Development",
                items: ["Database Management", "Frontend Technologies", "Backend Frameworks"],
              },
              {
                icon: "📢",
                title: "Marketing",
                items: ["Digital Marketing", "SEO", "Content Creation"],
              },
              {
                icon: "🎨",
                title: "Design",
                items: ["UI/UX", "Graphic Design", "Pitch Deck Designing"],
              },
              {
                icon: "🎬",
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
                className="group relative bg-white rounded-3xl p-6 border-2 border-gray-200 hover:border-[#FFE01B] hover:shadow-2xl transition-all duration-500 backdrop-blur-sm overflow-hidden flex-shrink-0 w-[240px]"
                whileHover={{ y: -10, scale: 1.02 }}
                style={{ minHeight: "320px" }}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/5 to-[#241C15]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                {/* Floating background decoration */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-[#FFE01B] opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon and Title */}
                  <div className="text-center mb-6">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFE01B] to-yellow-400 mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border-2 border-[#FFE01B]/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-2xl filter drop-shadow-sm">{service.icon}</span>
                    </motion.div>

                    <h3 className="text-lg font-bold text-[#241C15] group-hover:text-[#FFE01B] transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>

                  {/* Services List */}
                  <div className="flex-1 flex flex-col justify-center">
                    <ul className="space-y-3">
                      {service.items.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center text-gray-700 group-hover:text-[#241C15] transition-colors duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <motion.div
                            className="w-2 h-2 rounded-full bg-[#FFE01B] mr-3 flex-shrink-0 group-hover:bg-[#241C15] transition-colors duration-300"
                            whileHover={{ scale: 1.5 }}
                          />
                          <span className="text-sm font-medium leading-relaxed">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom CTA */}
                  {/* <motion.div
                    className="mt-6 pt-4 border-t border-gray-200 group-hover:border-[#FFE01B]/30 transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFE01B] to-yellow-400 text-[#241C15] font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl border border-[#FFE01B]/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Explore {service.title}
                    </motion.button>
                  </motion.div> */}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA Section */}
          {/* <motion.div
            className="text-center mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <motion.div
              className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-2xl shadow-lg border-2 border-[#FFE01B]/20 hover:border-[#FFE01B] hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFE01B] to-yellow-400 border-2 border-white flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    style={{ zIndex: 4 - i }}
                  >
                    <span className="text-[#241C15] font-bold text-sm">👤</span>
                  </motion.div>
                ))}
              </div>
              {/* <div className="text-left">
                <p className="text-sm font-semibold text-[#241C15]">Join 500+ satisfied clients</p>
                <p className="text-xs text-gray-600">Ready to get started?</p>
              </div>
              <motion.button
                className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold px-6 py-2 rounded-xl transition-colors duration-200 border border-[#FFE01B]/20 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button> 
            </motion.div>
          </motion.div> */}
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
