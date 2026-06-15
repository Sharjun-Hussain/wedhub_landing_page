"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  Home,
  ShoppingBag,
  ArrowLeft,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-zinc-500 hover:text-[#a97d43] dark:hover:text-[#d4af37] transition-colors flex items-center justify-center gap-2 mx-auto outline-none"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      Go back to previous page
    </button>
  );
};

export function NotFoundClient() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Ambient background pulses
      gsap.to(".anim-bg-element", {
        scale: 1.05,
        opacity: 0.8,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 2,
      });

      // Elegant entrance animation
      tl.fromTo(
        ".anim-404-text",
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      )
        .fromTo(
          ".anim-404-icon",
          { scale: 0, opacity: 0, rotation: -45 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.6",
        )
        .fromTo(
          ".anim-404-content",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
          },
          "-=0.4",
        )
        .fromTo(
          ".anim-404-buttons > *",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
          "-=0.4",
        );

      // Subtle float for the search icon
      gsap.to(".anim-404-icon", {
        y: -12,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 relative overflow-hidden bg-[#faf9f6] dark:bg-[#130f0d] transition-colors duration-500"
    >
      <main className="flex flex-col w-full min-h-dvh relative overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Ambient Effects */}
        <div className="anim-bg-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a97d43]/5 dark:bg-[#d4af37]/5 blur-[120px] pointer-events-none" />
        <div className="anim-bg-element absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#6d513e]/5 dark:bg-[#6d513e]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Wrapper */}
        <div className="relative z-10 max-w-2xl w-full mx-auto my-auto pt-32 pb-16 text-center space-y-8">
          {/* 404 Graphic */}
          <div className="relative flex justify-center items-center">
            <span className="anim-404-text text-[120px] sm:text-[160px] lg:text-[200px] font-black text-[#2c2520]/5 dark:text-white/5 leading-none tracking-tighter select-none uppercase">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="anim-404-icon w-20 h-20 sm:w-28 sm:h-28 bg-white dark:bg-[#1d1815] rounded-full flex items-center justify-center shadow-2xl border border-[#e7e3d9] dark:border-[#352d28]/60">
                <Search
                  className="w-8 h-8 sm:w-12 sm:h-12 text-[#a97d43] dark:text-[#d4af37]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Content Context */}
          <div className="space-y-4">
            <h1 className="anim-404-content text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight uppercase leading-none text-[#2c2520] dark:text-white">
              Page Not Found
            </h1>
            <p className="anim-404-content text-xs sm:text-sm text-[#6d513e] dark:text-[#a3988e] max-w-md mx-auto leading-relaxed">
              The premium selection or customized page you are seeking might have been relocated, updated, or is temporarily unavailable.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="anim-404-buttons flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2d2520] dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-[#1d1815] text-[#2c2520] dark:text-white border-2 border-[#e7e3d9] dark:border-[#352d28]/60 rounded-full font-bold text-xs uppercase tracking-wider hover:border-[#a97d43] dark:hover:border-[#d4af37] hover:text-[#a97d43] dark:hover:text-[#d4af37] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Shop
            </Link>
          </div>

          <div className="anim-404-buttons pt-8">
            <BackButton />
          </div>
        </div>
      </main>
    </div>
  );
}
