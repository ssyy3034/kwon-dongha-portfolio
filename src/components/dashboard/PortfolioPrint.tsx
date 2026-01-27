"use client";

import { useProfile } from "@/context/ProfileContext";
import projects from "@/config/projects.json";
import { getProjectDetail } from "@/data/project-details";
import FormattedText from "@/components/common/FormattedText";

export default function PortfolioPrint() {
  const { profile } = useProfile();

  return (
    <div className="bg-white text-stone-900">
      {/* ===== PAGE 1: RESUME SUMMARY ===== */}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-1">
          {profile.name}
        </h1>
        <p className="text-lg font-medium text-amber-600 mb-4">
          {profile.role}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone-600">
          <span>{profile.social.email}</span>
          <span>{profile.social.github.replace("https://", "")}</span>
          {profile.social.blog && (
            <span>{profile.social.blog.replace("https://", "")}</span>
          )}
        </div>
      </header>

      {/* About */}
      <section className="mb-8">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">
          About
        </h2>
        <p className="text-sm text-stone-700 leading-relaxed">
          {profile.bio.paragraphs
            .map((p) =>
              p.text
                .replace("{highlight}", p.highlight)
                .replace("{name}", profile.name),
            )
            .join(" ")}
          <br />
          <br />
          {profile.goals.description}
        </p>
      </section>

      {/* Primary Skills Quick View */}
      <section className="mb-8">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">
          Core Expertise
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills
            .flatMap((cat) => cat.items)
            .filter((s) => s.slug !== "nextdotjs" && s.slug !== "lighthouse")
            .slice(0, 10)
            .map((skill) => (
              <span
                key={skill.name}
                className="px-2 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded"
              >
                {skill.name}
              </span>
            ))}
        </div>
      </section>

      {/* Project Summaries */}
      <section className="mb-8">
        <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">
          Key Projects
        </h2>

        <div className="space-y-6">
          {projects.map((project) => (
            <article key={project.id}>
              {/* Project Header */}
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h3 className="text-base font-bold text-stone-900 inline">
                    {project.title}
                  </h3>
                  <span className="text-sm text-stone-500 ml-2">
                    — {project.subtitle}
                  </span>
                </div>
                <span className="text-xs text-stone-400">{project.period}</span>
              </div>

              {/* Meta */}
              <p className="text-xs text-stone-500 mb-2">
                {project.role} · {project.team}
                {project.github && (
                  <span className="ml-2">
                    · {project.github.replace("https://", "")}
                  </span>
                )}
              </p>

              {/* Description */}
              <p className="text-sm text-stone-700 leading-relaxed mb-2">
                <FormattedText text={project.description} />
              </p>

              {/* Key Metrics */}
              {project.metrics && (
                <div className="flex flex-wrap gap-3 mb-2">
                  {project.metrics.map((m, i) => (
                    <span key={i} className="text-xs">
                      <span className="font-bold text-amber-600">
                        {m.value}
                      </span>
                      <span className="text-stone-500 ml-1">{m.label}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Tech Stack */}
              <p className="text-xs text-stone-400">
                {project.tech.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== PAGE 2: DETAILED SKILLS ===== */}
      <div className="break-before-page pt-8">
        <div className="mb-10 border-b-4 border-stone-900 pb-4">
          <h2 className="text-4xl font-black text-stone-900 tracking-tighter">
            Technical Expertise
          </h2>
          <p className="text-stone-500 font-medium mt-1">
            Core competencies and practical applications
          </p>
        </div>

        <div className="space-y-12">
          {profile.skills.map((category) => (
            <section key={category.category}>
              <h3 className="text-lg font-black text-amber-600 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="h-px bg-amber-200 flex-1"></span>
                {category.category}
                <span className="h-px bg-amber-200 flex-1"></span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {category.items.map((skill) => (
                  <div
                    key={skill.name}
                    className="relative pl-6 border-l-2 border-stone-100 group"
                  >
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-stone-300 group-hover:bg-amber-500 transition-colors" />
                    <h4 className="text-base font-bold text-stone-900 mb-2">
                      {skill.name}
                    </h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ===== PROJECT DETAIL PAGES ===== */}
      {projects.map((project) => {
        const detail = getProjectDetail(project.id);
        if (!detail) return null;

        return (
          <div key={`${project.id}-detail`} className="break-before-page pt-8">
            {/* Header */}
            <div className="mb-6 border-b border-stone-200 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
                    Project
                  </span>
                  <h2 className="text-3xl font-black text-stone-900 mb-1">
                    {project.title}
                  </h2>
                  <p className="text-lg text-stone-600 font-medium">
                    {project.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-stone-800">
                    {project.period}
                  </span>
                  <span className="block text-xs text-stone-500">
                    {project.role}
                  </span>
                </div>
              </div>

              <p className="text-sm text-stone-700 italic border-l-2 border-stone-300 pl-3">
                &ldquo;{detail.tagline}&rdquo;
              </p>
            </div>

            {/* Overview */}
            <section className="mb-8">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">
                Overview
              </h3>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                <FormattedText text={detail.overview} />
              </p>
            </section>

            {/* Key Results Grid */}
            <section className="mb-8 p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">
                Key Results
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {detail.achievements.map((ach, idx) => (
                  <div key={idx}>
                    <div className="text-lg font-black text-amber-600">
                      {ach.metric}
                    </div>
                    <div className="text-xs font-bold text-stone-900">
                      {ach.label}
                    </div>
                    <div className="text-[10px] text-stone-600 leading-tight mt-0.5">
                      {ach.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Challenges (Limit to top 3 for print space if needed, or list all) */}
            <section>
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">
                Technical Deep Dive
              </h3>

              <div className="space-y-6">
                {detail.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="break-inside-avoid border border-stone-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-baseline mb-2 pb-2 border-b border-stone-100">
                      <h4 className="text-sm font-bold text-stone-900">
                        {idx + 1}. {section.title}
                      </h4>
                      {section.impact && (
                        <span className="text-[10px] font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                          {section.impact}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-[80px_1fr] gap-4 mb-3 text-xs">
                      <span className="font-bold text-red-600">Challenge</span>
                      <span className="text-stone-700 leading-relaxed">
                        <FormattedText text={section.challenge} />
                      </span>
                    </div>

                    <div className="grid grid-cols-[80px_1fr] gap-4 text-xs">
                      <span className="font-bold text-emerald-600">
                        Solution
                      </span>
                      <div>
                        <span className="text-stone-800 font-medium leading-relaxed block mb-1">
                          <FormattedText text={section.solution} />
                        </span>
                        {section.details && (
                          <ul className="list-disc list-outside ml-3 text-stone-600 space-y-0.5 mt-1">
                            {section.details.map((d, i) => (
                              <li key={i}>
                                <FormattedText text={d} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
