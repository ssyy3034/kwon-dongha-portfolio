"use client";

import {
  Sparkles,
  Folder,
  Github,
  Home,
  FileDown,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useTheme } from "next-themes";

export default function Nav() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handlePrintPDF = useCallback(() => {
    window.print();
  }, []);

  const handleHashClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      if (href.startsWith("/#")) {
        e.preventDefault();
        const hash = href.slice(1); // "/#projects" -> "#projects"

        if (pathname === "/") {
          // 같은 페이지면 바로 스크롤
          const element = document.querySelector(hash);
          element?.scrollIntoView({ behavior: "smooth" });
        } else {
          // 다른 페이지면 홈으로 이동 후 스크롤
          router.push("/");
          setTimeout(() => {
            const element = document.querySelector(hash);
            element?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    },
    [pathname, router],
  );

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
    // { name: "이력서", href: "/resume", icon: FileText, external: true },
  ];

  return (
    <>
      {/* DESKTOP NAV */}
      <nav
        className={clsx(
          "hidden md:block sticky top-0 z-[100] w-full transition-all duration-500 border-b no-print",
          scrolled
            ? "bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-stone-200/60 dark:border-stone-700/60 py-3"
            : "bg-transparent border-transparent py-5",
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform hover:scale-[1.02]"
          >
            <div className="w-10 h-10 bg-stone-900 dark:bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base tracking-wide uppercase leading-none text-stone-900 dark:text-stone-100">
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
                  onClick={(e: React.MouseEvent) =>
                    handleHashClick(e, item.href)
                  }
                  className={clsx(
                    "flex items-center gap-2 text-sm font-bold transition-all duration-300 relative py-2",
                    isActive
                      ? "text-amber-600 dark:text-amber-500"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100",
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

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 text-stone-600 dark:text-amber-400 hover:scale-110 hover:shadow-lg dark:hover:shadow-amber-500/20 active:scale-95 transition-all duration-300 border border-stone-200/50 dark:border-stone-700/50 overflow-hidden group"
              aria-label="테마 변경"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-500/0 group-hover:from-amber-400/10 group-hover:to-amber-500/20 dark:group-hover:from-amber-400/20 dark:group-hover:to-amber-500/30 transition-all duration-300" />
              {mounted ? (
                (resolvedTheme || theme) === "dark" ? (
                  <Sun
                    size={18}
                    className="relative z-10 transition-transform duration-300 group-hover:rotate-45"
                  />
                ) : (
                  <Moon
                    size={18}
                    className="relative z-10 transition-transform duration-300 group-hover:-rotate-12"
                  />
                )
              ) : (
                <Moon size={18} className="relative z-10" />
              )}
            </button>

            {/* PDF Button */}
            <button
              onClick={handlePrintPDF}
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-600 text-white hover:bg-stone-800 dark:hover:bg-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              <FileDown size={18} />
              <span className="text-sm font-bold">PDF 저장</span>
            </button>
          </div>
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
                  onClick={(e: React.MouseEvent) =>
                    handleHashClick(e, item.href)
                  }
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

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-amber-500/30 active:scale-95 transition-all duration-300 overflow-hidden group"
            aria-label="테마 변경"
          >
            {mounted ? (
              (resolvedTheme || theme) === "dark" ? (
                <Sun
                  size={20}
                  className="text-amber-400 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110"
                />
              ) : (
                <Moon
                  size={20}
                  className="text-white transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                />
              )
            ) : (
              <Moon size={20} className="text-white" />
            )}
          </button>

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
