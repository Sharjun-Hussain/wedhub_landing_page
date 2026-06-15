"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Star,
  ChevronRight,
  TrendingUp,
  Award,
  Percent,
  Plus,
} from "lucide-react";

import { useStore } from "@/States/Store";
import { slugify } from "@/app/Data";
import { useCart } from "@/hooks/useCart";

gsap.registerPlugin(ScrollTrigger);

// --- MOCK DATA (Unchanged) ---
const DATA = {
  featured: {
    title: "Editor's Choice",
    icon: Award,
    theme: "purple",
    items: [
      {
        id: 1,
        title: "iPhone 15 Pro",
        price: 385000,
        image:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=200",
        rating: 5.0,
      },
      {
        id: 2,
        title: "Pixel 8 Pro",
        price: 285000,
        image:
          "https://images.unsplash.com/photo-1598327105666-5b89351aff75?auto=format&fit=crop&q=80&w=200",
        rating: 4.9,
      },
      {
        id: 3,
        title: "Galaxy Tab S9",
        price: 245000,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=200",
        rating: 4.8,
      },
    ],
  },
  selling: {
    title: "Trending Now",
    icon: TrendingUp,
    theme: "blue",
    items: [
      {
        id: 4,
        title: "AirPods Pro 2",
        price: 78000,
        image:
          "https://images.unsplash.com/photo-1603351154351-5cf9972a9ce1?auto=format&fit=crop&q=80&w=200",
        rating: 4.9,
      },
      {
        id: 5,
        title: "Anker 20W Charger",
        price: 4500,
        image:
          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=200",
        rating: 4.7,
      },
      {
        id: 6,
        title: "Anker PowerBank",
        price: 12500,
        image:
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=200",
        rating: 4.6,
      },
    ],
  },
  sale: {
    title: "Hot Discounts",
    icon: Percent,
    theme: "rose",
    items: [
      {
        id: 7,
        title: "Sony XM4",
        price: 85000,
        oldPrice: 110000,
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200",
        rating: 4.8,
      },
      {
        id: 8,
        title: "Galaxy Watch 4",
        price: 45000,
        oldPrice: 65000,
        image:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=200",
        rating: 4.5,
      },
      {
        id: 9,
        title: "Spigen Case",
        price: 4500,
        oldPrice: 6000,
        image:
          "https://images.unsplash.com/photo-1603351154351-5cf9972a9ce1?auto=format&fit=crop&q=80&w=200",
        rating: 4.7,
      },
    ],
  },
};

const THEMES = {
  purple: {
    bg: "bg-purple-50 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border:
      "group-hover:border-purple-200 dark:group-hover:border-purple-500/30",
    shadow: "group-hover:shadow-purple-500/10",
    badge:
      "bg-white/90 dark:bg-zinc-900/90 text-purple-700 dark:text-purple-300 backdrop-blur-sm",
    glow: "from-purple-500/20 to-transparent",
    iconBg: "bg-purple-100 dark:bg-purple-500/20",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "group-hover:border-blue-200 dark:group-hover:border-blue-500/30",
    shadow: "group-hover:shadow-blue-500/10",
    badge:
      "bg-white/90 dark:bg-zinc-900/90 text-blue-700 dark:text-blue-300 backdrop-blur-sm",
    glow: "from-blue-500/20 to-transparent",
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "group-hover:border-rose-200 dark:group-hover:border-rose-500/30",
    shadow: "group-hover:shadow-rose-500/10",
    badge:
      "bg-white/90 dark:bg-zinc-900/90 text-rose-700 dark:text-rose-300 backdrop-blur-sm",
    glow: "from-rose-500/20 to-transparent",
    iconBg: "bg-rose-100 dark:bg-rose-500/20",
  },
};

const MiniProductCard = ({ product, index, themeKey }) => {
  const theme = THEMES[themeKey];
  const router = useRouter();
  const { dispatch } = useStore();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Transform to match store format
    const productToCart = {
      ...product,
      slug: slugify(product.title),
    };

    try {
      await addToCart(
        product.id,
        product.variants?.[0]?.id || null,
        1,
        productToCart,
      );
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      // Layout Logic:
      // 'flex-col' on mobile (Image Top, Text Bottom)
      // 'lg:flex-row' on desktop (Image Left, Text Right)
      className={`group relative flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 transition-all duration-500 ease-out hover:-translate-y-1 ${theme.border} hover:shadow-xl ${theme.shadow} cursor-pointer`}
    >
      {/* Image Container */}
      {/* Mobile: w-full aspect-square (Square image for grid) */}
      {/* Desktop: w-24 h-24 (Fixed size thumbnail) */}
      <div className="w-full aspect-square lg:w-24 lg:h-24 shrink-0 bg-slate-50 dark:bg-zinc-800 rounded-2xl overflow-hidden relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Ranking Badge (Top Left) */}
        <div
          className={`absolute top-2 left-2 w-6 h-6 rounded-full ${theme.badge} shadow-sm flex items-center justify-center text-[10px] font-black z-20 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75`}
        >
          {index + 1}
        </div>

        {/* Hover Add Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full ${theme.bg} ${theme.text} flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer z-30`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Info Container */}
      <div className="flex-1 min-w-0 py-1 w-full">
        <div className="flex items-center justify-between mb-1.5 lg:mb-1">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-500">
              {product.rating}
            </span>
          </div>
        </div>

        <h4 className="text-sm lg:text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mb-1 lg:mb-2">
          {product.title}
        </h4>

        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <span className={`text-sm font-bold ${theme.text}`}>
            Rs. {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-[10px] lg:text-xs text-slate-400 dark:text-slate-500 line-through">
              Rs. {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProductColumns() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // Only run scroll animations on desktop screens (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".col-group",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="pb-25 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {Object.keys(DATA).map((key) => {
            const column = DATA[key];
            const theme = THEMES[column.theme];

            return (
              <div key={key} className="col-group relative">
                {/* Atmospheric Glow */}
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-linear-to-b ${theme.glow} blur-[60px] opacity-0 lg:opacity-100 pointer-events-none`}
                />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-6 lg:mb-8">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${theme.iconBg} ${theme.text} flex items-center justify-center shadow-sm`}
                    >
                      <column.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {column.title}
                    </h3>
                  </div>
                  <Link
                    href={`/${key}`}
                    className={`text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:${theme.text} transition-colors flex items-center gap-1 group/link`}
                  >
                    View All{" "}
                    <ChevronRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>

                {/* Product GRID Container */}
                {/* Mobile: Grid (2 cols) | Desktop: Flex (Col) */}
                <div className="relative z-10 grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-4">
                  {column.items.map((item, idx) => (
                    <MiniProductCard
                      key={item.id}
                      product={item}
                      index={idx}
                      themeKey={column.theme}
                    />
                  ))}
                </div>

                {/* Bottom Button */}
                <button
                  className={`w-full mt-5 lg:mt-4 py-3 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 hover:${theme.text} transition-all active:scale-[0.98]`}
                >
                  Show More {column.title}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
