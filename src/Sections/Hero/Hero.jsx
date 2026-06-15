"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

// 1. Move static slides configuration outside the component to prevent re-allocation on every render pass
const BRAND_SLIDES = [
  {
    slogan: "Gourmet Confectionery",
    titlePart1: "Artisanal Belgian Truffles",
    titlePart2: "Up to 20% OFF!",
    subtitle:
      "Savor the rich, velvety taste of imported European truffles and pralinés.",
    image: "/hero_truffles.png",
    link: "/shop?category=chocolates",
  },
  {
    slogan: "Signature Fragrances",
    titlePart1: "Exclusive Parisian Scents",
    titlePart2: "100% Original Sourced!",
    subtitle:
      "Redefine your everyday elegance with premium boutique French perfumes.",
    image: "/hero_perfume.png",
    link: "/shop?category=perfumes",
  },
  {
    slogan: "Exotic Sodas & Juices",
    titlePart1: "Imported Drinks & Elixirs",
    titlePart2: "Dubai & Global Brands!",
    subtitle:
      "Exquisite imported sparkling sodas, royal nectar juices, and traditional Middle Eastern beverages.",
    image: "/hero_infant_care.png",
    link: "/shop?category=beverages",
  },
];

export default function HeroSlider({ initialCmsData }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 2. Use a Ref for transition locking instead of State.
  // This completely eliminates 2 redundant re-renders per slide change!
  const isTransitioningRef = useRef(false);
  const slideInterval = useRef(null);

  const slides = BRAND_SLIDES;

  // Autoplay Logic - Memoized with empty dependencies so the interval never thrashes
  const stopAutoPlay = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
    }
  }, []);

  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setCurrentSlide((prev) => (prev + 1) % BRAND_SLIDES.length);

    // Release the transition lock after animation completes
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 800);
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    slideInterval.current = setInterval(() => {
      handleNext();
    }, 6000);
  }, [handleNext, stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const goToSlide = (idx) => {
    if (isTransitioningRef.current || idx === currentSlide) return;
    isTransitioningRef.current = true;

    setCurrentSlide(idx);

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 800);

    startAutoPlay(); // Restart the interval countdown
  };

  return (
    <div className="w-full bg-[#faf9f6] dark:bg-[#130f0d] mt-[88px] sm:mt-[96px] pt-0 pb-4 transition-colors duration-500">
      {/* FLOATING LUXURY STRUCTURE WITH EXACTLY 12PX SIDE MARGINS & 16PX TOP GAP */}
      <div
        className="relative w-[calc(100%-24px)] mx-[12px] h-[78vh] min-h-[620px] bg-gradient-to-br from-[#061c15] via-[#0a382c] to-[#04120e] dark:from-[#04120e] dark:via-[#07241d] dark:to-[#020907] border border-[#d4af37]/15 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] pb-16"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)" }}
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        {/* Cinematic Lighting overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px] pointer-events-none z-0" />

        <div className="relative w-full h-full max-w-7xl mx-auto overflow-hidden">
          <div 
            className="flex w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => {
              const isActive = idx === currentSlide;

              return (
                <div
                  key={idx}
                  className={`w-full shrink-0 h-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 px-6 sm:px-12 lg:px-16 transition-opacity duration-1000 ${
                    isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100"
                  }`}
                  aria-hidden={!isActive}
                >
                {/* LEFT COLUMN: Premium Typography & High-CTR Actions */}
                <div className="lg:col-span-6 flex flex-col justify-center h-full pt-10 lg:pt-0 relative z-20 pl-2 sm:pl-4 text-left">
                  
                  {/* Luxury Pill Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm w-fit mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                    <span className="text-xs font-medium tracking-widest text-[#d4af37] uppercase">
                      {slide.slogan}
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-sans font-black tracking-tight text-white leading-[1.05] mb-5 drop-shadow-lg">
                    {slide.titlePart1}{" "}
                    <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] drop-shadow-md">
                      {slide.titlePart2}
                    </span>
                  </h1>

                  <p className="text-zinc-300 text-sm sm:text-lg font-light max-w-lg leading-relaxed mb-8 text-shadow-sm">
                    {slide.subtitle}
                  </p>

                  {/* INLINE PROGRESS PAGINATION DOTS */}
                  <div className="hidden lg:flex items-center gap-3 mb-10">
                    {slides.map((_, dotIdx) => {
                      const isDotActive = dotIdx === currentSlide;
                      return (
                        <button
                          key={dotIdx}
                          onClick={() => goToSlide(dotIdx)}
                          className="py-2 focus:outline-none group"
                          aria-label={`Go to slide ${dotIdx + 1}`}
                        >
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                              isDotActive
                                ? "w-8 bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                                : "w-2 bg-white/20 group-hover:bg-white/40"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* High-CTR Action Row with Trust Signals */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <Link
                      href={slide.link}
                      className="group relative inline-flex h-14 px-8 rounded-xl font-bold items-center justify-center gap-3 text-sm tracking-wider uppercase bg-gradient-to-r from-[#d4af37] to-[#b89569] text-zinc-950 border border-[#f3e5ab]/40 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                    >
                      {/* Shine effect sweep */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                      Shop Now 
                      <ShoppingBag className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    
                    {/* Trust Indicator */}
                    <div className="flex flex-col gap-1 opacity-80">
                      <div className="flex items-center gap-1 text-[#d4af37]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[11px] text-zinc-300 font-medium tracking-wide uppercase">Trusted by 10,000+</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Cinematic product presentation */}
                <div className="lg:col-span-6 relative h-[40vh] lg:h-full flex items-center justify-center lg:justify-end pb-8 lg:pb-0">
                  {/* Ambient Backlight Glow */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square bg-[#d4af37]/20 blur-[80px] rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  
                  <div
                    className={`relative w-[90%] sm:w-[70%] lg:w-[85%] h-[100%] max-h-[460px] aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 bg-black/10 backdrop-blur-sm transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      isActive
                        ? "translate-x-0 scale-100 opacity-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]"
                        : "translate-x-16 scale-95 opacity-0"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.titlePart1}
                      fill
                      priority={idx === 0}
                      className="object-cover transition-transform duration-[4s] ease-out hover:scale-110"
                      sizes="(max-width: 1024px) 90vw, 45vw"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* MOBILE-ONLY PROGRESS PAGINATION DOTS (Centered in the white space under the green clipped hero) */}
      <div className="lg:hidden flex items-center justify-center gap-3.5 mt-8 relative z-30">
        {slides.map((_, dotIdx) => {
          const isDotActive = dotIdx === currentSlide;
          return (
            <button
              key={dotIdx}
              onClick={() => goToSlide(dotIdx)}
              className="py-1 px-1 focus:outline-none"
              aria-label={`Go to slide ${dotIdx + 1}`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isDotActive
                    ? "bg-[#a97d43] dark:bg-[#d4af37] scale-125 shadow-sm"
                    : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
