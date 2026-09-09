"use client";

import React from "react";
import Link from "next/link";
import { Post } from "@/types/post";
import { Clock, Tag } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // Rough reading time calculation (avg 200 words per minute)
  const wordCount = post.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="card-surface p-5 sm:p-6 transition-all duration-200 hover:border-slate-700/80 hover:shadow-lg hover:shadow-blue-500/5">
      {/* Author Header */}
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

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <time dateTime={post.createdAt}>{formattedDate}</time>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime} min read
          </span>
        </div>
      </div>

      {/* Post Title & Excerpt */}
      <div className="mb-4">
        <Link href={`/posts/${post._id}`} className="group">
          <h2 className="font-heading text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition line-clamp-2 mb-2">
            {post.title}
          </h2>
          <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
            {post.content.replace(/[#*`_~\[\]]/g, "")}
          </p>
        </Link>
      </div>

      {/* Category & Tags Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Pill */}
          <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400 border border-blue-500/20">
            {post.category}
          </span>

          {/* Tags */}
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
