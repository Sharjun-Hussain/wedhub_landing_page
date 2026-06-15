"use client";

import React, { useRef, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const ShopHero = memo(function ShopHero({ cmsData }) {
  const containerRef = useRef(null);

  const heroData = cmsData?.data?.hero || {
    badge_text: "Curated Collections",
    title_start: "Shop Premium",
    title_end: "Imported Goods.",
    description:
      "Explore our handpicked selection of authentic imported chocolates, perfumes, exotic sodas, premium nuts, and more — sourced directly from Saudi Arabia and Dubai.",
  };

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // Only run animations on desktop screens (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline();
        tl.fromTo(
          ".shop-hero-stagger",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" },
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .shop-hero-curve {
          clip-path: polygon(0 0, 100% 0, 100% 92%, 95% 93%, 90% 94%, 85% 95%, 80% 96%, 75% 97%, 70% 98%, 65% 98.8%, 60% 99.4%, 55% 99.8%, 50% 100%, 45% 99.8%, 40% 99.4%, 35% 98.8%, 30% 98%, 25% 97%, 20% 96%, 15% 95%, 10% 94%, 5% 93%, 0% 92%);
        }
        @media (min-width: 640px) {
          .shop-hero-curve {
            clip-path: polygon(0 0, 100% 0, 100% 82%, 95% 84.8%, 90% 87.6%, 85% 90.2%, 80% 92.6%, 75% 94.7%, 70% 96.6%, 65% 98%, 60% 99.1%, 55% 99.8%, 50% 100%, 45% 99.8%, 40% 99.1%, 35% 98%, 30% 96.6%, 25% 94.7%, 20% 92.6%, 15% 90.2%, 10% 87.6%, 5% 84.8%, 0% 82%);
          }
        }
      `}} />
      <section
        ref={containerRef}
        className="relative w-[calc(100%-24px)] mx-[12px] h-[50vh] min-h-[380px] bg-[#0a382c] dark:bg-[#07241d] rounded-t-xl overflow-hidden shadow-2xl flex items-center justify-center mb-8 transform-gpu backface-hidden mt-[88px] sm:mt-[96px] shop-hero-curve"
      >
      {/* Background Image with Dark Forest Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] lg:hover:scale-105 transform-gpu will-change-transform"
        style={{ backgroundImage: `url('/hero_truffles.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a382c]/80 via-[#0a382c]/90 to-[#07241d]/95" />

      {/* Dotted Grid Overlay matching homepage Hero */}
      <div className="absolute inset-0 bg-[radial-gradient(#104e3e_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none z-10" />

      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white py-12">
        <span className="text-xs sm:text-sm font-semibold tracking-[0.15em] text-[#d4af37] mb-4 block uppercase shop-hero-stagger">
          #{heroData.badge_text}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.15] mb-6 shop-hero-stagger">
          {heroData.title_start} <br className="hidden sm:inline" />
          <span className="text-[#d4af37] italic font-serif font-normal">
            {heroData.title_end}
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm sm:text-base lg:text-lg text-zinc-300 font-light leading-relaxed shop-hero-stagger">
          {heroData.description}
        </p>
      </div>
    </section>
    </>
  );
});

ShopHero.displayName = "ShopHero";
