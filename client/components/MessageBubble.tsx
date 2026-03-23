"use client";
import { Sparkles, User, Globe, Brain } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  usedWebSearch?: boolean;
  memoryUsed?: boolean;
  timestamp: Date;
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-message`}>
      <div className={`flex items-end gap-3 max-w-[92%] sm:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border
            ${isUser 
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-white/20 text-white" 
              : "bg-black/40 border-white/10 text-cyan-400"}`}
        >
          {isUser ? <User size={16} strokeWidth={2.5} /> : <Sparkles size={16} />}
        </div>

        {/* Content Wrapper */}
        <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
          
          {/* Bubble */}
          <div
            className={`px-5 py-3.5 text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap shadow-xl border
              ${isUser
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-white/20 text-white rounded-[24px] rounded-br-sm shadow-cyan-500/20"
                : "bg-white/10 backdrop-blur-2xl border-white/10 text-slate-100 rounded-[24px] rounded-bl-sm"
              }`}
          >
            {message.content}
          </div>

          {/* Badges & Timestamp Row */}
          <div className={`flex items-center gap-3 px-1 mt-0.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            
            {!isUser && (message.usedWebSearch || message.memoryUsed) && (
              <div className="flex gap-2">
                {message.usedWebSearch && (
                  <div className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 bg-cyan-950/60 text-cyan-300 rounded-full border border-cyan-800/80 uppercase tracking-widest font-semibold backdrop-blur-md">
                    <Globe size={10} /> Search
                  </div>
                )}
                {message.memoryUsed && (
                  <div className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 bg-fuchsia-950/60 text-fuchsia-300 rounded-full border border-fuchsia-800/80 uppercase tracking-widest font-semibold backdrop-blur-md">
                    <Brain size={10} /> Memory
                  </div>
                )}
              </div>
            )}

            <div suppressHydrationWarning className="text-[10px] text-white/40 font-medium tracking-wide">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
