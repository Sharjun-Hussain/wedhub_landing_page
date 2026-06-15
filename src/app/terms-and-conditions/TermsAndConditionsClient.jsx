"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  FileText,
  Gavel,
  UserCheck,
  CreditCard,
  Truck,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";

export function TermsAndConditionsClient() {
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
          style={{ backgroundImage: `url('/banner_perfume.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c2520]/85 via-[#2c2520]/95 to-[#130f0d]/98" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white py-12">
          <span className="text-xs sm:text-sm font-black tracking-[0.15em] text-[#d4af37] mb-4 block uppercase hero-stagger">
            #Legal Terms
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6.5xl font-black tracking-tight leading-[1.15] mb-6 hero-stagger">
            Terms & <br className="hidden sm:inline" />
            <span className="text-[#d4af37] italic font-serif font-normal">Conditions.</span>
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm lg:text-base text-zinc-300 font-light leading-relaxed hero-stagger">
            Please read these terms carefully before utilizing our boutique services. They define our commitment to you and your responsibilities as a valued user.
          </p>
        </div>
      </section>

      {/* --- CONTENT --- */}
      <section className="px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto space-y-12 sm:space-y-16">
          
          {/* 1. Acceptance of Terms */}
          <div className="content-stagger bg-white dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28]/60 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-2xl shrink-0">
                <Gavel className="w-6 h-6 text-[#a97d43] dark:text-[#d4af37]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2c2520] dark:text-white uppercase tracking-wide">
                1. Acceptance of Terms
              </h2>
            </div>
            <div className="text-[#6d513e] dark:text-[#a3988e] leading-relaxed space-y-4 text-[13px] sm:text-sm sm:pl-16">
              <p>
                By accessing and using our online services (the "Site") and the boutique retail solutions provided by <strong>Foreign Emporium</strong>, you agree to comply with and be bound by these Terms and Conditions.
              </p>
              <p>
                If you do not agree to these terms, please do not use our Site or services. We reserve the right to modify these terms at any time without prior notice.
              </p>
            </div>
          </div>

          {/* 2. Account Responsibilities */}
          <div className="content-stagger bg-white dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28]/60 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-2xl shrink-0">
                <UserCheck className="w-6 h-6 text-[#a97d43] dark:text-[#d4af37]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2c2520] dark:text-white uppercase tracking-wide">
                2. Account Responsibilities
              </h2>
            </div>
            <div className="text-[#6d513e] dark:text-[#a3988e] leading-relaxed space-y-4 text-[13px] sm:text-sm sm:pl-16">
              <p>
                To access certain premium features or complete purchases, you may be required to register for a customer account.
              </p>
              <p>
                You are responsible for maintaining the strict confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>
            </div>
          </div>

          {/* 3. Pricing and Payments */}
          <div className="content-stagger bg-white dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28]/60 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-2xl shrink-0">
                <CreditCard className="w-6 h-6 text-[#a97d43] dark:text-[#d4af37]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2c2520] dark:text-white uppercase tracking-wide">
                3. Pricing and Payments
              </h2>
            </div>
            <div className="text-[#6d513e] dark:text-[#a3988e] leading-relaxed space-y-4 text-[13px] sm:text-sm sm:pl-16">
              <p>
                All prices are listed in Sri Lankan Rupees (LKR) or United States Dollars (USD) as applicable, and are subject to change without notice.
              </p>
              <p>
                We reserve the right to correct any errors in pricing or product descriptions and to cancel orders based on such errors. Payments must be completed through our authorized secure payment gateways or cash on delivery where available.
              </p>
            </div>
          </div>

          {/* 4. Shipping and Delivery */}
          <div className="content-stagger bg-white dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28]/60 p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-[#2c2520]/5 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#a97d43]/10 dark:bg-[#d4af37]/10 rounded-2xl shrink-0">
                <Truck className="w-6 h-6 text-[#a97d43] dark:text-[#d4af37]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2c2520] dark:text-white uppercase tracking-wide">
                4. Shipping and Delivery
              </h2>
            </div>
            <div className="text-[#6d513e] dark:text-[#a3988e] leading-relaxed space-y-4 text-[13px] sm:text-sm sm:pl-16">
              <p>
                We aim to dispatch and deliver your premium orders within the estimated timeframes specified at checkout.
              </p>
              <p>
                However, delivery times are not guaranteed and may be affected by external logistical factors beyond our direct control. We will always communicate delays transparently and support you.
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
