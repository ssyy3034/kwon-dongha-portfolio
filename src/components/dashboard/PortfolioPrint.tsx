"use client";

import { useProfile } from "@/context/ProfileContext";
import projects from "@/config/projects.json";
import { getProjectDetail } from "@/data/project-details";
import FormattedText from "@/components/common/FormattedText";
import {
  Code,
  Lightbulb,
  Users,
  Briefcase,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Server,
  Monitor,
  Trophy,
} from "lucide-react";
import { getProjectColors, getProjectIcon } from "@/config/project-theme";
import Mermaid from "@/components/common/Mermaid";
import CodeBlock from "@/components/common/CodeBlock";

const steps = [
  {
    key: "problem" as const,
    label: "Problem",
    icon: AlertCircle,
    color: "text-red-500",
    dot: "bg-red-500",
  },
  {
    key: "approach" as const,
    label: "Approach",
    icon: Lightbulb,
    color: "text-amber-500",
    dot: "bg-amber-500",
  },
  {
    key: "result" as const,
    label: "Result",
    icon: CheckCircle2,
    color: "text-emerald-500",
    dot: "bg-emerald-500",
  },
] as const;

function SectionCard({ section, colors }: { section: any; colors: any }) {
  return (
    <article className="mb-10 break-inside-avoid shadow-none border-none">
      {/* 라인 기반 헤더 - Narrative Style */}
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-stone-100 pb-2 mb-6">
        <h3 className="text-[14px] font-black text-stone-900 tracking-tight flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${colors.bg} border-2 border-white shadow-sm`}
          />
          {section.title}
        </h3>
        {section.impact && (
          <span
            className={`text-[10px] font-black ${colors.text} uppercase tracking-[0.2em] bg-stone-50 px-2 py-0.5 rounded`}
          >
            {section.impact}
          </span>
        )}
      </div>

      <div className="pl-4 relative">
        {/* 수직 타임라인 연결선 (Grid 구조에 맞춰 조정) */}
        <div className="absolute left-[8px] top-2 bottom-6 w-0.5 bg-stone-100/60" />

        {/* --- GRID Layout for Problem & Approach --- */}
        <div className="grid grid-cols-2 gap-8 mb-6 relative">
          {/* Problem Column */}
          <div className="relative pl-6">
            <div className="absolute left-[-1.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-red-500 shadow-sm" />
            <div className="mb-2">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-1.5 py-0.5 rounded">
                Problem
              </span>
              {section.subtitle && (
                <span className="text-stone-400 text-[10px] ml-2">
                  — {section.subtitle}
                </span>
              )}
            </div>
            <div className="text-stone-700 leading-relaxed text-[10pt] font-medium min-h-[4em]">
              <FormattedText noDark text={section.problem || ""} />
            </div>
          </div>

          {/* Approach Column */}
          <div className="relative pl-6">
            <div className="absolute left-[-1.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-blue-500 shadow-sm" />
            <div className="mb-2">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded">
                Approach
              </span>
            </div>
            <div className="text-stone-700 leading-relaxed text-[10pt] font-medium min-h-[4em]">
              <FormattedText noDark text={section.approach || ""} />
            </div>
          </div>
        </div>

        {/* --- Result (Full Width) --- */}
        <div className="relative pl-6 mb-8">
          <div className="absolute left-[-1.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500 shadow-sm" />
          <div className="mb-2">
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-1.5 py-0.5 rounded">
              Result
            </span>
          </div>
          <div className="text-stone-900 leading-relaxed text-[10pt] font-extrabold pb-4 border-b border-stone-50">
            <FormattedText noDark text={section.result || ""} />
          </div>
        </div>

        {/* 세부항목 - 차별화된 스타일 */}
        {section.details && section.details.length > 0 && (
          <div className="mt-4 ml-6 space-y-2 pl-4">
            {section.details.map((d: string, i: number) => (
              <div
                key={i}
                className="text-[10pt] text-stone-500 leading-relaxed italic flex items-start gap-2"
              >
                <span className="text-stone-300 mt-1">↳</span>
                <FormattedText noDark text={d} />
              </div>
            ))}
          </div>
        )}

        {/* 기술적 결과물 - 수평 흐름에 맞춘 최적화 */}
        {(section.codeSnippet || section.diagram) && (
          <div className="mt-8 ml-6 space-y-6">
            {section.codeSnippet && (
              <div className="rounded-2xl overflow-hidden border border-stone-100 shadow-sm bg-[#1c1917]">
                <CodeBlock code={section.codeSnippet} />
              </div>
            )}
            {section.diagram?.type === "mermaid" && (
              <div className="p-8 bg-stone-50/50 rounded-2xl border border-stone-100">
                {section.diagram.caption && (
                  <p className="text-[11px] text-stone-400 font-black mb-4 uppercase tracking-[0.25em] text-center italic">
                    {section.diagram.caption}
                  </p>
                )}
                <div className="max-h-[300px] flex justify-center">
                  <Mermaid chart={section.diagram.content} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function PortfolioPrint() {
  const { profile } = useProfile();

  return (
    <div className="bg-white text-stone-900 font-sans">
      {/* ===== PAGE 1: RESUME SUMMARY - GRID OPTIMIZED ===== */}
      <section className="pt-12 pb-12 border-b-2 border-stone-900 mb-12 text-center">
        <header className="mb-12">
          <h1
            className="text-8xl font-black tracking-tighter mb-4"
            style={{ fontFamily: "var(--font-editorial)" }}
          >
            {profile.name}
          </h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-3xl font-black text-amber-600 uppercase tracking-[0.25em]">
              {profile.role}
            </p>
            <div className="flex gap-10 text-stone-400 font-black text-[11px] uppercase tracking-[0.3em] border-t border-stone-100 pt-6 mt-2">
              <span>{profile.social.email}</span>
              <span className="text-stone-100">/</span>
              <span>{profile.social.github.replace("https://", "")}</span>
            </div>
          </div>
        </header>

        {/* Bio Highlights - GRID FIRST (Fixed Horizontal) */}
        <div className="grid grid-cols-3 gap-8 mb-16 h-[220px]">
          {profile.bio.cards?.map((card, idx) => (
            <div
              key={idx}
              className="p-8 bg-stone-50/40 rounded-[2.5rem] border border-stone-100 text-left relative overflow-hidden flex flex-col justify-between"
            >
              <div
                className="absolute top-0 left-0 w-1.5 h-full"
                style={{ backgroundColor: card.color }}
              />
              <div>
                <h3
                  className="text-[13px] font-black uppercase tracking-[0.15em] mb-4"
                  style={{ color: card.color }}
                >
                  {card.title}
                </h3>
                <p className="text-[13px] text-stone-800 leading-relaxed font-semibold">
                  <FormattedText
                    noDark
                    text={typeof card.content === "string" ? card.content : ""}
                  />
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Integrated Tech Stack Grid - Spaced out */}
        <div className="grid grid-cols-2 gap-12 text-left">
          {profile.skills.map((cat) => (
            <div
              key={cat.category}
              className="p-8 bg-white border border-stone-50 rounded-[2rem] shadow-sm"
            >
              <h3 className="text-[12px] font-black text-stone-900 border-b-2 border-stone-900 pb-2 mb-6 uppercase tracking-widest flex justify-between items-center">
                {cat.category}
                <span className="w-8 h-0.5 bg-stone-200" />
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {cat.items.map((skill) => (
                  <span
                    key={skill.name}
                    className="text-[14px] font-bold text-stone-600 hover:text-amber-600 transition-colors"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROJECT DETAIL PAGES ===== */}
      {projects.map((project) => {
        const detail = getProjectDetail(project.id);
        if (!detail) return null;
        const colors = getProjectColors(project.color);

        return (
          <div key={project.id} className="break-before-page pt-10">
            {/* Project Branding Header - Narrative Style */}
            <header className="mb-12">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h1
                    className="text-7xl font-black text-stone-900 tracking-tighter leading-none"
                    style={{ fontFamily: "var(--font-editorial)" }}
                  >
                    {project.title}
                  </h1>
                  <p
                    className={`text-[12px] font-black ${colors.text} uppercase tracking-[0.4em] mt-5`}
                  >
                    {project.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[12px] font-black text-stone-300 uppercase tracking-[0.2em] block mb-2">
                    Timeline
                  </span>
                  <span className="text-2xl font-black text-stone-900 tabular-nums">
                    {project.period}
                  </span>
                </div>
              </div>

              {/* Tagline & Overview - High Impact Single Column */}
              {detail && (
                <div className="mb-10 p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100 relative overflow-hidden shadow-inner">
                  <div
                    className={`absolute top-0 left-0 w-2.5 h-full ${colors.bg}`}
                  />
                  <p className="text-stone-900 font-black leading-tight text-[22px] mb-6 max-w-3xl tracking-tight">
                    <FormattedText noDark text={detail.tagline} />
                  </p>
                  <p className="text-stone-500 leading-relaxed text-[11pt] font-semibold max-w-4xl italic">
                    <FormattedText noDark text={detail.overview} />
                  </p>
                </div>
              )}

              {/* Horizontal Achievement Bar - GRID IMPACT */}
              <div className="grid grid-cols-4 gap-6 mb-12">
                {detail.achievements.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-white border border-stone-50 rounded-3xl shadow-sm text-center flex flex-col justify-center"
                  >
                    <div
                      className={`text-2xl font-black ${colors.text} mb-2 tabular-nums tracking-tighter`}
                    >
                      {a.metric}
                    </div>
                    <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-tight">
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Role & Team Mini-Badge */}
              <div className="flex gap-10 font-black uppercase text-[11px] tracking-[0.15em] text-stone-300 pl-4">
                <div className="flex items-center gap-3">
                  <Briefcase size={16} className="text-stone-900" />
                  <span className="text-stone-900">{project.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-stone-900" />
                  <span className="text-stone-900">{project.team}</span>
                </div>
              </div>
            </header>

            {/* Engineering Deep Dive - Linear Narrative with Break Control */}
            <div className="space-y-20 pb-16">
              {/* Backend Section - Keep with Header */}
              {detail.sections.backend &&
                detail.sections.backend.length > 0 && (
                  <section className="break-inside-avoid shadow-none">
                    <div className="flex items-center gap-6 mb-12 border-b-4 border-stone-900 pb-4">
                      <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-lg transform -rotate-3">
                        <Server size={24} />
                      </div>
                      <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">
                        Engineering: Backend
                      </h2>
                    </div>
                    <div className="space-y-16">
                      {detail.sections.backend.map((section, idx) => (
                        <SectionCard
                          key={idx}
                          section={section}
                          colors={colors}
                        />
                      ))}
                    </div>
                  </section>
                )}

              {/* Frontend Section - Keep with Header */}
              {detail.sections.frontend &&
                detail.sections.frontend.length > 0 && (
                  <section className="break-inside-avoid pt-12 border-t-4 border-stone-100 shadow-none">
                    <div className="flex items-center gap-6 mb-12 border-b-4 border-stone-900 pb-4">
                      <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-lg transform rotate-3">
                        <Monitor size={24} />
                      </div>
                      <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">
                        Solution: Frontend
                      </h2>
                    </div>
                    <div className="space-y-16">
                      {detail.sections.frontend.map((section, idx) => (
                        <SectionCard
                          key={idx}
                          section={section}
                          colors={colors}
                        />
                      ))}
                    </div>
                  </section>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
