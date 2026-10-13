"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Settings,
  Globe,
  Loader2,
  FolderCode,
  ArrowLeft,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/common/SocialIcons";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ProfileResponseData, ProfileUser } from "@/types/profile";
import { Post } from "@/types/post";
import PostCard from "@/components/posts/PostCard";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setError(null);
        const res = await api.get<ProfileResponseData>(`/profile/${username}`);
        if (isMounted && res.data) {
          const profileUser = res.data.profile || res.data.user;
          if (profileUser) {
            setProfile(profileUser);
            setPosts(res.data.posts || []);
          } else {
            setError("Profile not found");
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError("Failed to fetch profile");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [username]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="card-surface p-12 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-slate-100 mb-2">
            Developer Not Found
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            The requested profile @{username} does not exist.
          </p>
          <Link
            href="/"
            className="btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Feed</span>
          </Link>
        </div>
      </main>
    );
  }

  const isOwner = currentUser?.username === profile.username;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Bio Card */}
      <section className="card-surface p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/70 mb-8 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl border-2 border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-slate-300">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                {profile.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                @{profile.username}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Joined{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              <Settings className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm text-slate-300 mt-6 leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
        )}

        {/* Social Links */}
        {currentUser?.socials && (
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-800">
            {currentUser.socials.github && (
              <a
                href={currentUser.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {currentUser.socials.linkedin && (
              <a
                href={currentUser.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {currentUser.socials.website && (
              <a
                href={currentUser.socials.website}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
                aria-label="Personal Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </section>

      {/* Publications Stream */}
      <section>
        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <FolderCode className="w-4 h-4 text-blue-400" />
          <span>Technical Articles ({posts.length})</span>
        </h2>

        {posts.length === 0 ? (
          <div className="card-surface p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs text-slate-400">
              This engineer hasn&apos;t published any technical articles yet.
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

      {/* Edit Modal for Owner */}
      {isOwner && currentUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={currentUser}
          onSuccess={() => {
            // Re-fetch profile
            api
              .get<ProfileResponseData>(`/profile/${username}`)
              .then((res) => {
                if (res.data?.profile || res.data?.user) {
                  setProfile(res.data.profile || res.data.user || null);
                }
              })
              .catch(() => null);
          }}
        />
      )}
    </main>
  );
}
