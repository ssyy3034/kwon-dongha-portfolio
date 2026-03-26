"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowUp, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("chat-session-id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("chat-session-id", id);
  }
  return id;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      if (suggestions.length === 0) {
        fetch(`${API_URL}/chat/suggestions`)
          .then((res) => res.json())
          .then(setSuggestions)
          .catch(() => {});
      }
    }
  }, [isOpen, suggestions.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          message: text.trim(),
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");
        }
        throw new Error("서버 오류가 발생했습니다.");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "죄송합니다. 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90] print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute bottom-[72px] right-0 w-[380px] h-[540px] flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-700/60 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="relative px-5 pt-5 pb-4">
              {/* Ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-amber-500/10 dark:bg-amber-500/15 blur-[40px] rounded-full" />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.15em]">
                      Online
                    </span>
                  </div>
                  <h3 className="font-black text-base text-stone-900 dark:text-stone-100 tracking-tight">
                    권동하에게 물어보세요
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-500 mt-0.5">
                    이력, 프로젝트, 기술 스택에 대해 답변드립니다
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 -mr-1 -mt-0.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <X size={16} className="text-stone-400" />
                </button>
              </div>

              {/* Separator */}
              <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-stone-200 dark:via-stone-700 to-transparent" />
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-3 custom-scrollbar">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="h-full flex flex-col justify-center"
                >
                  {/* Welcome */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 mb-3">
                      <Sparkles size={22} className="text-white" />
                    </div>
                    <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      안녕하세요!
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                      궁금한 것을 아래에서 골라보세요
                    </p>
                  </div>

                  {/* Suggestion chips */}
                  <div className="space-y-2">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                        onClick={() => sendMessage(s)}
                        className="group w-full text-left text-[12.5px] font-medium px-3.5 py-2.5 rounded-xl border border-stone-150 dark:border-stone-700/80 bg-stone-50/80 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 hover:border-amber-300 dark:hover:border-amber-600/60 hover:bg-amber-50/80 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-400 transition-all duration-200"
                      >
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity mr-1.5">
                          →
                        </span>
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <ChatMessage
                      key={i}
                      role={msg.role}
                      content={msg.content}
                    />
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 mb-3"
                    >
                      <div className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                        <Sparkles
                          size={12}
                          className="text-white animate-pulse"
                        />
                      </div>
                      <div className="flex gap-1 py-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="relative px-4 pb-4 pt-2">
              <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-stone-200 dark:via-stone-700 to-transparent" />
              <form onSubmit={handleSubmit} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  maxLength={500}
                  className="w-full text-[13px] font-medium pl-4 pr-12 py-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/40 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400/60 dark:focus:ring-amber-500/30 dark:focus:border-amber-500/40 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-stone-900 dark:bg-amber-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 dark:hover:bg-amber-500 active:scale-90 transition-all"
                >
                  <ArrowUp size={15} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip Hint */}
      <AnimatePresence>
        {showTooltip && !isOpen && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ delay: 2, duration: 0.5, type: "spring", stiffness: 200 }}
            className="absolute right-[70px] top-1/2 -translate-y-1/2 w-max px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs sm:text-[13px] font-bold rounded-2xl shadow-xl pointer-events-none origin-right flex items-center gap-2"
          >
            <Sparkles size={14} className="text-amber-400 dark:text-amber-500" />
            포트폴리오에 대해 질문해보세요!
            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-[6px] border-transparent border-l-stone-900 dark:border-l-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-14 h-14 rounded-full bg-stone-900 dark:bg-amber-600 text-white flex items-center justify-center shadow-xl shadow-stone-900/20 dark:shadow-amber-600/30 hover:shadow-2xl transition-shadow"
      >
        {/* Pulse ring */}
        {!isOpen && messages.length === 0 && (
          <span className="absolute inset-0 rounded-full bg-stone-900 dark:bg-amber-600 animate-ping opacity-20" />
        )}
        <AnimatePresence mode="wait">
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X size={22} />
            ) : (
              <MessageCircle size={22} />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
