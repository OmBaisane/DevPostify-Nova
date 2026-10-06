"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, MessageSquare, Tag, Bookmark } from "lucide-react";
import { Post } from "@/types/post";
import ReactionButton from "./ReactionButton";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface PostCardProps {
  post: Post;
  initialBookmarked?: boolean;
  onBookmarkRemoved?: (postId: string) => void;
  onTagClick?: (tag: string) => void;
}

function CardBookmarkAction({
  postId,
  initialBookmarked = false,
  onRemoved,
}: {
  postId: string;
  initialBookmarked?: boolean;
  onRemoved?: (id: string) => void;
}) {
  const { user } = useAuth();
  const toastContext = useToast();
  const triggerToast = (
    msg: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = toastContext as any;
    if (typeof ctx.toast === "function") ctx.toast(msg, type);
    else if (typeof ctx.addToast === "function") ctx.addToast(msg, type);
  };

  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      triggerToast("Please log in to save bookmarks", "info");
      return;
    }

    if (loading) return;

    const prevState = bookmarked;
    setBookmarked(!prevState);

    try {
      setLoading(true);
      if (prevState) {
        await api.delete(`/bookmarks/${postId}`);
        triggerToast("Removed from bookmarks", "info");
        if (onRemoved) onRemoved(postId);
      } else {
        await api.post(`/bookmarks/${postId}`);
        triggerToast("Saved to bookmarks", "success");
      }
    } catch (err: unknown) {
      setBookmarked(prevState);
      const msg =
        err instanceof ApiError ? err.message : "Failed to update bookmark";
      triggerToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
      className={`p-1.5 rounded-lg border transition ${
        bookmarked
          ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
      }`}
    >
      <Bookmark
        className={`w-3.5 h-3.5 ${bookmarked ? "fill-blue-400 text-blue-400" : ""}`}
      />
    </button>
  );
}

export default function PostCard({
  post,
  initialBookmarked = false,
  onBookmarkRemoved,
  onTagClick,
}: PostCardProps) {
  const words = post.content ? post.content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="card-surface p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700/80 transition-all duration-200 group relative flex flex-col justify-between overflow-hidden">
      <div>
        {/* Cover Image Banner (If present) */}
        {post.coverImage && (
          <Link
            href={`/posts/${post._id}`}
            className="block -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-4 overflow-hidden border-b border-slate-800 max-h-52 bg-slate-950"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center group-hover:scale-102 transition duration-300"
            />
          </Link>
        )}

        {/* Top Metadata Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link
            href={`/profile/${post.author.username}`}
            className="flex items-center gap-2.5 group/author"
          >
            <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
              {post.author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-slate-300">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-200 group-hover/author:text-blue-400 transition">
                {post.author.name}
              </span>
              <span className="block text-[10px] text-slate-500 font-mono">
                @{post.author.username}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 uppercase font-semibold">
              {post.category}
            </span>
          </div>
        </div>

        {/* Post Title & Excerpt */}
        <Link
          href={`/posts/${post._id}`}
          className="block group-hover:translate-x-0.5 transition-transform duration-150"
        >
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-blue-400 transition leading-snug line-clamp-2">
            {post.title}
          </h2>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {post.content.replace(/#+\s|[*`_]/g, "")}
          </p>
        </Link>

        {/* Tags Row */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {post.tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (onTagClick) onTagClick(tag);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-slate-200 px-2 py-0.5 rounded-md transition"
              >
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-5">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {readTime} min read
          </span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reaction Button */}
          <ReactionButton
            postId={post._id}
            initialCount={post.reactionsCount || 0}
            initialIsReacted={post.isReactedByMe || false}
            size="sm"
          />

          {/* Comment Count Badge */}
          <Link
            href={`/posts/${post._id}#discussion`}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{post.commentsCount || 0}</span>
          </Link>

          {/* Inline Bookmark Action */}
          <CardBookmarkAction
            postId={post._id}
            initialBookmarked={initialBookmarked}
            onRemoved={onBookmarkRemoved}
          />
        </div>
      </div>
    </article>
  );
}
