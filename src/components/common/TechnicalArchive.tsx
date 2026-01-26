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
          ? "bg-white border-[#e8e4e1] shadow-lg ring-1 ring-[#4a3b31]/5"
          : "bg-[#fcfaf9] border-[#e8e4e1] hover:border-[#b5aea7]"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isOpen ? "bg-[#4a3b31] text-white" : "bg-[#f5f2f0] text-[#8c8279]"
            }`}
          >
            {isOpen ? <Zap size={14} /> : <HelpCircle size={14} />}
          </div>
          <span
            className={`text-[15px] font-black tracking-tight ${isOpen ? "text-[#24201e]" : "text-[#6e645c]"}`}
          >
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-[#b5aea7]" />
        ) : (
          <ChevronDown size={18} className="text-[#b5aea7]" />
        )}
      </button>

      {isOpen && (
        <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="h-[1px] w-full bg-[#f5f2f0] mb-8" />
          <div className="prose prose-stone max-w-none">{children}</div>
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
