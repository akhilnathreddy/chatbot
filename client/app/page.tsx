"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Menu, Paperclip, Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I am your intelligent assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "This is a simulated response exhibiting the modern UI. In a real application, this would stream from your backend AI model.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      
      <main className="flex-1 flex flex-col relative w-full h-full max-w-4xl mx-auto border-x border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-[#0a0a0a] shadow-sm">
        
        {/* Header */}
        <header className="absolute top-0 w-full z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-none mb-1">Nexus AI</h1>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Online
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400">
            <Menu size={20} />
          </button>
        </header>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-24 pb-36 sm:px-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1 border border-black/5 dark:border-white/5
                    ${msg.role === "user" ? "bg-zinc-100 dark:bg-zinc-800" : "bg-blue-600 text-white shadow-sm"}`}>
                    {msg.role === "user" ? <User size={15} className="text-zinc-600 dark:text-zinc-300" /> : <Bot size={15} />}
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className="flex items-baseline gap-2 mx-1">
                      <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                        {msg.role === "user" ? "You" : "Nexus AI"}
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className={`group relative px-5 py-3.5 rounded-2xl shadow-sm text-[15px]
                      ${msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-tr-sm" 
                        : "bg-zinc-50 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-100 rounded-tl-sm border border-zinc-200/50 dark:border-zinc-700/50"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>

                      {/* Action buttons (only for bot) */}
                      {msg.role === "bot" && (
                        <div className="absolute -bottom-11 left-0 hidden group-hover:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => copyToClipboard(msg.id, msg.content)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                            title="Copy"
                          >
                            {copiedId === msg.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                          <button className="p-1.5 text-zinc-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="Good response">
                            <ThumbsUp size={14} />
                          </button>
                          <button className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="Bad response">
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-4 flex-row"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 border border-black/5 dark:border-white/5 rounded-full mt-1 bg-blue-600 text-white shadow-sm">
                    <Bot size={15} />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl rounded-tl-sm px-5 py-4 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                    <div className="flex gap-1.5 items-center justify-center h-full">
                      <motion.div 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a] pt-10 pb-6 px-4 sm:px-6 pointer-events-none">
          <div className="max-w-3xl mx-auto relative group pointer-events-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-end gap-2 bg-white dark:bg-[#121212] border border-zinc-300 dark:border-zinc-700/80 rounded-2xl shadow-xl shadow-black/5 overflow-hidden pr-2 py-2 pl-4 focus-within:border-blue-500/50 focus-within:ring-2 ring-blue-500/20 transition-all">
              
              <button className="p-2 mb-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors shrink-0">
                <Paperclip size={20} />
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message Nexus AI..."
                className="w-full max-h-48 py-2.5 bg-transparent border-0 focus:ring-0 resize-none outline-none text-[15px] placeholder-zinc-400 dark:placeholder-zinc-500 [&::-webkit-scrollbar]:hidden"
                rows={1}
                style={{ minHeight: '44px' }}
              />

              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2.5 mb-0.5 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0
                  ${input.trim() 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
                  }`}
              >
                <motion.div
                  whileTap={input.trim() ? { scale: 0.9 } : {}}
                  initial={false}
                  animate={input.trim() ? { rotate: 0 } : { rotate: -45 }}
                >
                  <Send size={18} className={input.trim() ? "translate-x-0.5 translate-y-[1px]" : ""} />
                </motion.div>
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-600">
                Nexus AI can make mistakes. Consider verifying important information.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
