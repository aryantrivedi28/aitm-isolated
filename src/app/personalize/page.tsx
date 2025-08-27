"use client";
import React, { useState } from "react";

export default function PersonalizePage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [prompt, setPrompt] = useState("Write a concise personalized B2B outreach email.");
  const [running, setRunning] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [errors, setErrors] = useState<any[]>([]);

  async function fetchChunk() {
    const res = await fetch("/api/personalize-chunk2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheetUrl, prompt, batchSize: 5 }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || "Request failed");
    }
    return res.json();
  }

  async function start() {
    setRunning(true);
    setProcessed(0);
    setRemaining(null);
    setErrors([]);
    try {
      let iteration = 0;
      const MAX_ITERATIONS = 50;
      let res = await fetchChunk();
      setProcessed((p) => p + (res.processed || 0));
      setRemaining(res.remaining);
      setErrors((e) => [...e, ...(res.errors || [])]);

      while (res.remaining > 0 && iteration < MAX_ITERATIONS) {
        iteration++;
        res = await fetchChunk();
        setProcessed((p) => p + (res.processed || 0));
        setRemaining(res.remaining);
        setErrors((e) => [...e, ...(res.errors || [])]);
      }
    } catch (err: any) {
      alert(err?.message || "Error");
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-3">AI Personalization — Enrich & Write</h1>

      <label className="block mb-3">
        <div className="mb-1">Google Sheet URL or ID</div>
        <input value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="https://docs.google.com/spreadsheets/d/..." />
      </label>

      <label className="block mb-3">
        <div className="mb-1">Prompt (instructions for the AI)</div>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5} className="w-full border rounded px-3 py-2" />
      </label>

      <div className="flex gap-3 mb-4">
        <button onClick={start} disabled={running || !prompt} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
          {running ? "Running..." : "Start"}
        </button>
      </div>

      <div className="text-sm mb-2">Processed: {processed} | Remaining: {remaining ?? "—"} | Errors: {errors.length}</div>
      <div className="h-2 bg-gray-200 rounded mb-2">
        <div className="h-2 bg-black rounded" style={{ width: remaining === null ? "0%" : `${Math.round((processed / (processed + (remaining || 0))) * 100)}%` }} />
      </div>
    </main>
  );
}
