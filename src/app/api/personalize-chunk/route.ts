
// // app/api/personalize-chunk/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
// import { CONFIG } from "../../../lib/config";
// import { GoogleSheetsService } from "../../../lib/services/googleSheetsService"; // adjust import to your path

// // Fixed column names (your sheet already has these)
// const NAME_COL = "Company Name";
// const SUMMARY_COL = "Company Summary";
// const OUTPUT_COL = "Personalized Email";
// const MAX_BATCH = 25;

// function extractSheetId(urlOrId: string) {
//   const m = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
//   return m ? m[1] : urlOrId; // allow raw ID
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { sheetUrl, prompt, batchSize = 5 } = await req.json();
//     if (!sheetUrl || !prompt) {
//       return NextResponse.json({ error: "sheetUrl and prompt are required" }, { status: 400 });
//     }

//     const sheetId = extractSheetId(sheetUrl);

//     // Init Sheets service using your existing class
//     const svc = new GoogleSheetsService(sheetId);
//     const ok = await svc.initialize();
//     if (!ok) return NextResponse.json({ error: "Failed to initialize Google Sheets" }, { status: 500 });

//     const sheet = await svc.getMainSheet();
//     if (!sheet) return NextResponse.json({ error: "No sheet found" }, { status: 500 });

//     // Ensure output column exists
//     await svc.ensureColumnsExist([OUTPUT_COL]);

//     // Load rows and select next unprocessed chunk
//     await sheet.loadHeaderRow();
//     const rows = await sheet.getRows();

//     const targets = rows
//       .filter((r: any) => !r.get(OUTPUT_COL) && (r.get(NAME_COL) || r.get(SUMMARY_COL)))
//       .slice(0, Math.min(batchSize, MAX_BATCH));

//     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY2 });
//     const model = CONFIG.OPENAI_MODEL || "gpt-4o-mini";

//     let processed = 0;
//     const errors: Array<{ rowIndex: number; error: string }> = [];

//     for (const r of targets) {
//       const companyName = String(r.get(NAME_COL) || "").trim();
//       const companySummary = String(r.get(SUMMARY_COL) || "").trim();

//       const aiPrompt = `${prompt}

// Company Name: ${companyName}
// Summary: ${companySummary}`;

//       try {
//         // Responses API (preferred). Falls back to chat style if needed.
//         const resp = await openai.responses.create({
//           model,
//           input: [
//             { role: "system", content: "You are a concise, friendly B2B email copywriter." },
//             { role: "user", content: aiPrompt },
//           ],
//         } as any);

//         const text =
//           (resp as any)?.output_text?.trim() ||
//           (resp as any)?.choices?.[0]?.message?.content?.trim() ||
//           "";

//         r.set(OUTPUT_COL, text);
//         await r.save();
//         processed++;
//       } catch (e: any) {
//         errors.push({ rowIndex: (r as any)._rowNumber, error: e?.message || "OpenAI error" });
//       }

//       // gentle pacing to respect rate limits
//       await new Promise((res) => setTimeout(res, 800));
//     }

//     const remaining = rows.filter((r: any) => !r.get(OUTPUT_COL) && (r.get(NAME_COL) || r.get(SUMMARY_COL))).length;

//     return NextResponse.json({ processed, remaining, errors });
//   } catch (e: any) {
//     return NextResponse.json({ error: e?.message || "Bad Request" }, { status: 400 });
//   }
// }

// app/api/personalize-chunk/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { CONFIG } from "../../../lib/config";
import { GoogleSheetsService } from "../../../lib/services/googleSheetsService"; // adjust path

// Column names (only summary + output now)
const SUMMARY_COL = "Company Summary";
const OUTPUT_COL = "Personalized Email";
const MAX_BATCH = 25;

function extractSheetId(urlOrId: string) {
  const m = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : urlOrId; // allow raw ID
}

export async function POST(req: NextRequest) {
  try {
    const { sheetUrl, prompt, batchSize = 5 } = await req.json();
    if (!sheetUrl || !prompt) {
      return NextResponse.json({ error: "sheetUrl and prompt are required" }, { status: 400 });
    }

    const sheetId = extractSheetId(sheetUrl);

    // Init Sheets service
    const svc = new GoogleSheetsService(sheetId);
    const ok = await svc.initialize();
    if (!ok) return NextResponse.json({ error: "Failed to initialize Google Sheets" }, { status: 500 });

    const sheet = await svc.getMainSheet();
    if (!sheet) return NextResponse.json({ error: "No sheet found" }, { status: 500 });

    // Ensure output column exists
    await svc.ensureColumnsExist([OUTPUT_COL]);

    // Load rows and select next unprocessed chunk
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();

    const targets = rows
      .filter((r: any) => !r.get(OUTPUT_COL) && r.get(SUMMARY_COL))
      .slice(0, Math.min(batchSize, MAX_BATCH));

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY2 });
    const model = CONFIG.OPENAI_MODEL || "gpt-4o-mini";

    let processed = 0;
    const errors: Array<{ rowIndex: number; error: string }> = [];

    for (const r of targets) {
      const companySummary = String(r.get(SUMMARY_COL) || "").trim();

      const aiPrompt = `${prompt}

Company Summary: ${companySummary}`;

      try {
        // Responses API
        const resp = await openai.responses.create({
          model,
          input: [
            { role: "system", content: "You are a concise, friendly B2B email copywriter." },
            { role: "user", content: aiPrompt },
          ],
        } as any);

        const text =
          (resp as any)?.output_text?.trim() ||
          (resp as any)?.choices?.[0]?.message?.content?.trim() ||
          "";

        r.set(OUTPUT_COL, text);
        await r.save();
        processed++;
      } catch (e: any) {
        errors.push({ rowIndex: (r as any)._rowNumber, error: e?.message || "OpenAI error" });
      }

      // gentle pacing
      await new Promise((res) => setTimeout(res, 800));
    }

    const remaining = rows.filter((r: any) => !r.get(OUTPUT_COL) && r.get(SUMMARY_COL)).length;

    return NextResponse.json({ processed, remaining, errors });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Bad Request" }, { status: 400 });
  }
}
