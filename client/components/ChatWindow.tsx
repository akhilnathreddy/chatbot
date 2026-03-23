"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { sendMessage, clearChat } from "@/lib/api";
import { MessageBubble } from "./MessageBubble";
import { InputBar } from "./InputBar";

interface Message {
  role: "user" | "assistant";
  content: string;
  usedWebSearch?: boolean;
  memoryUsed?: boolean;
  timestamp: Date;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to Aurora! I possess long-term memory and live search capabilities. How may I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await sendMessage(text);
      const botMsg: Message = {
        role: "assistant",
        content: data.reply,
        usedWebSearch: data.usedWebSearch,
        memoryUsed: data.memoryUsed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Aurora encountered a disturbance. Please try your request again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    await clearChat();
    setMessages([
      {
        role: "assistant",
        content: "Memory erased. We begin anew.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden relative">
      
      {/* Main Glass Pane */}
      <div className="w-full max-w-5xl h-full flex flex-col bg-white/5 backdrop-blur-3xl sm:border border-white/10 sm:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">
        
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-60 z-10" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-white/10 bg-black/20 z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg animate-pulse-ring shrink-0">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white font-bold tracking-wide text-lg sm:text-xl leading-tight">Aurora</h1>
              <p className="text-cyan-300/70 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">Cognitive Core</p>
            </div>
          </div>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white/50 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all active:scale-95"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline tracking-wide">Purge Memory</span>
          </button>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 scroll-smooth z-0 relative">
          
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start animate-message">
                <div className="flex items-end gap-3 max-w-[85%]">
                  <div className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shadow-inner flex-shrink-0">
                    <Sparkles className="text-cyan-400 w-4 h-4 opacity-50" />
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl rounded-bl-sm px-6 py-4 shadow-xl">
                    <div className="flex gap-2 items-center justify-center h-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Input area */}
        <div className="bg-black/30 border-t border-white/10 p-4 sm:p-6 backdrop-blur-xl z-10 w-full relative">
          <InputBar onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
