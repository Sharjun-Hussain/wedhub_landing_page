"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Shield, Lock, Eye, FileText, ArrowRight, Heart } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";

export function PrivacyPolicyClient() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // Only run stagger animations on desktop screens (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline();
        tl.fromTo(
          ".hero-stagger",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" },
        );
        gsap.fromTo(
          ".content-stagger",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "power3.out", delay: 0.3 },
        );
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.set(".hero-stagger, .content-stagger", { y: 0, opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );
  return (
    <main ref={containerRef} className="grow pb-24 bg-[#faf9f6] dark:bg-[#130f0d] transition-colors duration-500">
      <ScrollToTop />
      
      {/* --- HERO HEADER WITH POLYGON SHAPE --- */}
      <section
        className="relative w-[calc(100%-24px)] mx-[12px] h-[50vh] min-h-[420px] bg-[#2c2520] dark:bg-[#1d1815] border border-[#a97d43]/20 dark:border-[#d4af37]/20 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center pb-16 mb-16 mt-[88px] sm:mt-[96px] transform-gpu backface-hidden will-change-[transform,clip-path]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 88%)" }}
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] lg:hover:scale-105 transform-gpu will-change-transform"
          style={{ backgroundImage: `url('/banner_pantry.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c2520]/85 via-[#2c2520]/95 to-[#130f0d]/98" />


        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white py-12">
          <span className="text-xs sm:text-sm font-black tracking-[0.15em] text-[#d4af37] mb-4 block uppercase hero-stagger">
            #Privacy Security
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6.5xl font-black tracking-tight leading-[1.15] mb-6 hero-stagger">
            Your Trust is <br className="hidden sm:inline" />
            <span className="text-[#d4af37] italic font-serif font-normal">Our Priority.</span>
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm lg:text-base text-zinc-300 font-light leading-relaxed hero-stagger">
            Last updated: March 17, 2026. Discover how we protect your personal information with absolute integrity, transparency, and state-of-the-art security systems.
          </p>
        </div>
      </section>

      {/* --- CONTENT --- */}
      <section className="px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto space-y-12 sm:space-y-16">
          
          {/* 1. Introduction */}
          <div className="content-stagger bg-white dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28]/60 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-2xl shrink-0">
                <FileText className="w-6 h-6 text-[#a97d43] dark:text-[#d4af37]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2c2520] dark:text-white uppercase tracking-wide">
                1. Introduction
              </h2>
            </div>
            <div className="text-[#6d513e] dark:text-[#a3988e] leading-relaxed space-y-4 text-[13px] sm:text-sm sm:pl-16">
              <p>
                Welcome to <strong>Foreign Emporium</strong> ("we," "our," or "us"). We are deeply committed to protecting your personal information and safeguarding your fundamental right to absolute privacy.
              </p>
              <p>
                If you have any questions, concerns, or inquiries regarding our privacy practices, please contact our dedicated security support team at{" "}
                <a href="mailto:support@inzeedo.lk" className="text-[#a97d43] dark:text-[#d4af37] font-black underline hover:opacity-85 transition-opacity">
                  support@inzeedo.lk
                </a>.
              </p>
              <p>
                When you access our boutique services and browse our curated collections, you place your trust in us. We treat your personal data with extreme care, absolute transparency, and state-of-the-art security systems.
              </p>
            </div>
          </div>

          {/* 2. Information We Collect */}
          <div className="content-stagger bg-white dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28]/60 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-2xl shrink-0">
                <Eye className="w-6 h-6 text-[#a97d43] dark:text-[#d4af37]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2c2520] dark:text-white uppercase tracking-wide">
                2. Information We Collect
              </h2>
            </div>
            <div className="text-[#6d513e] dark:text-[#a3988e] leading-relaxed space-y-5 text-[13px] sm:text-sm sm:pl-16">
              <p>
                We capture personal information that you intentionally provide when registering for a customer account, expressing interest in our curated products, or completing digital purchases.
              </p>
              <div className="grid gap-4 mt-6">
                <div className="flex gap-3 items-start bg-[#faf9f6] dark:bg-[#2d2520] p-5 rounded-2xl border border-[#e7e3d9] dark:border-[#352d28]/40">
                  <ArrowRight className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2c2520] dark:text-white font-bold block mb-1">Voluntary Personal Details</strong>
                    We collect your full name, phone number, email address, physical delivery addresses, account password, and billing preferences to complete secure checkouts.
                  </div>
                </div>
                <div className="flex gap-3 items-start bg-[#faf9f6] dark:bg-[#2d2520] p-5 rounded-2xl border border-[#e7e3d9] dark:border-[#352d28]/40">
                  <ArrowRight className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2c2520] dark:text-white font-bold block mb-1">Automated Device Telemetry</strong>
                    While browsing, we automatically collect basic device details (IP address, operating system, and language preferences) to optimize performance and display settings.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. How We Use Your Information */}
          <div className="content-stagger bg-white dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28]/60 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-2xl shrink-0">
                <Lock className="w-6 h-6 text-[#a97d43] dark:text-[#d4af37]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2c2520] dark:text-white uppercase tracking-wide">
                3. How We Use Your Information
              </h2>
            </div>
            <div className="text-[#6d513e] dark:text-[#a3988e] leading-relaxed space-y-4 text-[13px] sm:text-sm sm:pl-16">
              <p>
                All gathered details serve strict transactional, optimization, and relationship-building purposes:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37] shrink-0" />
                  To facilitate and protect your account creation and login security.
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37] shrink-0" />
                  To fulfill and manage orders, payments, returns, and premium shipments.
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37] shrink-0" />
                  To provide direct and helpful customer service support.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
