// 'use client'

// import { ArrowRight, Zap, Sparkles, Star, ChevronRight, Play, Shield, Rocket, TrendingUp, X, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { urlFor } from "@/src/sanity/lib/image"
// import { motion, AnimatePresence } from 'framer-motion'
// // import HeroForm from './HeroForm'
// import FormModal from './form/formModel'

// interface CTA {
//   label: string
//   href: string
//   variant?: string
// }

// interface Screenshot {
//   image: any
//   caption?: string
// }

// interface BlogButton {
//   label: string
//   href: string
// }

// interface HeroProps {
//   title: string
//   subtitle?: string
//   ctas?: CTA[]
//   screenshots?: Screenshot[]
//   blogButton?: BlogButton
//   form?: any
//   formConfig?: any
// }


// export default function Hero({
//   title,
//   subtitle,
//   ctas = [],
//   screenshots = [],
//   blogButton,
//   formConfig, // Add this prop
// }: HeroProps) {
//   const [particles, setParticles] = useState<{ left: string; top: string; duration: number; delay: number; size: number; type: string }[]>([])
//   const [isMobile, setIsMobile] = useState(false)
//   const [isVisible, setIsVisible] = useState(false)
//   const [showForm, setShowForm] = useState(false)
//   const [form, setForm] = useState<any>(null)

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     business: '',
//     website: '',
//     interest: ''
//   })

//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)
//   const [submitMessage, setSubmitMessage] = useState('')

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//     }

//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     setIsVisible(true)

//     setParticles(
//       Array.from({ length: isMobile ? 15 : 25 }).map((_, i) => ({
//         left: `${Math.random() * 100}%`,
//         top: `${Math.random() * 100}%`,
//         duration: 3 + Math.random() * 5,
//         delay: Math.random() * 3,
//         size: 2 + Math.random() * 4,
//         type: i % 4 === 0 ? 'circle' : i % 4 === 1 ? 'pulse' : i % 4 === 2 ? 'star' : 'sparkle'
//       }))
//     )

//     return () => window.removeEventListener('resize', checkMobile)
//   }, [isMobile])

//   useEffect(() => {
//     if (showForm) {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = 'unset'
//     }

//     return () => {
//       document.body.style.overflow = 'unset'
//     }
//   }, [showForm])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { id, value } = e.target
//     setFormData(prev => ({ ...prev, [id]: value }))

//     if (errors[id as keyof typeof errors]) {
//       setErrors(prev => ({ ...prev, [id]: '' }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.name.trim()) newErrors.name = 'Name is required'
//     if (!formData.email.trim()) newErrors.email = 'Email is required'
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid'

//     if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
//     if (!formData.interest) newErrors.interest = 'Please select an interest'

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       setSubmitStatus('error')
//       setSubmitMessage('Please fix the errors in the form')
//       setTimeout(() => setSubmitStatus(null), 5000)
//       return
//     }

//     setIsSubmitting(true)
//     setSubmitStatus(null)

//     try {
//       const response = await fetch('/api/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       const result = await response.json()

//       if (response.ok) {
//         setSubmitStatus('success')
//         setSubmitMessage('Thank you for your submission! We will contact you within 24 hours.')

//         // Reset form after showing success message
//         setTimeout(() => {
//           setFormData({
//             name: '',
//             email: '',
//             phone: '',
//             business: '',
//             website: '',
//             interest: ''
//           })
//           setSubmitStatus(null)
//         }, 3000)
//       } else {
//         throw new Error(result.error || 'Submission failed')
//       }
//     } catch (error) {
//       console.error('Submission error:', error)
//       setSubmitStatus('error')
//       setSubmitMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const shouldOpenForm = (label: string) => {
//     const formTriggers = [
//       'contact', 'contact us', 'get in touch', 'get started',
//       'free consultation', 'book a call', 'schedule a demo',
//       'request a quote', 'get free demo', 'start project'
//     ];

//     return formTriggers.some(trigger =>
//       label.toLowerCase().includes(trigger.toLowerCase())
//     );
//   }

//   return (
//     <>
//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           33% { transform: translateY(-10px) rotate(2deg); }
//           66% { transform: translateY(-5px) rotate(-2deg); }
//         }

