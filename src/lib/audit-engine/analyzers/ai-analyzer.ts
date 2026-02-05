import OpenAI from 'openai'
import { AuditIssue, AuditResult } from '../types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export class AIAnalyzer {
  static async analyzeStore(storeUrl: string, rawData: any): Promise<{
    summary: string
    priorityActions: string[]
    quickWins: string[]
    estimatedImpact: {
      conversionRate: string
      aovIncrease: string
      revenuePotential: string
    }
  }> {
    const prompt = this.createAnalysisPrompt(storeUrl, rawData)

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert Shopify consultant with 10+ years experience.
            Analyze the audit data and provide specific, actionable insights.
            Focus on business impact and practical solutions.
            Be concise but comprehensive.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
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

  static async enhanceIssues(issues: AuditIssue[]): Promise<AuditIssue[]> {
    const enhancedIssues: AuditIssue[] = []

    for (const issue of issues) {
      try {
        const enhanced = await this.enhanceSingleIssue(issue)
        enhancedIssues.push(enhanced)
      } catch (error) {
        console.error(`Failed to enhance issue ${issue.id}:`, error)
        enhancedIssues.push(issue)
      }
    }

    return enhancedIssues
  }

  private static async enhanceSingleIssue(issue: AuditIssue): Promise<AuditIssue> {
    const solutionSteps = Array.isArray(issue.solutionSteps)
      ? issue.solutionSteps
      : []

    const prompt = `Enhance this Shopify audit issue with expert insights:

Issue: ${issue.title || 'Untitled'}
Category: ${issue.category || 'general'}
Severity: ${issue.severity || 'medium'}
Current Solution: ${solutionSteps.join(', ') || 'Not provided'}

Provide:
1. More detailed business impact (specific percentages if possible)
2. Additional technical details
3. Step-by-step implementation guide
4. Common pitfalls to avoid
5. Tools or apps that could help

Format response as JSON:
{
  "businessImpact": "string",
  "technicalImpact": "string",
  "solutionSteps": ["string"],
  "aiExplanation": "string"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 500
    })

    const content = response.choices[0]?.message?.content
    if (!content) return issue

    let enhanced: any
    try {
      enhanced = JSON.parse(content)
    } catch {
      return issue
    }

    return {
      ...issue,
      businessImpact: enhanced.businessImpact ?? issue.businessImpact,
      technicalImpact: enhanced.technicalImpact ?? issue.technicalImpact,
      solutionSteps: enhanced.solutionSteps ?? issue.solutionSteps,
      aiExplanation: enhanced.aiExplanation
    }
  }


  private static createAnalysisPrompt(storeUrl: string, rawData: any): string {
    const allIssues = [
      ...(rawData.issues?.critical || []),
      ...(rawData.issues?.high || []),
      ...(rawData.issues?.medium || []),
      ...(rawData.issues?.low || [])
    ]

    return `Analyze this Shopify store audit:

Store URL: ${storeUrl}
Theme: ${rawData.theme?.name || 'Unknown'}
Performance Score: ${rawData.scores?.performance ?? 'N/A'}/100
Critical Issues: ${allIssues.filter(i => i.severity === 'critical').length}
High Issues: ${allIssues.filter(i => i.severity === 'high').length}


Performance Issues:
${allIssues
        .filter(i => i.category === 'performance')
        .map(i => `- ${i.title} (${i.severity})`)
        .join('\n') || 'None'}

UX Issues:
${allIssues
        .filter(i => i.category === 'ux')
        .map(i => `- ${i.title} (${i.severity})`)
        .join('\n') || 'None'}

Conversion Issues:
${rawData.issues?.filter((i: any) => i.category === 'conversion').map((i: any) => `- ${i.title} (${i.severity})`).join('\n') || 'None'}

Based on this data, provide:
1. A comprehensive 3-4 sentence summary
2. Top 5 priority actions (most impactful first)
3. 3 quick wins that can be implemented in under 2 hours
4. Estimated impact on conversion rate, AOV, and revenue

Format response as JSON:
{
  "summary": "string",
  "priorityActions": ["string"],
  "quickWins": ["string"],
  "estimatedImpact": {
    "conversionRate": "string (e.g., +1.5-3.2%)",
    "aovIncrease": "string (e.g., +$15-30)",
    "revenuePotential": "string (e.g., 25-40% monthly increase)"
  }
}`
  }

  private static getFallbackAnalysis() {
    return {
      summary: 'Store audit completed. Found several optimization opportunities.',
      priorityActions: [
        'Fix critical performance issues affecting page load',
        'Improve mobile user experience',
        'Add trust elements to increase conversion confidence',
        'Implement email capture for abandoned cart recovery',
        'Optimize product pages for better conversions'
      ],
      quickWins: [
        'Add trust badges to product pages',
        'Enable guest checkout option',
        'Implement sticky add-to-cart button'
      ],
      estimatedImpact: {
        conversionRate: '+1.2-2.8%',
        aovIncrease: '+$12-25',
        revenuePotential: '20-35% monthly increase'
      }
    }
  }
}