// app/landing/[slug]/page.tsx
import { client } from '@/src/sanity/lib/client'
import Hero from '../../../../src/components/landing/Hero'
import PainPoints from '../../../../src/components/landing/PainPoints'
import HowWeSolve from '../../../../src/components/landing/HowWeSolve'
import WhyUs from '../../../../src/components/landing/WhyUs'
import ShortCaseStudies from '../../../../src/components/landing/ShortCaseStudies'
import Logos from '../../../../src/components/landing/Logos'
import HowItWorks from '../../../../src/components/landing/HowItWorks'
import FAQ from '../../../../src/components/landing/FAQ'
import CTA from '../../../../src/components/landing/CTA'

type Section =
  | { _type: 'painPointsSection';[key: string]: any }
  | { _type: 'howWeSolveSection';[key: string]: any }
  | { _type: 'whyUsSection';[key: string]: any }
  | { _type: 'shortCaseStudiesSection';[key: string]: any }
  | { _type: 'logosSection';[key: string]: any }
  | { _type: 'howItWorksSection';[key: string]: any }
  | { _type: 'faqSection';[key: string]: any }
  | { _type: 'ctaSection';[key: string]: any }

interface LandingPageData {
  title: string
  hero: any
  sections: Section[]
}

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

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
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
      _type == "shortCaseStudiesSection" => {
        _type,
        _key,
        heading,
        "studies": caseStudies[]->{
          "company": title,
          "image": mainImage,
          "result": description,
          "slug": slug,
          tags
        }
      },
      _type == "logosSection" => {
        _type,
        _key,
        heading,
        logos[] {
          name,
          image{asset->{url}}
        }
      },
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
      _type == "faqSection" => {
        _type,
        _key,
        faqs[] {
          question,
          answer
        }
      },
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
    <main className="flex flex-col w-full">
      {page.hero && (
        <section className="w-full">
          <Hero {...page.hero} />
        </section>
      )}

      {page.sections?.map((section, i) => {
        const SectionComponent = componentMap[section._type]
        if (!SectionComponent) return null

        // Debug only the case studies section:
        if (section._type === 'shortCaseStudiesSection') {
          console.log('ShortCaseStudies section data:', section)
        }

        return (
          <section
            key={section._key || i}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <SectionComponent {...section} />
          </section>
        )
      })}
    </main>
  )

}