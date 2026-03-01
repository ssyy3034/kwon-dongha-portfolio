"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FormattedText from "@/components/common/FormattedText";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Cpu,
  Database,
  Layout,
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
  MessageSquare,
} from "lucide-react";
import projects from "@/config/projects.json";
import { getProjectDetail } from "@/data/project-details";
import { ProblemSolution } from "@/types/project";
import Nav from "@/components/dashboard/Nav";
import Mermaid from "@/components/common/Mermaid";

interface PageProps {
  params: Promise<{ id: string }>;
}

const icons = {
  stolink: Code2,
  pintos: Cpu,
  aidiary: Database,
  garden: Layout,
};

const accentColors = {
  amber: {
    bg: "bg-amber-500",
    light: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-700",
    text: "text-amber-600 dark:text-amber-500",
    gradient: "from-amber-500 to-orange-600",
    tab: "border-amber-500 text-amber-600 dark:text-amber-400",
  },
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-emerald-200 dark:border-emerald-700",
    text: "text-emerald-600 dark:text-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
    tab: "border-emerald-500 text-emerald-600 dark:text-emerald-400",
  },
  indigo: {
    bg: "bg-indigo-500",
    light: "bg-indigo-50 dark:bg-indigo-900/30",
    border: "border-indigo-200 dark:border-indigo-700",
    text: "text-indigo-600 dark:text-indigo-500",
    gradient: "from-indigo-500 to-purple-600",
    tab: "border-indigo-500 text-indigo-600 dark:text-indigo-400",
  },
  rose: {
    bg: "bg-rose-500",
    light: "bg-rose-50 dark:bg-rose-900/30",
    border: "border-rose-200 dark:border-rose-700",
    text: "text-rose-600 dark:text-rose-500",
    gradient: "from-rose-500 to-pink-600",
    tab: "border-rose-500 text-rose-600 dark:text-rose-400",
  },
  red: {
    bg: "bg-red-600",
    light: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-300 dark:border-red-700",
    text: "text-red-600 dark:text-red-500",
    gradient: "from-red-600 to-red-800",
    tab: "border-red-500 text-red-600 dark:text-red-400",
  },
};

const steps = [
  {
    key: "problem" as const,
    label: "문제 발견 및 정의",
    icon: AlertCircle,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-l-red-400",
  },
  {
    key: "approach" as const,
    label: "해결방법 모색 및 결정",
    icon: Lightbulb,
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-l-amber-400",
  },
  {
    key: "result" as const,
    label: "적용 및 개선 결과",
    icon: CheckCircle2,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-l-emerald-400",
  },
  {
    key: "retrospective" as const,
    label: "아쉬운점 및 개선 가능한 점",
    icon: MessageSquare,
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-l-blue-400",
  },
] as const;

function SectionCard({
  section,
  idx,
  colors,
}: {
  section: ProblemSolution;
  idx: number;
  colors: (typeof accentColors)[keyof typeof accentColors];
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.08 }}
      className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm"
    >
      {/* 헤더 */}
      <div className={`px-8 py-6 border-b border-stone-100 dark:border-stone-800 ${colors.light}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {section.subtitle && (
              <p className={`text-xs font-bold ${colors.text} uppercase tracking-wider mb-1`}>
                {section.subtitle}
              </p>
            )}
            <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              {section.title}
            </h3>
          </div>
          {section.impact && (
            <span className={`shrink-0 px-4 py-2 rounded-xl ${colors.bg} text-white text-sm font-bold`}>
              {section.impact}
            </span>
          )}
        </div>
      </div>

      {/* 4단계 */}
      <div className="px-8 py-6 space-y-6">
        {steps.map((step) => {
          const value = section[step.key];
          if (!value) return null;
          const StepIcon = step.icon;
          return (
            <div key={step.key} className={`border-l-4 ${step.border} pl-5`}>
              <div className="flex items-center gap-2 mb-2">
                <StepIcon size={15} className={step.color} />
                <p className={`text-xs font-bold ${step.color} uppercase tracking-wider`}>
                  {step.label}
                </p>
              </div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
                <FormattedText text={value} />
              </p>
            </div>
          );
        })}

        {/* 세부 bullet */}
        {section.details && section.details.length > 0 && (
          <div className="pt-2 space-y-2 border-t border-stone-100 dark:border-stone-800">
            {section.details.map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight size={15} className={`${colors.text} shrink-0 mt-0.5`} />
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  <FormattedText text={d} />
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 코드 스니펫 */}
        {section.codeSnippet && (
          <div className="mt-2 p-5 bg-stone-900 rounded-xl overflow-x-auto">
            <pre className="text-sm font-mono text-stone-200 leading-relaxed">
              <code>{section.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* 다이어그램 */}
        {section.diagram?.type === "mermaid" && (
          <div className="mt-2 p-5 bg-stone-100/70 dark:bg-stone-800/70 rounded-xl border border-stone-200 dark:border-stone-700">
            {section.diagram.caption && (
              <p className="text-xs text-stone-500 font-semibold mb-3">{section.diagram.caption}</p>
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
  const project = projects.find((p) => p.id === id);
  if (!project) return notFound();

  const detail = getProjectDetail(id);
  if (!detail) return notFound();

  const hasBackend = (detail.sections.backend?.length ?? 0) > 0;
  const hasFrontend = (detail.sections.frontend?.length ?? 0) > 0;
  const defaultTab = hasBackend ? "backend" : "frontend";

  const [activeTab, setActiveTab] = useState<"backend" | "frontend">(defaultTab);

  const Icon = icons[project.id as keyof typeof icons] || Code2;
  const colors = accentColors[project.color as keyof typeof accentColors] || accentColors.amber;

  const currentIndex = projects.findIndex((p) => p.id === id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const activeSections =
    activeTab === "backend" ? detail.sections.backend ?? [] : detail.sections.frontend ?? [];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Nav />

      {/* Hero */}
      <header className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-1/2 -right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br ${colors.gradient} opacity-[0.04] dark:opacity-[0.08] blur-3xl`}
          />
        </div>

        <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative z-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-10 group text-sm font-medium"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            프로젝트 목록
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colors.gradient}`}>
                Project
              </span>
              <span className="text-stone-400 text-sm">{project.period}</span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-black text-stone-900 dark:text-stone-100 tracking-tight mb-4"
              style={{ fontFamily: "var(--font-editorial)" }}
            >
              {project.title}
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
              {detail.tagline}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 md:px-10 pb-32">
        {/* README 카드 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-8 shadow-sm">
            {/* 메타 정보 */}
            <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <Briefcase size={15} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Role</p>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{project.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <Calendar size={15} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Period</p>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{project.period}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <Users size={15} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Team</p>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{project.team}</p>
                </div>
              </div>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r ${colors.gradient} text-white text-sm font-bold shadow-sm hover:shadow-md transition-shadow`}
                >
                  GitHub
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

            {/* 개요 */}
            <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
              <FormattedText text={detail.overview} />
            </p>

            {/* 기술 스택 */}
            <div className="flex flex-wrap gap-1.5">
              {detail.techStack.flatMap((s) =>
                s.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-lg border border-stone-200 dark:border-stone-700"
                  >
                    {item}
                  </span>
                ))
              )}
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
