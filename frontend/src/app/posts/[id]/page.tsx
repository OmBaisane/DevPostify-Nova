"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Post } from "@/types/post";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  ArrowLeft,
  Clock,
  Tag,
  Trash2,
  Calendar,
  Loader2,
  AlertCircle,
  Edit3,
} from "lucide-react";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<Post>(`/posts/${id}`);
        if (res.data) {
          setPost(res.data);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load post.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !confirm("Are you sure you want to delete this post?")) return;

    try {
      setIsDeleting(true);
      await api.delete(`/posts/${id}`);
      toast("Post deleted successfully", "info");
      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to delete post.");
      }
      toast("Failed to delete post", "error");
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="card-surface p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <h2 className="font-heading text-lg font-semibold text-slate-200">
            {error || "Post not found"}
          </h2>
          <Link
            href="/"
            className="btn-primary mt-5 inline-flex px-4 py-2 text-xs"
          >
            Return to Feed
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && user._id === post.author?._id;
  const wordCount = post.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to feed
        </Link>
      </div>

      <div className="card-surface p-6 sm:p-10 shadow-2xl">
        {/* Category & Tags Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
              {post.category}
            </span>
            {post.tags?.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 font-mono text-xs text-slate-400"
              >
                <Tag className="h-3 w-3" />
                {t}
              </span>
            ))}
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                href={`/posts/${post._id}/edit`}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <Edit3 className="h-3.5 w-3.5 text-blue-400" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="mt-6 font-heading text-2xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          {post.title}
        </h1>

        {/* Author Metadata */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6 text-xs text-slate-400">
          <Link
            href={`/profile/${post.author?.username}`}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-semibold text-blue-400 transition group-hover:border-blue-500/50">
              {post.author?.name
                ? post.author.name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div>
              <p className="font-medium text-slate-200 transition group-hover:text-blue-400">
                {post.author?.name}
              </p>
              <p className="font-mono text-slate-500">
                @{post.author?.username}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readTime} min read
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-8 leading-relaxed text-slate-200">
          <div className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-7">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
}
