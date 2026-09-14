import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-10 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/brand/devpostify-mark.svg"
            alt="DevPostify"
            width={24}
            height={24}
          />
          <span className="font-heading text-sm font-bold tracking-tight text-slate-200">
            DevPostify Nova
          </span>
          <span className="text-xs text-slate-500">
            — Where Developers Build Their Identity.
          </span>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex items-center gap-6 text-xs text-slate-400"
        >
          <Link href="/" className="hover:text-slate-200 transition">
            Explore
          </Link>
          <Link href="/search" className="hover:text-slate-200 transition">
            Search
          </Link>
          <a
            href="https://github.com/OmBaisane/DevPostify-Nova"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition"
          >
            GitHub
          </a>
        </nav>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} DevPostify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
