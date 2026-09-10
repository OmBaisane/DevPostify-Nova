"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { api, ApiError } from "@/lib/api";
import { Post } from "@/types/post";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Edit3, Eye, Loader2, AlertCircle } from "lucide-react";

const CATEGORY_OPTIONS = [
  { label: "Web Development", value: "webdev" },
  { label: "System Architecture", value: "architecture" },
  { label: "DevOps & Cloud", value: "devops" },
  { label: "Open Source", value: "opensource" },
  { label: "AI & Machine Learning", value: "ai" },
];

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("webdev");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<Post>(`/posts/${id}`);
        if (res.data) {
          const postData = res.data;
          // Ownership verification
          if (user && postData.author?._id !== user._id) {
            router.replace(`/posts/${id}`);
            return;
          }
          setTitle(postData.title);
          setCategory(postData.category);
          setTagsInput(postData.tags?.join(", ") || "");
          setContent(postData.content);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load post for editing.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    try {
      setIsSubmitting(true);
      await api.patch(`/posts/${id}`, {
        title: title.trim(),
        category,
        tags,
        content: content.trim(),
      });

      router.push(`/posts/${id}`);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update post.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link
            href={`/posts/${id}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to article
          </Link>
        </div>

        <div className="card-surface p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 border-b border-slate-800/80 pb-4">
            <h1 className="font-heading text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Edit3 className="h-6 w-6 text-blue-500" />
              Edit Engineering Post
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Update technical details, refine explanation, or modify tags.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Post Title
              </label>
              <input
                id="title"
                type="text"
                required
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full input-surface px-4 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full input-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition bg-slate-900"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full input-surface px-4 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-300">
                  Content (Markdown supported)
                </label>
                <div className="flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                      activeTab === "write"
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Edit3 className="h-3 w-3" />
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                      activeTab === "preview"
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <textarea
                  required
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full input-surface p-4 font-mono text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition leading-relaxed resize-y"
                />
              ) : (
                <div className="w-full min-h-87.5 input-surface p-4 text-xs sm:text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap font-sans text-slate-200 bg-slate-900/50">
                  {content.trim() ? (
                    content
                  ) : (
                    <span className="text-slate-500 italic">
                      No content to preview.
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
              <Link
                href={`/posts/${id}`}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-6 py-2.5 text-xs font-medium shadow-md shadow-blue-600/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
