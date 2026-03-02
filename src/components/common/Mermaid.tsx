"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;

    mermaid.render(id, chart).then(({ svg: rendered }) => {
      if (!cancelled) setSvg(rendered);
    }).catch((err) => {
      console.error("Mermaid rendering error:", err);
    });

    return () => { cancelled = true; };
  }, [chart]);

  return (
    <div
      className="mermaid flex justify-center my-12 p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-700/60 shadow-sm overflow-hidden"
      ref={ref}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      suppressHydrationWarning
    >
      {!svg ? chart : undefined}
    </div>
  );
}
