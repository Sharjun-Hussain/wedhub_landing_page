"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Cpu, Battery, Wifi, PlayCircle } from "lucide-react";

export default function CinematicSpotlight() {
  const containerRef = useRef < HTMLDivElement > null;
  const imageWrapperRef = useRef < HTMLDivElement > null;
  const heroImageRef = useRef < HTMLImageElement > null;

  // --- ANIMATION LOGIC ---
  useGSAP(
    (context) => {
      const mm = gsap.matchMedia();

      // Only run animations on desktop screens (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        // 1. SETUP: Initial Entry Animations
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          ".spotlight-text",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        );

        tl.fromTo(
          ".spotlight-img-container",
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" },
          "-=0.4",
        );

        // 2. INTERACTION: Desktop Only 3D Tilt
        const wrapper = containerRef.current;
        const target = imageWrapperRef.current;

        if (!wrapper || !target) return;

        const handleMouseMove = (e) => {
          const { left, top, width, height } = wrapper.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;

          gsap.to(target, {
            rotationY: x * 15,
            rotationX: -y * 15,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(".float-stat", {
            x: x * 30,
            y: y * 30,
            duration: 0.8,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(target, {
            rotationY: 0,
            rotationX: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          });
          gsap.to(".float-stat", {
            x: 0,
            y: 0,
            duration: 1,
            ease: "power2.out",
          });
        };

        wrapper.addEventListener("mousemove", handleMouseMove);
        wrapper.addEventListener("mouseleave", handleMouseLeave);

        // Cleanup function for this specific media query
        return () => {
          wrapper.removeEventListener("mousemove", handleMouseMove);
          wrapper.removeEventListener("mouseleave", handleMouseLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section className="py-8 px-4 sm:px-6 lg:py-16 lg:px-8 bg-slate-50 overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full max-w-[1400px] mx-auto rounded-[2rem] sm:rounded-[3rem] bg-[#0F172A] overflow-hidden min-h-[auto] lg:min-h-[600px] flex flex-col justify-center shadow-2xl shadow-slate-200"
      >
        {/* --- OPTIMIZED BACKGROUND --- */}
        {/* Using opacity-0 on mobile for GPU savings, only show subtle gradients */}
        <div className="absolute top-0 right-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-blue-600/20 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[250px] lg:w-[500px] h-[250px] lg:h-[500px] bg-purple-600/10 rounded-full blur-[60px] lg:blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-16">
          {/* --- CONTENT (Mobile First Order) --- */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <div className="spotlight-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
              <Cpu className="w-3.5 h-3.5" /> M3 Pro Chip
            </div>

            <h2 className="spotlight-text text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
              Mind-blowing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Head-turning.
              </span>
            </h2>

            <p className="spotlight-text text-slate-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md leading-relaxed">
              The new MacBook Pro blasts forward with the M3 architecture. Built
              on 3‑nanometer technology for extreme efficiency.
            </p>

            <div className="spotlight-text flex flex-col w-full sm:w-auto sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/shop?cat=macbook"
                className="bg-white text-slate-900 h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg hover:shadow-blue-500/20 group active:scale-95"
              >
                Buy Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95">
                <PlayCircle className="w-5 h-5" />{" "}
                <span className="hidden sm:inline">Watch Keynote</span>
                <span className="sm:hidden">Video</span>
              </button>
            </div>
          </div>

          {/* --- PRODUCT STAGE --- */}
          <div className="relative order-1 lg:order-2 perspective-1000 flex justify-center items-center py-8 lg:py-0">
            <div
              ref={imageWrapperRef}
              className="spotlight-img-container relative w-full max-w-[320px] sm:max-w-md lg:max-w-lg preserve-3d will-change-transform"
            >
              {/* Main Product Image - Explicit dimensions for CLS prevention */}
              <img
                ref={heroImageRef}
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000"
                alt="MacBook Pro M3"
                width={1000}
                height={600}
                loading="eager" // Important for Hero section
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)] object-contain"
              />

              {/* Float Cards - Adjusted positions for mobile to prevent overlap */}
              <div className="float-stat absolute -top-4 -right-2 lg:-right-4 bg-slate-800/90 backdrop-blur-md p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-white/10 shadow-xl transform translate-z-20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Battery className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase">
                      Battery
                    </p>
                    <p className="text-sm lg:text-base text-white font-bold whitespace-nowrap">
                      22 hrs
                    </p>
                  </div>
                </div>
              </div>

              <div className="float-stat absolute -bottom-4 left-0 lg:-left-8 bg-slate-800/90 backdrop-blur-md p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-white/10 shadow-xl transform translate-z-30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Wifi className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase">
                      Wi-Fi
                    </p>
                    <p className="text-sm lg:text-base text-white font-bold whitespace-nowrap">
                      6E Ready
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex w-full border-t border-white/5 bg-white/5 backdrop-blur-sm px-8 py-4 justify-between items-center text-xs font-bold text-slate-500 tracking-widest uppercase mt-auto">
          <span>Engineered for Professionals</span>
          <div className="flex gap-8">
            <span className="text-slate-300">Space Black</span>
            <span>Silver</span>
            <span>Space Grey</span>
          </div>
          <span className="text-white">Starting at Rs. 365,000</span>
        </div>
      </div>
    </section>
  );
}