//         @keyframes floatParticle {
//           0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
//           50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
//         }

//         @keyframes pulseGlow {
//           0%, 100% { box-shadow: 0 0 20px rgba(255, 224, 27, 0.3); }
//           50% { box-shadow: 0 0 40px rgba(255, 224, 27, 0.6), 0 0 60px rgba(255, 224, 27, 0.2); }
//         }

//         @keyframes slideInUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes slideInLeft {
//           from { opacity: 0; transform: translateX(-30px); }
//           to { opacity: 1; transform: translateX(0); }
//         }

//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(30px); }
//           to { opacity: 1; transform: translateX(0); }
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes typewriter {
//           from { width: 0; }
//           to { width: 100%; }
//         }

//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0; }
//         }

//         @keyframes confettiRain {
//           0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
//           100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
//         }

//         @keyframes checkmark {
//           0% { stroke-dashoffset: 100; opacity: 0; transform: scale(0.5); }
//           50% { opacity: 1; transform: scale(1.1); }
//           100% { stroke-dashoffset: 0; transform: scale(1); }
//         }

//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-floatParticle { animation: floatParticle 4s ease-in-out infinite; }
//         .animate-pulseGlow { animation: pulseGlow 3s ease-in-out infinite; }
//         .animate-slideInUp { animation: slideInUp 0.8s ease-out; }
//         .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
//         .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
//         .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
//         .animate-typewriter { animation: typewriter 3.5s steps(40, end); }
//         .animate-blink { animation: blink 1s infinite; }
//         .animate-confettiRain { animation: confettiRain 2s ease-out forwards; }
//         .animate-checkmark { animation: checkmark 1s ease-out forwards; }
//       `}</style>

//       <div className="hero-section relative bg-[] overflow-hidden">
//         <div className="relative z-10 min-h-screen flex items-center">
//           <div className="w-full max-w-[1450px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-center">
//               <div className={`space-y-8 ${isVisible ? 'animate-slideInLeft' : ''}`}>
//                 <div className="space-y-4">
//                   <h1 className="leading-[1.05] tracking-tight bg-[#241C15] bg-clip-text text-transparent relative"
//                     style={{
//                       fontSize: 'clamp(2rem, 5vw, 3rem)',
//                       letterSpacing: '-0.03em',
//                       fontWeight: '400',
//                     }}
//                   >
//                     {title}
//                   </h1>
//                 </div>

//                 {subtitle && (
//                   <div className="space-y-4">
//                     <p className="text-[#241C15]/75 leading-relaxed font-medium text-lg md:text-xl max-w-2xl"
//                       style={{
//                         lineHeight: '1.75'
//                       }}
//                     >
//                       {subtitle}
//                     </p>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
//                   {['No Setup Fees', '24/7 Support', '30-Day Guarantee', 'Easy Migration'].map((feature, index) => (
//                     <div key={feature} className="flex items-center gap-2 text-[#241C15]/70 group animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
//                       <div className="w-5 h-5 bg-[#f7af00] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
//                         <div className="w-1.5 h-1.5 bg-[#241C15] rounded-full"></div>
//                       </div>
//                       <span className="text-sm font-medium">{feature}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {ctas?.length > 0 && (
//                   <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
//                     <button
//                       onClick={() => setShowForm(true)}
//                       className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-[#f7af00] text-[#241C15] shadow-2xl hover:shadow-3xl hover:scale-[1.02] animate-fadeIn mt-4 sm:mt-0"
//                       style={{ animationDelay: '0.4s' }}
//                     >
//                       <span>Get Started</span>
//                       <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className={`relative ${isVisible ? 'animate-slideInRight' : ''}`}>
//                 <div className="relative">
//                   {screenshots?.length > 0 && (
//                     <div className="relative space-y-6">
//                       {screenshots.map((screenshot, index) => (
//                         <div
//                           key={index}
//                           className="group relative w-full transform hover:scale-[1.02] transition-all duration-500"
//                           style={{ animationDelay: `${index * 0.3}s` }}
//                         >
//                           <div className="relative backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
//                             <div className="aspect-video relative overflow-hidden">
//                               {screenshot.image && (
//                                 <img
//                                   src={urlFor(screenshot.image).url()}
//                                   alt={screenshot.caption || `Screenshot ${index + 1}`}
//                                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                                 />
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Form Modal/Popup */}
//       <AnimatePresence>
//         {/* {showForm && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
//               onClick={() => setShowForm(false)}
//             />

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{
//                 type: "spring",
//                 damping: 25,
//                 stiffness: 300,
//                 duration: 0.3
//               }}
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             >
//               <div
//                 className="relative w-full max-w-7xl bg-[#f0eadd] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Close Button *
//                 <button
//                   onClick={() => setShowForm(false)}
//                   className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
//                   aria-label="Close form"
//                 >
//                   <X className="w-5 h-5 text-gray-700" />
//                 </button>

//                 {submitStatus === 'success' ? (
//                   // Success/Thank You Message
//                   <div className="p-8 md:p-12 lg:p-16">
//                     <div className="max-w-3xl mx-auto text-center">
//                       {/* Animated Checkmark *
//                       <div className="relative mb-8">
//                         <div className="w-32 h-32 mx-auto mb-6 relative">
//                           {/* Outer circle *
//                           <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f7af00] to-[#ffd166] animate-pulse"></div>
                          
//                           {/* Checkmark SVG *
//                           <svg
//                             className="w-full h-full relative z-10"
//                             viewBox="0 0 100 100"
//                           >
//                             <circle
//                               cx="50"
//                               cy="50"
//                               r="45"
//                               fill="none"
//                               stroke="#fff"
//                               strokeWidth="4"
//                               strokeDasharray="283"
//                               strokeDashoffset="283"
//                               style={{
//                                 animation: 'checkmark 1s ease-out forwards',
//                                 animationDelay: '0.2s'
//                               }}
//                             />
//                             <path
//                               d="M30 50 L45 65 L70 35"
//                               fill="none"
//                               stroke="#fff"
//                               strokeWidth="5"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeDasharray="50"
//                               strokeDashoffset="50"
//                               style={{
//                                 animation: 'checkmark 1s ease-out forwards',
//                                 animationDelay: '0.5s'
//                               }}
//                             />
//                           </svg>

//                           {/* Confetti effect *
//                           {Array.from({ length: 20 }).map((_, i) => (
//                             <div
//                               key={i}
//                               className="absolute w-2 h-2 rounded-full animate-confettiRain"
//                               style={{
//                                 background: i % 3 === 0 ? '#f7af00' : i % 3 === 1 ? '#ff6b6b' : '#4ecdc4',
//                                 left: `${Math.random() * 100}%`,
//                                 animationDelay: `${i * 0.1}s`,
//                                 animationDuration: `${1 + Math.random()}s`
//                               }}
//                             />
//                           ))}
//                         </div>

//                         {/* Sparkles *
//                         <div className="absolute top-0 left-1/4">
//                           <Sparkles className="w-8 h-8 text-[#f7af00] animate-pulse" />
//                         </div>
//                         <div className="absolute top-4 right-1/4">
//                           <Star className="w-6 h-6 text-[#f7af00] animate-pulse" style={{ animationDelay: '0.5s' }} />
//                         </div>
//                       </div>

//                       {/* Thank You Message *
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.3 }}
//                         className="mb-8"
//                       >
//                         <h2 className="text-4xl md:text-5xl font-medium text-[#050504] mb-4">
//                           Thank You, <span className="text-[#f7af00]">{formData.name || 'Valued Client'}!</span>
//                         </h2>
//                         <p className="text-2xl text-[#31302f] mb-6">
//                           Your submission has been received successfully.
//                         </p>
//                       </motion.div>

