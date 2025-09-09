import { type NextRequest, NextResponse } from "next/server"
import { AIGenerator } from "../../../../lib/agreements/ai-terms"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    let terms: string

    if (type === "client") {
      const { projectTitle, scope, paymentAmount, currency } = data
      terms = await AIGenerator.generateClientAgreementTerms(projectTitle, scope, paymentAmount, currency)
    } else if (type === "freelancer") {
      const { workType, hourlyRate, projectDuration } = data
      terms = await AIGenerator.generateFreelancerAgreementTerms(workType, hourlyRate, projectDuration)
    } else if (type === "payment") {
      const { amount, currency, projectType } = data
      terms = await AIGenerator.generatePaymentTerms(amount, currency, projectType)
    } else if (type === "custom") {
      const { prompt, context } = data
      terms = await AIGenerator.generateCustomTerms(prompt, context)
    } else {
      return NextResponse.json({ error: "Invalid terms type" }, { status: 400 })
    }

    return NextResponse.json({ terms })
  } catch (error) {
    console.error("Error generating terms:", error)
    return NextResponse.json({ error: "Failed to generate terms" }, { status: 500 })
  }
}
