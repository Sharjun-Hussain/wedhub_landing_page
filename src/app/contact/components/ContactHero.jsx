"use client";

import React, { useRef, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ContactHero = memo(function ContactHero() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // Only run animations on desktop screens (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline();
        tl.fromTo(
          ".hero-stagger",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" },
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-[calc(100%-24px)] mx-[12px] h-[50vh] min-h-[420px] bg-[#0a382c] dark:bg-[#07241d] border border-[#104e3e]/40 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center pb-16 mb-16 transform-gpu backface-hidden will-change-[transform,clip-path]"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 88%)" }}
    >
      {/* Background Image with Dark Forest Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] lg:hover:scale-105 transform-gpu will-change-transform"
        style={{ backgroundImage: `url('/banner_perfume.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a382c]/80 via-[#0a382c]/90 to-[#07241d]/95" />

      {/* Dotted Grid Overlay matching homepage Hero */}
      <div className="absolute inset-0 bg-[radial-gradient(#104e3e_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none z-10" />

      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white py-12">
        <span className="text-xs sm:text-sm font-semibold tracking-[0.15em] text-[#d4af37] mb-4 block uppercase hero-stagger">
          #Contact Us
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6.5xl font-serif font-black tracking-tight leading-[1.15] mb-6 hero-stagger">
          We’re Here to <br className="hidden sm:inline" />
          <span className="text-[#d4af37] italic font-serif font-normal">Help You.</span>
        </h1>
        <p className="max-w-xl mx-auto text-sm sm:text-base lg:text-lg text-zinc-300 font-light leading-relaxed hero-stagger">
          Have questions about our premium ouds, viral chocolates, exotic drinks, or food imports? Feel free to reach out. We usually reply in a few hours.
        </p>
      </div>
    </section>
  );
});

ContactHero.displayName = "ContactHero";

export default ContactHero;