//                       {/* Success Details *
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.5 }}
//                         className="max-w-2xl mx-auto mb-10"
//                       >
//                         <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#f7af00]/20">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                             <div className="text-left">
//                               <p className="text-sm text-[#31302f]/70 mb-1">Submission ID</p>
//                               <p className="text-lg font-mono font-semibold text-[#050504]">
//                                 #{Date.now().toString().slice(-8)}
//                               </p>
//                             </div>
//                             <div className="text-left">
//                               <p className="text-sm text-[#31302f]/70 mb-1">Submitted At</p>
//                               <p className="text-lg font-semibold text-[#050504]">
//                                 {new Date().toLocaleDateString('en-US', {
//                                   month: 'short',
//                                   day: 'numeric',
//                                   year: 'numeric',
//                                   hour: '2-digit',
//                                   minute: '2-digit'
//                                 })}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="space-y-4">
//                             <div className="flex items-center space-x-3 text-[#31302f]">
//                               <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                               <span>Confirmation email sent to <strong>{formData.email}</strong></span>
//                             </div>
//                             <div className="flex items-center space-x-3 text-[#31302f]">
//                               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//                               <span>Our expert will contact you at <strong>{formData.phone}</strong> within 24 hours</span>
//                             </div>
//                             <div className="flex items-center space-x-3 text-[#31302f]">
//                               <div className="w-2 h-2 rounded-full bg-[#f7af00]"></div>
//                               <span>Preparing your personalized consultation for <strong>{formData.interest}</strong></span>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>

