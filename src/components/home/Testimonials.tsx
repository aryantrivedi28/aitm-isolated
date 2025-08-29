'use client';

import { motion, useAnimation } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { type Variants } from "framer-motion";

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
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

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
};

const Testimonials = () => {
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null);
  const controls = useAnimation();

  const testimonials = [
    {
      name: "Apratim Sinha",
      role: "Founder, Alevia Wellness",
      content:
        "I had the pleasure of working with the Finzie team for the development of our new website, and I couldn't be more impressed with the results. They sourced the best-fit talent for the project and ensured everything was executed smoothly through their project management support. The team demonstrated professionalism, creativity, and a clear understanding of our brand's needs throughout the process. The final website is not only visually impressive but also user-friendly, optimized for speed, and fully responsive across all devices. Their structured approach and timely delivery made the entire experience seamless.",
      rating: 5,
      avatar: "/apratim.jpeg",
    },
    {
      name: "Mohmad Zakariya",
      role: "Student, NYU Stern",
      content:
        "The team at Finzie has helped me bring to life several ideas that were a manifestation of my personal intellectual evolution and ambition to contribute to society. Since I graduated from NYU Stern, I have been interested in launching a platform along the realms of media, research, and sociology. One of the key ways Finzie has supported me is by identifying and onboarding the best-fit resources for each project, ensuring both quality and alignment with my vision. My accumulated technical exposure through academic and professional experience has enabled me to form a strong partnership with Finzie, where we have collaborated on multiple projects now, with a push for commercial markets coming in 2025. I plan to continue my relationship with Finzie — a team that is reliable, trustworthy, and capable of delivering on projects of varying complexities.",
      rating: 5,
      avatar: "/zakariya.jpeg",
    },
    {
      name: "Minakshi Samant",
      role: "",
      content:
        "It was wonderful working with Finzie for our SEO-related needs. They quickly understood the deliverables and provided us with a highly skilled SEO resource who not only optimized but also redesigned key pages of our website. The quality of work, thought process, and overall execution far exceeded our expectations. The results spoke for themselves, and we're very happy with the outcome.",
      rating: 5,
      avatar: "/Minakshi.jpeg",
    },
    {
      name: "Akshadeep",
      role: "Founder, Kalayansparsh",
      content:
        "It's been a great experience working with Finzie on our social media efforts. They helped us build a strong foundation by bringing in the right resources who understood our brand and consistently delivered high-quality content. With their support, we were able to scale our social media presence significantly. Our collaboration has now lasted over a year, and throughout, the Finzie team has been proactive, reliable, and focused on driving real results for us.",
      rating: 5,
      avatar: "/akshadeep.jpeg",
    },
  ];

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const startAnimation = () => {
    controls.start({
      x: "-50%",
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: testimonials.length * 5,
          ease: "linear",
        },
      },
    });
  };

  const stopAnimation = () => {
    controls.stop();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <section className="py-16 px-4 bg-[#fbf5e5] overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {/* Enhanced Header */}
        <div className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000`}>
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-white/70 border border-gray-200/60 px-5 py-3 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Sparkles className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">Testimonials</span>
            <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping" />
          </div>

          <h2
            className="font-black leading-tight mb-6 text-gray-900"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            What Our Clients{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FFE01B] via-amber-500 to-[#FFE01B] bg-clip-text text-transparent animate-gradient bg-300%">
                Say
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FFE01B]/20 to-amber-500/20 blur-xl -z-10 animate-pulse" />
            </span>
          </h2>

          <div className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We’ll make you fall in love with our offering—at least, that’s what our existing clients say!
          </div>
        </div>

        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={controls}
            onHoverStart={stopAnimation}
            onHoverEnd={startAnimation}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                className="group bg-[#fbf5e5] rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-[#FFE01B]/50 hover:shadow-xl transition-all duration-500 flex-shrink-0 flex flex-col"
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
                            e.stopPropagation();
                            setExpandedTestimonial(expandedTestimonial === index ? null : index);
                          }}
                          className="text-[#FFE01B] hover:text-[#241C15] font-medium text-sm mt-2 transition-colors duration-300"
                        >
                          {expandedTestimonial === index ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    <motion.div whileHover={{ scale: 1.1 }} className="relative">
                      <div className="absolute inset-0 bg-[#FFE01B] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                      {/* --- FIX START HERE --- */}
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="relative w-12 h-12 rounded-full object-cover border-2 border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500"
                      />
                      {/* --- FIX END HERE --- */}

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
  );
};

export default Testimonials;