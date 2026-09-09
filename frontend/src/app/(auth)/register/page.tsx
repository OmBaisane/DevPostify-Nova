"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { UserPlus, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { user, register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authenticated hone par direct redirect
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "username" ? value.toLowerCase().trim() : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side quick validations
    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(formData);
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create account. Please try again.");
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
          <h1 className="text-xl font-semibold text-slate-100">
            Create your account
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Join the developer-first identity platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Linus Torvalds"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full input-surface px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="torvalds"
              value={formData.username}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full input-surface px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition lowercase"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="linus@example.com"
              value={formData.email}
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
              autoComplete="new-password"
              required
              placeholder="At least 6 characters"
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
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
