"use client";

import { motion } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";
import { Code, Lightbulb, Users, TerminalSquare } from "lucide-react";

export default function Philosophy() {
  const { profile } = useProfile();
  
  const icons = [Code, Lightbulb, Users];
  const bgColors = [
    "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  ];

  return (
    <section id="philosophy" className="py-24 md:py-32 lg:py-40 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 relative overflow-hidden no-print">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 dark:via-stone-700 to-transparent" />
      
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           className="mb-20 md:mb-32 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <TerminalSquare size={14} /> Core Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight" style={{ fontFamily: "var(--font-editorial)" }}>
            이런 개발자로 일하고 싶습니다
          </h2>
        </motion.div>

        <div className="space-y-20 md:space-y-32">
          {profile.bio.paragraphs.map((p, i) => {
            const Icon = icons[i] || Code;
            
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row gap-6 md:gap-16 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Icon Area */}
                <div className="shrink-0 relative">
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl border shadow-sm flex items-center justify-center ${bgColors[i]}`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 mt-2 md:mt-4">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 leading-tight text-stone-900 dark:text-stone-100 tracking-tight break-keep border-b-2 border-stone-100 dark:border-stone-800 pb-6">
                    {p.slogan}
                  </h3>
                  <div className="space-y-5">
                    {p.points.map((point, idx) => (
                      <p key={idx} className="text-[15px] sm:text-[17px] md:text-lg text-stone-600 dark:text-stone-400 leading-[1.8] font-medium break-keep">
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
