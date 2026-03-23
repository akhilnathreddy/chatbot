"use client";
import { useState, KeyboardEvent, useRef } from "react";
import { SendHorizonal } from "lucide-react";

interface Props {
  onSend: (msg: string) => void;
  disabled: boolean;
}

export function InputBar({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <div 
          className={`flex items-end gap-3 bg-black/40 backdrop-blur-2xl rounded-[32px] border transition-all duration-300 p-2 sm:p-3
            ${isFocused 
              ? "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-white/5" 
              : "border-white/10 hover:border-white/20 hover:bg-white/5"}
          `}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Talk with Aurora..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-[#f8fafc] placeholder-white/30
              px-4 py-2 sm:py-3 text-[15px] focus:outline-none transition-colors disabled:opacity-50 scrollbar-hide"
            style={{ maxHeight: "150px", overflowY: "auto" }}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="bg-gradient-to-tr from-cyan-400 to-blue-600 disabled:opacity-30 disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 
              text-white sm:w-12 sm:h-12 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-90 flex-shrink-0 border border-white/10"
          >
            <SendHorizonal size={20} strokeWidth={2} className="sm:ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
