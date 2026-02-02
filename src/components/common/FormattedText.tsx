import React from "react";

/**
 * Renders text with simple markdown formatting.
 * Supports:
 * - **bold** -> <strong>bold</strong>
 * - `code` -> <code>code</code>
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function FormattedText({
  text,
  noDark = false,
}: {
  text: string;
  noDark?: boolean;
}) {
  if (!text) return null;
  if (typeof text !== "string") {
    console.error("FormattedText received invalid input:", text);
    return <span>{JSON.stringify(text)}</span>;
  }

  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={i}
              className={`font-bold ${
                noDark ? "text-inherit" : "text-stone-900 dark:text-stone-100"
              }`}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className={`px-1 py-0.5 rounded text-sm font-medium font-mono ${
                noDark
                  ? "bg-stone-100 text-stone-800"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              }`}
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
