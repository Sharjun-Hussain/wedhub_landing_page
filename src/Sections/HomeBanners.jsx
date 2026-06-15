"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const DEFAULT_BANNERS = [
  {
    id: "banner-1",
    title: "Exquisite Arabian Oud & Fragrances",
    description:
      "Scent profiles direct from elite perfume and fragrance houses in Dubai and Saudi Arabia.",
    badge: "EXCLUSIVE ARABIAN IMPORT",
    button_text: "Discover Oud & Musk",
    link: "/shop?category=perfumes",
    image: "/homebanner1.png",
  },
  {
    id: "banner-2",
    title: "Premium Imported Foods & Nuts",
    description:
      "Authentic Saudi Ajwa dates, roasted raw nuts, royal honey, and premium imported delicacies.",
    badge: "LIMITED IMPORT STOCK",
    button_text: "Shop Gourmet Foods",
    link: "/shop?category=foods",
    image: "/homebanner 2.png",
  },
  {
    id: "banner-3",
    title: "Viral Dubai Chocolate Bars",
    description:
      "Indulge in the famous Dubai pistachio kunafa chocolate bars and luxury Middle Eastern sweets.",
    badge: "VIRAL SWEETS",
    button_text: "Discover Sweet Delights",
    link: "/shop?category=chocolates",
    image: "/homebanner-3.png",
  },
  {
    id: "banner-4",
    title: "Global Skincare & Beauty Essentials",
    description:
      "Transform your routine with premium authentic skincare imported directly from top global brands.",
    badge: "PREMIUM BEAUTY",
    button_text: "Shop Beauty & Skincare",
    link: "/shop?category=skincare",
    image: "/homebanner4.png",
  },
];

export default function HomeBanners({ initialCmsData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayTimerRef = useRef(null);

  const bannerDataList = useMemo(() => {
    if (!initialCmsData?.data) return DEFAULT_BANNERS;

    const cms = initialCmsData.data;
    const list = [...DEFAULT_BANNERS];
    if (cms.promo_banner_1) {
      list[0] = { ...list[0], ...cms.promo_banner_1 };
    }
    if (cms.promo_banner_2) {
      list[1] = { ...list[1], ...cms.promo_banner_2 };
    }
    return list;
  }, [initialCmsData]);

  // Autoplay functionality: Cross-fade every 5 seconds
  useEffect(() => {
    const startTimer = () => {
      autoplayTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % bannerDataList.length);
      }, 5000);
    };

    startTimer();

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [bannerDataList.length]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bannerDataList.length);
    }, 5000);
  };

  return (
    <section 
      className="relative w-full overflow-hidden shadow-lg bg-[#faf9f6] dark:bg-[#130f0d] transition-colors duration-500"
      style={{ aspectRatio: "1717 / 916" }}
    >

      {/* 1. Fixed Background Layers (z-10) - Rendered as direct children of the section to keep attachment stable */}
      {bannerDataList.map((slide, idx) => {
        const isActive = idx === activeIndex;

        return (
          <div
            key={`bg-${slide.id || idx}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title || "Banner"} 
              className="w-full h-full object-cover object-center" 
            />
          </div>
        );
      })}

      {/* 2. Global Dark Overlay (z-15) - Stays static on top of backgrounds */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-15 pointer-events-none" /> */}

      {/* 3. Text & Content Layers (z-20) */}
      {bannerDataList.map((slide, idx) => {
        const isActive = idx === activeIndex;

        return (
          <div
            key={`content-${slide.id || idx}`}
            className={`absolute inset-0 p-8 md:p-16 lg:p-24 flex flex-col justify-center items-start z-20 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
          >

            {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#d4af37]/20 border border-[#d4af37]/35 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3" />
              {slide.badge}
            </span> */}


            {/* <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight mb-4 leading-tight max-w-2xl">
              {slide.title}
            </h3> */}


            {/* <p className="text-zinc-300 text-sm md:text-lg font-medium mb-8 max-w-xl leading-relaxed">
              {slide.description}
            </p> */}


            {/* <Link
              href={slide.link}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-md bg-[#d4af37] hover:bg-[#b89569] text-zinc-950 font-bold text-sm transition-all shadow-md active:scale-95 duration-200"
            >
              {slide.button_text}
              <ArrowRight className="w-4 h-4" />
            </Link> */}
          </div>
        );
      })}

      {/* 4. Navigation Dots (z-30) */}
      <div className="absolute bottom-8 right-12 flex gap-2.5 z-30">
        {bannerDataList.map((_, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? "w-6 bg-[#d4af37]" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>

    </section>
  );
}
