"use client";

import { lazy, Suspense } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export default function Scene() {
  return (
    <div className="absolute inset-x-0 top-0 -bottom-16 md:-bottom-24">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-sans text-[#ffffff]/30 text-[14.08px] uppercase tracking-widest animate-pulse">
              Loading 3D...
            </span>
          </div>
        }
      >
        <Spline scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
      </Suspense>
    </div>
  );
}
