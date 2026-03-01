import { Code2, Cpu, Database, Layout } from "lucide-react";

export const projectIcons = {
  stolink: Code2,
  pintos: Cpu,
  aidiary: Database,
  garden: Layout,
} as const;

export const accentColors = {
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-500",
    border: "border-amber-200 dark:border-amber-700",
    light: "bg-amber-50 dark:bg-amber-900/30",
    gradient: "from-amber-500 to-orange-600",
    tab: "border-amber-500 text-amber-600 dark:text-amber-400",
  },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-500",
    border: "border-emerald-200 dark:border-emerald-700",
    light: "bg-emerald-50 dark:bg-emerald-900/30",
    gradient: "from-emerald-500 to-teal-600",
    tab: "border-emerald-500 text-emerald-600 dark:text-emerald-400",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-500",
    border: "border-indigo-200 dark:border-indigo-700",
    light: "bg-indigo-50 dark:bg-indigo-900/30",
    gradient: "from-indigo-500 to-purple-600",
    tab: "border-indigo-500 text-indigo-600 dark:text-indigo-400",
  },
  rose: {
    bg: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-500",
    border: "border-rose-200 dark:border-rose-700",
    light: "bg-rose-50 dark:bg-rose-900/30",
    gradient: "from-rose-500 to-pink-600",
    tab: "border-rose-500 text-rose-600 dark:text-rose-400",
  },
  sage: {
    bg: "bg-lime-600",
    text: "text-lime-700 dark:text-lime-400",
    border: "border-lime-200 dark:border-lime-700",
    light: "bg-lime-50 dark:bg-lime-900/30",
    gradient: "from-lime-500 to-green-600",
    tab: "border-lime-500 text-lime-600 dark:text-lime-400",
  },
  peach: {
    bg: "bg-orange-300",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-700",
    light: "bg-orange-50 dark:bg-orange-900/30",
    gradient: "from-rose-300 to-orange-400",
    tab: "border-orange-500 text-orange-600 dark:text-orange-400",
  },
  sky: {
    bg: "bg-sky-400",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-700",
    light: "bg-sky-50 dark:bg-sky-900/30",
    gradient: "from-sky-400 to-cyan-500",
    tab: "border-sky-500 text-sky-600 dark:text-sky-400",
  },
  red: {
    bg: "bg-red-600",
    text: "text-red-600 dark:text-red-500",
    border: "border-red-300 dark:border-red-700",
    light: "bg-red-50 dark:bg-red-900/30",
    gradient: "from-red-600 to-red-800",
    tab: "border-red-500 text-red-600 dark:text-red-400",
  },
} as const;

export type AccentColorKey = keyof typeof accentColors;

export function getProjectColors(color: string) {
  return accentColors[color as AccentColorKey] || accentColors.amber;
}

export function getProjectIcon(id: string) {
  return projectIcons[id as keyof typeof projectIcons] || Code2;
}
