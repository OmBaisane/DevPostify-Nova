import React from "react";

export default function PostSkeleton() {
  return (
    <div className="card-surface p-5 sm:p-6 animate-pulse space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-slate-800" />
          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-slate-800" />
            <div className="h-2.5 w-16 rounded bg-slate-850" />
          </div>
        </div>
        <div className="h-3 w-20 rounded bg-slate-800" />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded bg-slate-800" />
        <div className="h-3 w-full rounded bg-slate-800/60" />
        <div className="h-3 w-5/6 rounded bg-slate-800/60" />
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-4 w-14 rounded bg-slate-800" />
          <div className="h-4 w-12 rounded bg-slate-800" />
        </div>
        <div className="h-3 w-16 rounded bg-slate-800" />
      </div>
    </div>
  );
}
