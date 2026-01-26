"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import { Activity, Zap, Star, Compass, Map } from "lucide-react";
import clsx from "clsx";
import { useProfile } from "@/context/ProfileContext";
import "react-calendar-heatmap/dist/styles.css";

interface ConsistencyTraceProps {
  heatmap: any[];
  startDate: Date;
  endDate: Date;
  missingTopics: any[];
}

export default function ConsistencyTrace({
  heatmap,
  startDate,
  endDate,
  missingTopics,
}: ConsistencyTraceProps) {
  const { profile } = useProfile();

  // Helper to render stack cards
  const renderStack = (
    categoryIndex: number,
    icon: React.ReactNode,
    accentColor: string,
  ) => {
    const stack = profile.skills[categoryIndex];
    if (!stack) return null;

    return (
      <div className="group/stack p-5 bg-white border border-stone-100 rounded-[24px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <h4
          className={clsx(
            "text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2",
            accentColor,
          )}
        >
          {icon}
          {stack.category}
        </h4>
        <div className="flex flex-wrap gap-2">
          {stack.items.map((item: any) => (
            <span
              key={item.name}
              className="px-2.5 py-1 bg-stone-50 text-[10px] font-bold text-stone-500 rounded-lg border border-stone-100/50 group-hover/stack:border-stone-200 transition-colors"
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="glass-card rounded-[40px] p-8 premium-shadow h-full relative overflow-hidden group transition-all duration-700 hover:shadow-[0_20px_60px_rgba(245,158,11,0.1)] hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-60 h-60 bg-orange-50/50 blur-[100px] rounded-full -mr-20 -mt-20" />

      {/* HEATMAP HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm transition-transform duration-500 group-hover:-rotate-12">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">
              학습의 궤적
            </h2>
            <p className="text-sm font-bold text-stone-800 mt-0.5">
              열정과 꾸준함이 기록된 매일의 정원
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-zinc-100 shadow-sm w-fit shrink-0">
          <span className="uppercase tracking-widest opacity-60">Empty</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((v) => {
              const colors: Record<number, string> = {
                0: "bg-stone-100",
                1: "bg-amber-100",
                2: "bg-amber-300",
                3: "bg-amber-500",
                4: "bg-amber-600",
              };
              return (
                <div
                  key={v}
                  className={clsx(
                    "w-3 h-3 rounded-[3px] transition-transform duration-300",
                    colors[v],
                  )}
                />
              );
            })}
          </div>
          <span className="uppercase tracking-widest opacity-60">Full</span>
        </div>
      </div>

      {/* HEATMAP GRID */}
      <div className="w-full overflow-x-auto pb-4 -mx-2 px-2 custom-scrollbar relative z-10 scroll-smooth">
        <div className="min-w-[700px] py-4">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={heatmap}
            gutterSize={4}
            classForValue={(value: any) => {
              if (!value || value.count === 0) return "color-empty";
              return `color-scale-${Math.min(value.count, 4)}`;
            }}
          />
        </div>
      </div>

      {/* TECH STACK & INTERESTS (New Curated Section) */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
        {renderStack(
          0,
          <Star size={12} fill="currentColor" />,
          "text-amber-500",
        )}
        {renderStack(
          1,
          <Zap size={12} fill="currentColor" />,
          "text-orange-500",
        )}
        {renderStack(
          2,
          <Compass size={12} fill="currentColor" />,
          "text-stone-700",
        )}
      </div>

      {/* INFOS & ROADMAP (Lower priority) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-zinc-100/50 pt-10 relative z-10">
        <div className="group/goal">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 group-hover/goal:text-amber-500 transition-colors">
            <span className="w-1 h-1 bg-amber-500 rounded-full" />
            {profile.goals.title}
          </h3>
          <div className="space-y-4 border-l-2 border-amber-500/20 pl-4">
            <p className="text-[13px] font-bold text-zinc-700 leading-relaxed italic">
              "{profile.goals.quote}"
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              {profile.goals.description}
            </p>
          </div>
        </div>

        <div className="group/backlog">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Map size={12} className="text-orange-500" />
            다음 목표
          </h3>
          <div className="space-y-3 pl-2 opacity-80 group-hover/backlog:opacity-100 transition-opacity">
            {missingTopics.map((topic, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <p className="text-[10px] font-bold text-stone-400 whitespace-nowrap min-w-[60px]">
                  {topic.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topic.keywords.slice(0, 2).map((k: string) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 bg-orange-50/50 border border-orange-100 rounded text-[10px] font-bold text-orange-700/80"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
