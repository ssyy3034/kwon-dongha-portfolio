"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily: "Inter, sans-serif",
});

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute("data-processed");
      // Use mermaid.run to process specific nodes after hydration
      try {
        mermaid.run({
          nodes: [ref.current],
        });
      } catch (err) {
        console.error("Mermaid rendering error:", err);
      }
    }
  }, [chart]);

  return (
    <div
      className="mermaid flex justify-center my-12 p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-700/60 shadow-sm overflow-hidden"
      ref={ref}
      suppressHydrationWarning
    >
      {chart}
    </div>
  );
}
