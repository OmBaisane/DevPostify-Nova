"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  Calendar,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Post } from "@/types/post";
import { useToast } from "@/context/ToastContext";

interface SearchResponseData {
  posts: Post[];
  query: string;
}

export default function SearchPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(
    async (query: string) => {
      const cleanQuery = query.trim().slice(0, 80);
      if (cleanQuery.length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      try {
        setLoading(true);
        setHasSearched(true);
        const res = await api.get<SearchResponseData>(
          `/search?q=${encodeURIComponent(cleanQuery)}`,
        );
        if (res.data) {
          setResults(res.data.posts || []);
        }
      } catch (err: unknown) {
        const msg = err instanceof ApiError ? err.message : "Search failed";
        toast(msg, "error");
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch(searchTerm);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mb-2">
          <SearchIcon className="w-6 h-6 text-blue-400" />
          <span>Explore Knowledge</span>
        </h1>
        <p className="text-xs text-slate-400">
          Search technical articles by title, keywords, categories, or developer
          concepts.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxLength={80}
            placeholder="Search architecture, docker, next.js, microservices..."
            className="input-surface w-full pl-11 pr-24 py-3.5 text-sm font-mono placeholder:text-slate-500"
          />
          <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading && (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            )}
            <span className="text-[10px] font-mono text-slate-500">
              {searchTerm.length}/80
            </span>
          </div>
        </div>
      </form>

      {/* Results Section */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 bg-slate-900/40 rounded-2xl border border-slate-800" />
          <div className="h-28 bg-slate-900/40 rounded-2xl border border-slate-800" />
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="card-surface p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <SearchIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-200">
            No Matching Articles Found
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try searching for broader keywords, programming languages, or
            architectural topics.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((post) => (
            <Link
              key={post._id}
              href={`/posts/${post._id}`}
              className="card-surface p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/60 block transition hover:border-slate-700/80 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 uppercase font-semibold">
                  {post.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-blue-400 transition truncate">
                {post.title}
              </h2>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {post.content.slice(0, 180)}...
              </p>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
                <span>By @{post.author?.username || "developer"}</span>
                <span className="inline-flex items-center gap-1 text-blue-400 group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
