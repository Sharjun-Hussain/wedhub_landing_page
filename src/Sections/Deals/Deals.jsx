"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, Clock } from "lucide-react";
import { ProductCard } from "@/app/shop/components/ProductCard";
import { QuickView } from "@/components/shop/QuickView";

// Mock Data for section features
const TRUST_INDICATORS = [
  {
    icon: ShieldCheck,
    label: "Official Warranty",
    color: "text-green-600 dark:text-green-500",
  },
  {
    icon: Truck,
    label: "Islandwide Delivery",
    color: "text-blue-600 dark:text-blue-500",
  },
  {
    icon: Clock,
    label: "Same Day Dispatch",
    color: "text-orange-600 dark:text-orange-500",
  },
];

export function ProductDealsSection({
  title = "Flash Deals",
  subtitle = "Limited time offers you can't miss",
  products = [],
  viewAllLink = "/deals",
}) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
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

  return (
    <section ref={containerRef} className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] dark:bg-[#130f0d] transition-colors duration-500">
      <div className="lg:px-10 max-w-full mx-auto">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
              <span className="text-[10px] font-bold tracking-widest text-[#a97d43] dark:text-[#d4af37] uppercase font-sans">
                Live Offers
              </span>
            </div>
            <h2 className="text-3xl lg:text-4.5xl font-serif font-black text-[#2c2520] dark:text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#2c2520]/60 dark:text-zinc-400 mt-2 max-w-md font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop View All Link */}
          <div className="flex items-center mt-4 md:mt-0">
            <Link
              href={viewAllLink}
              className="relative pb-1 text-xs font-bold tracking-widest uppercase transition-colors duration-300 select-none whitespace-nowrap text-[#a97d43] dark:text-[#d4af37] hover:opacity-80"
            >
              VIEW ALL
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a97d43] dark:bg-[#d4af37] rounded-full" />
            </Link>
          </div>
        </div>

        {/* --- TRUST BADGES (Horizontally Scrollable on Mobile) --- */}
        {/* <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 w-max py-1">
            {TRUST_INDICATORS.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-xs sm:shadow-sm hover:scale-105 transition-transform"
              >
                <item.icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.color}`}
                />
                <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-zinc-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        {/* --- PRODUCTS GRID --- */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-10 md:py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800/60 rounded-3xl md:rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/30">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-xl mb-4 md:mb-6 ring-1 ring-zinc-100 dark:ring-zinc-800/10">
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-zinc-300 dark:text-zinc-700 animate-pulse" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight text-center">
              No active offers at the moment
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm md:text-base max-w-[260px] md:max-w-sm text-center font-medium leading-relaxed">
              We're currently preparing new exclusive deals. Check back soon or
              browse our full collection.
            </p>
            <Link
              href="/shop"
              className="mt-6 md:mt-8 px-6 md:px-8 py-2.5 md:py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
              Explore Full Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                <ProductCard
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              </div>
            ))}
          </div>
        )}

      </div>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
