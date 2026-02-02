"use client";

import { useProfile } from "@/context/ProfileContext";

export default function Skills() {
  const { profile } = useProfile();

  // Helper to generate Shields.io URL
  const getBadgeUrl = (name: string, slug: string, color: string) => {
    const encodedName = encodeURIComponent(
      name.replace(/-/g, "--").replace(/_/g, "__"),
    );
    return `https://img.shields.io/badge/${encodedName}-${color}?style=flat-square&logo=${slug}&logoColor=white`;
  };

  return (
    <section className="space-y-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1 bg-amber-500 rounded-full" />
        <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          보유 기술 스택
        </h2>
      </div>

      <div className="grid gap-8">
        {profile.skills.map((category, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-sm font-black text-stone-600 dark:text-stone-400 uppercase tracking-widest pl-1 flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? "bg-amber-500" : idx === 1 ? "bg-stone-400 dark:bg-stone-500" : "bg-stone-200 dark:bg-stone-600"}`}
              />
              {category.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.items.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="group flex flex-col gap-3 p-5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg dark:hover:shadow-stone-900/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getBadgeUrl(skill.name, skill.slug, skill.color)}
                      alt={skill.name}
                      className="h-6 object-contain rounded-sm"
                    />
                  </div>
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
