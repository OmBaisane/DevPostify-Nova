import React from "react";
import Link from "next/link";
import { FolderCode } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "No posts found",
  description = "Be the first developer to share technical knowledge or an architectural insight.",
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="card-surface p-12 text-center flex flex-col items-center justify-center">
      <div className="h-12 w-12 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-400 mb-4">
        <FolderCode className="h-6 w-6 text-blue-400" />
      </div>
      <h3 className="font-heading font-semibold text-lg text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="btn-primary px-4 py-2 text-xs font-medium shadow-md shadow-blue-600/20"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
