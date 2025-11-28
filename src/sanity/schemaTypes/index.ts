// src/sanity/schema.ts
import { type SchemaTypeDefinition } from 'sanity'

// your existing doc
import caseStudy from './caseStudy'

// core doc
import landingPage from './landingPage'

// object types
import richImage from './objects/richImage'

// sections
import howWeSolveSection from './sections/howWeSolveSection'
import shortCaseStudiesSection from './sections/shortCaseStudiesSection'
import logosSection from './sections/logosSection'
import howItWorksSection from './sections/howItWorksSection'
import faqSection from './sections/faqSection'
import ctaSection from './sections/ctaSection'
import testimonialSection from './sections/testimonialSection'
import footerSection from './sections/footerSection'
import { theProblemSection } from './sections/theProblemSection'
import { theSolutionSection } from './sections/theSolutionSection'
import { resultBenefitSection } from './sections/resultBenefitSection'
import { ghlServicesSection } from './sections/ghlServicesSection'
import { includesSection } from './sections/includesSection'
import { devIntegrationSection } from './sections/devIntegrationSection'
import { crmMigrationSection } from './sections/crmMigrationSection'
// import { bottomSection } from './sections/bottomSection'

// export schema definition for Sanity Studio
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    caseStudy,
    landingPage,

    // shared objects
    richImage,

    // section objects
    theProblemSection,
    theSolutionSection,
    resultBenefitSection,
    ghlServicesSection,
    devIntegrationSection,
    crmMigrationSection,
    howWeSolveSection,
    includesSection,
    shortCaseStudiesSection,
    logosSection,
    howItWorksSection,
    faqSection,
    ctaSection,
    testimonialSection,
    // bottomSection,
    footerSection,
  ],
}
