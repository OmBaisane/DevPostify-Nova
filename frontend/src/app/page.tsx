"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Post, PostsResponseData } from "@/types/post";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/posts/PostCard";
import PostSkeleton from "@/components/posts/PostSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { PenSquare, Sparkles } from "lucide-react";

const CATEGORIES = [
  { label: "All Topics", value: "" },
  { label: "Web Dev", value: "webdev" },
  { label: "Architecture", value: "architecture" },
  { label: "DevOps", value: "devops" },
  { label: "Open Source", value: "opensource" },
  { label: "AI & ML", value: "ai" },
];

interface BookmarkItem {
  post: { _id: string };
}

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostsAndBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        page: 1,
        limit: 10,
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      // Fetch feed posts and (if logged in) current bookmarks in parallel
      const postsPromise = api.get<PostsResponseData>("/posts", { params });
      const bookmarksPromise = user
        ? api.get<{ bookmarks: BookmarkItem[] }>("/bookmarks")
        : Promise.resolve({ data: { bookmarks: [] } });

      const [postsRes, bookmarksRes] = await Promise.all([
        postsPromise,
        bookmarksPromise,
      ]);

      if (postsRes.data?.posts) {
        setPosts(postsRes.data.posts);
      }

      if (bookmarksRes.data?.bookmarks) {
        const idSet = new Set(
          bookmarksRes.data.bookmarks
            .filter((b) => b.post && b.post._id)
            .map((b) => b.post._id),
        );
        setBookmarkedIds(idSet);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load feed posts.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, user]);

  useEffect(() => {
    fetchPostsAndBookmarks();
  }, [fetchPostsAndBookmarks]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Feed Hero */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>COMMUNITY DISCOVERY</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Engineering Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Read engineering insights, architecture breakdowns, and learnings.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2 btn-primary px-4 py-2 text-xs font-medium shadow-md shadow-blue-600/20 hover:opacity-95 self-start sm:self-auto"
        >
          <PenSquare className="h-3.5 w-3.5" />
          Share Insight
        </Link>
      </section>

      {/* Category Pills Filter */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Feed List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              initialBookmarked={bookmarkedIds.has(post._id)}
            />
          ))
        ) : (
          <EmptyState
            title="No posts found"
            description={
              selectedCategory
                ? `No engineering posts published under "${selectedCategory}" yet.`
                : "The engineering feed is quiet right now. Be the first to share!"
            }
            actionText="Write First Post"
            actionHref="/create"
          />
        )}
      </div>
    </div>
  );
}
