"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import SpendingChart from "@/components/SpendingChart";
import CardRecommendations from "@/components/CardRecommendations";
import { AnalysisResult } from "@/types";

const LOADING_MESSAGES = [
  "Reading your transactions…",
  "Categorizing your spending…",
  "Crunching the rewards math…",
  "Finding your best match…",
];

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Animated card stack */}
      <div className="relative w-16 h-16">
        {[2, 1, 0].map((i) => (
          <div
            key={i}
            className="absolute inset-0 bg-green-500 rounded-2xl"
            style={{
              transform: `rotate(${(i - 1) * 6}deg) translateY(${i * -2}px)`,
              opacity: 1 - i * 0.25,
              animation: `pulse 1.8s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold z-10">
          ✦
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="font-semibold text-gray-800 text-lg">Analyzing your statement</p>
        <p className="text-gray-400 text-sm max-w-xs">
          Claude AI is reading your transactions and calculating which card earns you the most.
        </p>
      </div>

      {/* Animated steps */}
      <div className="space-y-2 w-full max-w-xs">
        {LOADING_MESSAGES.map((msg, i) => (
          <div
            key={msg}
            className="flex items-center gap-3 text-sm"
            style={{ animation: `fadeIn 0.4s ease-out ${i * 0.6}s both` }}
          >
            <div
              className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"
              style={{ animation: `pulse 1s ease-in-out ${i * 0.6}s infinite` }}
            />
            <span className="text-gray-500">{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data as AnalysisResult);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7faf8]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-green-200">
              B
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">Better Card</span>
          </div>
          <p className="text-sm text-gray-400 hidden sm:block">
            Find the card that works harder for you
          </p>
          {result && (
            <button
              onClick={handleReset}
              className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              ← Start over
            </button>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1">
        {!result && !isLoading && (
          <>
            {/* Hero */}
            <div className="bg-white border-b border-gray-100">
              <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-green-100">
                  ✦ Powered by Claude AI
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
                  Find the card that<br />
                  <span className="text-green-500">works harder</span> for you
                </h1>
                <p className="text-gray-500 text-lg sm:text-xl max-w-lg mx-auto leading-relaxed">
                  Upload your bank statement and we&apos;ll analyze every transaction to
                  show you exactly which card earns you the most rewards.
                </p>
              </div>
            </div>

            {/* Upload section */}
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
              <FileUpload onUpload={handleUpload} isLoading={isLoading} />

              {/* Privacy notice */}
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your statement is analyzed in memory and never stored or shared.</span>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">⚠</span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* How it works */}
              <div className="mt-14">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-6">
                  How it works
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: "📤", title: "Upload", desc: "Drop your PDF or CSV statement" },
                    { icon: "🧠", title: "Analyze", desc: "AI categorizes every transaction" },
                    { icon: "🏆", title: "Match", desc: "See your ideal rewards card" },
                  ].map((step, i) => (
                    <div key={step.title} className="text-center">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-xl mx-auto mb-3">
                        {step.icon}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="w-4 h-4 bg-green-100 text-green-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                          {i + 1}
                        </span>
                        <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="max-w-md mx-auto px-4 sm:px-6">
            <LoadingState />
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
            <SpendingChart spending={result.spending} />
            <CardRecommendations result={result} />
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                B
              </div>
              <span className="font-semibold text-gray-700 text-sm">Better Card</span>
            </div>
            <p className="text-xs text-gray-400 text-center sm:text-right max-w-sm">
              Estimates are for informational purposes only. Always review card terms before applying.
              Not affiliated with any card issuer.
            </p>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
