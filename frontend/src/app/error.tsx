"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <div className="card-surface max-w-md p-8 shadow-2xl border-red-500/20">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-red-400">
          System Exception
        </span>
        <h1 className="mt-2 font-heading text-2xl font-bold text-slate-100 sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          An unhandled error occurred while processing client hydration. Try
          re-executing the action.
        </p>

        <div className="mt-6">
          <button
            onClick={() => reset()}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium shadow-md shadow-blue-600/20"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