//                       {/* Next Steps *
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.7 }}
//                         className="mb-10"
//                       >
//                         <h3 className="text-2xl font-medium text-[#050504] mb-6">What Happens Next?</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
//                           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
//                             <div className="w-12 h-12 bg-[#f7af00]/20 rounded-full flex items-center justify-center mb-4">
//                               <span className="text-2xl font-bold text-[#f7af00]">1</span>
//                             </div>
//                             <h4 className="text-lg font-medium text-[#050504] mb-2">Review & Assignment</h4>
//                             <p className="text-[#31302f] text-sm">
//                               Our team reviews your submission and assigns the most suitable expert.
//                             </p>
//                           </div>
//                           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
//                             <div className="w-12 h-12 bg-[#f7af00]/20 rounded-full flex items-center justify-center mb-4">
//                               <span className="text-2xl font-bold text-[#f7af00]">2</span>
//                             </div>
//                             <h4 className="text-lg font-medium text-[#050504] mb-2">Initial Contact</h4>
//                             <p className="text-[#31302f] text-sm">
//                               You'll receive a call or email within 24 hours to schedule your consultation.
//                             </p>
//                           </div>
//                           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
//                             <div className="w-12 h-12 bg-[#f7af00]/20 rounded-full flex items-center justify-center mb-4">
//                               <span className="text-2xl font-bold text-[#f7af00]">3</span>
//                             </div>
//                             <h4 className="text-lg font-medium text-[#050504] mb-2">Personalized Consultation</h4>
//                             <p className="text-[#31302f] text-sm">
//                               A detailed, personalized consultation tailored to your specific needs.
//                             </p>
//                           </div>
//                         </div>
//                       </motion.div>

//                       {/* Action Buttons *
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.9 }}
//                         className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//                       >
//                         <button
//                           onClick={() => setShowForm(false)}
//                           className="px-8 py-4 bg-[#f7af00] text-[#050504] font-bold rounded-lg hover:bg-[#e09e00] transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 min-w-[200px]"
//                         >
//                           <CheckCircle2 className="w-5 h-5" />
//                           Done
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSubmitStatus(null)
//                             setFormData({
//                               name: '',
//                               email: '',
//                               phone: '',
//                               business: '',
//                               website: '',
//                               interest: ''
//                             })
//                           }}
//                           className="px-8 py-4 bg-white text-[#050504] font-bold rounded-lg border-2 border-[#f7af00] hover:bg-[#f7af00]/10 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 min-w-[200px]"
//                         >
//                           <Sparkles className="w-5 h-5 text-[#f7af00]" />
//                           Submit Another
//                         </button>
//                       </motion.div>

