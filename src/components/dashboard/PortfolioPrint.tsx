"use client";

import { useProfile } from "@/context/ProfileContext";
import projects from "@/config/projects.json";
import { getProjectDetail } from "@/data/project-details";
import FormattedText from "@/components/common/FormattedText";
import { Code, Lightbulb, Users } from "lucide-react";

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
        <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">
          About
        </h2>
        <div className="flex flex-col gap-4">
          {profile.bio.cards?.map((card, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 border border-stone-200 rounded-2xl bg-white shadow-sm break-inside-avoid"
            >
              {/* Icon Box */}
              <div
                className="flex items-center justify-center shrink-0 w-12 h-12 rounded-xl"
                style={{
                  backgroundColor: `${card.color}15`, // Ultra light background
                  color: card.color,
                }}
              >
                {card.icon === "code" && <Code className="w-6 h-6" />}
                {card.icon === "bulb" && <Lightbulb className="w-6 h-6" />}
                {card.icon === "users" && <Users className="w-6 h-6" />}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className="text-base font-bold mb-1.5"
                  style={{ color: card.color }}
                >
                  {card.title}
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed text-justify">
                  {/* Highlighter Logic */}
                  {typeof card.content === "string" ? (
                    card.content.split("**").map((text, i) =>
                      i % 2 === 1 ? (
                        <span
                          key={i}
                          className="font-bold px-0.5"
                          style={{ backgroundColor: "#fff3cd" }} // Yellow highlighter
                        >
                          {text}
                        </span>
                      ) : (
                        text
                      ),
                    )
                  ) : (
                    <span>{JSON.stringify(card.content)}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Skills Quick View */}
      <section className="mb-8">
        <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">
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
        <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">
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
                <span className="text-xs text-stone-500">{project.period}</span>
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
                <FormattedText noDark text={project.description} />
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
              <p className="text-xs text-stone-500">
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
          <div
            key={`${project.id}-detail`}
            className="break-before-page pt-10 px-4"
          >
            {/* Project Header - More Compact & Professional */}
            <div className="mb-8 border-l-4 border-stone-900 pl-6 py-2 bg-stone-50/50">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h2 className="text-3xl font-black text-stone-900 tracking-tight">
                    {project.title}
                  </h2>
                  <p className="text-base text-stone-600 font-bold mt-1">
                    {project.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-black text-stone-900">
                    {project.period}
                  </span>
                  <span className="block text-xs font-bold text-amber-600 uppercase tracking-tighter mt-1">
                    {project.role}
                  </span>
                </div>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed font-medium max-w-3xl">
                <FormattedText noDark text={detail.overview} />
              </p>
            </div>

            {/* Main Content Grid: Results & Tech Stack */}
            <div className="grid grid-cols-[1fr_250px] gap-8 mb-10 items-start">
              {/* Key Results - Visual Anchors */}
              <section className="break-inside-avoid">
                <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-4">
                  Core Achievements & Impact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {detail.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-stone-100 rounded-2xl shadow-sm"
                    >
                      <div className="text-xl font-black text-amber-600 mb-1">
                        {ach.metric}
                      </div>
                      <div className="text-xs font-black text-stone-900 mb-1">
                        {ach.label}
                      </div>
                      <div className="text-[10px] text-stone-500 leading-normal">
                        {ach.description}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tech Stack - Side Column for better space usage */}
              <section className="break-inside-avoid bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-4">
                  Tech Stack
                </h3>
                <div className="space-y-4">
                  {detail.techStack.map((stack, idx) => (
                    <div key={idx}>
                      <p className="text-[9px] font-black text-stone-500 uppercase mb-1">
                        {stack.category}
                      </p>
                      <p className="text-xs font-bold text-stone-800 leading-tight">
                        {stack.items.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Technical Decisions (ADR) - Compact Row Based Layout */}
            {detail.decisions && (
              <section className="mb-10 break-inside-avoid">
                <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-4">
                  Architectural Decision Records
                </h3>
                <div className="space-y-3">
                  {/* Category Sections as Compact Headers */}
                  {[
                    { key: "initial", label: "Initial Framework & Core" },
                    { key: "development", label: "Development & Optimization" },
                  ].map((cat) => (
                    <div key={cat.key} className="mb-6">
                      <h4 className="text-[11px] font-black text-stone-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-3 bg-stone-300 rounded-full" />
                        {cat.label}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {detail
                          .decisions!.filter((d) => d.type === cat.key)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="p-3 border border-stone-100 rounded-xl bg-stone-50/30"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-black bg-stone-900 text-white px-1.5 py-0.5 rounded leading-none">
                                  {item.id}
                                </span>
                                <span className="text-xs font-black text-stone-900">
                                  {item.decision}
                                </span>
                              </div>
                              <p className="text-[10px] text-stone-600 leading-relaxed mb-1.5">
                                {item.reason}
                              </p>
                              {item.tradeoff && (
                                <p className="text-[10px] text-amber-700 font-bold leading-tight border-t border-amber-100/50 pt-1.5 mt-1.5 flex gap-1">
                                  <span className="shrink-0">→</span>
                                  <span>{item.tradeoff}</span>
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Technical Deep Dive - Structured & Scannable */}
            <section className="break-inside-avoid">
              <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-4">
                Technical Deep Dive (Case Studies)
              </h3>
              <div className="space-y-4">
                {detail.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="border border-stone-200 rounded-2xl overflow-hidden break-inside-avoid"
                  >
                    <div className="px-5 py-2.5 bg-stone-900 text-white flex justify-between items-center">
                      <h4 className="text-xs font-black tracking-tight">
                        {idx + 1}. {section.title}
                      </h4>
                      {section.impact && (
                        <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded">
                          RESULT: {section.impact}
                        </span>
                      )}
                    </div>
                    <div className="p-5 grid grid-cols-[1fr_1.5fr] gap-6">
                      <div>
                        <p className="text-[9px] font-black text-red-600 uppercase mb-2">
                          Challenge
                        </p>
                        <p className="text-[11px] text-stone-700 leading-relaxed font-medium">
                          <FormattedText noDark text={section.challenge} />
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-emerald-600 uppercase mb-2">
                          Solution & Implementation
                        </p>
                        <p className="text-[11px] text-stone-900 leading-relaxed font-bold mb-3">
                          <FormattedText noDark text={section.solution} />
                        </p>
                        {section.details && (
                          <div className="space-y-1.5">
                            {section.details.map((bullet, i) => (
                              <div
                                key={i}
                                className="flex gap-2 text-[10px] text-stone-600 leading-normal"
                              >
                                <span className="text-stone-400 font-black mt-px">
                                  •
                                </span>
                                <FormattedText noDark text={bullet} />
                              </div>
                            ))}
                          </div>
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
