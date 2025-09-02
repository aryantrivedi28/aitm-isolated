'use client';

import { motion, useAnimation } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
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

  const truncateText = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + "...";

  useEffect(() => {
    controls.start({
      x: "-50%",
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: testimonials.length * 6,
          ease: "linear",
        },
      },
    });
  }, [controls, testimonials.length]);

  return (
    <section className="py-16 px-4 bg-[#241C15] overflow-hidden">
      <motion.div
        className="max-w-full mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-white/10 border border-gray-300 px-5 py-3 rounded-full mb-8 shadow-sm">
            <Sparkles className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span className="text-sm font-semibold text-white">Testimonials</span>
            <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping" />
          </div>

          <h2 className="font-black leading-tight mb-6 text-white text-3xl sm:text-4xl md:text-5xl">
            What Our Clients{" "}
            <span className="bg-gradient-to-r from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] bg-clip-text text-transparent animate-gradient bg-300%">
              Say
            </span>
          </h2>

          <div className="text-lg sm:text-xl text-[#dfd8c5] max-w-3xl mx-auto leading-relaxed">
            We’ll make you fall in love with our offering—at least, that’s what our existing clients say!
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={controls}
            onHoverStart={() => controls.stop()}
            onHoverEnd={() =>
              controls.start({
                x: "-50%",
                transition: {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: testimonials.length * 6,
                    ease: "linear",
                  },
                },
              })
            }
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                className="group bg-[#241C15] rounded-3xl p-6 sm:p-8 shadow-md border border-gray-300 hover:border-[#FFE01B] hover:shadow-lg transition-all duration-500 flex-shrink-0 flex flex-col"
                style={{
                  width: "85vw", // 🔥 Mobile-friendly width
                  maxWidth: "380px", // 🔥 Keep your desktop size
                  minHeight: expandedTestimonial === index ? "auto" : "420px",
                  height: expandedTestimonial === index ? "auto" : "420px",
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                <div className="flex flex-col h-full relative">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FFE01B] text-[#FFE01B]" />
                    ))}
                  </div>

                  <div className={`mb-6 ${expandedTestimonial === index ? "flex-none" : "flex-1"}`}>
                    <blockquote className="text-white leading-relaxed italic">
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
                        className="text-[#FFE01B] hover:text-[#FCD34D] font-medium text-sm mt-2 transition-colors duration-300"
                      >
                        {expandedTestimonial === index ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    <motion.div whileHover={{ scale: 1.05 }} className="relative">
                      <div className="absolute inset-0 bg-[#FFE01B]/20 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="relative w-12 h-12 rounded-full object-cover border-2 border-[#FFE01B] transition-colors duration-500"
                      />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#FFE01B] transition-colors duration-500">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-300 text-sm">{testimonial.role}</p>
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
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>👆</motion.span>
            Hover over testimonials to pause and read • Click "Read more" for full testimonials
          </p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { background-size: 300% 300%; animation: gradient 3s ease infinite; }
        .bg-300\\% { background-size: 300% 300%; }
      `}</style>
    </section>
  );
};

export default Testimonials;
