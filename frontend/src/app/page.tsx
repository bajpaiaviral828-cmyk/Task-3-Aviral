"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";
import Scene from "@/components/ui/Scene";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { AIInput } from "@/components/ui/ai-input";
import { GlareCard } from "@/components/ui/glare-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Scroll animations for the sticky Hero section
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 800], [1, 0.9]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0.3]);
  const y = useTransform(scrollY, [0, 800], [0, 50]);

  const handleScrollToGenerator = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ratio: "16:9" }),
      });

      if (!response.ok) {
        throw new Error("Backend unavailable");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error: any) {
      console.warn("Backend failed, falling back to public demo API (Pollinations.ai)...");
      
      // Fallback to Pollinations.ai for live demo purposes
      const encodedPrompt = encodeURIComponent(prompt);
      const publicUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
      
      // We set the URL directly. The browser will fetch it when the img tag renders.
      setImageUrl(publicUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `digitalwerk-vision-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    // Outer Pure White Canvas (The Bezel)
    <main className="min-h-screen w-full bg-[#ffffff] p-2 md:p-4 text-[#000000] selection:bg-[#000000] selection:text-[#ffffff] box-border">
      
      <FloatingNav 
        navItems={[
          { name: "Cases", link: "#" },
          { name: "Blog", link: "#" },
          { name: "People", link: "#" },
          { name: "Jobs", link: "#" },
          { name: "Contact", link: "#" },
        ]} 
      />

      {/* Inner Rounded Shell - STICKY HERO */}
      <motion.div 
        style={{ scale, opacity, y }}
        className="sticky top-2 md:top-4 z-10 w-full rounded-[30px] bg-[#000000] text-[#ffffff] overflow-hidden min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] border border-black/10"
      >
        
        {/* Animated Abstract Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="pointer-events-none absolute inset-0 w-full h-full object-cover z-0 opacity-[0.85]"
          src="/bg.mp4" 
        />

        {/* Dynamic Noise Overlay (GIF) */}
        <div 
          className="pointer-events-none absolute inset-0 z-50 opacity-[0.35] mix-blend-overlay w-full h-full bg-repeat" 
          style={{ backgroundImage: "url('/noise.gif')" }} 
        />

        {/* Top Right Light Leak */}
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-white opacity-[0.04] blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        {/* Navigation Layer removed, replaced by FloatingNav */}

        {/* SECTION 1: HERO (100vh of inner shell) */}
        <section className="relative z-10 w-full h-[calc(100vh-2rem)] flex flex-col md:flex-row items-stretch justify-center pt-32 pb-32 px-8 md:px-16">
          
          {/* Left side text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-2xl flex flex-col justify-center items-start text-left z-20 mt-16 md:mt-0"
          >
            <h1 className="font-heading font-normal text-[12vw] md:text-[80px] lg:text-[100px] leading-[1.05] tracking-[-0.02em]">
              Where imagination<br/>
              <span className="italic opacity-80">meets structure.</span>
            </h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-10 md:mt-12"
            >
              <button 
                onClick={handleScrollToGenerator}
                className="text-[#ffffff] bg-transparent border-[1.5px] border-dotted border-[#ffffff]/70 rounded-[28px] px-8 py-[10px] text-[14.08px] font-sans font-normal hover:bg-white hover:text-black hover:border-solid transition-all opacity-80 hover:opacity-100"
              >
                Initialize Engine
              </button>
            </motion.div>
          </motion.div>

          {/* Right side 3D model */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="flex-1 w-full self-stretch relative z-20 pointer-events-auto"
          >
            <Scene />
          </motion.div>

          {/* Absolute Metadata Footer (Hero Bounds) */}
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 opacity-50 text-[12.8px] font-sans font-light tracking-wide pointer-events-none">
            {new Date().toLocaleDateString('en-GB')}
          </div>
          
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex flex-col items-center opacity-70 pointer-events-none">
            <span className="font-sans text-[8px] uppercase tracking-widest mb-1">C K</span>
            <span className="font-sans text-xl font-light leading-none">U</span>
          </div>
        </section>

      </motion.div>

      {/* SECTION 2: GENERATOR SHELL */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full rounded-[30px] bg-[#000000] text-[#ffffff] overflow-hidden min-h-screen mt-2 md:mt-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border border-white/5"
      >
        
        {/* Dynamic Noise Overlay (GIF) */}
        <div 
          className="pointer-events-none absolute inset-0 z-50 opacity-[0.35] mix-blend-overlay w-full h-full bg-repeat" 
          style={{ backgroundImage: "url('/noise.gif')" }} 
        />

        <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center py-32 px-8 md:px-16">
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-16">
            
            {/* AI Input Component */}
            <AIInput 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onSubmit={handleGenerate}
              isGenerating={isGenerating}
            />

            {/* Output Canvas */}
            <div className="w-full mt-24">
              <AnimatePresence mode="wait">
                {imageUrl && !isGenerating ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-[60] w-full aspect-[16/9] overflow-hidden rounded-[20px] group border border-white/10"
                  >
                    <GlareCard className="w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={imageUrl} 
                        alt="Generated Visual" 
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 grayscale-[50%] hover:grayscale-0"
                      />
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <button 
                          onClick={handleDownload}
                          className="text-[#ffffff] bg-transparent border-[1.5px] border-dotted border-[#ffffff] rounded-[28px] px-8 py-[10px] text-[14.08px] font-sans hover:bg-white hover:text-black hover:border-solid transition-all"
                        >
                          Download Asset
                        </button>
                      </div>
                    </GlareCard>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-[60] w-full aspect-[16/9] rounded-[20px] border border-dotted border-[#ffffff]/20 flex items-center justify-center bg-white/[0.02]"
                  >
                    <span className="font-sans text-[#ffffff]/30 text-[14.08px] uppercase tracking-widest">
                      {isGenerating ? "Executing..." : "Awaiting Output"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>

      </motion.div>

      {/* Footer Shell - Light */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-20 w-full rounded-[30px] bg-[#d9d9d9] text-[#111111] overflow-hidden flex flex-col items-center justify-center pt-24 pb-8 md:pt-32 md:pb-12 px-8 md:px-16 border-[1.5px] border-dotted border-black/20 mt-2 md:mt-4 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
      >
        
        {/* Light Noise Filter */}
        <svg className="pointer-events-none absolute inset-0 z-50 opacity-[0.4] mix-blend-multiply w-full h-full" style={{ width: '100%', height: '100%' }}>
          <filter id="light-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 20 -9" />
          </filter>
          <rect width="100%" height="100%" filter="url(#light-noise)" />
        </svg>

        <span className="font-sans italic text-[14.08px] font-medium tracking-wide mb-16 opacity-80 z-10 text-center">
          Let&apos;s get physical or keep it digital
        </span>
        
        <div className="mb-16 md:mb-32 z-10 text-center">
          <TextGenerateEffect 
            words="Get in touch" 
            className="font-heading font-normal text-[13vw] leading-[0.9] tracking-[-0.02em] whitespace-nowrap" 
          />
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-end font-heading text-[12vw] md:text-[100px] leading-[0.8] tracking-[-0.04em] z-10 gap-8 md:gap-0 mt-8 md:mt-24">
          <a href="https://www.linkedin.com/in/aviral-bajpai-6a811a300/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
            @aviral.bajpai
          </a>
          <a href="https://www.linkedin.com/in/aviral-bajpai-6a811a300/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
            LinkedIn
          </a>
        </div>
      </motion.div>
    </main>
  );
}
