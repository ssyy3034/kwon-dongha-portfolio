"use client";

import { DashboardData } from "@/lib/graph-loader";
import { useRef } from "react";
import Nav from "./dashboard/Nav";
import Hero from "./dashboard/Hero";
import Skills from "./dashboard/Skills";
import ProjectList from "./dashboard/ProjectList";
import EngineeringLogs from "./dashboard/EngineeringLogs";
import PortfolioPrint from "./dashboard/PortfolioPrint";
import { useProfile } from "@/context/ProfileContext";
import { ChevronDown } from "lucide-react";

export default function Dashboard({
  data,
  hideNav = false,
}: {
  data: DashboardData;
  hideNav?: boolean;
}) {
  const { profile } = useProfile();
  const projectsRef = useRef<HTMLElement>(null);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FEFDFB] text-stone-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* PDF 출력 전용 포트폴리오 */}
      <div className="print-portfolio">
        <PortfolioPrint />
      </div>

      {/* 웹 전용 콘텐츠 */}
      {!hideNav && <Nav />}

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO - 임팩트 있는 첫인상 (Full Viewport)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="min-h-[100svh] flex flex-col no-print relative">
        <div className="flex-1 animate-fade-in-up opacity-0 fill-mode-forwards">
          <Hero
            totalActivity={data.totalActivity}
            streak={data.streak}
            radarData={data.radar}
            heatmapData={data.heatmap}
          />
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToProjects}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400 hover:text-amber-600 transition-colors group cursor-pointer"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Scroll to explore
          </span>
          <ChevronDown
            size={20}
            className="animate-bounce group-hover:text-amber-600"
          />
        </button>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: PROJECTS - 핵심 프로젝트 (가장 중요)
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={projectsRef}
        id="projects"
        className="py-24 md:py-32 bg-white border-y border-stone-100 animate-fade-in-up opacity-0 delay-100 fill-mode-forwards no-print"
      >
        <ProjectList />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: SKILLS - 접이식 패널로 정보 밀도 완화
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 no-print">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Skills />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: RECENT LOGS - 최근 학습 기록
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-stone-100 no-print">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <EngineeringLogs recentPosts={data.recentPosts} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER - 미니멀하게 정리
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-16 border-t border-stone-100 no-print">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p className="text-sm font-black text-stone-900 mb-1">
                {profile.name}
              </p>
              <p className="text-xs text-stone-400">
                Engineering Knowledge Garden
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </div>
              <a
                href={`mailto:${profile.social.email}`}
                className="text-xs font-bold text-stone-600 hover:text-amber-600 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-50 flex justify-between text-[10px] text-stone-300">
            <span>
              &copy; {new Date().getFullYear()} {profile.name}
            </span>
            <span>v1.5.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
