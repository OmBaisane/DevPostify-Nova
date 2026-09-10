"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { ProfileResponseData, ProfileUser } from "@/types/profile";
import { Post } from "@/types/post";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/posts/PostCard";
import PostSkeleton from "@/components/posts/PostSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import EditProfileModal from "@/components/profile/EditProfileModal";
import {
  Calendar,
  PenTool,
  ArrowLeft,
  Settings,
  AlertCircle,
  FileCode2,
} from "lucide-react";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<ProfileResponseData>(`/profile/${username}`);
        const userData = res.data?.profile || res.data?.user;
        if (userData) {
          setProfileUser(userData);
          setPosts(res.data?.posts || []);
        } else {
          setError("User not found");
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load user profile.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  const isOwner =
    currentUser && profileUser && currentUser.username === profileUser.username;

  const handleProfileUpdated = (updatedName: string, updatedBio: string) => {
    if (profileUser) {
      setProfileUser({
        ...profileUser,
        name: updatedName,
        bio: updatedBio,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="card-surface p-8 mb-8 animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-slate-800" />
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-slate-800" />
              <div className="h-3 w-24 rounded bg-slate-850" />
            </div>
          </div>
          <div className="h-4 w-3/4 rounded bg-slate-800" />
        </div>
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="card-surface p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <h2 className="font-heading text-lg font-semibold text-slate-200">
            {error || "User not found"}
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

  const joinDate = new Date(profileUser.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
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

      {/* Profile Header Card */}
      <section className="card-surface p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar Initial */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 text-2xl font-bold font-heading text-white shadow-xl shadow-blue-500/10 border border-white/10">
              {profileUser.name
                ? profileUser.name.charAt(0).toUpperCase()
                : "D"}
            </div>

            <div>
              <h1 className="font-heading text-2xl font-bold text-slate-100">
                {profileUser.name}
              </h1>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                @{profileUser.username}
              </p>

              {profileUser.bio ? (
                <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-xl leading-relaxed">
                  {profileUser.bio}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic mt-3">
                  No bio provided yet.
                </p>
              )}

              {/* Meta stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-mono text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  Joined {joinDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileCode2 className="h-3.5 w-3.5 text-blue-400" />
                  {posts.length} {posts.length === 1 ? "Post" : "Posts"}{" "}
                  published
                </span>
              </div>
            </div>
          </div>

          {/* Action Button for Profile Owner */}
          {isOwner && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-850 transition self-center sm:self-start shrink-0"
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              Edit Profile
            </button>
          )}
        </div>
      </section>

      {/* User's Published Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <h2 className="font-heading text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <PenTool className="h-4 w-4 text-blue-400" />
            Published Articles ({posts.length})
          </h2>
        </div>

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <EmptyState
              title="No posts published yet"
              description={
                isOwner
                  ? "You haven't written any engineering posts yet. Share your first breakthrough!"
                  : `@${profileUser.username} hasn't published any posts yet.`
              }
              actionText={isOwner ? "Write First Post" : undefined}
              actionHref={isOwner ? "/create" : undefined}
            />
          )}
        </div>
      </section>

      {/* Edit Profile Modal */}
      {isOwner && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialName={profileUser.name}
          initialBio={profileUser.bio || ""}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
}
