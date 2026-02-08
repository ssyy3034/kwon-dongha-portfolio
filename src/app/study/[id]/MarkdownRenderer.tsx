"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

// YouTube URL에서 video ID 추출
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Obsidian 위키링크 [[링크]] → 일반 텍스트로 변환
  const processedContent = content.replace(/\[\[(.*?)\]\]/g, (_, link) => {
    const displayText = link.split("|").pop() || link;
    return `**${displayText}**`;
  });

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 코드 블록 스타일링
        code({ className, children, ...props }) {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // 링크 스타일링 + YouTube 임베드
        a({ children, href, ...props }) {
          // YouTube 링크인 경우 임베드
          if (href) {
            const youtubeId = getYouTubeId(href);
            if (youtubeId) {
              return (
                <div className="my-6">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-stone-200 dark:bg-stone-800">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-400 hover:text-amber-500 mt-2 inline-block"
                  >
                    YouTube에서 보기 →
                  </a>
                </div>
              );
            }
          }
          return (
            <a
              href={href}
              className="text-amber-600 dark:text-amber-500 hover:underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },
        // 이미지
        img({ src, alt, ...props }) {
          return (
            <img
              src={src}
              alt={alt || ""}
              className="rounded-xl shadow-md my-6"
              {...props}
            />
          );
        },
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}
