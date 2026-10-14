"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Heart,
  MessageSquare,
  CheckCheck,
  Clock,
  Loader2,
  Inbox,
  ArrowRight,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface NotificationItem {
  _id: string;
  sender: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
  } | null;
  type: "reaction" | "comment";
  post?: {
    _id: string;
    title: string;
  } | null;
  comment?: {
    _id: string;
    content: string;
  } | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponseData {
  notifications: NotificationItem[];
  total: number;
}

function formatNotificationTime(dateStr: string) {
  const past = new Date(dateStr).getTime();
  const diff = Date.now() - past;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const res = await api.get<NotificationsResponseData>("/notifications");
        if (isMounted && res.data) {
          setNotifications(res.data.notifications || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof ApiError
              ? err.message
              : "Failed to load notifications";
          toast(msg, "error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleMarkAsRead = async (id: string, redirectUrl?: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch {
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  };

  const handleMarkAllRead = async () => {
    if (notifications.every((n) => n.isRead)) return;

    try {
      setMarkingAll(true);
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast("All notifications marked as read", "success");
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to mark all as read";
      toast(msg, "error");
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {unreadCount} unread
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Technical discussions and community interactions on your
                articles.
              </p>
            </div>
          </div>

          {notifications.length > 0 && unreadCount > 0 && (
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
              <span>Mark all read</span>
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
              Zero Unread Activity
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-5">
              When developers interact with your technical publications,
              discussions will show up here.
            </p>
            <Link
              href="/"
              className="btn-primary px-4 py-2 text-xs font-medium inline-block"
            >
              Explore Feed
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => {
              const targetPostId = item.post?._id;
              const redirectUrl = targetPostId
                ? `/posts/${targetPostId}`
                : undefined;

              return (
                <div
                  key={item._id}
                  onClick={() => handleMarkAsRead(item._id, redirectUrl)}
                  className={`p-4 sm:p-5 rounded-2xl border transition flex items-start justify-between gap-4 cursor-pointer ${
                    item.isRead
                      ? "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100"
                      : "bg-slate-900/70 border-blue-500/30 hover:border-blue-500/50 shadow-md shadow-blue-950/20"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        item.type === "reaction"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {item.type === "reaction" ? (
                        <Heart className="w-4 h-4 fill-current" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.sender ? (
                          <span className="text-xs font-bold text-slate-200 hover:text-blue-400 transition">
                            {item.sender.name || item.sender.username}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            A developer
                          </span>
                        )}

                        <span className="text-xs text-slate-400">
                          {item.type === "reaction"
                            ? "liked your article"
                            : "commented on your article"}
                        </span>
                      </div>

                      {item.post ? (
                        <p className="text-xs font-medium text-slate-300 mt-1 truncate max-w-xl">
                          &quot;{item.post.title}&quot;
                        </p>
                      ) : (
                        <p className="text-xs italic text-slate-500 mt-1">
                          (Archived article)
                        </p>
                      )}

                      {item.type === "comment" && item.comment?.content && (
                        <p className="text-[11px] text-slate-400 font-mono mt-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 line-clamp-2">
                          &ldquo;{item.comment.content}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatNotificationTime(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                    {redirectUrl && (
                      <ArrowRight className="w-4 h-4 text-slate-600 hover:text-slate-300 transition" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
