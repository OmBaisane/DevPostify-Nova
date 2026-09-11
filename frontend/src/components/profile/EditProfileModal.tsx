"use client";

import React, { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { X, Loader2, AlertCircle } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  initialBio: string;
  onProfileUpdated: (updatedName: string, updatedBio: string) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialName,
  initialBio,
  onProfileUpdated,
}: EditProfileModalProps) {
  const { refreshUser } = useAuth();
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.patch("/profile", {
        name: name.trim(),
        bio: bio.trim(),
      });

      toast("Profile updated successfully", "success");
      await refreshUser();
      onProfileUpdated(name.trim(), bio.trim());
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg card-surface p-6 sm:p-8 shadow-2xl relative border border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-100">
              Edit Developer Profile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your public display identity and bio.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-850 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Display Name
            </label>
            <input
              id="name"
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full input-surface px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="bio"
                className="block text-xs font-medium text-slate-300"
              >
                Bio
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {bio.length}/500
              </span>
            </div>
            <textarea
              id="bio"
              rows={4}
              maxLength={500}
              placeholder="Full-stack engineer interested in distributed systems, compilers, and cloud-native architecture..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSubmitting}
              className="w-full input-surface p-3 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-5 py-2 text-xs font-medium shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
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
  );
}
