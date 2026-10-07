"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileEdit,
  Clock,
  ArrowRight,
  Trash2,
  Send,
  Loader2,
  FileText,
  PenSquare,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Post } from "@/types/post";

interface DraftsResponseData {
  drafts: Post[];
  total: number;
}

export default function DraftsPage() {
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

  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const res = await api.get<DraftsResponseData>("/posts/my/drafts");
      if (res.data) {
        setDrafts(res.data.drafts || []);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to load drafts";
      triggerToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handlePublish = async (postId: string) => {
    try {
      setActionLoadingId(postId);
      await api.patch(`/posts/${postId}`, { isDraft: false });
      setDrafts((prev) => prev.filter((d) => d._id !== postId));
      triggerToast("Draft published successfully to public feed!", "success");
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to publish draft";
      triggerToast(msg, "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this unpublished draft?")
    ) {
      return;
    }

    try {
      setActionLoadingId(postId);
      await api.delete(`/posts/${postId}`);
      setDrafts((prev) => prev.filter((d) => d._id !== postId));
      triggerToast("Draft deleted", "success");
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to delete draft";
      triggerToast(msg, "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatUpdatedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Drafts Management
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Private unpublished articles. Only visible to you until
                published.
              </p>
            </div>
          </div>

          <Link
            href="/create"
            className="btn-primary px-3.5 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>New Article</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-28 bg-slate-900/40 rounded-2xl border border-slate-800" />
            <div className="h-28 bg-slate-900/40 rounded-2xl border border-slate-800" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="card-surface p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h2 className="text-base font-bold text-slate-200">
              No Pending Drafts
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-5">
              All your technical writing is either published or you have not
              started a draft yet.
            </p>
            <Link
              href="/create"
              className="btn-primary px-4 py-2 text-xs font-medium inline-block"
            >
              Compose New Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft._id}
                className="card-surface p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-700/80"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold">
                      Draft
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 uppercase font-semibold">
                      {draft.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-100 truncate">
                    {draft.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      Last updated: {formatUpdatedDate(draft.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    type="button"
                    onClick={() => handlePublish(draft._id)}
                    disabled={actionLoadingId === draft._id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 hover:bg-emerald-500/20 font-medium transition disabled:opacity-50"
                  >
                    {actionLoadingId === draft._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Publish</span>
                  </button>

                  <Link
                    href={`/posts/${draft._id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:border-slate-700 font-medium transition"
                  >
                    <span>Edit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(draft._id)}
                    disabled={actionLoadingId === draft._id}
                    aria-label="Delete draft"
                    className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
