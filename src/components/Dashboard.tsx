"use client";

import { useRef } from "react";
import { GitHubStreakData } from "@/lib/github-fetcher";
import Nav from "./dashboard/Nav";
import Hero from "./dashboard/Hero";
import Skills from "./dashboard/Skills";
import ProjectList from "./dashboard/ProjectList";
import PortfolioPrint from "./dashboard/PortfolioPrint";
import { useProfile } from "@/context/ProfileContext";
import { ChevronDown } from "lucide-react";

export default function Dashboard({
  streakData,
}: {
  streakData: GitHubStreakData;
}) {
  const { profile } = useProfile();
  const contentRef = useRef<HTMLElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FEFDFB] dark:bg-stone-950 text-stone-900 dark:text-stone-50 font-sans antialiased selection:bg-amber-500 selection:text-white transition-colors duration-300">
      {/* PDF 출력 전용 포트폴리오 */}
      <div className="print-portfolio">
        <PortfolioPrint />
      </div>

      <Nav />

      {/* HERO */}
      <section className="min-h-[100svh] flex flex-col no-print relative">
        <div className="flex-1 animate-fade-in-up opacity-0 fill-mode-forwards">
          <Hero streak={streakData.streak} heatmapData={streakData.heatmap} />
        </div>

        {/* Scroll Indicator — hidden on mobile when hero overflows */}
        <button
          onClick={scrollToContent}
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-stone-400 hover:text-amber-600 transition-colors group cursor-pointer"
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

      {/* SKILLS */}
      <section
        ref={contentRef}
        id="skills"
        className="py-24 md:py-32 bg-white dark:bg-stone-900 border-y border-stone-100 dark:border-stone-800 no-print"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Skills />
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="py-24 md:py-32 bg-stone-50/50 dark:bg-stone-950 border-b border-stone-100 dark:border-stone-800 no-print"
      >
        <ProjectList />
      </section>

      {/* FOOTER */}
      <footer className="py-16 no-print">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p className="text-sm font-black text-stone-900 dark:text-stone-100 mb-1">
                {profile.name}
              </p>
              <p className="text-xs text-stone-400">{profile.role}</p>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                GitHub
              </a>
              <a
                href={`mailto:${profile.social.email}`}
                className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-100 dark:border-stone-800 text-center text-[10px] text-stone-300 dark:text-stone-600">
            <span>
              &copy; {new Date().getFullYear()} {profile.name}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
