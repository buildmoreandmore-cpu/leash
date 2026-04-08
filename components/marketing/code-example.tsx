"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface CodeExampleProps {
  code: string;
  language: string;
  filename: string;
}

/**
 * Tokenize a line of TypeScript-ish code into colored spans.
 * This is a lightweight manual highlighter — no external dep.
 */
function highlightLine(line: string) {
  const tokens: { text: string; className: string }[] = [];

  // Regex order matters — first match wins
  const rules: [RegExp, string][] = [
    // Comments
    [/^(\/\/.*)/, "text-slate-500"],
    // Strings (double, single, backtick)
    [/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, "text-emerald-400"],
    // Keywords
    [
      /\b(import|from|export|default|const|let|var|function|return|async|await|new|if|else|true|false|null|undefined|typeof|type|interface)\b/,
      "text-blue-400",
    ],
    // Types / capitalised identifiers
    [/\b([A-Z][A-Za-z0-9_]*)\b/, "text-amber-300"],
    // Properties after dot or object keys before colon
    [/([a-zA-Z_]\w*)(?=\s*:)/, "text-cyan-300"],
    // Numbers
    [/\b(\d+)\b/, "text-amber-300"],
    // Punctuation
    [/([{}()[\];,.:=<>+\-*/?&|!@#$%^~]+)/, "text-slate-400"],
    // Identifiers (default)
    [/([a-zA-Z_]\w*)/, "text-slate-200"],
    // Whitespace
    [/(\s+)/, ""],
  ];

  let remaining = line;
  let safety = 0;

  while (remaining.length > 0 && safety < 500) {
    safety++;
    let matched = false;

    for (const [regex, cls] of rules) {
      const m = remaining.match(regex);
      if (m && m.index === 0) {
        tokens.push({ text: m[0], className: cls });
        remaining = remaining.slice(m[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Consume one char as plain text
      tokens.push({ text: remaining[0], className: "text-slate-200" });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

export function CodeExample({ code, language, filename }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);

  const lines = code.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-700 bg-[#1e293b] shadow-lg">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-slate-600 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* macOS dots */}
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-slate-400">{filename}</span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-300"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-relaxed">
          <code>
            {lines.map((line, lineIdx) => (
              <div key={lineIdx} className="flex">
                <span className="mr-6 inline-block w-6 select-none text-right text-slate-500">
                  {lineIdx + 1}
                </span>
                <span>
                  {highlightLine(line).map((token, tokenIdx) => (
                    <span key={tokenIdx} className={token.className}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
