"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ProductCard } from "@/app/shop/components/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import { transformProduct } from "@/lib/api";

const AdSlider = ({ adImages }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (!adImages || adImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % adImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [adImages]);

  if (!adImages || adImages.length === 0) return null;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-lg">
      {adImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentAdIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={img}
            alt={`Ad ${idx + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 25vw"
            className="object-cover"
          />
        </div>
      ))}
      {/* Slider Indicators */}
      {adImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 pointer-events-none">
          {adImages.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentAdIndex ? "bg-white w-4" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoryShowcase({
  initialProducts = [],
  title = "Showcase",
  categoryName,
  adImages = []
}) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const products = useMemo(() => {
    const productsArray = Array.isArray(initialProducts)
      ? initialProducts
      : Array.isArray(initialProducts?.data)
        ? initialProducts.data
        : [];
    return productsArray.map(transformProduct);
  }, [initialProducts]);

  // Static ad, no auto-play needed

  if (!products || products.length === 0) return null;

  return (
    <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] dark:bg-[#130f0d] overflow-hidden transition-colors duration-500 relative">

      <div className="lg:px-10 max-w-full mx-auto relative z-10">
        {/* --- SIMPLE & ELEGANT HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
              <span className="text-[10px] font-bold tracking-widest text-[#a97d43] dark:text-[#d4af37] uppercase font-sans">
                Curated Collection
              </span>
            </div>
            <h2 className="text-3xl lg:text-4.5xl font-serif font-black text-[#2c2520] dark:text-white tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <Link
              href={categoryName ? `/shop?category=${encodeURIComponent(categoryName)}` : "/shop"}
              className="relative pb-1 text-xs font-bold tracking-widest uppercase transition-colors duration-300 select-none whitespace-nowrap text-[#a97d43] dark:text-[#d4af37] hover:opacity-80"
            >
              VIEW ALL
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#a97d43] dark:bg-[#d4af37] opacity-40"></span>
            </Link>
          </div>
        </div>

        {/* --- 12-COLUMN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Area (9 Columns): Product Slider */}
          <div className="lg:col-span-9 relative group">
            {/* Slider Arrows */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 w-10 h-10 bg-white dark:bg-[#1d1815] rounded-full flex items-center justify-center shadow-lg border border-[#e7e3d9] dark:border-[#352d28] text-[#0a382c] dark:text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 w-10 h-10 bg-white dark:bg-[#1d1815] rounded-full flex items-center justify-center shadow-lg border border-[#e7e3d9] dark:border-[#352d28] text-[#0a382c] dark:text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-2 py-2 no-scrollbar"
            >
              {products.map((product, index) => (
                <div key={product.id || index} className="w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] shrink-0 snap-start">
                  <ProductCard
                    product={product}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Area (3 Columns): Ad Slider Component */}
          {adImages && adImages.length > 0 && (
            <div className="lg:col-span-3 hidden lg:block">
              <AdSlider adImages={adImages} />
            </div>
          )}
        </div>
      </div>

      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
