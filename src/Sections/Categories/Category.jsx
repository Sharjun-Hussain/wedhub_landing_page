"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export default function CategorySection({ initialCategories = [] }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categoriesToRender = useMemo(() => {
    if (!initialCategories || initialCategories.length === 0) return [];

    const baseUrl = API_BASE_URL.replace("/api/v1", "");
    
    return initialCategories.map((cat, index) => {
      let imageUrl = "/category_pantry.png"; // Fallback
      if (cat.image_path) {
        if (cat.image_path.startsWith('http')) {
          imageUrl = cat.image_path;
        } else {
          const cleanPath = cat.image_path.replace(/\/+/g, "/");
          imageUrl = `${baseUrl}/${cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath}`;
        }
      }

      return {
        id: cat.id,
        name: cat.name,
        image: imageUrl,
        href: `/shop?category=${encodeURIComponent(cat.name)}`,
      };
    });
  }, [initialCategories]);

  if (categoriesToRender.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="pt-4 lg:pt-6 pb-16 lg:pb-24 bg-[#faf9f6] dark:bg-[#130f0d] font-sans text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500"
    >
      {/* Background Subtle Sparkle Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#a97d43_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* --- HEADER --- */}
        <div 
          className={`text-center max-w-2xl mx-auto mb-16 px-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-3 justify-center">
            <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#a97d43] dark:text-[#d4af37] uppercase">
              Bespoke Collections
            </span>
            <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-[#2c2520] dark:text-white tracking-tight uppercase">
            Shop by Category
          </h2>
          <p className="text-[#6d513e] dark:text-[#a3988e] mt-2 text-sm sm:text-base font-light">
            Discover curated imported items flown in directly from Saudi Arabia and Dubai.
          </p>
        </div>

        {/* --- CIRCULAR CATEGORIES GRID --- */}
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-start justify-center gap-x-2 gap-y-6 sm:gap-x-8 sm:gap-y-12 max-w-6xl mx-auto px-1 sm:px-4">
          {categoriesToRender.map((cat, index) => (
            <Link
              key={cat.id}
              href={cat.href}
              style={{ transitionDelay: `${index * 150}ms` }}
              className={`group flex flex-col items-center select-none cursor-pointer text-center w-full sm:w-28 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"
              }`}
            >
              {/* Rounded Image Wrapper */}
              <div className="relative w-[70px] h-[70px] xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#e7e3d9] dark:border-[#352d28]/60 bg-white dark:bg-[#1d1815] group-hover:border-[#a97d43] dark:group-hover:border-[#d4af37] group-hover:shadow-lg shadow-[#2c2520]/5 group-hover:shadow-[#a97d43]/10 transition-all duration-300 transform group-hover:scale-105 active:scale-95 flex items-center justify-center">
                
                {/* Category Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                {/* Subtle Inner Glow Border overlay */}
                <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none" />
                
                {/* Soft Hover Overlay */}
                <div className="absolute inset-0 bg-[#2c2520]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              </div>

              {/* Centered Label */}
              <span className="mt-2.5 text-[11px] xs:text-xs sm:text-sm font-bold text-[#2c2520] dark:text-zinc-200 tracking-wide uppercase line-clamp-2 max-w-full px-0.5 group-hover:text-[#a97d43] dark:group-hover:text-[#d4af37] transition-colors duration-300">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
