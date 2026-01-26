"use client";

import {
  Sparkles,
  Folder,
  Github,
  Home,
  PenTool,
  Globe,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useProfile } from "@/context/ProfileContext";

export default function Nav() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePrintPDF = useCallback(() => {
    window.print();
  }, []);

  const navItems = [
    { name: "홈", href: "/", icon: Home },
    { name: "프로젝트", href: "/#projects", icon: Folder },
    {
      name: "GitHub",
      href: profile.social.github,
      icon: Github,
      external: true,
    },
    {
      name: "블로그",
      href: profile.social.blog,
      icon: Globe,
      external: true,
    },
    { name: "스튜디오", href: "/customize", icon: PenTool },
  ];

  return (
    <>
      {/* DESKTOP NAV */}
      <nav
        className={clsx(
          "hidden md:block sticky top-0 z-[100] w-full transition-all duration-500 border-b no-print",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-stone-200/60 py-3"
            : "bg-transparent border-transparent py-5",
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform hover:scale-[1.02]"
          >
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base tracking-wide uppercase leading-none text-stone-900">
                {profile.name}
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isProjectsLink = item.href === "/#projects";
              const isProjectDetail = pathname?.startsWith("/projects/");
              const isActive =
                pathname === item.href || (isProjectsLink && isProjectDetail);

              const Component = item.external ? "a" : Link;
              const props = item.external
                ? {
                    href: item.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : { href: item.href };

              return (
                // @ts-ignore
                <Component
                  key={item.name}
                  {...props}
                  className={clsx(
                    "flex items-center gap-2 text-sm font-bold transition-all duration-300 relative py-2",
                    isActive
                      ? "text-amber-600"
                      : "text-stone-600 hover:text-stone-900",
                  )}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-amber-600" : ""}
                  />
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-amber-600 rounded-full" />
                  )}
                </Component>
              );
            })}
          </div>

          {/* PDF Button */}
          <button
            onClick={handlePrintPDF}
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          >
            <FileDown size={18} />
            <span className="text-sm font-bold">PDF 저장</span>
          </button>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-[420px] no-print">
        <div className="px-2 py-2.5 bg-stone-950/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center">
          <div className="flex items-center flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isProjectsLink = item.href === "/#projects";
              const isProjectDetail = pathname?.startsWith("/projects/");
              const isActive =
                pathname === item.href || (isProjectsLink && isProjectDetail);

              const Component = item.external ? "a" : Link;
              const props = item.external
                ? {
                    href: item.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : { href: item.href };

              return (
                // @ts-ignore
                <Component
                  key={item.name}
                  {...props}
                  className={clsx(
                    "flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all duration-300",
                    isActive
                      ? "text-amber-400 bg-white/10"
                      : "text-stone-400 hover:text-white",
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-bold">{item.name}</span>
                </Component>
              );
            })}
          </div>

          <div className="w-[1px] h-8 bg-white/10 mx-2" />

          {/* Mobile PDF Button */}
          <button
            onClick={handlePrintPDF}
            className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
            aria-label="PDF로 저장"
          >
            <FileDown size={22} />
          </button>
        </div>
      </nav>
    </>
  );
}
