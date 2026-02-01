"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Zap, HelpCircle } from "lucide-react";

interface ArchiveItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

export function ArchiveItem({
  title,
  children,
  isOpen: initialOpen = false,
}: ArchiveItemProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div
      className={`mb-4 rounded-3xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 shadow-lg ring-1 ring-stone-900/5 dark:ring-stone-100/5"
          : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isOpen ? "bg-stone-800 dark:bg-amber-600 text-white" : "bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400"
            }`}
          >
            {isOpen ? <Zap size={14} /> : <HelpCircle size={14} />}
          </div>
          <span
            className={`text-[15px] font-black tracking-tight ${isOpen ? "text-stone-900 dark:text-stone-100" : "text-stone-600 dark:text-stone-400"}`}
          >
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-stone-400" />
        ) : (
          <ChevronDown size={18} className="text-stone-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="h-[1px] w-full bg-stone-100 dark:bg-stone-700 mb-8" />
          <div className="prose prose-stone dark:prose-invert max-w-none">{children}</div>
        </div>
      )}
    </div>
  );
}

interface ArchiveGridProps {
  children: React.ReactNode;
}

export function ArchiveGrid({ children }: ArchiveGridProps) {
  return <div className="grid grid-cols-1 gap-4 mt-12">{children}</div>;
}
