"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Heart,
  MessageSquare,
  CheckCheck,
  Loader2,
  Inbox,
  ArrowRight,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import {
  NotificationItem,
  NotificationsResponseData,
} from "@/types/notification";

export default function NotificationsPage() {
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

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get<NotificationsResponseData>("/notifications");
      if (res.data) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to load notifications";
      triggerToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      triggerToast("All notifications marked as read", "success");
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to mark all as read";
      triggerToast(msg, "error");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await api.patch(`/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)),
        );
      } catch {
        // Continue navigation regardless
      }
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <ProtectedRoute>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Activity & Alerts
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Reactions and discussions on your published technical posts.
              </p>
            </div>
          </div>

          {hasUnread && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-slate-900/40 rounded-2xl border border-slate-800" />
            <div className="h-20 bg-slate-900/40 rounded-2xl border border-slate-800" />
            <div className="h-20 bg-slate-900/40 rounded-2xl border border-slate-800" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="card-surface p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h2 className="text-base font-bold text-slate-200">
              All Caught Up
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You do not have any alerts yet. When engineers react to or discuss
              your posts, they will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const isComment = notif.type === "comment";
              const targetUrl = isComment
                ? `/posts/${notif.post?._id}#discussion`
                : `/posts/${notif.post?._id}`;

              return (
                <Link
                  key={notif._id}
                  href={targetUrl}
                  onClick={() => handleNotificationClick(notif)}
                  className={`card-surface p-4 rounded-xl border flex items-center justify-between gap-4 transition group ${
                    notif.isRead
                      ? "border-slate-800/80 bg-slate-900/40 hover:border-slate-700"
                      : "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isComment
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {isComment ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : (
                        <Heart className="w-4 h-4 fill-rose-500/30" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-slate-300 leading-snug">
                        <span className="font-semibold text-slate-100 group-hover:text-blue-400 transition">
                          {notif.sender?.name || "An engineer"}
                        </span>{" "}
                        {isComment
                          ? "commented on your article:"
                          : "found your article insightful:"}{" "}
                        <span className="font-medium text-slate-200">
                          &ldquo;{notif.post?.title || "Technical Post"}&rdquo;
                        </span>
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
