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
    <article className="mb-10 break-inside-avoid">
      {/* 라인 기반 헤더 - Narrative Style */}
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-stone-100 pb-2 mb-4">
        <h3 className="text-[14px] font-black text-stone-900 tracking-tight flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
          {section.title}
        </h3>
        {section.impact && (
          <span
            className={`text-[11px] font-black ${colors.text} uppercase tracking-widest`}
          >
            {section.impact}
          </span>
        )}
      </div>

      <div className="pl-4 relative">
        {/* 수직 타임라인 연결선 */}
        <div className="absolute left-[7px] top-2 bottom-4 w-0.5 bg-stone-100" />

        <div className="space-y-6">
          {steps.map((step) => {
            const value = section[step.key];
            if (!value) return null;
            return (
              <div key={step.key} className="relative pl-6">
                {/* 단계 표시 도트 */}
                <div
                  className={`absolute left-[-1.5px] top-1.5 w-2 h-2 rounded-full border-2 border-white ${step.dot}`}
                />

                <div className="mb-1">
                  <span
                    className={`text-[10px] font-black ${step.color} uppercase tracking-widest`}
                  >
                    {step.label}
                  </span>
                  {step.key === "title" && section.subtitle && (
                    <span className="text-stone-400 text-[10px] ml-2">
                      — {section.subtitle}
                    </span>
                  )}
                </div>
                <div className="text-stone-700 leading-relaxed text-[10pt] font-medium">
                  <FormattedText noDark text={value} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 세부항목 - 차별화된 스타일 */}
        {section.details && section.details.length > 0 && (
          <div className="mt-4 ml-6 space-y-2 border-l-2 border-stone-50 pl-4">
            {section.details.map((d: string, i: number) => (
              <div
                key={i}
                className="text-[10pt] text-stone-500 leading-relaxed italic"
              >
                <FormattedText noDark text={d} />
              </div>
            ))}
          </div>
        )}

        {/* 기술적 결과물 - 중앙 배치 및 캡션 강화 */}
        {(section.codeSnippet || section.diagram) && (
          <div className="mt-6 ml-6 space-y-4">
            {section.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-stone-100 shadow-sm">
                <CodeBlock code={section.codeSnippet} />
              </div>
            )}
            {section.diagram?.type === "mermaid" && (
              <div className="p-6 bg-stone-50/30 rounded-xl border border-stone-100">
                {section.diagram.caption && (
                  <p className="text-[10px] text-stone-400 font-black mb-3 uppercase tracking-[0.2em] text-center">
                    {section.diagram.caption}
                  </p>
                )}
                <div className="max-h-[250px] flex justify-center">
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
      {/* ===== PAGE 1: RESUME SUMMARY - NARRATIVE CENTERED ===== */}
      <section className="pt-12 pb-12 border-b-2 border-stone-900 mb-12 text-center">
        <header className="mb-12">
          <h1
            className="text-8xl font-black tracking-tighter mb-4"
            style={{ fontFamily: "var(--font-editorial)" }}
          >
            {profile.name}
          </h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-3xl font-black text-amber-600 uppercase tracking-[0.2em]">
              {profile.role}
            </p>
            <div className="flex gap-8 text-stone-400 font-bold text-[12px] uppercase tracking-[0.2em] border-t border-stone-100 pt-4">
              <span>{profile.social.email}</span>
              <span className="text-stone-200">|</span>
              <span>{profile.social.github.replace("https://", "")}</span>
            </div>
          </div>
        </header>

        {/* Bio Highlights - Horizontal Narrative */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {profile.bio.cards?.map((card, idx) => (
            <div
              key={idx}
              className="p-6 bg-stone-50 rounded-2xl border border-stone-100 text-left relative overflow-hidden group"
            >
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: card.color }}
              />
              <h3
                className="text-[11px] font-black uppercase tracking-widest mb-3"
                style={{ color: card.color }}
              >
                {card.title}
              </h3>
              <p className="text-[12px] text-stone-700 leading-relaxed font-semibold">
                <FormattedText
                  noDark
                  text={typeof card.content === "string" ? card.content : ""}
                />
              </p>
            </div>
          ))}
        </div>

        {/* Integrated Tech Stack Grid */}
        <div className="grid grid-cols-2 gap-10 text-left">
          {profile.skills.map((cat) => (
            <div
              key={cat.category}
              className="p-6 border border-stone-50 rounded-2xl"
            >
              <h3 className="text-[12px] font-black text-stone-900 border-b-2 border-stone-900 pb-2 mb-4 uppercase tracking-widest">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {cat.items.map((skill) => (
                  <span
                    key={skill.name}
                    className="text-[13px] font-bold text-stone-600"
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
                    className={`text-[12px] font-black ${colors.text} uppercase tracking-[0.3em] mt-4`}
                  >
                    {project.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[12px] font-black text-stone-300 uppercase tracking-widest block mb-1">
                    Timeline
                  </span>
                  <span className="text-lg font-black text-stone-900 tabular-nums">
                    {project.period}
                  </span>
                </div>
              </div>

              {/* Tagline & Overview - High Impact Single Column */}
              {detail && (
                <div className="mb-10 p-8 bg-stone-50 rounded-3xl border border-stone-100 relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 w-2 h-full ${colors.bg}`}
                  />
                  <p className="text-stone-900 font-extrabold leading-relaxed text-[18px] mb-4 max-w-3xl">
                    <FormattedText noDark text={detail.tagline} />
                  </p>
                  <p className="text-stone-500 leading-relaxed text-[11pt] font-medium max-w-4xl">
                    <FormattedText noDark text={detail.overview} />
                  </p>
                </div>
              )}

              {/* Horizontal Achievement Bar - GRID IMPACT */}
              <div className="grid grid-cols-4 gap-4 mb-10">
                {detail.achievements.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border-2 border-stone-50 rounded-2xl shadow-sm text-center"
                  >
                    <div
                      className={`text-2xl font-black ${colors.text} mb-1 tabular-nums tracking-tighter`}
                    >
                      {a.metric}
                    </div>
                    <div className="text-[10px] font-black text-stone-900 uppercase tracking-tighter leading-tight">
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Role & Team Mini-Badge */}
              <div className="flex gap-6 font-black uppercase text-[11px] tracking-widest text-stone-400 pl-2">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} />
                  <span className="text-stone-900">{project.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span className="text-stone-900">{project.team}</span>
                </div>
              </div>
            </header>

            {/* Engineering Deep Dive - Linear Narrative */}
            <div className="space-y-16 pb-12">
              {/* Backend Section */}
              {detail.sections.backend &&
                detail.sections.backend.length > 0 && (
                  <section className="relative">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">
                        <Server size={20} />
                      </div>
                      <h2 className="text-xl font-black text-stone-900 uppercase tracking-[0.1em]">
                        Engineering: Backend
                      </h2>
                    </div>
                    <div className="space-y-12">
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

              {/* Frontend Section */}
              {detail.sections.frontend &&
                detail.sections.frontend.length > 0 && (
                  <section className="relative pt-8 border-t-2 border-stone-50">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">
                        <Monitor size={20} />
                      </div>
                      <h2 className="text-xl font-black text-stone-900 uppercase tracking-[0.1em]">
                        Solution: Frontend
                      </h2>
                    </div>
                    <div className="space-y-12">
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
