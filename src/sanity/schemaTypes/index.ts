// src/sanity/schema.ts
import { type SchemaTypeDefinition } from 'sanity'

// your existing doc
import caseStudy from './caseStudy'

// core doc
import landingPage from './landingPage'

// object types
import richImage from './objects/richImage'

// sections
import painPointsSection from './sections/painPointsSections'
import howWeSolveSection from './sections/howWeSolveSection'
import whyUsSection from './sections/whyUsSection'
import shortCaseStudiesSection from './sections/shortCaseStudiesSection'
import logosSection from './sections/logosSection'
import howItWorksSection from './sections/howItWorksSection'
import faqSection from './sections/faqSection'
import ctaSection from './sections/ctaSection'
import testimonialSection from './sections/testimonialSection'

// export schema definition for Sanity Studio
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    caseStudy,
    landingPage,

    // shared objects
    richImage,

    // section objects
    painPointsSection,
    howWeSolveSection,
    whyUsSection,
    shortCaseStudiesSection,
    logosSection,
    howItWorksSection,
    faqSection,
    ctaSection,
    testimonialSection,
  ],
}
