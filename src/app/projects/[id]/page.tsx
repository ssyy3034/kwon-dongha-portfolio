"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FormattedText from "@/components/common/FormattedText";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Trophy,
  Calendar,
  Users,
  Briefcase,
  Server,
  Monitor,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import projects from "@/config/projects.json";
import { getProjectDetail } from "@/data/project-details";
import { ProblemSolution } from "@/types/project";
import { getProjectColors, getProjectIcon } from "@/config/project-theme";
import Nav from "@/components/dashboard/Nav";
import Mermaid from "@/components/common/Mermaid";

interface PageProps {
  params: Promise<{ id: string }>;
}

const steps = [
  {
    key: "problem" as const,
    label: "Problem",
    icon: AlertCircle,
    color: "text-red-500 dark:text-red-400",
    dot: "bg-red-500",
  },
  {
    key: "approach" as const,
    label: "Approach",
    icon: Lightbulb,
    color: "text-amber-500 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  {
    key: "result" as const,
    label: "Result",
    icon: CheckCircle2,
    color: "text-emerald-500 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
] as const;

function SectionCard({
  section,
  idx,
  colors,
}: {
  section: ProblemSolution;
  idx: number;
  colors: ReturnType<typeof getProjectColors>;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.08 }}
      className="bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden print:border print:shadow-none print:break-inside-avoid"
    >
      {/* 헤더 */}
      <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            {section.subtitle && (
              <p className={`text-[10px] sm:text-xs font-bold ${colors.text} tracking-wider mb-1`}>
                {section.subtitle}
              </p>
            )}
            <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              {section.title}
            </h3>
          </div>
          {section.impact && (
            <span className={`shrink-0 self-start px-3 py-1.5 rounded-lg ${colors.bg} text-white text-xs sm:text-sm font-bold print:text-stone-900 print:bg-stone-100 print:border`}>
              {section.impact}
            </span>
          )}
        </div>
      </div>

      {/* 3단계 타임라인 — 배경색 없이 여백으로 구분 */}
      <div className="px-5 sm:px-7 py-5 sm:py-7">
        <div className="space-y-6 sm:space-y-8">
          {steps.map((step, stepIdx) => {
            const value = section[step.key];
            if (!value) return null;
            const StepIcon = step.icon;
            const isLast = stepIdx === steps.length - 1 || !section[steps[stepIdx + 1]?.key];
            return (
              <div key={step.key} className="relative pl-7 sm:pl-8">
                {/* 타임라인 세로선 */}
                {!isLast && (
                  <div className="absolute left-[9px] sm:left-[11px] top-7 bottom-[-24px] sm:bottom-[-32px] w-px bg-stone-200 dark:bg-stone-700 print:bg-stone-300" />
                )}
                {/* 타임라인 도트 */}
                <div className={`absolute left-0 top-[3px] w-[19px] h-[19px] sm:w-[23px] sm:h-[23px] rounded-full border-2 border-white dark:border-stone-900 ${step.dot} flex items-center justify-center print:border-stone-200`}>
                  <StepIcon size={10} className="text-white sm:w-3 sm:h-3" />
                </div>
                {/* 라벨 + 본문 */}
                <p className={`text-[11px] sm:text-xs font-bold ${step.color} uppercase tracking-wider mb-1.5 sm:mb-2`}>
                  {step.label}
                </p>
                <div className="text-stone-700 dark:text-stone-300 leading-[1.85] text-[13.5px] sm:text-[15px] break-keep print:text-stone-800 print:text-[12px] print:leading-[1.7]">
                  <FormattedText text={value} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 세부사항 */}
        {section.details && section.details.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-100 dark:border-stone-800 space-y-2.5">
            {section.details.map((d, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <ChevronRight size={13} className={`${colors.text} shrink-0 mt-0.5`} />
                <div className="text-[13px] sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed break-keep print:text-stone-700 print:text-[11px]">
                  <FormattedText text={d} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 코드 스니펫 */}
        {section.codeSnippet && (
          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-stone-900 rounded-lg sm:rounded-xl overflow-x-auto print:bg-stone-100 print:border print:border-stone-300">
            <pre className="text-[11px] sm:text-sm font-mono text-stone-200 leading-relaxed print:text-stone-800">
              <code>{section.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* 다이어그램 */}
        {section.diagram?.type === "mermaid" && (
          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg sm:rounded-xl border border-stone-200 dark:border-stone-700 overflow-x-auto">
            {section.diagram.caption && (
              <p className="text-[10px] sm:text-xs text-stone-500 font-semibold mb-3">
                {section.diagram.caption}
              </p>
            )}
            <Mermaid chart={section.diagram.content} />
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const project = projects.find((p) => p.id === id);
  if (!project) return notFound();

  const detail = getProjectDetail(id);
  if (!detail) return notFound();

  const hasBackend = (detail.sections.backend?.length ?? 0) > 0;
  const hasFrontend = (detail.sections.frontend?.length ?? 0) > 0;
  const defaultTab = hasBackend ? "backend" : "frontend";

  const [activeTab, setActiveTab] = useState<"backend" | "frontend">(defaultTab);

  const Icon = getProjectIcon(project.id);
  const colors = getProjectColors(project.color);

  const currentIndex = projects.findIndex((p) => p.id === id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const activeSections =
    activeTab === "backend" ? detail.sections.backend ?? [] : detail.sections.frontend ?? [];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Nav />

      {/* Hero */}
      <header className="relative pt-24 sm:pt-32 pb-10 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-1/2 -right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br ${colors.gradient} opacity-[0.04] dark:opacity-[0.08] blur-3xl`}
          />
        </div>

        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-8 sm:mb-10 group text-sm font-medium"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            프로젝트 목록
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colors.gradient}`}>
                Project
              </span>
              <span className="text-stone-400 text-xs sm:text-sm">{project.period}</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-black text-stone-900 dark:text-stone-100 tracking-tight mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-editorial)" }}
            >
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
              {detail.tagline}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-10 pb-24 sm:pb-32">
        {/* README 카드 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 sm:mb-10"
        >
          <div className="bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-stone-700 p-4 sm:p-6 md:p-8 shadow-sm">
            {/* 메타 정보 */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                  <Briefcase size={13} className="text-stone-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider">Role</p>
                  <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 truncate">{project.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                  <Calendar size={13} className="text-stone-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider">Period</p>
                  <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">{project.period}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                  <Users size={13} className="text-stone-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider">Team</p>
                  <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">{project.team}</p>
                </div>
              </div>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`col-span-2 sm:col-span-1 sm:ml-auto flex items-center justify-center sm:justify-start gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r ${colors.gradient} text-white text-sm font-bold shadow-sm hover:shadow-md transition-shadow`}
                >
                  GitHub
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

            {/* 개요 */}
            <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-[1.8] mb-5 sm:mb-6">
              <FormattedText text={detail.overview} />
            </div>

            {/* 기술 스택 */}
            <div className="space-y-3">
              {detail.techStack.map((group) => (
                <div key={group.category} className="flex items-start gap-3">
                  <span className="shrink-0 text-[10px] sm:text-[11px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-1.5 w-16 sm:w-20">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] sm:text-xs font-bold rounded-lg border border-stone-200 dark:border-stone-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 카테고리 탭 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800/50 rounded-xl w-fit">
            {hasBackend && (
              <button
                onClick={() => setActiveTab("backend")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "backend"
                    ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
              >
                <Server size={15} />
                Backend
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                  activeTab === "backend"
                    ? `${colors.light} ${colors.text}`
                    : "bg-stone-200 dark:bg-stone-700 text-stone-500"
                }`}>
                  {detail.sections.backend?.length ?? 0}
                </span>
              </button>
            )}
            {hasFrontend && (
              <button
                onClick={() => setActiveTab("frontend")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "frontend"
                    ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
              >
                <Monitor size={15} />
                Frontend
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                  activeTab === "frontend"
                    ? `${colors.light} ${colors.text}`
                    : "bg-stone-200 dark:bg-stone-700 text-stone-500"
                }`}>
                  {detail.sections.frontend?.length ?? 0}
                </span>
              </button>
            )}
          </div>
        </motion.div>

        {/* 섹션 목록 */}
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 mb-16"
          >
            {activeSections.map((section, idx) => (
              <SectionCard key={section.id} section={section} idx={idx} colors={colors} />
            ))}
          </motion.section>
        </AnimatePresence>

        {/* Key Results */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Trophy size={18} className={colors.text} />
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Key Results</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {detail.achievements.map((a, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700"
              >
                {a.metric && (
                  <span className={`text-xl font-black ${colors.text} shrink-0 leading-tight`}>
                    {a.metric}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-stone-900 dark:text-stone-100 mb-0.5">{a.label}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Next Project */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pt-12 border-t border-stone-200 dark:border-stone-800"
        >
          <p className="text-xs text-stone-400 font-semibold mb-4">Next Project</p>
          <Link
            href={nextProject.link}
            className="group flex items-center justify-between p-7 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 hover:shadow-lg transition-all duration-300"
          >
            <div>
              <h3
                className="text-2xl font-black text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors mb-1"
                style={{ fontFamily: "var(--font-editorial)" }}
              >
                {nextProject.title}
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm">{nextProject.subtitle}</p>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-stone-200 dark:border-stone-700 group-hover:border-stone-900 dark:group-hover:border-amber-500 group-hover:bg-stone-900 dark:group-hover:bg-amber-500 flex items-center justify-center transition-all duration-300">
              <ArrowRight size={20} className="text-stone-400 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </motion.section>
      </main>
    </div>
  );
}
