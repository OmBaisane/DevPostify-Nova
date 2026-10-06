"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Clock, X, Tag } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Post, PostsResponseData } from "@/types/post";
import PostCard from "@/components/posts/PostCard";

const CATEGORIES = [
  "All",
  "webdev",
  "architecture",
  "devops",
  "opensource",
  "ai",
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Discovery Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "top">("latest");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        sort: sortBy,
      };

      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      if (selectedTag) {
        params.tag = selectedTag;
      }

      const res = await api.get<PostsResponseData>("/posts", { params });
      if (res.data) {
        setPosts(res.data.posts || []);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch technical feed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedTag, sortBy]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Welcome Header */}
      <section className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Engineering Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
          Deep dives, architectural decisions, and production learnings shared
          directly by software engineers.
        </p>
      </section>

      {/* Category Pills Bar */}
      <nav
        aria-label="Engineering Categories"
        className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedTag(null); // Reset tag on category shift
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            {cat === "All" ? "All Topics" : `#${cat}`}
          </button>
        ))}
      </nav>

      {/* Discovery Sub-Bar: Sort Controls (Latest vs Top) & Active Tag Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Sort By:
          </span>
          <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/60 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setSortBy("latest")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition ${
                sortBy === "latest"
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Latest
            </button>

            <button
              type="button"
              onClick={() => setSortBy("top")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition ${
                sortBy === "top"
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              Top Insights
            </button>
          </div>
        </div>

        {/* Active Tag Indicator */}
        {selectedTag && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 text-xs text-purple-300">
            <Tag className="w-3 h-3" />
            <span>Tag: #{selectedTag}</span>
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              aria-label="Clear tag filter"
              className="hover:text-white ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Feed Content Stream */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-slate-900/40 rounded-2xl border border-slate-800" />
          <div className="h-44 bg-slate-900/40 rounded-2xl border border-slate-800" />
          <div className="h-44 bg-slate-900/40 rounded-2xl border border-slate-800" />
        </div>
      ) : posts.length === 0 ? (
        <div className="card-surface p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">
            No Articles Found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No technical posts match your selected criteria. Try switching
            categories or clearing tags.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onTagClick={(tag) => setSelectedTag(tag)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
