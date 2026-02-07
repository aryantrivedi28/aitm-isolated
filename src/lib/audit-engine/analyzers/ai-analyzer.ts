import OpenAI from 'openai'
import { AuditIssue } from '../types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export class AIAnalyzer {

  /* =======================================================
     STORE LEVEL ANALYSIS
  ======================================================= */

  static async analyzeStore(storeUrl: string, rawData: any) {
    const prompt = this.createAnalysisPrompt(storeUrl, rawData)

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert Shopify CRO + performance consultant. Return STRICT JSON only.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0,   // 🔥 deterministic
        top_p: 0,
        max_tokens: 1200,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No AI response')

      return JSON.parse(content)

    } catch (error) {
      console.error('AI analysis failed:', error)
      return this.getFallbackAnalysis()
    }
  }

  /* =======================================================
     ISSUE ENHANCEMENT (optimized)
  ======================================================= */

  static async enhanceIssues(issues: AuditIssue[]): Promise<AuditIssue[]> {
    if (!issues.length) return []

    // 🔥 only enhance critical + high (industry practice)
    const important = issues.filter(i =>
      i.severity === 'critical' || i.severity === 'high'
    )

    const others = issues.filter(i =>
      i.severity !== 'critical' && i.severity !== 'high'
    )

    const enhancedImportant = await Promise.all(
      important.map(issue =>
        this.enhanceSingleIssue(issue).catch(() => issue)
      )
    )

    return [...enhancedImportant, ...others]
  }

  /* =======================================================
     SINGLE ISSUE
  ======================================================= */

  private static async enhanceSingleIssue(issue: AuditIssue): Promise<AuditIssue> {
    const prompt = `
Enhance this Shopify issue with expert guidance.

Title: ${issue.title}
Category: ${issue.category}
Severity: ${issue.severity}

Return JSON:
{
  "businessImpact": "string",
  "technicalImpact": "string",
  "solutionSteps": ["step 1", "step 2"],
  "aiExplanation": "string"
}`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        top_p: 0,
        max_tokens: 400,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0]?.message?.content
      if (!content) return issue

      let enhanced: any = {}

      try {
        enhanced = JSON.parse(content)
      } catch {
        enhanced = {}
      }

      return {
        ...issue,
        businessImpact: enhanced.businessImpact ?? issue.businessImpact ?? '',
        technicalImpact: enhanced.technicalImpact ?? issue.technicalImpact ?? '',
        solutionSteps:
          enhanced.solutionSteps ??
          issue.solutionSteps ??
          [issue.title],   // 🔥 always fallback
        aiExplanation: enhanced.aiExplanation ?? ''
      }

    } catch {
      return issue
    }
  }

  /* =======================================================
     PROMPT BUILDER (FIXED)
  ======================================================= */

  private static createAnalysisPrompt(storeUrl: string, rawData: any): string {
    const issues: AuditIssue[] = rawData.issues || []

    const critical = issues.filter(i => i.severity === 'critical')
    const high = issues.filter(i => i.severity === 'high')

    const list = (category: string) =>
      issues
        .filter(i => i.category === category)
        .map(i => `- ${i.title} (${i.severity})`)
        .join('\n') || 'None'

    return `
Analyze this Shopify store audit:

Store URL: ${storeUrl}
Performance Score: ${rawData.scores?.performance ?? 'N/A'}/100

Critical Issues: ${critical.length}
High Issues: ${high.length}

Performance:
${list('performance')}

UX:
${list('ux')}

Conversion:
${list('conversion')}

Trust:
${list('trust')}

Return STRICT JSON:
{
  "summary": "string",
  "priorityActions": ["string"],
  "quickWins": ["string"],
  "estimatedImpact": {
    "conversionRate": "string",
    "aovIncrease": "string",
    "revenuePotential": "string"
  }
}`
  }

  /* =======================================================
     FALLBACK
  ======================================================= */

  private static getFallbackAnalysis() {
    return {
      summary: 'Store audit completed. Found several optimization opportunities.',
      priorityActions: [
        'Improve performance and Core Web Vitals',
        'Optimize mobile UX',
        'Add trust signals',
        'Improve checkout flow',
        'Increase product page conversions'
      ],
      quickWins: [
        'Enable sticky add-to-cart',
        'Add trust badges',
        'Improve CTA visibility'
      ],
      estimatedImpact: {
        conversionRate: '+1–3%',
        aovIncrease: '+$10–20',
        revenuePotential: '20–30% growth'
      }
    }
  }
}
