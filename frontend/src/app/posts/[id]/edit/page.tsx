"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Loader2,
  Image as ImageIcon,
  X,
  FileCheck,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { api, ApiError } from "@/lib/api";
import { uploadImageDirect } from "@/lib/upload";
import { Post } from "@/types/post";

const CATEGORIES = ["webdev", "architecture", "devops", "opensource", "ai"];

export default function EditPostPage({
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("webdev");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetching(true);
        const res = await api.get<{ post: Post }>(`/posts/${postId}`);
        if (res.data?.post) {
          const p = res.data.post;
          // Guard: Only author can edit
          if (
            user &&
            p.author._id !== user._id &&
            p.author.id !== user._id &&
            p.author.username !== user.username
          ) {
            triggerToast("Unauthorized to edit this article", "error");
            router.push("/");
            return;
          }

          setTitle(p.title);
          setCategory(p.category);
          setContent(p.content);
          setTagsInput((p.tags || []).join(", "));
          setCoverImage(p.coverImage || "");
          setIsDraft(Boolean(p.isDraft));
        }
      } catch (err: unknown) {
        const msg =
          err instanceof ApiError ? err.message : "Failed to load post";
        setError(msg);
      } finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [postId, user]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      setError(null);
      const url = await uploadImageDirect(file, "devpostify/covers");
      setCoverImage(url);
      triggerToast("Cover image updated", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload cover";
      setError(msg);
      triggerToast(msg, "error");
    } finally {
      setUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    try {
      setSaving(true);
      await api.patch(`/posts/${postId}`, {
        title: title.trim(),
        category,
        content: content.trim(),
        tags,
        coverImage: coverImage.trim(),
        isDraft,
      });

      triggerToast("Post updated successfully!", "success");
      router.push(`/posts/${postId}`);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update post");
      }
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="card-surface h-72 rounded-2xl border border-slate-800 bg-slate-900/40" />
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/posts/${postId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Cancel & Back to Post
          </Link>
          <span className="text-xs text-slate-500 font-mono">
            Edit Technical Article
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload Area */}
          <div className="card-surface p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
            <span className="block text-xs font-medium text-slate-300 mb-2">
              Article Cover Image
            </span>

            {coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-56 bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  aria-label="Remove cover image"
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-rose-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverUpload}
                  className="hidden"
                  id="cover-file-input"
                />
                <label
                  htmlFor="cover-file-input"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer bg-slate-950/50 transition group"
                >
                  {uploadingCover ? (
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-400 mb-2 transition" />
                      <span className="text-xs text-slate-300 font-medium">
                        Click to upload new cover image
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        PNG, JPG or WebP up to 5MB (Direct Cloudinary CDN)
                      </span>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Title & Category Input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="edit-title"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Article Title ({title.length}/160)
              </label>
              <input
                id="edit-title"
                type="text"
                required
                minLength={5}
                maxLength={160}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-surface w-full px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="edit-category"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Category
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-surface w-full px-3.5 py-2.5 text-sm uppercase font-mono"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="edit-tags"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Tags (comma-separated, up to 5)
            </label>
            <input
              id="edit-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="kafka, microservices, docker"
              className="input-surface w-full px-3.5 py-2 text-xs font-mono"
            />
          </div>

          {/* Editor Header: Write vs Preview */}
          <div className="card-surface rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    activeTab === "write"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    activeTab === "preview"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Live Preview
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-500">
                {content.length} chars
              </span>
            </div>

            {activeTab === "write" ? (
              <textarea
                rows={16}
                required
                minLength={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent p-4 text-sm font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none resize-y leading-relaxed"
              />
            ) : (
              <div className="p-6 min-h-95 bg-slate-950/40">
                {content.trim() ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Nothing to preview.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Draft Toggle & Submit Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-300 font-medium">
                Keep as Private Draft (Hidden from public feed)
              </span>
            </label>

            <button
              type="submit"
              disabled={saving || uploadingCover}
              className="btn-primary px-6 py-2.5 text-xs font-semibold disabled:opacity-50 inline-flex items-center gap-2 w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  Update Post
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </ProtectedRoute>
  );
}
