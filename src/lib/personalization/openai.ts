import OpenAI from "openai";


export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY2 });


export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";


export async function generateEmail({
prompt,
companyName,
companySummary,
}: {
prompt: string;
companyName: string;
companySummary: string;
}) {
const userPrompt = `${prompt}\n\nCompany Name: ${companyName}\nSummary: ${companySummary}`;


// Responses API (recommended) — falls back to chat.completions style if needed
try {
const resp = await openai.responses.create({
model: OPENAI_MODEL,
input: [
{
role: "system",
content:
"You are a helpful B2B email copywriter. Write concise, personalized outreach that sounds natural and avoids placeholders.",
},
{ role: "user", content: userPrompt },
],
} as any);


// The SDK returns content in various shapes; this extracts the final text safely.
const out = (resp as any)?.output_text ||
(resp as any)?.choices?.[0]?.message?.content ||
(resp as any)?.data?.[0]?.content?.[0]?.text || "";


return String(out).trim();
} catch (err: any) {
// Rethrow with a compact message so the caller can decide what to do
throw new Error(err?.message || "OpenAI error");
}
}