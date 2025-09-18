import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY2! });

export async function POST(req: Request) {
      try {
            const { text } = await req.json();
            if (!text)
                  return NextResponse.json({ error: "Missing text" }, { status: 400 });

            const prompt = `
You are an API that converts raw client requirements into structured JSON for a form builder.

The client text is between triple quotes:
"""${text}"""

Return **only valid JSON** (no explanations, no markdown) following this schema exactly:

{
  "form_id": "startup-webdev-001",           // lowercase, no spaces, hyphen-separated, end with incremental number like 001
  "form_name": "Web Developer Requirement",  // short clear name
  "form_description": "Write 2–3 full sentences summarising what this form is for and what the applicant should expect.",
  "industry": "Technology",
  "category": "Development",
  "subcategory": "Web Development",
  "message": "Write a friendly marketing-style invitation text (2–3 sentences) encouraging people to fill out this form."
}

If any field is not given in the client text, guess reasonable defaults or use empty arrays/strings where appropriate. 
Do NOT include any text outside the JSON.
`;


            const completion = await openai.chat.completions.create({
                  model: "gpt-4o-mini",
                  messages: [{ role: "user", content: prompt }],
                  temperature: 0.2,
            });

            const raw = completion.choices[0].message?.content;
            if (!raw) throw new Error("OpenAI returned no content");

            // Try to safely extract JSON even if model wraps it
            let parsed;
            try {
                  parsed = JSON.parse(raw);
            } catch {
                  const match = raw.match(/\{[\s\S]*\}/);
                  parsed = match ? JSON.parse(match[0]) : {};
            }

            return NextResponse.json(parsed);
      } catch (err: any) {
            console.error("parse-client-text error:", err);
            return NextResponse.json({ error: err.message }, { status: 500 });
      }
}
