import { client } from '@/src/sanity/lib/client'
import { urlFor } from '@/src/sanity/lib/image'

// Components
import Hero from '../../../../src/components/landing/Hero'
import PainPoints from '../../../../src/components/landing/PainPoints'
import HowWeSolve from '../../../../src/components/landing/HowWeSolve'
import WhyUs from '../../../../src/components/landing/WhyUs'
import ShortCaseStudies from '../../../../src/components/landing/ShortCaseStudies'
import Logos from '../../../../src/components/landing/Logos'
import HowItWorks from '../../../../src/components/landing/HowItWorks'
import FAQ from '../../../../src/components/landing/FAQ'
import CTA from '../../../../src/components/landing/CTA'

interface LandingPageData {
  title: string
  hero: any
  sections: Section[]
}

type LandingPageProps = {
  params: {
    slug: string
  }
}

// 🔹 Section union type
type Section =
  | { _type: 'painPointsSection'; [key: string]: any }
  | { _type: 'howWeSolveSection'; [key: string]: any }
  | { _type: 'whyUsSection'; [key: string]: any }
  | { _type: 'shortCaseStudiesSection'; [key: string]: any }
  | { _type: 'logosSection'; [key: string]: any }
  | { _type: 'howItWorksSection'; [key: string]: any }
  | { _type: 'faqSection'; [key: string]: any }
  | { _type: 'ctaSection'; [key: string]: any }

// 🔹 Component map
const componentMap: Record<Section['_type'], React.ComponentType<any>> = {
  painPointsSection: PainPoints,
  howWeSolveSection: HowWeSolve,
  whyUsSection: WhyUs,
  shortCaseStudiesSection: ShortCaseStudies,
  logosSection: Logos,
  howItWorksSection: HowItWorks,
  faqSection: FAQ,
  ctaSection: CTA,
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params

  const page: LandingPageData = await client.fetch(
    `*[_type == "landingPage" && slug.current == $slug][0]{
      title,

      hero {
        title,
        subtitle,
        backgroundImage{asset->{url}},
        foregroundImage{asset->{url}},
        ctas[]{label, href, variant}
      },

      sections[] {
        _type,
        _key,

        // ✅ Pain Points
        _type == "painPointsSection" => {
          _type,
          _key,
          heading,
          items[] {
            title,
            description,
            icon{asset->{url}}
          }
        },

        // ✅ How We Solve
        _type == "howWeSolveSection" => {
          _type,
          _key,
          heading,
          solutions[] {
            title,
            description,
            image{asset->{url}}
          }
        },

        // ✅ Why Us
        _type == "whyUsSection" => {
          _type,
          _key,
          heading,
          reasons[] {
            title,
            description,
            icon{asset->{url}}
          }
        },

        // ✅ Short Case Studies
        _type == "shortCaseStudiesSection" => {
          _type,
          _key,
          heading,
          caseStudies[]->{
            _id,
            title,
            excerpt,
            "slug": slug.current,
            thumbnail{asset->{url}}
          }
        },

        // ✅ Logos
        _type == "logosSection" => {
          _type,
          _key,
          heading,
          logos[] {
            name,
            image{asset->{url}}
          }
        },

        // ✅ How It Works
        _type == "howItWorksSection" => {
          _type,
          _key,
          heading,
          steps[] {
            title,
            description,
            image{asset->{url}}
          }
        },

        // ✅ FAQs
        _type == "faqSection" => {
          _type,
          _key,
          faqs[] {
            question,
            answer
          }
        },

        // ✅ CTA
        _type == "ctaSection" => {
          _type,
          _key,
          title,
          subtitle,
          buttons[] {
            label,
            href
          },
          background{asset->{url}}
        }
      }
    }`,
    { slug }
  )

  if (!page) return <div>Not found</div>

  return (
    <div>
      {/* Hero section */}
      {page.hero && <Hero {...page.hero} />}

      {/* Dynamic sections */}
      {page.sections?.map((section, i) => {
        const SectionComponent = componentMap[section._type]
        if (!SectionComponent) return null
        return <SectionComponent key={section._key || i} {...section} />
      })}
    </div>
  )
}
