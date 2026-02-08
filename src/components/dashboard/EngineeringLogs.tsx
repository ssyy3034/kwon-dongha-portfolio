"use client";

import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

interface EngineeringLogsProps {
  recentPosts: any[];
}

export default function EngineeringLogs({ recentPosts }: EngineeringLogsProps) {
  return (
    <section className="glass-card rounded-[40px] overflow-hidden premium-shadow flex flex-col h-[500px] print:h-auto print:overflow-visible transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      <div className="p-8 border-b border-stone-100/50 dark:border-stone-700/50 flex items-center justify-between sticky top-0 bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl flex items-center justify-center text-stone-900 dark:text-stone-100 shadow-sm">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">
              최근 학습
            </h2>
            <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
              학습 기록
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-[9px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
          {recentPosts.length}개 기록
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar print:overflow-visible">
        {recentPosts.map((node, idx) => (
          <Link
            key={node.id}
            href={`/study/${node.id}`}
            style={{ animationDelay: `${idx * 100}ms` }}
            className="block w-full text-left group px-8 py-7 border-b border-stone-100/30 dark:border-stone-700/30 last:border-0 hover:bg-stone-50/80 dark:hover:bg-stone-800/80 transition-all duration-500 animate-fade-in-up opacity-0"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 tracking-[0.15em] uppercase px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 rounded">
                {node.group}
              </span>
              <span className="text-[10px] text-stone-300 dark:text-stone-600 font-mono italic">
                {node.date}
              </span>
            </div>
            <h3 className="text-[17px] font-bold text-stone-800 dark:text-stone-200 group-hover:text-amber-600 dark:group-hover:text-amber-500 mb-2.5 flex items-center gap-2 transition-colors duration-300">
              {node.name}
              <ChevronRight
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-3 group-hover:translate-x-0 text-amber-500"
              />
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-500 line-clamp-2 leading-relaxed font-medium group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors duration-300">
              {node.preview}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
