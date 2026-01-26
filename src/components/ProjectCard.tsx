"use client";

import { Project } from "@/data/project-data";
import { ExternalLink, Github, FileText, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  variant?: "default" | "featured";
}

const CATEGORY_LABELS: Record<Project["category"], string> = {
  frontend: "프론트엔드",
  fullstack: "풀스택",
  backend: "백엔드",
  other: "기타",
};

const CATEGORY_COLORS: Record<Project["category"], string> = {
  frontend: "bg-amber-50 text-amber-700 border-amber-200",
  fullstack: "bg-orange-50 text-orange-700 border-orange-200",
  backend: "bg-stone-100 text-stone-700 border-stone-200",
  other: "bg-stone-50 text-stone-600 border-stone-200",
};

export default function ProjectCard({
  project,
  variant = "default",
}: ProjectCardProps) {
  const isFeatured = variant === "featured";

  return (
    <article
      className={`group relative bg-white border border-stone-200 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(245,158,11,0.12)] hover:-translate-y-1 ${
        isFeatured ? "lg:col-span-2" : ""
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-100/30 blur-[80px] rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-6 md:p-8 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                CATEGORY_COLORS[project.category]
              }`}
            >
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">
              {project.period}
            </span>
          </div>
          <ArrowUpRight
            size={18}
            className="text-stone-300 group-hover:text-amber-500 transition-colors duration-300"
          />
        </div>

        {/* Title & Description */}
        <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Role */}
        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-4">
          {project.role}
        </p>

        {/* Highlights */}
        <ul className="space-y-2 mb-6">
          {project.highlights.map((highlight, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-stone-600"
            >
              <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 shrink-0" />
              {highlight}
            </li>
          ))}
        </ul>

        {/* Technical Deep Dive (New) */}
        {(project.problemSolving || project.techDecisions) && (
          <div className="space-y-6 mb-8 p-5 bg-stone-50 rounded-2xl border border-stone-100">
            {project.problemSolving && (
              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1 h-3 bg-amber-500 rounded-full" />
                  Problem Solving
                </h4>
                <div className="space-y-4">
                  {project.problemSolving.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs font-bold text-stone-800">
                        Q. {item.challenge}
                      </p>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        <span className="text-amber-600 font-semibold">A.</span>{" "}
                        {item.approach} → {item.result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.techDecisions && (
              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1 h-3 bg-stone-900 rounded-full" />
                  Tech Decisions
                </h4>
                <div className="flex flex-wrap gap-3">
                  {project.techDecisions.map((item, idx) => (
                    <div key={idx} className="group/item relative">
                      <p className="text-xs text-stone-600 font-medium bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                        <span className="font-bold text-stone-900">
                          {item.tech}
                        </span>
                        : {item.reason}
                        {item.deepDive && (
                          <a
                            href={item.deepDive}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-amber-600 hover:text-amber-700 underline"
                          >
                            상세보기
                          </a>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-white border border-stone-100 rounded text-[10px] font-bold text-stone-400 uppercase tracking-wide"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10"
            >
              <Github size={14} />
              GitHub
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
          {project.retrospective && (
            <a
              href={project.retrospective}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors"
            >
              <FileText size={14} />
              회고록
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
