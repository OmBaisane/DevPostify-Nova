"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import Prism from "prismjs";

// Common developer language grammars
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-sql";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    const lang = language.toLowerCase();
    if (Prism.languages[lang]) {
      try {
        setHighlightedCode(Prism.highlight(code, Prism.languages[lang], lang));
      } catch {
        setHighlightedCode("");
      }
    } else {
      setHighlightedCode("");
    }
  }, [code, language]);

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
    <div className="group relative my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 text-slate-400">
        <span className="text-[11px] font-medium tracking-wider uppercase text-blue-400">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy snippet"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-300 hover:border-slate-700 hover:text-white transition"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-4 leading-relaxed">
        {highlightedCode ? (
          <pre className="m-0 bg-transparent p-0 text-slate-200">
            <code
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        ) : (
          <pre className="m-0 bg-transparent p-0 text-slate-200">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`text-slate-300 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded-md border border-slate-800 bg-slate-900/80 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : "text"}
                code={String(children).replace(/\n$/, "")}
              />
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
