import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openSheet, getFirstSheet, ensureColumns } from "../../../lib/personalization/sheets";
import { generateEmail } from "../../../lib/personalization/openai";


const Body = z.object({
      sheetUrl: z.string().min(10),
      prompt: z.string().min(10),
      nameColumn: z.string().default("Company Name"),
      summaryColumn: z.string().default("Company Summary"),
      outputColumn: z.string().default("Personalized Email"),
      batchSize: z.number().int().min(1).max(25).default(5),
});


export async function POST(req: NextRequest) {
      try {
            const body = Body.parse(await req.json());
            const { sheetUrl, prompt, nameColumn, summaryColumn, outputColumn, batchSize } = body;


            const doc = await openSheet(sheetUrl);
            const sheet = await getFirstSheet(doc);


            // Ensure output column exists
            await ensureColumns(sheet, [nameColumn, summaryColumn, outputColumn]);


            // Load rows and pick the next N unprocessed
            const rows = await sheet.getRows();


            const targets = rows.filter((r: any) => !r[outputColumn] && (r[nameColumn] || r[summaryColumn])).slice(0, batchSize);


            let processed = 0;
            const errors: Array<{ rowIndex: number; error: string }> = [];


            for (const r of targets) {
                  const companyName = String(r[nameColumn] || "").trim();
                  const companySummary = String(r[summaryColumn] || "").trim();


                  if (!companyName && !companySummary) continue;


                  try {
                        const email = await generateEmail({ prompt, companyName, companySummary });
                        r[outputColumn] = email;
                        await r.save();
                        processed++;
                  } catch (e: any) {
                        errors.push({ rowIndex: r._rowNumber, error: e?.message || "Unknown error" });
                  }


                  // Gentle pacing to respect rate limits
                  await new Promise((res) => setTimeout(res, 800));
            }


            const remaining = rows.filter((r: any) => !r[outputColumn] && (r[nameColumn] || r[summaryColumn])).length;


            return NextResponse.json({ processed, remaining, errors });
      } catch (e: any) {
            return NextResponse.json({ error: e?.message || "Bad Request" }, { status: 400 });
      }
}