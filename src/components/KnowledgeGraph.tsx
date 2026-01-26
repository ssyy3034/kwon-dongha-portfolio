'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { DashboardData as GraphData, GraphNode } from '@/lib/graph-loader';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'; // POTENTIAL ERROR SOURCE

// Dynamically import ForceGraph3D with no SSR
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => <div className="flex flex-col items-center justify-center h-screen bg-black text-emerald-500 font-mono">
    <div className="text-xl animate-pulse">BOOTING NEURAL LINK...</div>
  </div>
});

interface KnowledgeGraphProps {
  data: GraphData;
}

interface ForceGraphNode extends GraphNode {
  x?: number;
  y?: number;
  z?: number;
}

// 그룹별 색상 맵
const groupColors: Record<string, string> = {
  'CS': '#10b981',
  'Frontend': '#3b82f6',
  'Backend': '#f59e0b',
  'DevOps': '#ef4444',
  'Database': '#8b5cf6',
  'default': '#6b7280',
};

export default function KnowledgeGraph({ data }: KnowledgeGraphProps) {
  const fgRef = useRef<any>(null);
  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);

  // 고유 날짜 목록
  const uniqueDates = useMemo(() => {
    const dates = new Set(data.nodes.map((n) => n.date || '').filter(Boolean));
    return Array.from(dates).sort();
  }, [data.nodes]);

  // 현재 날짜까지의 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!uniqueDates.length) return { nodes: data.nodes, links: data.links };
    const currentDate = uniqueDates[currentDateIndex];
    const filteredNodes = data.nodes.filter(
      (n) => !n.date || n.date <= currentDate
    );
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = data.links.filter(
      (l) => nodeIds.has(l.source as string) && nodeIds.has(l.target as string)
    );
    return { nodes: filteredNodes, links: filteredLinks };
  }, [data, uniqueDates, currentDateIndex]);

  // 인트로 애니메이션
  useEffect(() => {
    if (!isIntroPlaying || !uniqueDates.length) return;
    const interval = setInterval(() => {
      setCurrentDateIndex((prev) => {
        if (prev >= uniqueDates.length - 1) {
          setIsIntroPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isIntroPlaying, uniqueDates.length]);

  const handleNodeClick = (node: any) => {
    const distance = 60;
    const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0);
    fgRef.current?.cameraPosition(
      { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
      { x: node.x, y: node.y, z: node.z },
      2000
    );
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono selection:bg-emerald-500 selection:text-black">
      
      {/* HUD: Left Panel */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white tracking-tighter mix-blend-difference">
            MY KNOWLEDGE<br/><span className="text-emerald-500">UNIVERSE</span>
          </h1>
          <div className="text-xs text-zinc-500 tracking-[0.3em] uppercase mt-2">
            Automated Knowledge Pipeline
          </div>
        </div>

        <div className="mt-8 bg-zinc-900/50 backdrop-blur-sm border-l-2 border-emerald-500 pl-4 py-2">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white leading-none">{data.nodes.length}</span>
            <span className="text-xs text-zinc-400 mb-1">NODES ACCUMULATED</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-1 uppercase">
            {isIntroPlaying ? '▶ REPLAYING HISTORY...' : '● SYSTEM ONLINE'}
          </div>
        </div>

        <div className="mt-6 space-y-2">
            {Object.entries(data.graphStats.groupByCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([group, count]) => (
                <div key={group} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: groupColors[group], boxShadow: `0 0 10px ${groupColors[group]}` }}></div>
                    <span className="text-zinc-300 w-24 truncate">{group}</span>
                    <span className="text-zinc-600 font-bold">{count}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Timeline: Bottom Center */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 z-20 flex flex-col items-center">
        <div className="text-emerald-400 text-sm font-bold mb-2 tracking-widest">
            {uniqueDates[currentDateIndex]}
        </div>
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-75 ease-linear"
                style={{ width: `${(currentDateIndex / (uniqueDates.length - 1)) * 100}%` }}
            />
        </div>
        <div className="flex justify-between w-full text-[10px] text-zinc-600 mt-2 font-bold uppercase">
            <span>START: {data.graphStats.firstDate}</span>
            <span>TODAY: {data.graphStats.lastDate}</span>
        </div>
      </div>

      <ForceGraph3D
        ref={fgRef}
        graphData={filteredData}
        nodeLabel="name"
        nodeAutoColorBy="group"
        nodeVal={(node: any) => Math.pow(node.val, 0.7) * 2}
        nodeResolution={32}
        nodeColor={(node: any) => groupColors[node.group] || '#ffffff'}
        nodeOpacity={1}
        linkWidth={0.2}
        linkColor={() => '#333333'}
        linkDirectionalParticles={isIntroPlaying ? 0 : 2}
        linkDirectionalParticleWidth={1}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        backgroundColor="#050505"
        showNavInfo={false}
      />
    </div>
  );
}