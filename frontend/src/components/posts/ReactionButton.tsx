"use client";

import React, { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface ReactionButtonProps {
  postId: string;
  initialCount: number;
  initialIsReacted: boolean;
  size?: "sm" | "md";
}

interface ReactionResponse {
  isReacted: boolean;
  reactionsCount: number;
}

export default function ReactionButton({
  postId,
  initialCount = 0,
  initialIsReacted = false,
  size = "md",
}: ReactionButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isReacted, setIsReacted] = useState(initialIsReacted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast("Please sign in to react to technical articles", "info");
      return;
    }

    if (loading) return;

    // Optimistic UI state update
    const previousReacted = isReacted;
    const previousCount = count;
    const nextReacted = !previousReacted;
    const nextCount = nextReacted
      ? previousCount + 1
      : Math.max(0, previousCount - 1);

    setIsReacted(nextReacted);
    setCount(nextCount);
    setLoading(true);

    try {
      const res = await api.post<ReactionResponse>(`/posts/${postId}/react`);
      if (res.data) {
        setIsReacted(res.data.isReacted);
        setCount(res.data.reactionsCount);
      }
    } catch (err: unknown) {
      // Rollback on failure
      setIsReacted(previousReacted);
      setCount(previousCount);
      const msg =
        err instanceof ApiError ? err.message : "Failed to toggle reaction";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={isReacted ? "Unlike this article" : "Like this article"}
      className={`inline-flex items-center gap-1.5 rounded-xl border font-mono transition group ${
        isSmall ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs"
      } ${
        isReacted
          ? "border-rose-500/30 bg-rose-500/10 text-rose-400 font-semibold"
          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:border-slate-700"
      }`}
    >
      {loading ? (
        <Loader2
          className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} animate-spin text-rose-400`}
        />
      ) : (
        <Heart
          className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} transition-transform group-hover:scale-110 ${
            isReacted ? "fill-current text-rose-500" : ""
          }`}
        />
      )}
      <span>{count}</span>
    </button>
  );
}
