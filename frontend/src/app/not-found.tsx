import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <div className="card-surface max-w-md p-8 shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
          <Terminal className="h-7 w-7" />
        </div>

        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-400">
          404 — Route Missing
        </span>
        <h1 className="mt-2 font-heading text-2xl font-bold text-slate-100 sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          The requested endpoint does not exist or has been shifted in the Nova
          architecture.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium shadow-md shadow-blue-600/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Feed</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
