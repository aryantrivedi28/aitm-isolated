import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY2! });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    const prompt = `
You are an assistant that converts client requirements into form meta-data.
Client text:
"""${text}"""

Return JSON exactly like:
{
  "form_id": "shortuniqueid",
  "form_name": "Form name",
  "category": "Category",
  "subcategory": "Subcategory",
  "industry": "Industry",
  "required_fields": ["field1","field2"],
  "message": "shareable message text"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const raw = completion.choices[0].message?.content;
    if (!raw) throw new Error("OpenAI returned no content");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || "{}");
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
