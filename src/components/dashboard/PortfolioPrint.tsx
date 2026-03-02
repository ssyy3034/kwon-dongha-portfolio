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

      {/* Project Summaries (Quick Look) */}
      <section className="mb-12">
        <h2 className="text-sm font-black text-stone-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
          Project Summaries
          <div className="h-px bg-stone-200 flex-1"></div>
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="border-l-4 border-stone-100 pl-6 py-2"
            >
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="text-xl font-black text-stone-900">
                  {project.title}
                  <span className="text-sm font-medium text-stone-500 ml-3">
                    {project.subtitle}
                  </span>
                </h3>
                <span className="text-sm font-bold text-stone-400">
                  {project.period}
                </span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                <FormattedText noDark text={project.description} />
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-stone-50 text-stone-500 text-[10px] font-bold rounded border border-stone-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
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

      {/* ===== PROJECT DETAIL PAGES (Deep Dive) ===== */}
      {projects.map((project) => {
        const detail = getProjectDetail(project.id);
        if (!detail) return null;

        return (
          <div key={`${project.id}-detail`} className="break-before-page pt-12">
            {/* Project Cover Header */}
            <div
              className={`mb-12 p-10 rounded-3xl bg-gradient-to-br ${project.color === "amber" ? "from-amber-50 to-orange-50" : "from-red-50 to-rose-50"} border border-stone-100`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-black text-stone-900 tracking-tight mb-2">
                    {project.title}
                  </h2>
                  <p
                    className={`text-lg font-bold ${project.color === "amber" ? "text-amber-600" : "text-red-600"}`}
                  >
                    {project.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-black text-stone-400 uppercase tracking-widest">
                    {project.period}
                  </span>
                  <span className="block text-sm font-bold text-stone-600 mt-1">
                    {project.role}
                  </span>
                </div>
              </div>
              <div className="p-6 bg-white/60 backdrop-blur rounded-2xl border border-white/50 text-base text-stone-700 leading-relaxed font-medium">
                <FormattedText noDark text={detail.overview} />
              </div>
            </div>

            {/* Achievements Section */}
            <section className="mb-12 break-inside-avoid">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] mb-6">
                Key Achievements
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {detail.achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-stone-50 border border-stone-100 rounded-2xl"
                  >
                    <div
                      className={`text-2xl font-black ${project.color === "amber" ? "text-amber-600" : "text-red-600"} mb-2`}
                    >
                      {ach.metric}
                    </div>
                    <div className="text-sm font-black text-stone-900 mb-1">
                      {ach.label}
                    </div>
                    <div className="text-xs text-stone-500 leading-relaxed">
                      {ach.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Case Studies */}
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] mb-8">
              Technical Deep Dive
            </h3>
            <div className="space-y-16">
              {[
                ...(detail.sections.backend ?? []),
                ...(detail.sections.frontend ?? []),
              ].map((section, idx) => (
                <article key={idx} className="break-inside-avoid space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${project.color === "amber" ? "bg-amber-600" : "bg-red-600"}`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-stone-900">
                        {section.title}
                      </h4>
                      <p className="text-sm font-bold text-stone-400">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {/* Problem - Solution - Result 3단 구성 */}
                    <div className="flex flex-col gap-6">
                      <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-2xl">
                        <p className="text-[10px] font-black text-rose-600 uppercase mb-2 tracking-widest">
                          The Problem
                        </p>
                        <div className="text-sm text-stone-700 leading-relaxed">
                          <FormattedText noDark text={section.problem} />
                        </div>
                      </div>

                      <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                        <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest">
                          Engineering Approach
                        </p>
                        <div className="text-sm text-stone-800 leading-relaxed font-bold mb-4">
                          <FormattedText noDark text={section.approach} />
                        </div>
                        {section.details && (
                          <ul className="space-y-2">
                            {section.details.map((bullet, i) => (
                              <li
                                key={i}
                                className="flex gap-3 text-xs text-stone-600 leading-normal"
                              >
                                <span className="text-emerald-400 font-black">
                                  •
                                </span>
                                <FormattedText noDark text={bullet} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {section.retrospective && (
                        <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-2xl italic">
                          <p className="text-[10px] font-black text-amber-600 uppercase mb-2 tracking-widest not-italic">
                            Engineers Perspective & Retrospective
                          </p>
                          <div className="text-xs text-stone-600 leading-relaxed">
                            <FormattedText
                              noDark
                              text={section.retrospective}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
