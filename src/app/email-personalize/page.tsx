

// // app/page.tsx
// "use client";

// import { useEffect, useRef, useState } from "react";

// type ProgressState = {
//   processed: number;
//   remaining: number;
//   errors: { rowIndex: number; error: string }[];
// };

// export default function Home() {
//   const [sheetUrl, setSheetUrl] = useState("");
//   const [prompt, setPrompt] = useState(
//     "You are an expert B2B email copywriter. Using the company name and summary, write a concise, friendly, and personalized cold email. Avoid placeholders. Include a clear, single CTA."
//   );
//   const [nameColumn, setNameColumn] = useState("Company Name");
//   const [summaryColumn, setSummaryColumn] = useState("Company Summary");
//   const [outputColumn, setOutputColumn] = useState("Personalized Email");
//   const [batchSize, setBatchSize] = useState(5);

//   const [running, setRunning] = useState(false);
//   const [totals, setTotals] = useState<ProgressState>({ processed: 0, remaining: 0, errors: [] });
//   const [log, setLog] = useState<string[]>([]);
//   const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

//   async function callChunk(): Promise<ProgressState | null> {
//     const res = await fetch("/api/process-chunk", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ sheetUrl, prompt, nameColumn, summaryColumn, outputColumn, batchSize }),
//     });
//     if (!res.ok) {
//       const j = await res.json().catch(() => ({}));
//       throw new Error(j.error || `Request failed: ${res.status}`);
//     }
//     return res.json();
//   }

//   async function start() {
//     setRunning(true);
//     setTotals({ processed: 0, remaining: 0, errors: [] });
//     setLog([]);
//     abortRef.current.aborted = false;

//     try {
//       // Kick off with one call to learn remaining
//       let r = await callChunk();
//       if (!r) return;
//       setTotals(r);
//       setLog((L) => [
//         ...L,
//         r ? `Processed: ${r.processed} | Remaining: ${r.remaining} | Errors: ${r.errors.length}` : "No data processed",
//       ]);

//       // Continue until remaining == 0 or user stops
//       while (!abortRef.current.aborted && r && r.remaining > 0) {
//         let r = await callChunk();
//         if (!r) break;
//         setTotals((prev) => ({
//           processed: prev.processed + r.processed,
//           remaining: r.remaining,
//           errors: [...prev.errors, ...r.errors],
//         }));
//         setLog((L) => [
//           ...L,
//           `Processed: +${r.processed} | Remaining: ${r.remaining} | Errors: +${r.errors.length}`,
//         ]);
//       }
//     } catch (e: any) {
//       setLog((L) => [...L, `Error: ${e.message}`]);
//     } finally {
//       setRunning(false);
//     }
//   }

//   function stop() {
//     abortRef.current.aborted = true;
//   }

//   const total = totals.processed + totals.remaining;
//   const completed = total > 0 ? ((total - totals.remaining) / total) * 100 : 0;

//   return (
//     <main className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
//       <h1 className="text-2xl md:text-3xl font-semibold">Email Personalization from Google Sheets</h1>
//       <p className="mt-2 text-sm opacity-80">
//         Paste your Google Sheet URL. The first sheet should have columns for Company Name and Company Summary. Results are written to the output column.
//       </p>

//       <div className="mt-6 grid gap-4">
//         <label className="grid gap-1">
//           <span>Google Sheet URL or ID</span>
//           <input
//             className="border rounded px-3 py-2"
//             placeholder="https://docs.google.com/spreadsheets/d/XXXX/edit"
//             value={sheetUrl}
//             onChange={(e) => setSheetUrl(e.target.value)}
//           />
//         </label>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           <label className="grid gap-1">
//             <span>Name Column</span>
//             <input className="border rounded px-3 py-2" value={nameColumn} onChange={(e) => setNameColumn(e.target.value)} />
//           </label>
//           <label className="grid gap-1">
//             <span>Summary Column</span>
//             <input className="border rounded px-3 py-2" value={summaryColumn} onChange={(e) => setSummaryColumn(e.target.value)} />
//           </label>
//           <label className="grid gap-1">
//             <span>Output Column</span>
//             <input className="border rounded px-3 py-2" value={outputColumn} onChange={(e) => setOutputColumn(e.target.value)} />
//           </label>
//         </div>

//         <label className="grid gap-1">
//           <span>Prompt (will be used for every row)</span>
//           <textarea
//             className="border rounded px-3 py-2 min-h-[140px]"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         </label>

//         <label className="grid gap-1 w-48">
//           <span>Batch size per request</span>
//           <input
//             type="number"
//             min={1}
//             max={25}
//             className="border rounded px-3 py-2"
//             value={batchSize}
//             onChange={(e) => setBatchSize(parseInt(e.target.value || "5", 10))}
//           />
//         </label>

