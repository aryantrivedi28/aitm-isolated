import pdf from 'pdf-parse'

export async function extractTextFromPDF(buffer: Buffer) {
  try {
    const data = await pdf(buffer)
    const text = data.text
    
    // Extract headings (lines that look like headings)
    const lines = text.split('\n')
    const headings = lines.filter(line => {
      const trimmed = line.trim()
      return (
        trimmed.length > 0 &&
        trimmed.length < 100 &&
        (
          /^[A-Z][A-Z\s]+$/.test(trimmed) || // All caps
          /^[IVX]+\./.test(trimmed) || // Roman numerals
          /^\d+\.\s+[A-Z]/.test(trimmed) || // Numbered headings
          /^[A-Z].*:$/.test(trimmed) // Ends with colon
        )
      )
    })
    
    // Extract bullet points
    const bulletPoints = lines.filter(line => 
      /^[-•*]\s+/.test(line.trim()) ||
      /^\d+[\.\)]\s+/.test(line.trim())
    )
    
    // Extract metrics
    const metrics: string[] = []
    const metricPatterns = [
      /\b(\d+)\s*%\b/g,
      /\b(\d+)\s*(increase|decrease|growth|reduction|improvement)\b/gi,
      /\$\s*(\d+[,\d]*\.?\d*)/g,
      /\b(\d+)\s*(days|months|years|weeks|hours|minutes)\b/gi,
      /\b(\d+)\s*(users|customers|visitors|subscribers|downloads)\b/gi
    ]
    
    lines.forEach(line => {
      metricPatterns.forEach(pattern => {
        const matches = line.match(pattern)
        if (matches) {
          metrics.push(...matches)
        }
      })
    })
    
    return {
      text,
      headings,
      bulletPoints,
      metrics: Array.from(new Set(metrics)), // Remove duplicates
      numPages: data.numpages
    }
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error}`)
  }
}