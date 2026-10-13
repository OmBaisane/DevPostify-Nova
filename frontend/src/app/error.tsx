"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception safely to client console
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="card-surface max-w-md w-full p-8 rounded-2xl border border-slate-800 bg-slate-900/60 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-bold text-slate-100 mb-2">
          An Unexpected Error Occurred
        </h1>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {error.message ||
            "Something went wrong while rendering this section. Our runtime caught the issue safely."}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:border-slate-700 font-semibold inline-flex items-center gap-2 transition"
          >
            <Home className="w-3.5 h-3.5 text-blue-400" />
            <span>Feed Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
