"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { api, ApiError } from "@/lib/api";
import { Post } from "@/types/post";
import PostCard from "@/components/posts/PostCard";
import PostSkeleton from "@/components/posts/PostSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Bookmark, ArrowLeft } from "lucide-react";

interface BookmarkItem {
  _id: string;
  user: string;
  post: Post;
  createdAt: string;
}

export default function BookmarksPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches persisted bookmarks. Filters out null references where posts
   * may have been purged on the backend to avoid client hydration errors.
   */
  const fetchBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<{ bookmarks: BookmarkItem[] }>("/bookmarks");
      if (res.data?.bookmarks) {
        const extractedPosts = res.data.bookmarks
          .map((b) => b.post)
          .filter((p): p is Post => Boolean(p && p._id));
        setPosts(extractedPosts);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load bookmarks.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Optimistic unbookmarking: remove deleted item from local state directly
  const handleBookmarkRemoved = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to feed
          </Link>
        </nav>

        {/* Section Header */}
        <header className="mb-8 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <Bookmark className="h-3.5 w-3.5 fill-blue-400" />
            <span>SAVED FOR LATER</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Bookmarks
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your personal library of architectural breakdowns and technical
            references.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400"
          >
            {error}
          </div>
        )}

        {/* Bookmarked Posts Collection */}
        <section aria-label="Saved Bookmarks List" className="space-y-4">
          {isLoading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                initialBookmarked={true}
                onBookmarkRemoved={handleBookmarkRemoved}
              />
            ))
          ) : (
            <EmptyState
              title="No bookmarks yet"
              description="Click the bookmark icon on any engineering post in your feed to save it here for quick reference."
              actionText="Explore Feed"
              actionHref="/"
            />
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
