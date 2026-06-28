"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for X and Y coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Add smooth transition to all interactive elements globally
    const style = document.createElement('style');
    style.innerHTML = `
      button, a, [data-magnetic] {
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      /* Hide default cursor */
      body {
        cursor: none;
      }
      button, a, [data-magnetic] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      const { clientX, clientY } = e;
      const target = e.target as HTMLElement;

      const interactiveEl = target.closest("button, a, [data-magnetic]") as HTMLElement;

      if (interactiveEl) {
        setIsHovered(true);
        // Magnetic pull effect
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        
        // Move the element slightly towards the cursor
        interactiveEl.style.transform = `translate(${distanceX * 0.15}px, ${distanceY * 0.15}px)`;
        
        // Lock cursor near the center of the element
        cursorX.set(centerX - 30); // 60px / 2 = 30
        cursorY.set(centerY - 30);
      } else {
        setIsHovered(false);
        // Normal cursor following
        cursorX.set(clientX - 10); // 20px / 2 = 10
        cursorY.set(clientY - 10);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("button, a, [data-magnetic]") as HTMLElement;
      
      if (interactiveEl) {
        // Reset element position when mouse leaves
        interactiveEl.style.transform = `translate(0px, 0px)`;
      }
      
      // Hide cursor if it leaves the window
      if (e.relatedTarget === null) {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      document.head.removeChild(style);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full bg-white mix-blend-difference pointer-events-none z-[99999]"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      animate={{
        width: isHovered ? 60 : 20,
        height: isHovered ? 60 : 20,
        opacity: isHovered ? 0.8 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  );
}
