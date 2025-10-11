'use client';

import React, { useRef, useState } from 'react';
import { Mail, Upload, Sheet, Send, CheckCircle, XCircle, AlertCircle, Zap, Users, Clock } from 'lucide-react';

type Failure = { email: string; error: string };
type Result = {
  totalRows?: number;
  attempted?: number;
  sent?: number;
  failed?: Failure[];
  error?: string;
};

export default function HomePage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [subject, setSubject] = useState('Hello from Bulk Mailer');
  const [message, setMessage] = useState('We have a new opportunity for you.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function looksLikeGoogleSheet(url: string) {
    try {
      const u = new URL(url);
      return u.hostname.includes('docs.google.com') && u.pathname.includes('/spreadsheets/');
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setStatusMessage(null);

    try {
      if (!fileRef.current?.files?.[0] && !sheetUrl.trim()) {
        setStatusMessage('Please upload a CSV or provide a Google Sheet URL.');
        setLoading(false);
        return;
      }

      if (sheetUrl && !looksLikeGoogleSheet(sheetUrl) && !sheetUrl.endsWith('.csv')) {
        setStatusMessage("Provided URL doesn't look like a valid Google Sheet or CSV link.");
        setLoading(false);
        return;
      }

      const form = new FormData();
      const file = fileRef.current?.files?.[0];
      if (file) form.append('file', file);
      if (sheetUrl) form.append('sheetUrl', sheetUrl.trim());
      form.append('subject', subject);
      form.append('message', message);
      form.append('dryRun', dryRun ? '1' : '0');

      setStatusMessage('Uploading...');

      const res = await fetch('/api/send-bulk', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) setResult({ error: data?.error || 'Server error' });
      else setResult(data as Result);

      // ✅ Clear fields after process completes
      setSheetUrl('');
      setSubject('Hello from Bulk Mailer');
      setMessage('We have a new opportunity for you.');
      setDryRun(false);
      if (fileRef.current) fileRef.current.value = ''; // clear file input
    } catch (err: any) {
      setResult({ error: err?.message || String(err) });
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fbf5e5] via-[#fff8e1] to-[#fbf5e5] py-10 font-[Inter] pt-32">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 224, 27, 0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFE01B] rounded-2xl mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <Mail className="w-10 h-10 text-[#241C15]" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-[#241C15] tracking-tight">
            Bulk Freelancers Mailer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Streamline your outreach with powerful bulk email automation. Upload CSV files or connect Google Sheets to reach hundreds of freelancers instantly.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFE01B] bg-opacity-20 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-[#241C15]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#241C15]">500+</p>
                <p className="text-sm text-gray-600">Emails per day</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFE01B] bg-opacity-20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-[#241C15]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#241C15]">2000+</p>
                <p className="text-sm text-gray-600">With Workspace</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFE01B] bg-opacity-20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-[#241C15]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#241C15]">Instant</p>
                <p className="text-sm text-gray-600">Delivery speed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-2xl p-6 mb-8 shadow-lg border-2 border-[#FFE01B] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#241C15] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-[#241C15] mb-3 text-lg">Email Sending Limits (Gmail)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-60 rounded-lg p-4">
                  <p className="font-semibold text-[#241C15] mb-1">Free Gmail Accounts</p>
                  <p className="text-2xl font-bold text-[#241C15]">500</p>
                  <p className="text-sm text-gray-700">emails per day</p>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-4">
                  <p className="font-semibold text-[#241C15] mb-1">Google Workspace</p>
                  <p className="text-2xl font-bold text-[#241C15]">2,000</p>
                  <p className="text-sm text-gray-700">emails per day</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#241C15] bg-white bg-opacity-40 rounded-lg p-3">
                💡 <strong>Pro Tip:</strong> Exceeding these limits may temporarily block your Gmail account. For larger campaigns, consider professional email APIs like SendGrid or AWS SES.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-r from-[#241C15] to-[#3a2f23] p-6">
            <h2 className="text-2xl font-bold text-[#FFE01B] flex items-center gap-3">
              <Send className="w-7 h-7" />
              Campaign Setup
            </h2>
            <p className="text-gray-300 mt-2">Configure your bulk email campaign below</p>
          </div>

          <div className="p-8 space-y-6">
            {/* File Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-[#241C15] flex items-center gap-2">
                <Upload className="w-4 h-4" />
                CSV File Upload
              </label>
              <div className="relative">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="block w-full text-sm text-gray-600 bg-gray-50 border-2 border-gray-300 rounded-xl cursor-pointer p-4 hover:border-[#FFE01B] transition-colors duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#FFE01B] file:text-[#241C15] file:font-semibold hover:file:bg-[#FCD34D] file:cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Upload a CSV with email addresses or use Google Sheets below
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Sheets Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-[#241C15] flex items-center gap-2">
                <Sheet className="w-4 h-4" />
                Google Sheet URL
              </label>
              <input
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full border-2 border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] text-[#241C15] bg-white transition-all duration-300"
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Make sure the sheet is shared with "Anyone with the link"
              </p>
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-[#241C15] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] text-[#241C15] bg-white transition-all duration-300"
                required
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-[#241C15] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl p-4 text-sm min-h-[150px] focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] text-[#241C15] bg-white transition-all duration-300"
                required
              />
              <p className="text-xs text-gray-500">Craft a compelling message for your recipients</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="w-5 h-5 accent-[#FFE01B] cursor-pointer"
                />
                <span className="group-hover:text-[#241C15] transition-colors">
                  Dry run (test without sending)
                </span>
              </label>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-4 bg-[#FFE01B] text-[#241C15] rounded-xl text-sm font-bold hover:bg-[#FCD34D] disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-[#241C15] border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Emails
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="mt-6 bg-[#FFE01B] bg-opacity-20 border-2 border-[#FFE01B] rounded-xl p-4 text-center animate-fade-in-up">
            <p className="text-[#241C15] font-semibold flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#241C15] border-t-transparent rounded-full animate-spin"></span>
              {statusMessage}
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-[#241C15] to-[#3a2f23] p-6">
              <h2 className="text-xl font-bold text-[#FFE01B] flex items-center gap-2">
                {result.error ? (
                  <>
                    <XCircle className="w-6 h-6" />
                    Campaign Failed
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Campaign Results
                  </>
                )}
              </h2>
            </div>

            <div className="p-6">
              {result.error ? (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{result.error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Total Rows</p>
                    <p className="text-3xl font-bold text-[#241C15]">{result.totalRows ?? 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Attempted</p>
                    <p className="text-3xl font-bold text-[#241C15]">{result.attempted ?? 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-xs text-green-700 mb-1">Sent</p>
                    <p className="text-3xl font-bold text-green-600">{result.sent ?? 0}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-xs text-red-700 mb-1">Failed</p>
                    <p className="text-3xl font-bold text-red-600">{result.failed?.length ?? 0}</p>
                  </div>
                </div>
              )}

              {result.failed && result.failed.length > 0 && (
                <details className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <summary className="cursor-pointer text-sm font-semibold text-[#241C15] flex items-center gap-2 hover:text-gray-700">
                    <AlertCircle className="w-4 h-4" />
                    View Failed Emails ({result.failed.length})
                  </summary>
                  <ul className="mt-4 space-y-2">
                    {result.failed.map((f, i) => (
                      <li key={i} className="text-xs text-gray-600 bg-white rounded-lg p-3 border border-gray-200">
                        <code className="font-semibold text-[#241C15]">{f.email}</code>
                        <span className="text-red-600 ml-2">— {f.error}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-4 pb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 inline-block">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FFE01B]" />
              Need help? Make sure your Google Sheet is shared with <strong>"Anyone with the link"</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}