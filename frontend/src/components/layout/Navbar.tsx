"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  PenSquare,
  Bookmark,
  LogOut,
  User as UserIcon,
  Search,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/devpostify-mark.svg"
            alt="DevPostify"
            width={30}
            height={30}
            priority
          />
          <span className="font-heading text-xl font-bold tracking-tight brand-gradient-text">
            DevPostify
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Discovery Search Link */}
          <Link
            href="/search"
            className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Search Insights"
          >
            <Search className="h-4 w-4" />
          </Link>

          {user ? (
            <>
              <Link
                href="/create"
                className="hidden sm:inline-flex items-center gap-1.5 btn-primary px-3.5 py-1.5 text-xs font-medium shadow-md shadow-blue-600/20 hover:opacity-95"
              >
                <PenSquare className="h-3.5 w-3.5" />
                Write Post
              </Link>

              <Link
                href="/bookmarks"
                className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 transition"
                title="Saved Bookmarks"
              >
                <Bookmark className="h-4 w-4" />
              </Link>

              <Link
                href={`/profile/${user.username}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 transition"
              >
                <UserIcon className="h-3.5 w-3.5 text-blue-400" />
                <span>{user.username}</span>
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-red-400 hover:border-slate-700 transition"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 transition"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn-primary px-3.5 py-1.5 text-xs font-medium shadow-md shadow-blue-600/20 hover:opacity-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
