import React from "react";

/**
 * Renders text with simple markdown formatting.
 * Supports:
 * - **bold** -> <strong>bold</strong>
 * - `code` -> <code>code</code>
 */
export default function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-stone-900 dark:text-stone-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-sm font-medium text-stone-800 dark:text-stone-200 font-mono"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
