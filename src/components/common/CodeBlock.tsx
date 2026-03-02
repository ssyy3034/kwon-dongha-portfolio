"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CSSProperties } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

function parseHeader(code: string) {
  const firstLine = code.split("\n")[0];
  const match = firstLine.match(
    /^\/\/\s*(.+\.(?:java|tsx?|jsx?|py))\s*[—–-]\s*(.+)/,
  );
  if (!match) return null;
  return { filename: match[1], description: match[2] };
}

function detectLanguage(code: string): string {
  const firstLine = code.split("\n")[0].toLowerCase();
  if (firstLine.includes(".java")) return "java";
  if (firstLine.includes(".tsx")) return "tsx";
  if (firstLine.includes(".ts")) return "typescript";
  if (firstLine.includes(".py")) return "python";
  return "typescript";
}

function getHighlightedLines(code: string): Set<number> {
  const lines = code.split("\n");
  const highlighted = new Set<number>();
  lines.forEach((line, i) => {
    if (line.includes("// ←") || line.includes("// ➜")) {
      highlighted.add(i + 1);
    }
  });
  return highlighted;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const header = parseHeader(code);
  const lang = language || detectLanguage(code);

  const displayCode = header
    ? code
        .split("\n")
        .slice(1)
        .join("\n")
        .replace(/^\n/, "")
    : code;

  const highlighted = getHighlightedLines(displayCode);

  const lineProps = (lineNumber: number): { style: CSSProperties } => {
    const isHL = highlighted.has(lineNumber);
    return {
      style: {
        display: "block",
        backgroundColor: isHL ? "rgba(251, 191, 36, 0.10)" : "transparent",
        borderLeft: isHL
          ? "3px solid rgba(251, 191, 36, 0.70)"
          : "3px solid transparent",
        marginLeft: "-1.25rem",
        paddingLeft: "calc(1.25rem - 3px)",
        marginRight: "-1.25rem",
        paddingRight: "1.25rem",
      },
    };
  };

  return (
    <div className="mt-5 sm:mt-6 rounded-lg sm:rounded-xl overflow-hidden border border-stone-800 dark:border-stone-700/50 print:border-stone-300">
      {header && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1e32] border-b border-stone-700/30 print:bg-stone-100 print:border-stone-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="ml-2 text-[11px] sm:text-xs font-mono font-semibold text-amber-400/90 print:text-amber-700">
            {header.filename}
          </span>
          <span className="text-[10px] sm:text-[11px] text-stone-500 print:text-stone-500">
            {header.description}
          </span>
        </div>
      )}
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem 1.25rem",
          fontSize: "0.72rem",
          lineHeight: "1.7",
          background: "#16162a",
          borderRadius: 0,
        }}
        showLineNumbers={false}
        wrapLines={true}
        lineProps={lineProps}
      >
        {displayCode}
      </SyntaxHighlighter>
    </div>
  );
}
