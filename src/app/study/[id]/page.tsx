import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, FileText } from "lucide-react";
import { glob } from "glob";
import Nav from "@/components/dashboard/Nav";
import MarkdownRenderer from "./MarkdownRenderer";

const STUDY_PATH = path.join(process.cwd(), "study");

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getStudyContent(id: string) {
  // 하위 디렉토리까지 검색
  const files = await glob(`**/${id}.md`, {
    cwd: STUDY_PATH,
    ignore: ["**/.obsidian/**"],
    absolute: true,
  });

  if (files.length === 0) {
    return null;
  }

  const filePath = files[0];
  const content = fs.readFileSync(filePath, "utf-8");
  const stats = fs.statSync(filePath);
  const { data, content: markdown } = matter(content);

  return {
    id,
    title: data.title || id,
    tags: data.tags || [],
    date: data.date
      ? new Date(data.date).toISOString().split("T")[0]
      : stats.birthtime.toISOString().split("T")[0],
    content: markdown,
  };
}

export default async function StudyPage({ params }: PageProps) {
  const { id } = await params;
  const study = await getStudyContent(decodeURIComponent(id));

  if (!study) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Nav />

      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-20">
        {/* Back Link */}
        <Link
          href="/#"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-8 group text-sm font-medium"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          돌아가기
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <FileText
                size={20}
                className="text-amber-600 dark:text-amber-500"
              />
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
              학습 기록
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight mb-6"
            style={{ fontFamily: "var(--font-editorial)" }}
          >
            {study.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{study.date}</span>
            </div>
            {study.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag size={14} />
                <div className="flex gap-2">
                  {(Array.isArray(study.tags) ? study.tags : [study.tags]).map(
                    (tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-pre:bg-stone-900 prose-pre:text-stone-100 prose-code:bg-stone-100 prose-code:dark:bg-stone-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-a:text-amber-600 prose-a:dark:text-amber-500 prose-blockquote:border-amber-500 prose-li:marker:text-stone-400">
          <MarkdownRenderer content={study.content} />
        </article>
      </main>
    </div>
  );
}
