// src/sanity/schema.ts

import { type SchemaTypeDefinition } from 'sanity'
import caseStudy from './caseStudy'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [caseStudy],
}
