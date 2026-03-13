"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex ${isUser ? "justify-end" : "justify-start gap-2.5"} mb-3`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20 mt-0.5">
          <Bot size={14} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-[78%] text-[13px] leading-[1.7] ${
          isUser
            ? "px-4 py-2.5 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-2xl rounded-br-md font-medium shadow-lg shadow-stone-900/10 dark:shadow-stone-300/10"
            : "px-0 py-0.5 text-stone-700 dark:text-stone-300"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-2.5 last:mb-0 text-stone-700 dark:text-stone-300">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mb-2.5 last:mb-0 space-y-1.5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 mb-2.5 last:mb-0 space-y-1.5">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="flex gap-2 text-stone-600 dark:text-stone-400">
                  <span className="shrink-0 text-amber-500 mt-px">•</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-stone-900 dark:text-stone-100">
                  {children}
                </strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 dark:text-amber-400 underline underline-offset-2 decoration-amber-400/40 hover:decoration-amber-500 transition-colors"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}
