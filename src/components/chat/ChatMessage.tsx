"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-amber-500 text-white rounded-br-md"
            : "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-bl-md"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
