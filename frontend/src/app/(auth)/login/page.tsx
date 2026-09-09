"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { LogIn, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already authenticated hone par direct feed par redirect
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.emailOrUsername.trim() || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formData);
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to login. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md card-surface p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <Image
              src="/brand/devpostify-mark.svg"
              alt="DevPostify Logo"
              width={36}
              height={36}
              priority
            />
            <span className="font-heading font-bold text-2xl tracking-tight brand-gradient-text">
              DevPostify
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-slate-100">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to continue building your developer identity
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              autoComplete="username"
              required
              placeholder="developer@example.com or octocat"
              value={formData.emailOrUsername}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full input-surface px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full input-surface px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-2.5 text-sm font-medium mt-2 shadow-lg shadow-blue-600/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:text-blue-300 font-medium transition"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
