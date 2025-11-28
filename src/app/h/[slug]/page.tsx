// app/landing/[slug]/page.tsx
import { client } from '@/src/sanity/lib/client'
import Hero from '../../../components/landing/Hero'
import ShortCaseStudies from '../../../components/landing/ShortCaseStudies'
import Logos from '../../../components/landing/Logos'
import HowItWorks from '../../../components/landing/HowItWorks'
import FAQ from '../../../components/landing/FAQ'
import CTA from '../../../components/landing/CTA'
import TestimonialSection from '../../../components/landing/Testimonial'
import Footer from '@/src/components/landing/Footer'
// Import your new components
import TheProblem from '../../../components/landing/TheProblem'
import TheSolution from '../../../components/landing/TheSolution'
import GHLServices from '../../../components/landing/GHLServices'
import ResultBenefit from '../../../components/landing/ResultBenefit'
import CRMMigration from '../../../components/landing/CRMMigration'
import DevIntegration from '../../../components/landing/DevIntegration'
import IncludesSection from '../../../components/landing/IncludesSection'

type Section =
  | { _type: 'shortCaseStudiesSection'; [key: string]: any }
  | { _type: 'logosSection'; [key: string]: any }
  | { _type: 'howItWorksSection'; [key: string]: any }
  | { _type: 'faqSection'; [key: string]: any }
  | { _type: 'ctaSection'; [key: string]: any }
  | { _type: 'testimonialSection'; [key: string]: any }
  | { _type: 'footerSection'; [key: string]: any }
  | { _type: 'theProblemSection'; [key: string]: any }
  | { _type: 'theSolutionSection'; [key: string]: any }
  | { _type: 'ghlServicesSection'; [key: string]: any }
  | { _type: 'resultBenefitSection'; [key: string]: any }
  | { _type: 'crmMigrationSection'; [key: string]: any }
  | { _type: 'devIntegrationSection'; [key: string]: any }
  | { _type: 'includesSection'; [key: string]: any }

interface LandingPageData {
  title: string
  hero: any
  sections: Section[]
}

const componentMap: Record<Section['_type'], React.ComponentType<any>> = {
  shortCaseStudiesSection: ShortCaseStudies,
  logosSection: Logos,
  howItWorksSection: HowItWorks,
  faqSection: FAQ,
  ctaSection: CTA,
  testimonialSection: TestimonialSection,
  footerSection: Footer,
  theProblemSection: TheProblem,
  theSolutionSection: TheSolution,
  ghlServicesSection: GHLServices,
  resultBenefitSection: ResultBenefit,
  crmMigrationSection: CRMMigration,
  devIntegrationSection: DevIntegration,
  includesSection: IncludesSection,
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
        backgroundImage { asset->{ url } },
        ctas[] { label, href, variant },
        screenshots[] {
          image { asset->{ url } },
          caption
        },
        blogButton {
          label,
          href
        }
      },
      sections[] {
        _type,
        _key,
        _type == "theProblemSection" => {
          _type,
          _key,
          heading,
          subheading,
          paragraph
        },
        _type == "theSolutionSection" => {
          _type,
          _key,
          heading,
          subheading,
          solutions
        },
        _type == "ghlServicesSection" => {
          _type,
          _key,
          heading,
          subheading,
          services[] {
            title,
            description
          }
        },
        _type == "resultBenefitSection" => {
          _type,
          _key,
          heading,
          subheading,
          benefits
        },
        _type == "crmMigrationSection" => {
          _type,
          _key,
          heading,
          subheading,
          items[] {
            title,
            description
          }
        },
        _type == "devIntegrationSection" => {
          _type,
          _key,
          heading,
          subheading,
          items[] {
            title,
            description
          }
        },
        _type == "includesSection" => {
          _type,
          _key,
          heading,
          subheading,
          items
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
          heading,
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
        },
        _type == "testimonialSection" => {
          _type,
          _key,
          heading,
          testimonials[]{
            quote,
            authorName,
            authorTitle,
            authorImage{asset->{url}}
          }
        },
        _type == "footerSection" => {
          _type,
          _key,
          text
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
        if (!SectionComponent) {
          console.warn(`No component found for section type: ${section._type}`)
          return null
        }

        return (
          <section key={section._key || i}>
            <SectionComponent {...section} />
          </section>
        )
      })}

      <Footer />
    </main>
  )
}