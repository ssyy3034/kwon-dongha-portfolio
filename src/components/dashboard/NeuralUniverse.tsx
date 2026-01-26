"use client";

import dynamic from "next/dynamic";
import { Globe, GitCommit, Zap } from "lucide-react";
import { useMemo } from "react";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
          Booting_Neural_Core...
        </span>
      </div>
    </div>
  ),
});

// Vibrant color palette for node groups (following skill.md: bold, unexpected)
const GROUP_COLORS: Record<string, string> = {
  Frontend: "#FF6B6B", // Coral Red
  Backend: "#4ECDC4", // Teal
  CS: "#FFE66D", // Electric Yellow
  Algorithm: "#95E1D3", // Mint
  AI: "#A855F7", // Purple
  Consistency: "#F59E0B", // Amber
  Uncategorized: "#6B7280", // Slate
  default: "#818CF8", // Indigo fallback
};

// Fallback data when nodes are empty
const FALLBACK_NODES = [
  { id: "frontend-core", name: "Frontend Core", group: "Frontend", val: 5 },
  { id: "react-patterns", name: "React Patterns", group: "Frontend", val: 4 },
  { id: "typescript", name: "TypeScript", group: "Frontend", val: 6 },
  { id: "cs-fundamentals", name: "CS Fundamentals", group: "CS", val: 5 },
  {
    id: "data-structures",
    name: "Data Structures",
    group: "Algorithm",
    val: 4,
  },
  { id: "system-design", name: "System Design", group: "Backend", val: 3 },
  { id: "node-api", name: "Node.js API", group: "Backend", val: 4 },
  { id: "ml-basics", name: "ML Basics", group: "AI", val: 3 },
];

const FALLBACK_LINKS = [
  { source: "frontend-core", target: "react-patterns" },
  { source: "react-patterns", target: "typescript" },
  { source: "typescript", target: "cs-fundamentals" },
  { source: "cs-fundamentals", target: "data-structures" },
  { source: "data-structures", target: "system-design" },
  { source: "system-design", target: "node-api" },
  { source: "cs-fundamentals", target: "ml-basics" },
  { source: "frontend-core", target: "cs-fundamentals" },
];

interface NeuralUniverseProps {
  nodes: any[];
  links: any[];
  mounted: boolean;
}

export default function NeuralUniverse({
  nodes,
  links,
  mounted,
}: NeuralUniverseProps) {
  // Use fallback data if nodes are empty
  const graphData = useMemo(() => {
    const hasData = nodes && nodes.length > 0;
    return {
      nodes: hasData ? nodes : FALLBACK_NODES,
      links: hasData ? links : FALLBACK_LINKS,
    };
  }, [nodes, links]);

  const getNodeColor = (node: any) => {
    return GROUP_COLORS[node.group] || GROUP_COLORS.default;
  };

  return (
    <section className="bg-zinc-950 rounded-[40px] overflow-hidden shadow-2xl relative h-[500px] group border border-zinc-800/50">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center group-hover:border-emerald-500/50 transition-colors duration-500">
            <Globe size={18} className="text-emerald-400" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 block">
              Knowledge Topology
            </span>
            <span className="text-xs font-bold text-white">
              Neural Universe
            </span>
          </div>
        </div>
      </div>

      <div className="h-full w-full">
        {mounted && (
          <ForceGraph3D
            graphData={graphData}
            nodeLabel="name"
            nodeColor={getNodeColor}
            nodeVal={(n) => (n.val || 1) * 2}
            nodeOpacity={0.95}
            nodeResolution={16}
            backgroundColor="rgba(0,0,0,0)"
            linkColor={() => "rgba(129, 140, 248, 0.3)"}
            linkWidth={1.5}
            linkOpacity={0.6}
            showNavInfo={false}
            width={700}
            height={500}
            enableNavigationControls={true}
            enableNodeDrag={true}
          />
        )}
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-zinc-400">
              <span className="text-white">{graphData.nodes.length}</span> Nodes
            </span>
          </div>
          <div className="w-px h-3 bg-zinc-700" />
          <div className="text-[10px] font-bold text-zinc-400">
            <span className="text-white">{graphData.links.length}</span>{" "}
            Connections
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3 pointer-events-none">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
            System Status
          </span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Active
          </span>
        </div>
        <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-900 shadow-inner group-hover:border-indigo-500/50 transition-colors">
          <GitCommit size={16} className="text-zinc-400" />
        </div>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