//                       {/* Contact Info *
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 1.1 }}
//                         className="mt-10 pt-8 border-t border-gray-200"
//                       >
//                         <p className="text-[#31302f] mb-4">
//                           Need immediate assistance?
//                         </p>
//                         <div className="flex flex-wrap justify-center gap-6">
//                           <a
//                             href="mailto:aryan@getfinzie.com"
//                             className="inline-flex items-center gap-2 text-[#31302f] hover:text-[#f7af00] transition-colors"
//                           >
//                             <Zap className="w-4 h-4" />
//                             aryan@getfinzie.com
//                           </a>
//                           <a
//                             href="tel:9893270210"
//                             className="inline-flex items-center gap-2 text-[#31302f] hover:text-[#f7af00] transition-colors"
//                           >
//                             <Rocket className="w-4 h-4" />
//                             9893270210
//                           </a>
//                         </div>
//                       </motion.div>
//                     </div>
//                   </div>
//                 ) : (
//                   // Original Form (when not in success state)
//                   <div className="grid md:grid-cols-2">
//                     <div className="p-6 md:p-8 lg:p-10">
//                       <div className="mb-8">
//                         <h3 className="text-2xl md:text-3xl font-medium text-[#050504] mb-3">
//                           Get Your Free Consultation
//                         </h3>
//                         <p className="text-[#31302f]">
//                           Fill out this form and our experts will contact you within 24 hours.
//                         </p>
//                       </div>

//                       {submitStatus === 'error' && (
//                         <motion.div
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start gap-3"
//                         >
//                           <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
//                           <p className="text-sm font-medium">{submitMessage}</p>
//                         </motion.div>
//                       )}

//                       <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className="grid grid-cols-1 gap-4">
//                           {/* Form fields remain the same *
//                           <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-[#31302f] mb-2">
//                               Name <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                               type="text"
//                               id="name"
//                               value={formData.name}
//                               onChange={handleChange}
//                               className={`w-full px-4 py-3 rounded-lg border-2 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                                 } focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
//                               placeholder="Enter your full name"
//                             />
//                             {errors.name && (
//                               <p className="mt-2 text-sm text-red-600 flex items-center">
//                                 <AlertTriangle className="w-4 h-4 mr-1" />
//                                 {errors.name}
//                               </p>
//                             )}
//                           </div>

//                           {/* ... other form fields ... *
//                           <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-[#31302f] mb-2">
//                               Email <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                               type="email"
//                               id="email"
//                               value={formData.email}
//                               onChange={handleChange}
//                               className={`w-full px-4 py-3 rounded-lg border-2 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                                 } focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
//                               placeholder="Enter your email address"
//                             />
//                             {errors.email && (
//                               <p className="mt-2 text-sm text-red-600 flex items-center">
//                                 <AlertTriangle className="w-4 h-4 mr-1" />
//                                 {errors.email}
//                               </p>
//                             )}
//                           </div>

//                           <div>
//                             <label htmlFor="phone" className="block text-sm font-medium text-[#31302f] mb-2">
//                               Phone <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                               type="tel"
//                               id="phone"
//                               value={formData.phone}
//                               onChange={handleChange}
//                               className={`w-full px-4 py-3 rounded-lg border-2 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                                 } focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
//                               placeholder="Enter your phone number"
//                             />
//                             {errors.phone && (
//                               <p className="mt-2 text-sm text-red-600 flex items-center">
//                                 <AlertTriangle className="w-4 h-4 mr-1" />
//                                 {errors.phone}
//                               </p>
//                             )}
//                           </div>

//                           <div>
//                             <label htmlFor="business" className="block text-sm font-medium text-[#31302f] mb-2">
//                               Your Business Name
//                             </label>
//                             <input
//                               type="text"
//                               id="business"
//                               value={formData.business}
//                               onChange={handleChange}
//                               className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50"
//                               placeholder="Enter your business name"
//                             />
//                           </div>

//                           <div>
//                             <label htmlFor="website" className="block text-sm font-medium text-[#31302f] mb-2">
//                               Web URL
//                             </label>
//                             <input
//                               type="url"
//                               id="website"
//                               value={formData.website}
//                               onChange={handleChange}
//                               className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50"
//                               placeholder="https://example.com"
//                             />
//                           </div>

//                           <div>
//                             <label htmlFor="interest" className="block text-sm font-medium text-[#31302f] mb-2">
//                               Interested in <span className="text-red-500">*</span>
//                             </label>
//                             <select
//                               id="interest"
//                               value={formData.interest}
//                               onChange={handleChange}
//                               className={`w-full px-4 py-3 rounded-lg border-2 ${errors.interest ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                                 } focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50 appearance-none`}
//                             >
//                               <option value="">Select an option</option>
//                               <option value="GHL VA">GHL VA</option>
//                               <option value="One Time Project">One Time Project</option>
//                               <option value="On Going Support">On Going Support</option>
//                             </select>
//                             {errors.interest && (
//                               <p className="mt-2 text-sm text-red-600 flex items-center">
//                                 <AlertTriangle className="w-4 h-4 mr-1" />
//                                 {errors.interest}
//                               </p>
//                             )}
//                           </div>
//                         </div>

