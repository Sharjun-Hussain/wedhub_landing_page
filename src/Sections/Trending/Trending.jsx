"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Star,
  ShoppingBag,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Cpu,
  Wifi,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 128,
    imageFront:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=600",
    imageBack:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600",
    colors: ["#3f3f46", "#f4f4f5", "#2563eb"],
    specs: { storage: "256GB", ram: "8GB", network: "5G" },
    tag: "Titanium",
  },
  {
    id: 2,
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1099,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 94,
    imageFront:
      "https://images.unsplash.com/photo-1610945415295-d96bf067153c?auto=format&fit=crop&q=80&w=600",
    imageBack:
      "https://images.unsplash.com/photo-1610945265064-f3947e720ba0?auto=format&fit=crop&q=80&w=600",
    colors: ["#000000", "#fbbf24", "#e5e7eb"],
    specs: { storage: "512GB", ram: "12GB", network: "5G" },
    tag: "AI Ready",
  },
  {
    id: 3,
    name: "Pixel 8 Pro",
    brand: "Google",
    price: 899,
    originalPrice: 999,
    rating: 4.7,
    reviews: 82,
    imageFront:
      "https://images.unsplash.com/photo-1698696884697-768a86561230?auto=format&fit=crop&q=80&w=600",
    imageBack:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=600",
    colors: ["#bae6fd", "#171717", "#fef3c7"],
    specs: { storage: "128GB", ram: "12GB", network: "5G" },
    tag: "Best Camera",
  },
  {
    id: 4,
    name: "Sony Xperia 1 V",
    brand: "Sony",
    price: 1399,
    originalPrice: null,
    rating: 4.6,
    reviews: 45,
    imageFront:
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=600",
    imageBack:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600",
    colors: ["#18181b", "#166534"],
    specs: { storage: "256GB", ram: "12GB", network: "4K OLED" },
    tag: "Pro Media",
  },
  {
    id: 5,
    name: "Nothing Phone (2)",
    brand: "Nothing",
    price: 699,
    originalPrice: 750,
    rating: 4.8,
    reviews: 156,
    imageFront:
      "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&q=80&w=600",
    imageBack:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600",
    colors: ["#ffffff", "#52525b"],
    specs: { storage: "256GB", ram: "12GB", network: "Glyph" },
    tag: "Unique",
  },
];

export default function TrendingSection() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // Only run scroll animations on desktop screens (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray(".product-card");
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 overflow-hidden bg-zinc-50 dark:bg-black transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

      <div className="container relative z-10 mx-auto px-4">
        {/* --- HEADER CHANGE IS HERE --- */}
        <div className="flex flex-row justify-between items-end mb-12 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-8 bg-blue-600 dark:bg-blue-500"></span>
              <span className="text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase text-xs">
                Weekly Selection
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Trending Devices
            </h2>
          </div>

          <div className="flex gap-2 shrink-0 mb-1">
            <button
              onClick={scrollLeft}
              className="group p-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-white hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 group-active:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={scrollRight}
              className="group p-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-white hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 group-active:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group min-w-[320px] md:min-w-[360px] snap-center bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500"
            >
              <div className="relative h-[400px] overflow-hidden p-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100/50 to-zinc-50/0 dark:from-zinc-800/20 dark:to-transparent transition-opacity duration-500" />

                <div className="relative z-20 flex justify-between items-start">
                  <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white backdrop-blur-md rounded-full">
                    {product.tag}
                  </span>

                  <div className="flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">
                    <button className="p-2.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-lg hover:bg-blue-500 hover:text-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-lg hover:bg-blue-500 hover:text-white transition-colors delay-75">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 ease-out group-hover:scale-110">
                  <img
                    src={product.imageFront}
                    alt={product.name}
                    className="absolute max-w-[85%] max-h-[85%] object-contain drop-shadow-xl z-10 transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <img
                    src={product.imageBack}
                    alt={product.name}
                    className="absolute max-w-[85%] max-h-[85%] object-contain drop-shadow-xl z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
              </div>

              <div className="p-6 pt-2 flex flex-col gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 py-3 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <Smartphone className="w-3.5 h-3.5" />{" "}
                    {product.specs.storage}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <Cpu className="w-3.5 h-3.5" /> {product.specs.ram}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <Wifi className="w-3.5 h-3.5" /> {product.specs.network}
                  </div>
                </div>

                <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" />

                <div className="flex items-center justify-between mt-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-medium">
                      Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-zinc-900 dark:text-white">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-zinc-400 line-through decoration-zinc-400/50">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="group/btn relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-105 transition-all shadow-md hover:shadow-xl hover:shadow-zinc-500/20 active:scale-95">
                    <span className="hidden sm:inline">Add</span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
