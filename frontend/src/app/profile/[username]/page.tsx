"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Calendar,
  FileText,
  Globe,
  Edit3,
  Layers,
  Sparkles,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/common/SocialIcons";
import { api, ApiError } from "@/lib/api";
import { User } from "@/types/auth";
import { Post } from "@/types/post";
import PostCard from "@/components/posts/PostCard";
import EditProfileModal from "@/components/profile/EditProfileModal";

interface ProfileResponseData {
  user: User;
  posts: Post[];
  postsCount: number;
  isOwner: boolean;
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [profileData, setProfileData] = useState<ProfileResponseData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<ProfileResponseData>(`/profile/${username}`);
      if (res.data) {
        setProfileData(res.data);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load developer profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="card-surface h-64 mb-8 bg-slate-900/40 rounded-2xl border border-slate-800" />
        <div className="space-y-4">
          <div className="h-32 bg-slate-900/40 rounded-2xl border border-slate-800" />
          <div className="h-32 bg-slate-900/40 rounded-2xl border border-slate-800" />
        </div>
      </main>
    );
  }

  if (error || !profileData) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="card-surface p-8 border border-slate-800 bg-slate-900/60 rounded-2xl max-w-md mx-auto">
          <h1 className="text-xl font-bold text-slate-100 mb-2">
            Developer Not Found
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            {error ||
              "The developer profile you are looking for does not exist."}
          </p>
          <Link href="/" className="btn-primary px-4 py-2 text-xs font-medium">
            Back to Feed
          </Link>
        </div>
      </main>
    );
  }

  const { user, posts, postsCount, isOwner } = profileData;
  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Developer Hero Card */}
      <section className="card-surface p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80 mb-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl border border-slate-700 bg-slate-800 flex items-center justify-center text-2xl font-bold text-blue-400 overflow-hidden shrink-0 shadow-lg">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-100">
                  {user.name}
                </h1>
                <span className="text-xs text-slate-400 font-mono">
                  @{user.username}
                </span>
              </div>

              {user.bio ? (
                <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                  {user.bio}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic mt-1">
                  Developer on DevPostify.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-400 font-mono">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Joined {formattedDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  {postsCount} {postsCount === 1 ? "Post" : "Posts"}
                </span>
              </div>
            </div>
          </div>

          {/* Owner Edit Action & Social Links */}
          <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
            {isOwner && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="btn-primary px-4 py-2 text-xs font-medium inline-flex items-center gap-2 w-full sm:w-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            )}

            <div className="flex items-center gap-2">
              {user.socials?.github && (
                <a
                  href={user.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {user.socials?.linkedin && (
                <a
                  href={user.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {user.socials?.website && (
                <a
                  href={user.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Portfolio Website"
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specialties & Skills Showcase */}
        {((user.specialties && user.specialties.length > 0) ||
          (user.skills && user.skills.length > 0)) && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
            {user.specialties && user.specialties.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 font-mono uppercase tracking-wider mr-1">
                  <Sparkles className="w-3 h-3" /> Specialties:
                </span>
                {user.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[11px] font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}

            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 font-mono uppercase tracking-wider mr-1">
                  <Layers className="w-3 h-3" /> Tech Stack:
                </span>
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-[11px] font-mono"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Publications / Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100">
            {isOwner ? "Your Publications" : `Articles by ${user.name}`}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="card-surface p-10 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs text-slate-400">
              No technical posts published yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchProfile}
      />
    </main>
  );
}
