import Link from "next/link";
import { FileQuestion, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="card-surface max-w-md w-full p-8 rounded-2xl border border-slate-800 bg-slate-900/60 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-bold text-slate-100 mb-2">
          404 — Article or Route Not Found
        </h1>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          The requested page, publication, or profile does not exist or may have
          been removed.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Explore Feed</span>
          </Link>

          <Link
            href="/search"
            className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:border-slate-700 font-semibold inline-flex items-center gap-2 transition"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Search</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
