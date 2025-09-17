"use client";
import { useState } from "react";

export default function GenerateFormPage() {
  const [clientText, setClientText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Step 1: get JSON + message
  async function handleGenerateJson() {
    setLoading(true);
    setParsed(null);
    setResultUrl(null);

    const res = await fetch("/api/parse-client-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clientText }),
    });
    const data = await res.json();
    setLoading(false);
    setParsed(data);
  }

  // Step 2: insert form into DB
  async function handleCreateForm() {
    if (!parsed) return;
    setCreating(true);
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form_id: parsed.form_id,
        form_name: parsed.form_name,
        category: parsed.category,
        subcategory: parsed.subcategory,
        industry: parsed.industry,
        created_by: "admin",
        is_active: true,
      }),
    });
    const data = await res.json();
    setCreating(false);
    if (data.url) setResultUrl(data.url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#241C15] via-[#2a1f16] to-[#241C15] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide">
            Generate Form From Client Text
          </h1>
          <p className="text-gray-300 mt-2">
            Paste client requirements, generate a JSON + message, review, then create the form.
          </p>
        </div>

        {/* Step 1: Input */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <label className="block text-sm font-semibold mb-2">
            Client Requirement Text
          </label>
          <textarea
            rows={6}
            placeholder="Paste client requirement here..."
            value={clientText}
            onChange={(e) => setClientText(e.target.value)}
            className="w-full rounded-xl p-3 text-black focus:outline-none"
          />
          <button
            onClick={handleGenerateJson}
            disabled={loading || !clientText}
            className="mt-4 inline-block rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate JSON & Message"}
          </button>
        </div>

        {/* Step 2: Show JSON + message */}
        {parsed && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Generated JSON</h2>
            <pre className="bg-black/50 rounded-xl p-4 text-sm overflow-x-auto">
              {JSON.stringify(parsed, null, 2)}
            </pre>
            <h2 className="text-xl font-semibold">Generated Message</h2>
            <pre className="bg-black/50 rounded-xl p-4 text-sm overflow-x-auto">
              {parsed.message}
            </pre>

            <button
              onClick={handleCreateForm}
              disabled={creating}
              className="mt-2 inline-block rounded-xl bg-green-600 hover:bg-green-500 px-6 py-2 text-white font-medium transition disabled:opacity-50"
            >
              {creating ? "Creating Form…" : "Create Form in DB"}
            </button>
          </div>
        )}

        {/* Step 3: Show link */}
        {resultUrl && (
          <div className="bg-green-600/20 border border-green-600 rounded-xl p-4 text-center">
            <p className="font-semibold">
              ✅ Form Created:{" "}
              <a href={resultUrl} className="underline text-green-400">
                {resultUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
