import React from "react";

/**
 * Renders text with simple markdown formatting.
 * Supports:
 * - **bold** -> <strong>bold</strong>
 * - `code` -> <code>code</code>
 * - \n -> line breaks (first line becomes headline, rest are body)
 * - Lines starting with "- " -> bullet points
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

  // If no newlines, render as simple inline text
  if (!text.includes("\n")) {
    return <span>{renderInline(text, noDark)}</span>;
  }

  // Split into lines and categorize
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  const result: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      result.push(
        <ul
          key={`ul-${result.length}`}
          className="mt-1.5 space-y-1 text-[13px] sm:text-[14px] print:text-[11px]"
        >
          {bulletBuffer.map((item, i) => (
            <li key={i} className="flex gap-1.5 leading-[1.7]">
              <span className="text-stone-400 dark:text-stone-500 select-none shrink-0 print:text-stone-500">
                •
              </span>
              <span>{renderInline(item, noDark)}</span>
            </li>
          ))}
        </ul>
      );
      bulletBuffer = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("- ")) {
      bulletBuffer.push(line.slice(2));
    } else {
      flushBullets();
      result.push(
        <span key={`p-${result.length}`} className="block">
          {renderInline(line, noDark)}
        </span>
      );
    }
  }
  flushBullets();

  return <>{result}</>;
}

function renderInline(text: string, noDark: boolean): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
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
  });
}
