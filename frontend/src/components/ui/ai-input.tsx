import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "./shimmer-button";

interface AIInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  placeholder?: string;
}

export function AIInput({
  value,
  onChange,
  onSubmit,
  isGenerating,
  placeholder = "Declare the vision...",
}: AIInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-[30px] border border-white/20 bg-black/40 backdrop-blur-xl p-4 shadow-2xl transition-all focus-within:border-white/50 focus-within:bg-black/60">
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent min-h-[120px] resize-none text-[20px] md:text-[28px] font-sans font-light text-white placeholder:text-white/30 focus:outline-none p-4 pb-20 leading-relaxed"
      />
      
      <div className="absolute bottom-4 right-4 left-4 flex justify-between items-center px-2">
        <span className="text-[12px] text-white/40 font-sans tracking-wide uppercase">
          Shift + Enter for new line
        </span>
        
        <ShimmerButton
          onClick={onSubmit}
          disabled={isGenerating || !value.trim()}
          shimmerColor="#ffffff"
          shimmerSize="0.05em"
          background="#000000"
          className="text-white/80 hover:text-white font-sans text-[13px] uppercase tracking-widest px-8 py-3 border border-white/20"
        >
          {isGenerating ? "Executing..." : "Generate"}
        </ShimmerButton>
      </div>
    </div>
  );
}