//         <div className="flex gap-3 mt-2">
//           <button
//             onClick={start}
//             disabled={running}
//             className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
//           >
//             {running ? "Running..." : "Start Processing"}
//           </button>
//           <button
//             onClick={stop}
//             disabled={!running}
//             className="border rounded px-4 py-2 disabled:opacity-50"
//           >
//             Stop
//           </button>
//         </div>

//         <div className="mt-4">
//           <div className="h-3 bg-gray-200 rounded">
//             <div
//               className="h-3 bg-gray-800 rounded"
//               style={{ width: `${completed}%`, transition: "width 300ms" }}
//             />
//           </div>
//           <div className="text-sm mt-2 opacity-80">
//             Processed: {totals.processed} | Remaining: {totals.remaining} | Errors: {totals.errors.length}
//           </div>
//         </div>

//         {totals.errors.length > 0 && (
//           <details className="mt-2">
//             <summary className="cursor-pointer">Show errors ({totals.errors.length})</summary>
//             <ul className="list-disc pl-6 text-sm">
//               {totals.errors.map((e, i) => (
//                 <li key={i}>Row {e.rowIndex}: {e.error}</li>
//               ))}
//             </ul>
//           </details>
//         )}

//         <div className="mt-4 bg-gray-50 border rounded p-3 text-sm max-h-60 overflow-auto">
//           {log.map((l, i) => (
//             <div key={i}>{l}</div>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }




"use client";
import { useRef, useState } from "react";
export default function Page() {
      const [sheetUrl, setSheetUrl] = useState("");
      const [prompt, setPrompt] = useState("");
      const [running, setRunning] = useState(false);
      const [processed, setProcessed] = useState(0);
      const [remaining, setRemaining] = useState(0);
      const [errors, setErrors] = useState<{ rowIndex: number; error: string }[]>([]);
      const abortRef = useRef({ stop: false });


      async function callChunk() {
            const res = await fetch("/api/personalize-chunk", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ sheetUrl, prompt, batchSize: 5 }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Request failed");
            return res.json();
      }


      async function start() {
            setRunning(true);
            setProcessed(0);
            setRemaining(0);
            setErrors([]);
            abortRef.current.stop = false;


            try {
                  let r = await callChunk();
                  setProcessed(r.processed);
                  setRemaining(r.remaining);
                  setErrors(r.errors || []);


                  while (!abortRef.current.stop && r.remaining > 0) {
                        r = await callChunk();
                        setProcessed((p) => p + r.processed);
                        setRemaining(r.remaining);
                        setErrors((E) => [...E, ...(r.errors || [])]);
                  }
            } catch (e: any) {
                  alert(e.message);
            } finally {
                  setRunning(false);
            }
      }


      function stop() {
            abortRef.current.stop = true;
      }


      const total = processed + remaining;
      const pct = total ? Math.round(((total - remaining) / total) * 100) : 0;


      return (
            <main className="max-w-2xl mx-auto p-6">
                  <h1 className="text-2xl font-semibold">Email Personalization</h1>
                  <p className="text-sm opacity-70 mb-4">Paste your Google Sheet URL and the prompt. We will fill the "Personalized Email" column row-by-row.</p>


                  <label className="block mb-3">
                        <div className="mb-1">Google Sheet URL</div>
                        <input
                              className="w-full border rounded px-3 py-2"
                              placeholder="https://docs.google.com/spreadsheets/d/XXXX/edit"
                              value={sheetUrl}
                              onChange={(e) => setSheetUrl(e.target.value)}
                        />
                  </label>


                  <label className="block mb-3">
                        <div className="mb-1">Prompt</div>
                        <textarea
                              className="w-full border rounded px-3 py-2 min-h-[140px]"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                        />
                  </label>


                  <div className="flex gap-3 mb-4">
                        <button
                              onClick={start}
                              disabled={running || !sheetUrl || !prompt}
                              className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
                        >
                              {running ? "Running..." : "Start"}
                        </button>
                        <button onClick={stop} disabled={!running} className="border rounded px-4 py-2 disabled:opacity-50">Stop</button>
                  </div>


                  <div className="text-sm">Processed: {processed} | Remaining: {remaining} | Errors: {errors.length}</div>
                  <div className="h-2 bg-gray-200 rounded mt-2">
                        <div className="h-2 bg-gray-800 rounded" style={{ width: `${pct}%` }} />
                  </div>


                  {errors.length > 0 && (
                        <details className="mt-3 text-sm">
                              <summary>Show errors</summary>
                              <ul className="list-disc pl-5">
                                    {errors.map((e, i) => (
                                          <li key={i}>Row {e.rowIndex}: {e.error}</li>
                                    ))}
                              </ul>
                        </details>
                  )}
            </main>
      );
}