"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowDown, PenTool, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HomeHeroProps {
  onExploreClick?: () => void;
}

export default function HomeHero({ onExploreClick }: HomeHeroProps) {
  const { user } = useAuth();

  const handleScrollToFeed = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const feedElement = document.getElementById("articles-feed");
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Hero Introduction"
      className="relative overflow-hidden mb-12 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 sm:p-10 md:p-12 shadow-2xl"
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 mb-6 text-[11px] font-mono uppercase tracking-wider font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Developer-First Engineering Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-[1.15] mb-4">
          Where Developers{" "}
          <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
            Build Their Identity.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mb-8">
          Publish technical knowledge, showcase your expertise, and discover
          engineering insights built for developers.
        </p>

        {/* Action CTAs */}
        <div className="flex items-center flex-wrap gap-3.5 mb-10">
          <button
            type="button"
            onClick={handleScrollToFeed}
            className="btn-primary px-5 py-2.5 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
          >
            <span>Explore Insights</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          {user ? (
            <Link
              href="/create"
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white inline-flex items-center gap-2 transition"
            >
              <PenTool className="w-4 h-4 text-blue-400" />
              <span>Write an Article</span>
            </Link>
          ) : (
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white inline-flex items-center gap-2 transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </Link>
          )}
        </div>

        {/* Capability Strip */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="flex items-center flex-wrap gap-y-2 gap-x-4 text-[11px] sm:text-xs font-mono text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Technical Publishing
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Developer Profiles
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Engineering Discussions
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
