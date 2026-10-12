"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Trash2,
  Loader2,
  User as UserIcon,
  Clock,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Comment } from "@/types/comment";

interface CommentSectionProps {
  postId: string;
  commentsCount: number;
}

interface CommentsResponseData {
  comments: Comment[];
  total: number;
}

interface NewCommentResponseData {
  comment: Comment;
}

export default function CommentSection({
  postId,
  commentsCount: initialCommentsCount,
}: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState(initialCommentsCount);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await api.get<CommentsResponseData>(
          `/posts/${postId}/comments`,
        );
        if (res.data) {
          setComments(res.data.comments || []);
          setCount(res.data.total ?? (res.data.comments || []).length);
        }
      } catch {
        // Quiet on initial mount
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!user) {
      toast("Please sign in to join the discussion", "info");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post<NewCommentResponseData>(
        `/posts/${postId}/comments`,
        {
          content: content.trim(),
        },
      );

      if (res.data?.comment) {
        const newComment = res.data.comment;
        setComments((prev) => [...prev, newComment]);
        setCount((prev) => prev + 1);
        setContent("");
        toast("Comment posted", "success");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to post comment";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      setDeletingId(commentId);
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCount((prev) => Math.max(0, prev - 1));
      toast("Comment deleted", "success");
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to delete comment";
      toast(msg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCommentDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="card-surface mt-8 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-bold text-slate-100">
          Discussion ({count})
        </h2>
      </div>

      {/* Comment Input Box */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share technical feedback, edge cases, or ask a question..."
            maxLength={1000}
            className="input-surface w-full p-3.5 text-xs font-mono resize-y focus:outline-none"
          />
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[11px] font-mono text-slate-500">
              {content.length}/1000 chars
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="btn-primary px-4 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 mb-8 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
          <p className="text-xs text-slate-400 mb-2">
            Sign in to share your thoughts or join the technical discussion.
          </p>
          <Link
            href="/login"
            className="btn-primary px-4 py-1.5 text-xs font-medium inline-block"
          >
            Sign In to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-slate-900/40 rounded-xl border border-slate-800" />
          <div className="h-16 bg-slate-900/40 rounded-xl border border-slate-800" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-slate-500 font-mono">
            No comments yet. Be the first to share an insight!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isAuthor =
              user &&
              (user.id === comment.author._id ||
                user._id === comment.author._id ||
                user.username === comment.author.username);

            return (
              <div
                key={comment._id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                      {comment.author.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition">
                        {comment.author.name}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        @{comment.author.username}
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatCommentDate(comment.createdAt)}
                    </span>
                    {isAuthor && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment._id)}
                        disabled={deletingId === comment._id}
                        aria-label="Delete comment"
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      >
                        {deletingId === comment._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed pl-9">
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
