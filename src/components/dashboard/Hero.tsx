"use client";

import {
  ArrowRight,
  Folder,
  Github,
  Mail,
  BookOpen,
  Code,
  Lightbulb,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useProfile } from "@/context/ProfileContext";
import { Typewriter } from "@/components/ui/Typewriter";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function Hero({
  streak,
  heatmapData,
}: {
  streak: number;
  heatmapData: any[];
}) {
  const { profile } = useProfile();
  const [tooltip, setTooltip] = React.useState<{
    show: boolean;
    data: any;
    x: number;
    y: number;
  }>({ show: false, data: null, x: 0, y: 0 });

  return (
    <header className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 pb-12 md:pt-24 md:pb-20">
      {/* 1. HEADER SECTION (Full Width) */}
      <div className="max-w-4xl mb-12 lg:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold">{profile.bio.badge}</span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]">
          I&apos;m{" "}
          <Typewriter
            words={[profile.name]}
            loop={false}
            cursorClassName="hidden"
          />
          , a<br />
          <span className="inline-grid pb-2">
            {/* Ghost text for layout */}
            <span className="invisible col-start-1 row-start-1 font-black leading-[0.9] tracking-tight pb-2">
              {profile.role}|
            </span>
            {/* Actual text with gradient */}
            <span className="col-start-1 row-start-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 font-black leading-[0.9] tracking-tight pb-2">
              <Typewriter
                words={["Software Engineer", "Problem Solver", "Team Player"]}
                loop={true}
                delaySpeed={3000}
                typeSpeed={80}
                deleteSpeed={50}
                cursorClassName="text-amber-500"
              />
            </span>
          </span>
        </h1>
        <p className="mt-8 text-xl md:text-2xl text-stone-600 dark:text-stone-400 font-medium max-w-2xl leading-relaxed">
          {profile.bio.headline.replace("{name}", profile.name)}
        </p>
      </div>

      {/* 2. CONTENT COLUMNS */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 lg:gap-20">
        {/* LEFT COLUMN: Intro Cards */}
        <div className="flex-1 max-w-2xl">
          {/* Data-driven Persona */}
          <div className="space-y-6 mb-10">
            {profile.bio.paragraphs.map((p, i) => {
              const titles = [
                {
                  icon: Code,
                  label: "Software Engineer",
                  color: "text-blue-500 dark:text-blue-400",
                  bg: "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800",
                },
                {
                  icon: Lightbulb,
                  label: "Problem Solver",
                  color: "text-amber-500 dark:text-amber-400",
                  bg: "bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800",
                },
                {
                  icon: Users,
                  label: "Team Player",
                  color: "text-emerald-500 dark:text-emerald-400",
                  bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800",
                },
              ];
              const info = titles[i] || titles[0];
              const Icon = info.icon;

              return (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-5 sm:p-6 rounded-3xl bg-white/40 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 hover:bg-white/80 dark:hover:bg-stone-800/80 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-xl dark:hover:shadow-stone-900/50 transition-all duration-500 group relative overflow-hidden"
                >
                  <div
                    className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${info.bg} border flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                  >
                    <Icon
                      className={`${info.color} w-6 h-6 sm:w-[26px] sm:h-[26px]`}
                    />
                  </div>
                  <div className="relative z-10 min-w-0">
                    <h3 className={`font-black text-lg mb-2 ${info.color}`}>
                      {info.label}
                    </h3>
                    <p className="text-stone-900 dark:text-stone-100 font-bold mb-2 text-[15px]">
                      {p.slogan}
                    </p>
                    <ul className="space-y-1.5">
                      {p.points.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2 text-stone-600 dark:text-stone-400 text-[14px] leading-relaxed font-medium"
                        >
                          <span className="shrink-0 text-amber-500">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 dark:bg-amber-600 text-white rounded-2xl text-base font-black hover:bg-stone-800 dark:hover:bg-amber-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 group"
            >
              <Folder
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              프로젝트 둘러보기
              <ArrowRight
                size={18}
                className="group-hover:translate-x-2 transition-transform"
              />
            </Link>
            {/* <Link
              href="/resume"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-stone-200 text-stone-900 rounded-2xl text-base font-black hover:bg-stone-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 group"
            >
              <FileText
                size={20}
                className="group-hover:scale-110 transition-transform text-amber-600"
              />
              이력서 보기
            </Link> */}
            <a
              href={profile.cta.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-2xl text-sm font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all duration-300"
            >
              {profile.cta.secondary.text}
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Profile & Stats */}
        <div className="flex flex-col gap-5 shrink-0 w-full lg:w-auto">
          {/* Profile Card */}
          <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-2xl border border-stone-200 dark:border-stone-700 rounded-[32px] p-8 premium-shadow group hover:-translate-y-1.5 transition-all duration-500 w-full lg:w-[520px] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 dark:bg-amber-500/10 blur-[80px] rounded-full -mr-10 -mt-10" />

            <div className="flex items-start gap-8 relative z-10">
              {/* Avatar Slot */}
              <div className="w-40 min-h-[160px] shrink-0 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-700 shadow-inner bg-stone-100 dark:bg-stone-800 relative group-hover:scale-[1.02] transition-transform duration-500 flex items-center justify-center">
                <div className="absolute inset-0 bg-stone-200 dark:bg-stone-700 flex items-center justify-center pointer-events-none">
                  <span className="text-6xl text-stone-400 dark:text-stone-500">
                    👤
                  </span>
                </div>
                {/* Fallback pattern if no image, or actual image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar || "/images/me.jpg"}
                  alt={profile.name}
                  className="w-full h-auto relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Personal Info */}
              <div className="flex-1 pt-1 min-w-0">
                <div>
                  <h3 className="text-3xl font-black text-stone-900 dark:text-stone-100 leading-tight mb-1 truncate">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-5">
                    {profile.role}
                  </p>

                  {/* Social Links (Repo/Blog/Mail) */}
                  <div className="flex gap-3 mb-6">
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-900 dark:hover:bg-stone-100 hover:text-white dark:hover:text-stone-900 hover:scale-110 transition-all duration-300 shadow-sm"
                      aria-label="GitHub"
                    >
                      <Github size={18} />
                    </a>
                    <a
                      href={`mailto:${profile.social.email}`}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-blue-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                      aria-label="Email"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Now Learning (Interests) */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2 pl-1">
                      최근 관심 분야
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills
                        .find((s) => s.category === "관심 분야")
                        ?.items.map((skill) => (
                          <span
                            key={skill.slug}
                            className="px-2 py-1 rounded-md bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            {skill.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row (Full Width Streak) */}
          <div className="w-full bg-stone-900 rounded-[32px] p-6 shadow-2xl text-white group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full -mr-20 -mt-20 animate-pulse" />

            {/* Header - 숫자보다 메시지와 그래프 비주얼 강조 */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-xs font-bold text-stone-300 uppercase tracking-widest">
                  Consistency is Key
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Streak</span>
                  <span className="font-bold text-emerald-400">{streak}일</span>
                </div>
              </div>
            </div>

            {/* Heatmap Container */}
            <div className="relative z-10 opacity-90 mix-blend-screen w-full overflow-hidden">
              <CalendarHeatmap
                startDate={
                  new Date(new Date().setDate(new Date().getDate() - 170))
                }
                endDate={new Date()}
                values={heatmapData}
                gutterSize={3}
                showWeekdayLabels={false}
                classForValue={(value: any) => {
                  if (!value || value.count === 0) return "color-empty-dark";
                  return `color-scale-${Math.min(value.count, 4)}`;
                }}
                onMouseOver={(event: any, value: any) => {
                  if (!value) return;
                  // @ts-ignore
                  const rect = event.target.getBoundingClientRect();
                  setTooltip({
                    show: true,
                    data: value,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => {
                  setTooltip({ ...tooltip, show: false });
                }}
              />
            </div>

            {/* Tooltip */}
            {tooltip.show && tooltip.data && (
              <div
                className="fixed z-50 bg-stone-950/90 backdrop-blur-md border border-stone-700 text-white text-[10px] px-3 py-2 rounded-xl shadow-xl space-y-1 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-8px]"
                style={{ top: tooltip.y, left: tooltip.x }}
              >
                <p className="font-bold text-stone-300 border-b border-stone-800 pb-1 mb-1">
                  {tooltip.data.date}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-stone-400">Commits</span>
                  <span className="font-bold text-emerald-400">
                    {tooltip.data.commits || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-stone-400">Posts</span>
                  <span className="font-bold text-amber-400">
                    {tooltip.data.posts || 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
