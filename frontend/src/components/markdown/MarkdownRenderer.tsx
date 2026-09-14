"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <div className="w-full text-slate-300 font-sans leading-relaxed wrap-break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white border-b border-slate-800/80 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 mb-3 font-heading text-xl sm:text-2xl font-semibold tracking-tight text-slate-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 mb-2 font-heading text-lg sm:text-xl font-semibold text-slate-200">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-3 leading-7 text-slate-300">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc pl-6 space-y-1.5 text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal pl-6 space-y-1.5 text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-blue-500 bg-slate-900/50 py-2 pl-4 pr-3 italic text-slate-400 rounded-r-xl">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline decoration-blue-500/40 underline-offset-4 transition-colors hover:text-blue-300"
            >
              {children}
            </a>
          ),
          code({ className, children, ...props }) {
            const isInline =
              !className &&
              typeof children === "string" &&
              !children.includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded-md bg-slate-800/90 px-1.5 py-0.5 font-mono text-xs sm:text-sm text-violet-300 border border-slate-700/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const codeText = String(children).replace(/\n$/, "");
            const language = className?.replace(/language-/, "") || "text";

            return <CodeBlock code={codeText} language={language} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; language: string }> = ({
  code,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative my-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg">
      <div className="flex h-9 items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed text-slate-200">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
