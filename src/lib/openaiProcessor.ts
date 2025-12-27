import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

interface Metadata {
  projectTitle?: string
  role?: string
  serviceType?: string
  toolsUsed?: string[]
  shortDescription?: string
}

interface ExtractedText {
  text: string
  headings: string[]
  bulletPoints: string[]
  metrics: string[]
}

export async function structurePDFContent(
  extractedText: ExtractedText, 
  metadata: Metadata
): Promise<{
  challenge: string
  solution: string
  process: string
  deliverables: string
  results: string
  summary: string
}> {
  const prompt = `
You are a portfolio analyzer. Extract and structure the following PDF content.

EXTRACTED TEXT:
${extractedText.text.substring(0, 15000)} ${extractedText.text.length > 15000 ? '...[truncated]' : ''}

KEY ELEMENTS FOUND:
- Headings: ${extractedText.headings.slice(0, 10).join(', ')}
- Key bullet points: ${extractedText.bulletPoints.slice(0, 10).join(', ')}
- Metrics: ${extractedText.metrics.slice(0, 10).join(', ')}

METADATA PROVIDED:
- Project Title: ${metadata.projectTitle || 'Not provided'}
- Role: ${metadata.role || 'Not provided'}
- Service Type: ${metadata.serviceType || 'Not provided'}
- Tools: ${metadata.toolsUsed?.join(', ') || 'Not provided'}
- Description: ${metadata.shortDescription || 'Not provided'}

STRUCTURE THE CONTENT INTO THESE EXACT SECTIONS:

1. "challenge": Combine "About the client" and "The challenge" - What was the problem or need?
2. "solution": "The solution" - What was your approach or solution?
3. "process": "Execution" - How did you execute the solution?
4. "deliverables": Specific deliverables produced
5. "results": Measurable outcomes, metrics, and impact
6. "summary": One-line summary of the project

Return JSON with these exact keys:
{
  "challenge": "",
  "solution": "",
  "process": "",
  "deliverables": "",
  "results": "",
  "summary": ""
}

Rules:
- Each field: 2-5 sentences
- Include specific metrics when available
- Use bullet points in deliverables
- Professional and concise tone
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional portfolio content analyzer that structures case studies into specific JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No content returned from OpenAI')
    
    return JSON.parse(content)
  } catch (error) {
    console.error('OpenAI processing error:', error)
    throw new Error('Failed to structure content with AI')
  }
}