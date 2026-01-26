'use client';

import dynamic from 'next/dynamic';
import type { GraphData } from '@/lib/graph-loader';

// Dynamically import the real graph component with NO SSR
const KnowledgeGraph = dynamic(() => import('./KnowledgeGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-emerald-500 font-mono">
      <div className="text-xl animate-pulse">INITIALIZING SYSTEM...</div>
    </div>
  )
});

export default function KnowledgeGraphWrapper({ data }: { data: GraphData }) {
  return <KnowledgeGraph data={data} />;
}
