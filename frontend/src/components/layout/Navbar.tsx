"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  PenSquare,
  Bookmark,
  LogOut,
  User as UserIcon,
  Search,
  Settings,
  Menu,
  X,
  Compass,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Mobile Hamburger + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/brand/devpostify-mark.svg"
                alt="DevPostify"
                width={28}
                height={28}
                priority
              />
              <span className="font-heading text-xl font-bold tracking-tight brand-gradient-text">
                DevPostify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-2.5"
          >
            <Link
              href="/search"
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Search Insights"
              aria-label="Search Insights"
            >
              <Search className="h-4 w-4" />
            </Link>

            {user ? (
              <>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 btn-primary px-3.5 py-1.5 text-xs font-medium shadow-md shadow-blue-600/20 hover:opacity-95"
                >
                  <PenSquare className="h-3.5 w-3.5" />
                  Write Post
                </Link>

                <Link
                  href="/bookmarks"
                  className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 transition"
                  title="Saved Bookmarks"
                  aria-label="Saved Bookmarks"
                >
                  <Bookmark className="h-4 w-4" />
                </Link>

                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 transition"
                  title="Account Settings"
                  aria-label="Account Settings"
                >
                  <Settings className="h-4 w-4" />
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
                  aria-label="Log out"
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
          </nav>

          {/* Mobile Right Quick Search */}
          <div className="flex md:hidden items-center">
            <Link
              href="/search"
              aria-label="Search"
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition"
            >
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Solid Left-Side Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Dark Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Box */}
        <aside
          className={`absolute inset-y-0 left-0 flex h-full w-70 max-w-[85vw] flex-col border-r border-slate-800 bg-slate-950 p-5 shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Image
                src="/brand/devpostify-mark.svg"
                alt="DevPostify"
                width={24}
                height={24}
              />
              <span className="font-heading text-lg font-bold brand-gradient-text">
                DevPostify
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 flex-1 overflow-y-auto space-y-2">
            {user ? (
              <>
                {/* Profile Card */}
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3 transition hover:border-slate-700"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white">
                      {user.name || user.username}
                    </div>
                    <div className="truncate text-xs text-slate-400">
                      @{user.username}
                    </div>
                  </div>
                </Link>

                {/* Write Post Button */}
                <Link
                  href="/create"
                  className="flex items-center justify-center gap-2 btn-primary w-full py-2.5 text-sm font-medium shadow-md shadow-blue-600/20 my-4!"
                >
                  <PenSquare className="h-4 w-4" />
                  Write Post
                </Link>

                <div className="space-y-1">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
                  >
                    <Compass className="h-4 w-4 text-blue-400" />
                    <span>Explore Feed</span>
                  </Link>

                  <Link
                    href="/bookmarks"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
                  >
                    <Bookmark className="h-4 w-4 text-violet-400" />
                    <span>Saved Bookmarks</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>Account Settings</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
                >
                  <Compass className="h-4 w-4 text-blue-400" />
                  <span>Explore Feed</span>
                </Link>

                <div className="my-2 border-t border-slate-800" />

                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center btn-primary py-2.5 text-sm font-medium shadow-md shadow-blue-600/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Bottom Sign Out */}
          {user && (
            <div className="border-t border-slate-800/80 pt-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
