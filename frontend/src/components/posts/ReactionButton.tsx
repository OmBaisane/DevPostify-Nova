"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface ReactionButtonProps {
  postId: string;
  initialCount?: number;
  initialIsReacted?: boolean;
  size?: "sm" | "md";
}

export default function ReactionButton({
  postId,
  initialCount = 0,
  initialIsReacted = false,
  size = "md",
}: ReactionButtonProps) {
  const { user } = useAuth();
  const toastContext = useToast();
  // Safe helper to invoke either toast() or addToast() depending on implementation
  const triggerToast = (
    msg: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = toastContext as any;
    if (typeof ctx.toast === "function") ctx.toast(msg, type);
    else if (typeof ctx.addToast === "function") ctx.addToast(msg, type);
  };

  const [isReacted, setIsReacted] = useState(initialIsReacted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      triggerToast("Please log in to react to posts", "info");
      return;
    }

    if (loading) return;

    // 1. Optimistic UI update
    const previousState = isReacted;
    const previousCount = count;

    setIsReacted(!previousState);
    setCount(
      previousState ? Math.max(0, previousCount - 1) : previousCount + 1,
    );

    try {
      setLoading(true);
      const res = await api.post<{
        isReacted: boolean;
        reactionsCount: number;
      }>(`/posts/${postId}/react`);

      if (res.data) {
        setIsReacted(res.data.isReacted);
        setCount(res.data.reactionsCount);
      }
    } catch (err: unknown) {
      // Rollback on network/server error
      setIsReacted(previousState);
      setCount(previousCount);
      const msg =
        err instanceof ApiError ? err.message : "Failed to toggle reaction";
      triggerToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isReacted ? "Unlike post" : "Like post"}
      className={`inline-flex items-center gap-1.5 rounded-lg border transition ${
        isReacted
          ? "border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
      } ${isSmall ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs font-medium"}`}
    >
      <Heart
        className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} transition-transform active:scale-125 ${
          isReacted ? "fill-rose-500 text-rose-500" : ""
        }`}
      />
      <span>{count}</span>
    </button>
  );
}
