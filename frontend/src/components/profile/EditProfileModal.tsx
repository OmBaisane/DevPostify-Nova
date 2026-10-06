"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Loader2, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/common/SocialIcons";
import { User } from "@/types/auth";
import { api, ApiError } from "@/lib/api";
import { uploadImageDirect } from "@/lib/upload";
import { useToast } from "@/context/ToastContext";

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [skillsInput, setSkillsInput] = useState(
    (user.skills || []).join(", "),
  );
  const [specialtiesInput, setSpecialtiesInput] = useState(
    (user.specialties || []).join(", "),
  );
  const [github, setGithub] = useState(user.socials?.github || "");
  const [linkedin, setLinkedin] = useState(user.socials?.linkedin || "");
  const [website, setWebsite] = useState(user.socials?.website || "");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      setError(null);
      const uploadedUrl = await uploadImageDirect(file, "devpostify/avatars");
      setAvatar(uploadedUrl);
      toast("Avatar uploaded successfully", "success");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to upload avatar";
      setError(msg);
      toast(msg, "error");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 15);

    const specialtiesArray = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 5);

    try {
      await api.patch("/profile", {
        name: name.trim(),
        bio: bio.trim(),
        avatar: avatar.trim(),
        skills: skillsArray,
        specialties: specialtiesArray,
        socials: {
          github: github.trim(),
          linkedin: linkedin.trim(),
          website: website.trim(),
        },
      });

      toast("Profile updated successfully", "success");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="card-surface w-full max-w-xl my-8 p-6 border border-slate-800 bg-slate-900/95 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2
          id="edit-profile-title"
          className="text-xl font-bold text-slate-100 mb-1"
        >
          Edit Developer Profile
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Showcase your technical identity, skills, and links to the community.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Avatar Upload Block */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Profile Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                  id="avatar-file-input"
                />
                <label
                  htmlFor="avatar-file-input"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-200 hover:border-slate-600 hover:text-white cursor-pointer transition"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  {uploadingAvatar ? "Uploading..." : "Upload New Avatar"}
                </label>
                <p className="text-[11px] text-slate-500 mt-1">
                  JPG, PNG, or WebP. Max 2MB. Direct CDN upload.
                </p>
              </div>
            </div>
          </div>

          {/* Name & Bio */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label
                htmlFor="name-input"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Display Name
              </label>
              <input
                id="name-input"
                type="text"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-surface w-full px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label
                htmlFor="bio-input"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Bio ({bio.length}/300)
              </label>
              <textarea
                id="bio-input"
                rows={3}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Software engineer focused on distributed systems, TypeScript, and modern web architectures..."
                className="input-surface w-full px-3 py-2 text-xs resize-none"
              />
            </div>
          </div>

          {/* Technical Skills & Specialties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="skills-input"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Core Skills (comma-separated)
              </label>
              <input
                id="skills-input"
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="TypeScript, React, Go, Docker"
                className="input-surface w-full px-3 py-2 text-xs"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Up to 15 technologies
              </p>
            </div>

            <div>
              <label
                htmlFor="specialties-input"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Specialties (comma-separated)
              </label>
              <input
                id="specialties-input"
                type="text"
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                placeholder="Microservices, API Design"
                className="input-surface w-full px-3 py-2 text-xs"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Up to 5 focus domains
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="block text-xs font-semibold text-slate-300">
              Professional Links
            </span>

            <div className="relative">
              <div className="absolute left-3 top-2.5 text-slate-400">
                <GithubIcon className="w-3.5 h-3.5" />
              </div>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="input-surface w-full pl-9 pr-3 py-2 text-xs"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-2.5 text-slate-400">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </div>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="input-surface w-full pl-9 pr-3 py-2 text-xs"
              />
            </div>

            <div className="relative">
              <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="input-surface w-full pl-9 pr-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingAvatar}
              className="btn-primary px-5 py-2 text-xs font-semibold disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