//                         <button
//                           type="submit"
//                           disabled={isSubmitting}
//                           className="w-full py-4 bg-[#f7af00] text-[#050504] font-bold rounded-lg hover:bg-[#e09e00] transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <Loader2 className="w-5 h-5 animate-spin" />
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <ArrowRight className="w-5 h-5" />
//                               Submit Now
//                             </>
//                           )}
//                         </button>

//                         <div className="pt-4 border-t border-gray-100">
//                           <p className="text-xs text-[#31302f] text-center">
//                             We respect your privacy. Your information will not be shared with third parties.
//                           </p>
//                         </div>
//                       </form>
//                     </div>

//                     <div className="bg-[#f0eadd] p-6 md:p-8 lg:p-10">
//                       <div className="mb-8">
//                         <h3 className="text-2xl md:text-3xl font-medium text-[#050504] mb-3">
//                           Why Connect With Us?
//                         </h3>
//                       </div>

//                       <div className="space-y-8">
//                         <div className="flex items-start space-x-4">
//                           <div className="w-10 h-10 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
//                             <Zap className="w-5 h-5 text-[#050504]" />
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-medium text-[#050504] mb-2">Fast Response</h3>
//                             <p className="text-[#31302f]">
//                               Get a response from our experts within 24 hours of submitting your details.
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-start space-x-4">
//                           <div className="w-10 h-10 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
//                             <Shield className="w-5 h-5 text-[#050504]" />
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-medium text-[#050504] mb-2">Secure & Confidential</h3>
//                             <p className="text-[#31302f]">
//                               Your information is protected with enterprise-grade security.
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-start space-x-4">
//                           <div className="w-10 h-10 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
//                             <TrendingUp className="w-5 h-5 text-[#050504]" />
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-medium text-[#050504] mb-2">Expert Consultation</h3>
//                             <p className="text-[#31302f]">
//                               Personalized advice from industry experts with 10+ years of experience.
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mt-10 bg-[#f0eadd] rounded-xl p-6">
//                         <h3 className="text-xl font-medium text-[#050504] mb-4">Contact Information</h3>
//                         <div className="space-y-3">
//                           <div className="flex items-center text-[#31302f]">
//                             <Sparkles className="w-5 h-5 mr-3 text-[#f7af00]" />
//                             <span>aryan@getfinzie.com</span>
//                           </div>
//                           <div className="flex items-center text-[#31302f]">
//                             <Rocket className="w-5 h-5 mr-3 text-[#f7af00]" />
//                             <span>9893270210</span>
//                           </div>
//                           <div className="flex items-center text-[#31302f]">
//                             <Star className="w-5 h-5 mr-3 text-[#f7af00]" />
//                             <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </>
//         )} */}

//         {form && (
//           <FormModal
//             formConfig={formConfig}
//             buttonText="Get Started"
//             buttonClassName="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-[#f7af00] text-[#241C15] shadow-2xl hover:shadow-3xl hover:scale-[1.02] animate-fadeIn mt-4 sm:mt-0"
//           />
//         )}

//       </AnimatePresence>

//       <style jsx global>{`
//         @keyframes gradientShift {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }

//         @keyframes gridMove {
//           0% { transform: translate(0, 0); }
//           100% { transform: translate(50px, 50px); }
//         }

//         .shadow-3xl {
//           box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
//         }

//         .backdrop-blur-md {
//           backdrop-filter: blur(12px);
//         }
//       `}</style>
//     </>
//   )
// }

// components/Hero.tsx
'use client'

import { ArrowRight, Zap, Sparkles, Star, ChevronRight, Play, Shield, Rocket, TrendingUp, X, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { urlFor } from "@/src/sanity/lib/image"
import { motion, AnimatePresence } from 'framer-motion'
import FormModal from './FormModal'
// import { FormModal } from './form/formModel' // Make sure this import path is correct

interface CTA {
  label: string
  href: string
  variant?: string
}

interface Screenshot {
  image: any
  caption?: string
}

interface BlogButton {
  label: string
  href: string
}

interface FormConfig {
  _id: string;
  name: string;
  title?: string;
  description?: string;
  type: 'ghl' | 'shopify' | 'general';
  additionalFields?: Array<{
    fieldType: 'select' | 'checkbox' | 'radio' | 'text' | 'textarea';
    label: string;
    name: string;
    required?: boolean;
    options?: string[];
    placeholder?: string;
  }>;
}

interface HeroProps {
  title: string
  subtitle?: string
  ctas?: CTA[]
  screenshots?: Screenshot[]
  blogButton?: BlogButton
  formConfig?: FormConfig // Changed from 'form' to 'formConfig'
}

export default function Hero({
  title,
  subtitle,
  ctas = [],
  screenshots = [],
  blogButton,
  formConfig, // Now using formConfig from Sanity
}: HeroProps) {
  const [particles, setParticles] = useState<{ left: string; top: string; duration: number; delay: number; size: number; type: string }[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    setIsVisible(true)

    setParticles(
      Array.from({ length: isMobile ? 15 : 25 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 5,
        delay: Math.random() * 3,
        size: 2 + Math.random() * 4,
        type: i % 4 === 0 ? 'circle' : i % 4 === 1 ? 'pulse' : i % 4 === 2 ? 'star' : 'sparkle'
      }))
    )

    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(-5px) rotate(-2deg); }
        }

        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 224, 27, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 224, 27, 0.6), 0 0 60px rgba(255, 224, 27, 0.2); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-floatParticle { animation: floatParticle 4s ease-in-out infinite; }
        .animate-pulseGlow { animation: pulseGlow 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
      `}</style>

      <div className="hero-section relative bg-[] overflow-hidden">
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="w-full max-w-[1450px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-center">
              <div className={`space-y-8 ${isVisible ? 'animate-slideInLeft' : ''}`}>
                <div className="space-y-4">
                  <h1 className="leading-[1.05] tracking-tight bg-[#241C15] bg-clip-text text-transparent relative"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      letterSpacing: '-0.03em',
                      fontWeight: '400',
                    }}
                  >
                    {title}
                  </h1>
                </div>

                {subtitle && (
                  <div className="space-y-4">
                    <p className="text-[#241C15]/75 leading-relaxed font-medium text-lg md:text-xl max-w-2xl"
                      style={{
                        lineHeight: '1.75'
                      }}
                    >
                      {subtitle}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                  {['No Setup Fees', '24/7 Support', '30-Day Guarantee', 'Easy Migration'].map((feature, index) => (
                    <div key={feature} className="flex items-center gap-2 text-[#241C15]/70 group animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="w-5 h-5 bg-[#f7af00] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-1.5 h-1.5 bg-[#241C15] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Use FormModal instead of old button logic */}
                <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                  {formConfig ? (
                    <FormModal
                      formConfig={formConfig}
                      buttonText="Get Started"
                      buttonClassName="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-[#f7af00] text-[#241C15] shadow-2xl hover:shadow-3xl hover:scale-[1.02] animate-fadeIn mt-4 sm:mt-0"
                    />
                  ) : (
                    <button
                      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-[#f7af00] text-[#241C15] shadow-2xl hover:shadow-3xl hover:scale-[1.02] animate-fadeIn mt-4 sm:mt-0"
                      style={{ animationDelay: '0.4s' }}
                      onClick={() => alert('Form configuration not found. Please check Sanity setup.')}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>

              <div className={`relative ${isVisible ? 'animate-slideInRight' : ''}`}>
                <div className="relative">
                  {screenshots?.length > 0 && (
                    <div className="relative space-y-6">
                      {screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className="group relative w-full transform hover:scale-[1.02] transition-all duration-500"
                          style={{ animationDelay: `${index * 0.3}s` }}
                        >
                          <div className="relative backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="aspect-video relative overflow-hidden">
                              {screenshot.image && (
                                <img
                                  src={urlFor(screenshot.image).url()}
                                  alt={screenshot.caption || `Screenshot ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }
      `}</style>
    </>
  )
}