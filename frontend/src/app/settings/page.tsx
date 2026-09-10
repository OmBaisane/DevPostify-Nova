"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Moon,
  Shield,
  LogOut,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to feed
          </Link>
        </div>

        <div className="mb-8 border-b border-slate-800/80 pb-6">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Account Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your developer preferences, security credentials, and active
            session.
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance / Theme Settings */}
          <div className="card-surface p-6">
            <h2 className="font-heading text-base font-semibold text-slate-200 mb-1">
              Interface Appearance
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              DevPostify Nova is crafted with a locked developer-first dark
              palette for optimal syntax contrast and eye comfort.
            </p>

            <div className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-xs font-medium text-blue-400 shadow-inner">
              <Moon className="h-4 w-4" />
              <span>Developer Dark Mode</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 ml-1" />
            </div>
          </div>

          {/* Account Credentials Card */}
          <div className="card-surface p-6">
            <h2 className="font-heading text-base font-semibold text-slate-200 mb-1">
              Account Credentials
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Core identity identifiers registered with DevPostify Nova.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-1">
                <span className="text-slate-500">Username</span>
                <span className="text-slate-200">@{user?.username}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-1">
                <span className="text-slate-500">Registered Email</span>
                <span className="text-slate-200">{user?.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-1">
                <span className="text-slate-500">Security</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                  <Shield className="h-3 w-3" /> HTTP-Only Secure JWT
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/60">
              <Link
                href={`/profile/${user?.username}`}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
              >
                <span>View & edit public profile information</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Danger / Session Zone */}
          <div className="card-surface p-6 border-red-500/20">
            <h2 className="font-heading text-base font-semibold text-red-400 mb-1">
              Session Management
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Terminate your current authenticated browser session.
            </p>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out of DevPostify</span>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
