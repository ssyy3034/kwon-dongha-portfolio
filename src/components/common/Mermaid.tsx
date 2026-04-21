"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily: "Inter, sans-serif",
  themeVariables: {
    fontSize: "16px",
  },
  sequence: {
    actorMargin: 70,
    messageMargin: 45,
    boxMargin: 10,
    noteMargin: 12,
    useMaxWidth: true,
  },
  flowchart: {
    nodeSpacing: 55,
    rankSpacing: 60,
    useMaxWidth: true,
    htmlLabels: true,
  },
});

interface MermaidProps {
  chart: string;
  className?: string;
}

export default function Mermaid({ chart, className }: MermaidProps) {
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
      className={`mermaid ${className || ""}`}
      ref={ref}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      suppressHydrationWarning
    >
      {!svg ? chart : undefined}
    </div>
  );
}
