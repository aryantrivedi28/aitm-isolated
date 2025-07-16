// 'use client';

// import { motion } from 'framer-motion';

// const fadeUp = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// const staggerContainer = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.2 } },
// };

// export default function CaseStudies() {
//   const caseStudies = [
//     {
//       title: 'E-commerce Platform Scale-up',
//       description: 'Helped an e-commerce startup migrate to a scalable architecture, improving load times by 40% and boosting conversion rates.',
//       image: 'https://www.weverve.com/wp-content/uploads/2020/10/ecommerce-1.jpg',
//     },
//     {
//       title: 'AI Chatbot Deployment',
//       description: 'Built and deployed an AI-powered chatbot that reduced support ticket volume by 50% while enhancing customer satisfaction.',
//       image: 'https://as1.ftcdn.net/v2/jpg/05/53/49/14/1000_F_553491455_LFIQhLnAmAB1y4eNKehXqqUNVD8HfpUP.jpg',
//     },
//     {
//       title: 'Product Landing Page Revamp',
//       description: 'Redesigned a SaaS product landing page, resulting in a 30% increase in user sign-ups within the first month post-launch.',
//       image: 'https://tse1.mm.bing.net/th/id/OIP.AAx9kc_xsCZ8ovc_8CtTnQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
//     },
//   ];

//   return (
//     <main className="flex flex-col items-center justify-center bg-[#F5F5F5] py-16 px-4">
//       {/* Heading */}
//       <motion.div
//         className="text-center max-w-2xl mb-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.3 }}
//         variants={staggerContainer}
//       >
//         <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-[#241C15] mb-4">
//           Case Studies
//         </motion.h1>
//         <motion.p variants={fadeUp} className="text-lg md:text-xl text-[#241C15]">
//           Explore our successful projects and how we helped businesses achieve their goals.
//         </motion.p>
//       </motion.div>

//       {/* Cards */}
//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.2 }}
//         variants={staggerContainer}
//       >
//         {caseStudies.map((study, idx) => (
//           <motion.div
//             key={idx}
//             variants={fadeUp}
//             className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col"
//           >
//             <img
//               src={study.image}
//               alt={study.title}
//               className="rounded-md h-48 w-full object-cover mb-4"
//             />
//             <h3 className="text-xl font-semibold text-[#241C15] mb-2">{study.title}</h3>
//             <p className="text-gray-600">{study.description}</p>
//           </motion.div>
//         ))}
//       </motion.div>
//     </main>
//   );
// }


// app/case-studies/page.tsx

import { client } from '../../sanity/lib/client'
import Image from 'next/image';
import Link from 'next/link';
interface CaseStudy {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  image: { asset: { url: string } };
}

export default async function CaseStudiesPage() {
  const caseStudies: CaseStudy[] = await client.fetch(`
    *[_type == "caseStudy"]{
      _id,
      title,
      description,
      slug,
      image {
        asset->{
          url
        }
      }
    }
  `);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Case Studies</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {caseStudies.map((study) => (
          <Link
            key={study._id}
            href={`/case-studies/${study.slug.current}`}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
          >
            {study.image?.asset?.url && (
              <Image
                src={study.image.asset.url}
                alt={study.title}
                width={400}
                height={250}
                className="rounded mb-3 object-cover w-full h-48"
              />
            )}
            <h2 className="text-xl font-semibold">{study.title}</h2>
            <p className="text-gray-600">{study.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
