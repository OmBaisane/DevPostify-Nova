"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/types/post";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Clock, Tag, Bookmark } from "lucide-react";

interface PostCardProps {
  post: Post;
  initialBookmarked?: boolean;
  onBookmarkRemoved?: (postId: string) => void;
}

export default function PostCard({
  post,
  initialBookmarked = false,
  onBookmarkRemoved,
}: PostCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);

  // Approximate reading time
  const wordCount = post.content?.trim().split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    if (isToggling) return;

    const previousState = isBookmarked;
    setIsBookmarked(!previousState);
    setIsToggling(true);

    try {
      if (previousState) {
        await api.delete(`/bookmarks/${post._id}`);
        if (onBookmarkRemoved) {
          onBookmarkRemoved(post._id);
        }
      } else {
        await api.post(`/bookmarks/${post._id}`);
      }
    } catch {
      // Revert if API fails
      setIsBookmarked(previousState);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <article className="card-surface p-5 sm:p-6 transition-all duration-200 hover:border-slate-700/80 hover:shadow-lg hover:shadow-blue-500/5">
      {/* Author Header & Bookmark Action */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/profile/${post.author?.username}`}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 font-semibold text-xs text-blue-400 group-hover:border-blue-500/50 transition">
            {post.author?.name ? post.author.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-200 group-hover:text-blue-400 transition">
              {post.author?.name || "Developer"}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">
              @{post.author?.username || "anonymous"}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <time dateTime={post.createdAt}>{formattedDate}</time>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime} min read
            </span>
          </div>

          <button
            type="button"
            onClick={handleBookmarkToggle}
            disabled={isToggling}
            aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
            className={`p-1.5 rounded-lg border transition ${
              isBookmarked
                ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${isBookmarked ? "fill-blue-400" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Post Title & Excerpt */}
      <div className="mb-4">
        <Link href={`/posts/${post._id}`} className="group">
          <h2 className="font-heading text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition line-clamp-2 mb-2">
            {post.title}
          </h2>
          <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
            {post.content?.replace(/[#*`_~\[\]]/g, "")}
          </p>
        </Link>
      </div>

      {/* Category & Tags Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400 border border-blue-500/20">
            {post.category}
          </span>

          {post.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 font-mono"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/posts/${post._id}`}
          className="text-[11px] font-medium text-slate-300 hover:text-white transition"
        >
          Read post →
        </Link>
      </div>
    </article>
  );
}
