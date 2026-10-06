"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Trash2,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Comment, CommentsResponseData } from "@/types/comment";

interface CommentSectionProps {
  postId: string;
  commentsCount: number;
}

export default function CommentSection({
  postId,
  commentsCount: initialCount,
}: CommentSectionProps) {
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

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [count, setCount] = useState(initialCount);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get<CommentsResponseData>(
        `/posts/${postId}/comments`,
      );
      if (res.data) {
        setComments(res.data.comments || []);
        setCount(res.data.total || 0);
      }
    } catch {
      // Silent catch on unmounted or initial failures
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!user) {
      triggerToast("Please log in to participate in the discussion", "info");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post<{ comment: Comment }>(
        `/posts/${postId}/comments`,
        {
          content: content.trim(),
        },
      );

      if (res.data?.comment) {
        setComments((prev) => [...prev, res.data!.comment]);
        setCount((prev) => prev + 1);
        setContent("");
        triggerToast("Comment posted", "success");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to post comment";
      triggerToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      setDeletingId(commentId);
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCount((prev) => Math.max(0, prev - 1));
      triggerToast("Comment deleted", "success");
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to delete comment";
      triggerToast(msg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-slate-100">
          Discussion ({count})
        </h2>
      </div>

      {/* Comment Input Box */}
      {user ? (
        <form onSubmit={handleCreateComment} className="mb-8">
          <div className="card-surface p-4 border border-slate-800 bg-slate-900/60 rounded-2xl">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share technical insights, ask architecture questions, or offer feedback..."
              maxLength={1000}
              required
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
              <span className="text-[11px] font-mono text-slate-500">
                {content.length}/1000
              </span>

              <button
                type="submit"
                disabled={submitting || content.trim().length < 2}
                className="btn-primary px-4 py-1.5 text-xs font-medium disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Comment</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="card-surface p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-center mb-8">
          <p className="text-xs text-slate-400 mb-3">
            Join the conversation. Sign in to post technical questions or
            feedback.
          </p>
          <Link
            href="/login"
            className="btn-primary px-4 py-1.5 text-xs font-medium inline-block"
          >
            Log in to comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-slate-900/40 rounded-xl border border-slate-800" />
          <div className="h-20 bg-slate-900/40 rounded-xl border border-slate-800" />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 italic">
          No comments yet. Be the first to start the discussion!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isAuthor =
              user &&
              (user.id === comment.author._id ||
                user._id === comment.author._id);

            return (
              <div
                key={comment._id}
                className="card-surface p-4 rounded-xl border border-slate-800/80 bg-slate-900/40"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-7 h-7 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      {comment.author.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition">
                        {comment.author.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                        @{comment.author.username}
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatDate(comment.createdAt)}
                    </span>

                    {isAuthor && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={deletingId === comment._id}
                        aria-label="Delete comment"
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                      >
                        {deletingId === comment._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed pl-9">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
