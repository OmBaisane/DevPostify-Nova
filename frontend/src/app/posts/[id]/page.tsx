"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Loader2,
  Tag,
  User as UserIcon,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Post } from "@/types/post";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import ReactionButton from "@/components/posts/ReactionButton";
import CommentSection from "@/components/posts/CommentSection";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const router = useRouter();
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

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<{ post: Post }>(`/posts/${postId}`);
        if (res.data?.post) {
          setPost(res.data.post);
        } else {
          setError("Post not found");
        }
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load post");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete this technical article?")
    ) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/posts/${postId}`);
      triggerToast("Post deleted successfully", "success");
      router.push("/");
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to delete post";
      triggerToast(msg, "error");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 w-24 bg-slate-900/60 rounded mb-8 border border-slate-800" />
        <div className="h-12 w-3/4 bg-slate-900/60 rounded-xl mb-4 border border-slate-800" />
        <div className="h-4 w-1/3 bg-slate-900/60 rounded mb-8 border border-slate-800" />
        <div className="h-96 bg-slate-900/40 rounded-2xl border border-slate-800" />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="card-surface p-8 border border-slate-800 bg-slate-900/60 rounded-2xl max-w-md mx-auto">
          <h1 className="text-xl font-bold text-slate-100 mb-2">
            Article Not Found
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            {error ||
              "The technical article you are looking for does not exist or has been removed."}
          </p>
          <Link href="/" className="btn-primary px-4 py-2 text-xs font-medium">
            Back to Feed
          </Link>
        </div>
      </main>
    );
  }

  // Safe null checks against undefined content string
  const postContent = typeof post.content === "string" ? post.content : "";
  const words = postContent.trim() ? postContent.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const isAuthor =
    user &&
    post.author &&
    (user.id === post.author._id ||
      user._id === post.author._id ||
      user.id === post.author.id ||
      user.username === post.author.username);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation & Actions Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed
        </Link>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link
              href={`/posts/${post._id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit</span>
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400 hover:bg-rose-500/20 transition disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Article Article Container */}
      <article className="card-surface p-6 sm:p-10 rounded-2xl border border-slate-800 bg-slate-900/60">
        {/* Category Pill & Draft Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 uppercase font-semibold">
            {post.category}
          </span>
          {post.isDraft && (
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-300 font-medium">
              Private Draft
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Author & Reading Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5 my-6 border-y border-slate-800/80">
          <Link
            href={`/profile/${post.author?.username || ""}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
              {post.author?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition">
                {post.author?.name || "Anonymous Developer"}
              </span>
              <span className="block text-xs text-slate-500 font-mono">
                @{post.author?.username || "unknown"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {readTime} min read
            </span>

            {/* Reaction Button in header */}
            <ReactionButton
              postId={post._id}
              initialCount={post.reactionsCount || 0}
              initialIsReacted={post.isReactedByMe || false}
              size="sm"
            />
          </div>
        </div>

        {/* Cover Image Banner (If present) */}
        {post.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-slate-800 max-h-110 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Markdown Content with Prism.js Highlighting */}
        <div className="py-2">
          <MarkdownRenderer content={postContent} />
        </div>

        {/* Tags Footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 mt-8 border-t border-slate-800">
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" /> Tags:
            </span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-xs font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Discussion Section */}
      <CommentSection
        postId={post._id}
        commentsCount={post.commentsCount || 0}
      />
    </main>
  );
}
