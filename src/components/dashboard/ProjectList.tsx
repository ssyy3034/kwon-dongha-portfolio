"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Database,
  Layout,
  Calendar,
  Users,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import projects from "@/config/projects.json";

const icons = {
  stolink: Code2,
  pintos: Cpu,
  aidiary: Database,
  garden: Layout,
};

const accentColors = {
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-700",
    light: "bg-amber-50 dark:bg-amber-900/30",
    gradient: "from-amber-500 to-orange-600",
  },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-700",
    light: "bg-emerald-50 dark:bg-emerald-900/30",
    gradient: "from-emerald-500 to-teal-600",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-700",
    light: "bg-indigo-50 dark:bg-indigo-900/30",
    gradient: "from-indigo-500 to-purple-600",
  },
  rose: {
    bg: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-700",
    light: "bg-rose-50 dark:bg-rose-900/30",
    gradient: "from-rose-500 to-pink-600",
  },
  // 부드러운 세이지 그린
  sage: {
    bg: "bg-lime-600",
    text: "text-lime-700 dark:text-lime-400",
    border: "border-lime-200 dark:border-lime-700",
    light: "bg-lime-50 dark:bg-lime-900/30",
    gradient: "from-lime-500 to-green-600",
  },
  // 따뜻한 피치/살구색
  peach: {
    bg: "bg-orange-300",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-700",
    light: "bg-orange-50 dark:bg-orange-900/30",
    gradient: "from-rose-300 to-orange-400",
  },
  // 하늘색
  sky: {
    bg: "bg-sky-400",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-700",
    light: "bg-sky-50 dark:bg-sky-900/30",
    gradient: "from-sky-400 to-cyan-500",
  },
  // 빨강
  red: {
    bg: "bg-red-600",
    text: "text-red-800 dark:text-red-400",
    border: "border-red-300 dark:border-red-700",
    light: "bg-red-50 dark:bg-red-900/30",
    gradient: "from-red-600 to-red-800",
  },
};

export default function ProjectList() {
  return (
    <section
      id="projects"
      className="py-12 md:py-20 max-w-[1400px] mx-auto px-5 md:px-10 scroll-mt-16"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 mb-3">
          Projects
        </h2>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => {
          const Icon = icons[project.id as keyof typeof icons] || Code2;
          const colors =
            accentColors[project.color as keyof typeof accentColors];

          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={project.link} className="group block h-full">
                <div className="h-full bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-stone-900/50 hover:border-stone-300 dark:hover:border-stone-600 hover:-translate-y-1">
                  {/* Accent Bar */}
                  <div className={`h-1 bg-gradient-to-r ${colors.gradient}`} />

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${colors.light} ${colors.border} border flex items-center justify-center`}
                        >
                          <Icon size={20} className={colors.text} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-stone-500 dark:text-stone-400">
                            {project.subtitle}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight
                        size={20}
                        className="text-stone-300 dark:text-stone-600 group-hover:text-stone-900 dark:group-hover:text-stone-300 transition-colors shrink-0 mt-1"
                      />
                    </div>

                    {/* Meta Row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Briefcase size={12} />
                        {project.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {project.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {project.team}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Metrics - 수치화된 성과 */}
                    {project.metrics && (
                      <div className="flex gap-3 mb-4">
                        {project.metrics.map(
                          (m: { value: string; label: string }, i: number) => (
                            <div
                              key={i}
                              className={`flex-1 px-3 py-2 rounded-lg ${colors.light} border ${colors.border}`}
                            >
                              <p
                                className={`text-sm font-black ${colors.text} leading-tight`}
                              >
                                {m.value}
                              </p>
                              <p className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">
                                {m.label}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 text-xs font-medium">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
