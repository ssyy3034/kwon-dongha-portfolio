"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import FormattedText from "@/components/common/FormattedText";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Cpu,
  Database,
  Layout,
  ExternalLink,
  Layers,
  Zap,
  Shield,
  Target,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Trophy,
  Calendar,
  Users,
  Briefcase,
} from "lucide-react";
import projects from "@/config/projects.json";
import { getProjectDetail } from "@/data/project-details";
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

const focusIcons = {
  layers: Layers,
  zap: Zap,
  shield: Shield,
  target: Target,
  cpu: Cpu,
  database: Database,
};

const accentColors = {
  amber: {
    bg: "bg-amber-500",
    light: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-700",
    text: "text-amber-600 dark:text-amber-500",
    gradient: "from-amber-500 to-orange-600",
  },
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-emerald-200 dark:border-emerald-700",
    text: "text-emerald-600 dark:text-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
  },
  indigo: {
    bg: "bg-indigo-500",
    light: "bg-indigo-50 dark:bg-indigo-900/30",
    border: "border-indigo-200 dark:border-indigo-700",
    text: "text-indigo-600 dark:text-indigo-500",
    gradient: "from-indigo-500 to-purple-600",
  },
  rose: {
    bg: "bg-rose-500",
    light: "bg-rose-50 dark:bg-rose-900/30",
    border: "border-rose-200 dark:border-rose-700",
    text: "text-rose-600 dark:text-rose-500",
    gradient: "from-rose-500 to-pink-600",
  },
  red: {
    bg: "bg-red-600",
    light: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-300 dark:border-red-700",
    text: "text-red-600 dark:text-red-500",
    gradient: "from-red-600 to-red-800",
  },
};

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const project = projects.find((p) => p.id === id);
  if (!project) return notFound();

  const detail = getProjectDetail(id);
  if (!detail) return notFound();

  const Icon = icons[project.id as keyof typeof icons] || Code2;
  const colors = accentColors[project.color as keyof typeof accentColors];

  // 다음/이전 프로젝트
  const currentIndex = projects.findIndex((p) => p.id === id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Nav />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br ${colors.gradient} opacity-[0.03] dark:opacity-[0.08] blur-3xl`}
          />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-200 dark:via-stone-700 to-transparent" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-12 group text-sm font-medium"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              프로젝트 목록
            </Link>
          </motion.div>

          {/* Project Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              {/* Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colors.gradient} shadow-lg`}
                >
                  Project
                </span>
                <span className="text-stone-400 dark:text-stone-500 text-sm">{project.period}</span>
              </div>

              {/* Title */}
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-black text-stone-900 dark:text-stone-100 tracking-tight mb-6 leading-[0.95]"
                style={{ fontFamily: "var(--font-editorial)" }}
              >
                {project.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 font-medium mb-8 max-w-2xl">
                {project.subtitle}
              </p>

              {/* Tagline */}
              <div
                className={`p-6 rounded-2xl ${colors.light} ${colors.border} border`}
              >
                <p
                  className={`text-lg md:text-xl font-bold ${colors.text} leading-relaxed`}
                >
                  &ldquo;{detail.tagline}&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Meta Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-80 shrink-0"
            >
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-700 p-8 shadow-xl shadow-stone-200/50 dark:shadow-stone-900/50">
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`w-14 h-14 rounded-2xl ${colors.light} ${colors.border} border-2 flex items-center justify-center`}
                  >
                    <Icon size={28} className={colors.text} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Project
                    </p>
                    <p className="text-lg font-black text-stone-900 dark:text-stone-100">
                      {project.title}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <Briefcase size={18} className="text-stone-600 dark:text-stone-400" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                        Role
                      </p>
                      <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                        {project.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <Calendar size={18} className="text-stone-600 dark:text-stone-400" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                        Period
                      </p>
                      <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                        {project.period}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <Users size={18} className="text-stone-600 dark:text-stone-400" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                        Team
                      </p>
                      <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                        {project.team}
                      </p>
                    </div>
                  </div>
                </div>

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r ${colors.gradient} text-white font-bold shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    GitHub 저장소
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 md:px-10 pb-32">
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="p-8 md:p-14 rounded-[32px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xl shadow-stone-200/30 dark:shadow-stone-900/30">
            <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mb-4">
              Overview
            </p>
            <p className="text-lg md:text-2xl text-stone-800 dark:text-stone-200 leading-relaxed font-medium break-keep">
              <FormattedText text={detail.overview} />
            </p>
          </div>
        </motion.section>

        {/* Key Focus (if exists) */}
        {detail.keyFocus && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <div className="p-10 md:p-14 rounded-[32px] bg-stone-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles size={20} className="text-stone-400" />
                  <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-bold">
                    {detail.keyFocus.headline}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {detail.keyFocus.points.map((point, idx) => {
                    const FocusIcon = focusIcons[point.icon];
                    return (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <FocusIcon size={20} className="text-stone-400" />
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            {point.title}
                          </h3>
                        </div>
                        <p className="text-stone-400 leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Problem-Solution Sections */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100"
              style={{ fontFamily: "var(--font-editorial)" }}
            >
              Technical Challenges
            </h2>
            <div className="flex-1 h-[1px] bg-stone-300 dark:bg-stone-700" />
            <span className="text-sm font-bold text-stone-500 dark:text-stone-400">
              {detail.sections.length} Cases
            </span>
          </motion.div>

          <div className="space-y-16">
            {detail.sections.map((section, idx) => (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Section Number */}
                <div className="absolute left-4 md:left-8 top-4 text-7xl md:text-8xl font-black text-stone-100 dark:text-stone-800/50 leading-none select-none pointer-events-none -z-10">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="relative z-10 bg-white dark:bg-stone-900 rounded-[32px] border border-stone-200 dark:border-stone-700 overflow-hidden shadow-lg dark:shadow-stone-900/50">
                  {/* Section Header */}
                  <div
                    className={`p-8 md:p-10 border-b border-stone-100 dark:border-stone-700 bg-gradient-to-r ${colors.light}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <p
                          className={`text-xs font-bold ${colors.text} uppercase tracking-wider mb-2`}
                        >
                          {section.subtitle}
                        </p>
                        <h3
                          className="text-2xl md:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight"
                          style={{ fontFamily: "var(--font-editorial)" }}
                        >
                          {section.title}
                        </h3>
                      </div>
                      {section.impact && (
                        <div
                          className={`shrink-0 px-5 py-3 rounded-2xl ${colors.bg}`}
                        >
                          <p className="text-[10px] uppercase tracking-wider text-white/80 mb-1">
                            Impact
                          </p>
                          <p className="text-sm font-bold text-white">
                            {section.impact}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-8 md:p-10">
                    {/* Challenge */}
                    <div className="mb-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Target size={14} className="text-red-600 dark:text-red-500" />
                        </div>
                        <p className="text-xs font-bold text-red-600 dark:text-red-500 uppercase tracking-wider">
                          Challenge
                        </p>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed pl-8 border-l-2 border-red-300 dark:border-red-700">
                        <FormattedText text={section.challenge} />
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="mb-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <CheckCircle2
                            size={14}
                            className="text-emerald-600 dark:text-emerald-500"
                          />
                        </div>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                          Solution
                        </p>
                      </div>
                      <p className="text-stone-800 dark:text-stone-200 text-lg leading-relaxed font-medium pl-8 border-l-2 border-emerald-300 dark:border-emerald-700 mb-6">
                        <FormattedText text={section.solution} />
                      </p>

                      {/* Details */}
                      {section.details && section.details.length > 0 && (
                        <div className="pl-8 space-y-3">
                          {section.details.map((detail, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <ChevronRight
                                size={18}
                                className={`${colors.text} shrink-0 mt-0.5`}
                              />
                              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                                <FormattedText text={detail} />
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Diagram */}
                    {section.diagram && section.diagram.type === "mermaid" && (
                      <div className="mt-10 p-6 bg-stone-100/70 dark:bg-stone-800/70 rounded-2xl border border-stone-200 dark:border-stone-700">
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mb-4">
                          {section.diagram.caption || "Architecture Diagram"}
                        </p>
                        <Mermaid chart={section.diagram.content} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Achievements - 내 성과 (PDF에서 중요) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Trophy size={20} className={colors.text} />
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Key Results</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {detail.achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700"
              >
                {achievement.metric && (
                  <span
                    className={`text-2xl font-black ${colors.text} shrink-0`}
                  >
                    {achievement.metric}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-stone-900 dark:text-stone-100 mb-1">
                    {achievement.label}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack - 간결한 인라인 태그 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Tech Stack</h2>
            <div className="flex-1 h-[1px] bg-stone-200 dark:bg-stone-700" />
          </div>

          <div className="flex flex-wrap gap-2">
            {detail.techStack.flatMap((stack) =>
              stack.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-lg border border-stone-200 dark:border-stone-700"
                >
                  {item}
                </span>
              )),
            )}
          </div>
        </motion.section>

        {/* Next Project - PDF에서 제외 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-16 border-t border-stone-300 no-print"
        >
          <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mb-6">
            Next Project
          </p>
          <Link
            href={nextProject.link}
            className="group flex items-center justify-between p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-700 hover:shadow-xl dark:hover:shadow-stone-900/50 hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-300"
          >
            <div>
              <h3
                className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors mb-2"
                style={{ fontFamily: "var(--font-editorial)" }}
              >
                {nextProject.title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400">{nextProject.subtitle}</p>
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-stone-200 dark:border-stone-700 group-hover:border-stone-900 dark:group-hover:border-amber-500 group-hover:bg-stone-900 dark:group-hover:bg-amber-500 flex items-center justify-center transition-all duration-300">
              <ArrowRight
                size={24}
                className="text-stone-400 group-hover:text-white transition-colors"
              />
            </div>
          </Link>
        </motion.section>
      </main>
    </div>
  );
}
