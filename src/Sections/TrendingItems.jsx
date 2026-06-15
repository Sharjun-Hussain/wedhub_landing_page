"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShoppingBag,
  ArrowRight,
  Timer,
  Star,
  Zap,
  ChevronRight,
  Tag,
} from "lucide-react";
import { slugify, TOP_PICKS, MAIN_DEAL } from "@/app/Data";
import { useStore } from "@/States/Store";
import { useCart } from "@/hooks/useCart";
import { transformProduct } from "@/lib/api";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- UTILS ---
const formatCurrency = (amount) => "Rs. " + amount.toLocaleString("en-LK");

export default function DealsSection({ trendingProducts = [] }) {
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const router = useRouter();
  const { dispatch } = useStore();
  const { addToCart } = useCart();

  // Map trending products to UI structure
  const trendingItems = useMemo(() => {
    if (!trendingProducts || trendingProducts.length === 0) return TOP_PICKS;
    return trendingProducts
      .slice(0, 4)
      .map((product) => transformProduct(product));
  }, [trendingProducts]);

  const handleAddToCart = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // transformProduct normalized id, variant.id, etc.
      // But we need to be careful with the structures
      const productId = item.id;
      const variantId = item.variants?.[0]?.id || null;
      await addToCart(productId, variantId, 1, item);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  // --- COUNTDOWN LOGIC ---
  useEffect(() => {
    setIsMounted(true); // Prevent hydration mismatch
    const calculateTime = () => {
      const now = new Date();
      const difference = MAIN_DEAL.endDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- ANIMATIONS ---
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

        tl.fromTo(
          ".deal-header",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        );

        tl.fromTo(
          ".deal-main",
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4",
        );

        tl.fromTo(
          ".deal-side-item",
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
          "-=0.6",
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-10 sm:py-20 bg-white dark:bg-zinc-950 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="deal-header flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs mb-2 sm:mb-3 animate-pulse">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Most
              Wanted Now
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Trending Products
            </h2>
          </div>
          <Link
            href="/shop?sort=trending"
            className="hidden sm:flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            View All Trending <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* --- LEFT: MAIN DEAL CARD (7 Cols) --- */}
          <div className="deal-main lg:col-span-7 relative h-[380px] sm:h-[500px] lg:h-[600px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-slate-900 dark:bg-zinc-900 text-white group shadow-2xl shadow-slate-200 dark:shadow-none border border-transparent dark:border-white/10">
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={MAIN_DEAL.image}
                alt={MAIN_DEAL.title}
                className="w-full h-full object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-5 sm:p-10 flex flex-col justify-between">
              {/* Top Row: Timer & Tag */}
              <div className="flex justify-between items-start">
                {/* Glassmorphism Timer */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-4 shadow-lg">
                  <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs font-bold uppercase tracking-wide text-red-400">
                    <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Ends:
                  </div>
                  {isMounted ? (
                    <div className="flex gap-0.5 sm:gap-1 text-sm sm:text-xl font-bold font-mono text-white">
                      <span>{timeLeft.h.toString().padStart(2, "0")}</span>
                      <span className="text-white/40 animate-pulse">:</span>
                      <span>{timeLeft.m.toString().padStart(2, "0")}</span>
                      <span className="text-white/40 animate-pulse">:</span>
                      <span>{timeLeft.s.toString().padStart(2, "0")}</span>
                    </div>
                  ) : (
                    <div className="h-5 sm:h-7 w-20 sm:w-24 bg-white/20 animate-pulse rounded" />
                  )}
                </div>

                <div className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                  -11% OFF
                </div>
              </div>

              {/* Bottom Row: Product Info */}
              <div className="relative z-10">
                <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1.5 sm:mb-2 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                  <Tag className="w-3.5 h-3.5" /> {MAIN_DEAL.subtitle}
                </p>
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-3 sm:mb-6 leading-none">
                  {MAIN_DEAL.title}
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 mb-5 sm:mb-8">
                  <div>
                    <span className="text-sm sm:text-base text-slate-400 line-through block mb-0.5 sm:mb-1">
                      {formatCurrency(MAIN_DEAL.originalPrice)}
                    </span>
                    <div className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                      {formatCurrency(MAIN_DEAL.price)}
                    </div>
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-white/20 mb-1" />
                  <div className="text-xs sm:text-sm font-medium text-slate-300 flex sm:block items-center gap-2">
                    <span className="block sm:inline">You Save:</span>
                    <span className="text-green-400 font-bold text-base sm:text-lg">
                      {formatCurrency(
                        MAIN_DEAL.originalPrice - MAIN_DEAL.price,
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, MAIN_DEAL)}
                  className="w-full sm:w-auto bg-white text-slate-950 h-12 sm:h-14 px-8 sm:px-10 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-blue-500/40 group/btn"
                >
                  Add to Cart
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:rotate-12" />
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT: TOP PICKS LIST (5 Cols) --- */}
          <div className="lg:col-span-5 flex flex-col gap-4 h-full">
            {trendingItems.map((item) => (
              <div
                onClick={() =>
                  router.push(
                    `/product/${item.slug}?id=${item.id}&utm_source=homepage&utm_medium=trending-section`,
                  )
                }
                key={item.id}
                className="deal-side-item flex-1 group relative bg-slate-50 dark:bg-zinc-900 rounded-3xl p-3 sm:p-4 flex items-center gap-4 border border-slate-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer"
              >
                {/* Small Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shrink-0 relative flex items-center justify-center border border-slate-100 dark:border-zinc-700">
                  <img
                    src={
                      item.images?.[0] ||
                      "https://via.placeholder.com/400?text=No+Image"
                    }
                    alt={item.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  {item.originalPrice > item.price && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                      SALE
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {item.brand}
                    </p>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 ml-1">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-400 dark:text-slate-600 line-through font-medium">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all active:scale-90"
                      aria-label="Add to cart"
                      onClick={(e) => handleAddToCart(e, item)}
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* View All Card */}
            <Link
              href="/shop?sort=trending"
              className="deal-side-item h-14 sm:h-16 rounded-3xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-bold hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-sm sm:text-base"
            >
              View All Trending <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
