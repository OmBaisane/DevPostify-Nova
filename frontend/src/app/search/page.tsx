"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Post } from "@/types/post";
import PostCard from "@/components/posts/PostCard";
import PostSkeleton from "@/components/posts/PostSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Search as SearchIcon, Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPosts([]);
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.get<{ posts: Post[] }>("/search", {
        params: { q: searchTerm.trim() },
      });
      if (res.data?.posts) {
        setPosts(res.data.posts);
      } else {
        setPosts([]);
      }
    } catch {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-slate-100 sm:text-3xl mb-2">
          Discover Insights
        </h1>
        <p className="text-xs text-slate-400 mb-6">
          Search engineering posts by title, markdown content, tags, or topics.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            placeholder="Search keywords, e.g. zustand, mongodb, caching..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full input-surface py-3 pl-11 pr-24 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
          />
          <SearchIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <button
            type="submit"
            className="absolute right-2 top-2 btn-primary px-4 py-1.5 text-xs font-medium shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : query.trim() ? (
          <EmptyState
            title="No matching posts found"
            description={`We couldn't find any articles matching "${query}". Try searching by generic technical tags.`}
          />
        ) : (
          <div className="card-surface p-8 text-center text-xs text-slate-500">
            Type keywords above to discover community articles.
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
