"use client";
import { useState } from "react";
import { FileText, Zap, Database, CheckCircle, Loader2, Sparkles, ChevronRight, Eye } from "lucide-react";

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
      body: JSON.stringify({ text: clientText, nonce: Date.now() }), // 👈 add nonce
    });
    const data = await res.json();
    // clone the data so React always gets a new reference
    setParsed(structuredClone(data));
    setLoading(false);
  }


  // Step 2: insert form into DB
  // async function handleCreateForm() {
  //   if (!parsed) return;
  //   setCreating(true);
  //   const res = await fetch("/api/forms", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       form_id: parsed.form_id,
  //       form_name: parsed.form_name,
  //       category: parsed.category,
  //       subcategory: parsed.subcategory,
  //       industry: parsed.industry,
  //       created_by: "admin",
  //       is_active: true,
  //     }),
  //   });
  //   const data = await res.json();
  //   setCreating(false);
  //   if (data.url) setResultUrl(data.url);
  // }

  // Step 2: insert form into DB
  async function handleCreateForm() {
    if (!parsed) return;

    setCreating(true);

    // Merge everything from parsed plus overrides
    const payload = {
      ...parsed,
      created_by: parsed.created_by || 'admin',
      is_active: parsed.is_active ?? true,
    };

    // Strip out undefined / null so backend sees clean JSON
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    console.log('Creating form with payload:', payload); // <-- check in browser console

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.url) setResultUrl(data.url);
    } catch (err) {
      console.error('Error creating form', err);
    } finally {
      setCreating(false);
    }
  }



  const steps = [
    { id: 1, title: "Input Text", icon: FileText, active: true },
    { id: 2, title: "Generate JSON", icon: Zap, active: !!parsed },
    { id: 3, title: "Create Form", icon: Database, active: !!resultUrl },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A06] via-[#241C15] to-[#0F0A06] text-[#fbf5e5] overflow-x-hidden pt-10 sm:14 lg:pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FFE01B]/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-[#FFE01B]/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#FFE01B]/3 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-[#241C15]/30 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#000000]/40 border border-[#FFE01B]/30 rounded-full text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#FFE01B]" />
              <span className="bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent">
                AI-Powered Form Generation
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#fbf5e5] via-[#FFE01B] to-[#fbf5e5] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                Generate Forms
              </span>
              <br />
              <span className="text-[#fbf5e5]">From Client Text</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
              Transform client requirements into structured forms with AI.
              Paste your text, generate JSON, and create forms instantly.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 py-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 backdrop-blur-sm ${step.active
                  ? 'bg-[#FFE01B]/15 border border-[#FFE01B]/40 scale-105 shadow-lg shadow-[#FFE01B]/10'
                  : 'bg-[#000000]/30 border border-[#4B5563]/20'
                  }`}>
                  <step.icon className={`w-5 h-5 transition-colors duration-300 ${step.active ? 'text-[#FFE01B]' : 'text-[#4B5563]'
                    }`} />
                  <span className={`font-medium transition-colors duration-300 ${step.active ? 'text-[#FFE01B]' : 'text-[#4B5563]'
                    }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-[#4B5563] hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Input */}
            <div className="space-y-6">
              <div className="bg-[#000000]/40 backdrop-blur-md border border-[#4B5563]/30 rounded-2xl p-6 lg:p-8 shadow-2xl hover:shadow-3xl hover:shadow-[#FFE01B]/5 transition-all duration-500 hover:bg-[#000000]/50 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#FFE01B]/15 rounded-xl backdrop-blur-sm">
                    <FileText className="w-6 h-6 text-[#FFE01B]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#fbf5e5]">Client Requirements</h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-[#4B5563]">
                    Paste your client's form requirements below
                  </label>
                  <div className="relative group">
                    <textarea
                      rows={8}
                      placeholder="Enter client requirements here... 

For example: 'I need a contact form for my restaurant with fields for name, email, phone number, party size, and special dietary requirements. It should also have a date picker for reservations.'"
                      value={clientText}
                      onChange={(e) => setClientText(e.target.value)}
                      className="w-full rounded-xl p-4 bg-[#000000]/60 border border-[#4B5563]/40 text-[#fbf5e5] placeholder-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all duration-300 resize-none backdrop-blur-sm hover:bg-[#000000]/70 hover:border-[#4B5563]/60"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFE01B]/0 via-[#FFE01B]/5 to-[#FFE01B]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>

                  <button
                    onClick={handleGenerateJson}
                    disabled={loading || !clientText}
                    className="w-full sm:w-auto group relative overflow-hidden rounded-xl bg-[#FFE01B] hover:bg-[#FCD34D] px-8 py-3 font-bold text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl hover:shadow-[#FFE01B]/30 disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 group-disabled:translate-x-0"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Magic...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Generate JSON & Message
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {/* JSON Result */}
              {parsed && (
                <div className="bg-[#000000]/40 backdrop-blur-md border border-[#4B5563]/30 rounded-2xl p-6 lg:p-8 shadow-2xl animate-slide-up-delay space-y-6 hover:shadow-3xl hover:shadow-[#FFE01B]/5 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#FFE01B]/15 rounded-xl backdrop-blur-sm">
                      <Eye className="w-6 h-6 text-[#FFE01B]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#fbf5e5]">Generated Results</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#FFE01B] mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        JSON Structure
                      </h3>
                      <div className="relative group">
                        <pre className="bg-[#000000]/70 border border-[#4B5563]/40 rounded-xl p-4 text-sm overflow-x-auto text-[#fbf5e5] hover:bg-[#000000]/80 transition-colors duration-300 max-h-48 scrollbar-thin scrollbar-thumb-[#FFE01B] scrollbar-track-transparent backdrop-blur-sm">
                          {JSON.stringify(parsed, null, 2)}
                        </pre>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="px-2 py-1 bg-[#FFE01B]/20 rounded text-xs text-[#FFE01B] backdrop-blur-sm">
                            Hover to highlight
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#FFE01B] mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Message
                      </h3>
                      <div className="bg-gradient-to-r from-[#FFE01B]/15 via-[#FFE01B]/8 to-[#FFE01B]/15 border border-[#FFE01B]/25 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-[#fbf5e5] leading-relaxed whitespace-pre-wrap">
                          {parsed.message}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateForm}
                      disabled={creating}
                      className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] hover:from-[#FCD34D] hover:to-[#FFE01B] px-8 py-3 font-bold text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl hover:shadow-[#FFE01B]/30 disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 group-disabled:translate-x-0"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        {creating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Form...
                          </>
                        ) : (
                          <>
                            <Database className="w-5 h-5" />
                            Create Form in Database
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {resultUrl && (
                <div className="bg-gradient-to-r from-[#FFE01B]/15 via-[#FFE01B]/8 to-[#FFE01B]/15 border border-[#FFE01B]/35 rounded-2xl p-6 text-center animate-bounce-in shadow-2xl hover:shadow-[#FFE01B]/15 transition-all duration-500 backdrop-blur-sm">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-[#FFE01B]/20 rounded-full animate-pulse backdrop-blur-sm">
                      <CheckCircle className="w-8 h-8 text-[#FFE01B]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#FFE01B] mb-2">
                    🎉 Form Created Successfully!
                  </h3>
                  <p className="text-[#4B5563] mb-4">
                    Your form has been generated and saved to the database. <br />
                    You can also edit and manage it anytime from the{" "}
                    <span className="font-semibold text-[#FFE01B]">Admin Panel → Form Management</span> section.
                  </p>
                  <a
                    href="/admin-panel"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE01B] hover:bg-[#FCD34D] rounded-xl text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FFE01B]/25 group"
                  >
                    Go to Admin Panel
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up-delay {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slide-up-delay 1s ease-out 0.3s both;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .scrollbar-thumb-[#FFE01B]::-webkit-scrollbar-thumb {
          background: rgba(255, 224, 27, 0.4);
          border-radius: 3px;
        }
        
        .scrollbar-thumb-[#FFE01B]::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 224, 27, 0.6);
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}