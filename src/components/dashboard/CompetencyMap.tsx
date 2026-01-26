"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import { Brain, ArrowUpRight } from "lucide-react";

interface CompetencyMapProps {
  data: any[];
  mounted: boolean;
}

export default function CompetencyMap({ data, mounted }: CompetencyMapProps) {
  return (
    <section className="glass-card rounded-[40px] p-8 premium-shadow flex flex-col justify-between overflow-hidden relative group h-full transition-all duration-700 hover:shadow-[0_20px_60px_rgba(245,158,11,0.1)] hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50/50 blur-[80px] rounded-full -mr-10 -mt-10" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm transition-transform duration-500 group-hover:rotate-12">
            <Brain size={20} />
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">
              성장을 위한 여정
            </h2>
            <p className="text-sm font-bold text-stone-800">목표를 향한 기록</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            Live Synced
          </div>
          <p className="text-[9px] font-bold text-stone-400">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            업데이트됨
          </p>
        </div>
      </div>

      <div className="h-80 md:h-[360px] w-full relative z-10">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
              <PolarGrid stroke="#f1f1f1" />
              <PolarAngleAxis
                dataKey="category"
                tick={({ x, y, payload, textAnchor }) => {
                  const category = payload.value;
                  // More sophisticated label offset logic
                  const isTop = (y as number) < 140;
                  const isBottom = (y as number) > 220;
                  const dy = isTop ? -15 : isBottom ? 20 : 0;

                  return (
                    <text
                      x={x}
                      y={(y as number) + dy}
                      textAnchor={textAnchor}
                      fill="#a1a1aa"
                      fontSize={11}
                      fontWeight={800}
                      className="tracking-[0.1em] pointer-events-none transition-all duration-300 group-hover:fill-amber-500"
                    >
                      {category}
                    </text>
                  );
                }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="수준"
                dataKey="score"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.08}
                strokeWidth={3}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 mb-6 px-1 space-y-3">
        <p className="text-[11px] text-stone-500 leading-relaxed italic">
          * 이 그래프는 실력의 높고 낮음이 아닌, <strong>'좋은 개발자'</strong>
          라는 스스로의 목표를 향해 나아가는 <strong>꾸준한 노력의 밀도</strong>
          를 나타냅니다. 나태해지지 않기 위해 매일 아침 이 지표를 확인하며
          오늘의 성장을 다짐합니다.
        </p>
        <div className="flex items-center gap-3 py-2 border-t border-zinc-100">
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">
            Data Sources:
          </span>
          <div className="flex gap-2">
            <span className="px-1.5 py-0.5 bg-stone-50 border border-stone-200 rounded text-[8px] font-bold text-stone-500">
              GitHub API
            </span>
            <span className="px-1.5 py-0.5 bg-stone-50 border border-stone-200 rounded text-[8px] font-bold text-stone-500">
              Obsidian Knowledge Garden
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {data.slice(0, 3).map((item) => (
          <div key={item.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.05em]">
              <span className="text-zinc-400">{item.category}</span>
              <span className="text-zinc-900 px-2 py-0.5 bg-zinc-50 rounded border border-zinc-100 font-mono">
                {item.score}%
              </span>
            </div>
            <div className="w-full h-1 bg-zinc-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
