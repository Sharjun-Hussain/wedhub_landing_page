"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  MousePointer2,
  PackageCheck,
  Truck,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function DeliverySection() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // Only run scroll animations on desktop screens (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        });

        // 1. Title Fade
        tl.fromTo(
          ".del-title",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        );

        // 2. Steps Stagger
        tl.fromTo(
          ".del-step",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.6,
            ease: "back.out(1.5)",
          },
          "-=0.4",
        );

        // 3. Line Draw (Desktop)
        tl.fromTo(
          ".del-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.out", transformOrigin: "left" },
          "-=0.8",
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-20 bg-[#faf9f6] dark:bg-[#130f0d] relative overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="del-title text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#a97d43]/10 text-[#a97d43] dark:text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#a97d43]/20">
            <Truck className="w-4 h-4" /> Island-wide Delivery
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-[#2c2520] dark:text-white mb-6 leading-tight uppercase tracking-tight">
            From Our Boutique <br />
            <span className="text-[#a97d43] dark:text-[#d4af37] italic font-serif font-normal">
              To Your Doorstep.
            </span>
          </h2>
          <p className="text-[#6d513e] dark:text-[#a3988e] text-sm sm:text-base lg:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Sit back and enjoy absolute luxury. We handle the logistics with climate-controlled, premium partners to ensure your delicate imports arrive in flawless condition.
          </p>
        </div>

        {/* --- PROCESS STEPS --- */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {/* Connecting Line (Desktop Only) */}
          <div className="del-line absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#a97d43]/20 via-[#a97d43]/60 to-[#a97d43]/20 hidden md:block rounded-full" />

          {/* STEP 1: ORDER */}
          <div className="del-step relative flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white dark:bg-[#1d1815] rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none flex items-center justify-center border border-[#e7e3d9] dark:border-[#352d28]/60 relative z-10 mb-6 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#a97d43] dark:text-[#d4af37]">
                <MousePointer2 className="w-6 h-6" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#2c2520] dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-sm border-4 border-white dark:border-[#1d1815]">
                1
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#2c2520] dark:text-white mb-2 uppercase tracking-wide">
              Bespoke Selection
            </h3>
            <p className="text-[#6d513e] dark:text-[#a3988e] text-xs max-w-[200px] leading-relaxed">
              Explore and select your premium ouds, viral chocolates, and fine dates.
            </p>
          </div>

          {/* STEP 2: PACKING */}
          <div className="del-step relative flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white dark:bg-[#1d1815] rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none flex items-center justify-center border border-[#e7e3d9] dark:border-[#352d28]/60 relative z-10 mb-6 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#a97d43] dark:text-[#d4af37]">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#2c2520] dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-sm border-4 border-white dark:border-[#1d1815]">
                2
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#2c2520] dark:text-white mb-2 uppercase tracking-wide">
              Boutique Care
            </h3>
            <p className="text-[#6d513e] dark:text-[#a3988e] text-xs max-w-[200px] leading-relaxed">
              We carefully pack your goods inside heat-insulated packaging to safeguard original quality.
            </p>
          </div>

          {/* STEP 3: DELIVERY */}
          <div className="del-step relative flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white dark:bg-[#1d1815] rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none flex items-center justify-center border border-[#e7e3d9] dark:border-[#352d28]/60 relative z-10 mb-6 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#a97d43] dark:text-[#d4af37]">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#2c2520] dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-sm border-4 border-white dark:border-[#1d1815]">
                3
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#2c2520] dark:text-white mb-2 uppercase tracking-wide">
              Elite Delivery
            </h3>
            <p className="text-[#6d513e] dark:text-[#a3988e] text-xs max-w-[200px] leading-relaxed">
              Delivered safely to your doorstep with tracking notifications at every stage.
            </p>
          </div>
        </div>

        {/* --- BOTTOM: PARTNERS & INFO --- */}
        <div className="mt-20 bg-white dark:bg-[#1d1815] rounded-[2rem] p-8 border border-[#e7e3d9] dark:border-[#352d28]/60 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-[#2c2520]/5 dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-[#a97d43] dark:text-[#d4af37]" />
            </div>
            <div>
              <h4 className="font-bold text-[#2c2520] dark:text-white uppercase tracking-wide">
                Elite Logistics Partners
              </h4>
              <p className="text-sm text-[#6d513e] dark:text-[#a3988e]">
                We use domestic high-priority networks PromptX, Certis & Domex.
              </p>
            </div>
          </div>

          <div className="h-10 w-px bg-[#e7e3d9] dark:bg-[#352d28]/60 hidden md:block" />

          <div className="text-center md:text-left">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Standard Timelines
            </p>
            <p className="text-[#2c2520] dark:text-white font-bold">
              1-2 Days (Colombo/Suburbs) • 2-3 Days (Other Districts)
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Link
              href="/account?tab=orders"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2d2520] dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Track My Order <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
