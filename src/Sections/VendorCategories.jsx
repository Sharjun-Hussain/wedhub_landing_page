"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Wedding Halls",
    count: "320+ venues",
    href: "/vendors?category=venues",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-2 row-span-2", // large card
  },
  {
    name: "Photographers",
    count: "180+ studios",
    href: "/vendors?category=photographers",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Makeup Artists",
    count: "95+ artists",
    href: "/vendors?category=makeup",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Decorations",
    count: "140+ decorators",
    href: "/vendors?category=decorators",
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=2069&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Wedding Cakes",
    count: "75+ bakers",
    href: "/vendors?category=cakes",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Wedding Cars",
    count: "60+ providers",
    href: "/vendors?category=cars",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Jewelry",
    count: "110+ jewellers",
    href: "/vendors?category=jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Honeymoon Services",
    count: "85+ packages",
    href: "/vendors?category=honeymoon",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2033&auto=format&fit=crop",
    span: "col-span-2 row-span-1", // wide card
  },
];

const CategoryCard = memo(function CategoryCard({ item, priority = false }) {
  const isLarge  = item.span.includes("row-span-2");
  const isWide   = item.span.includes("col-span-2") && !isLarge;

  return (
    <Link
      href={item.href}
      className={`group relative overflow-hidden rounded-2xl ${item.span} cursor-pointer block h-full min-h-[200px]`}
    >
      {/* Background image */}
      <Image
        src={item.image}
        alt={item.name}
        fill
        priority={priority}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 transform-gpu will-change-transform"
      />

      {/* Gradient overlay — stronger at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

      {/* Gold shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/0 via-transparent to-[#8B1A2D]/0 group-hover:from-[#d4a853]/10 group-hover:to-[#8B1A2D]/15 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
        {/* Vendor count pill */}
        <div className="mb-2.5 transform-gpu translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300 ease-out will-change-transform">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-semibold text-white/90 tracking-wide">
            {item.count}
          </span>
        </div>

        {/* Category name */}
        <div className="flex items-end justify-between gap-3">
          <h3
            className={`font-serif font-bold text-white leading-tight drop-shadow-sm ${
              isLarge ? "text-[1.6rem] sm:text-[2rem]" : "text-[1.05rem] sm:text-[1.2rem]"
            }`}
          >
            {item.name}
          </h3>

          {/* Arrow icon */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center transform-gpu translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition duration-300 ease-out group-hover:bg-[#d4a853] group-hover:border-[#d4a853] will-change-transform">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Gold accent line */}
        <div className="mt-3 h-[2px] w-0 group-hover:w-12 bg-[#d4a853] rounded-full transition-all duration-500 ease-out transform-gpu" />
      </div>
    </Link>
  );
});

const VendorCategories = memo(function VendorCategories() {
  return (
    <section className="py-16 md:py-24 bg-[#fdf8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#8B1A2D] bg-rose-50 px-4 py-1.5 rounded-full mb-4">
              What We Offer
            </span>
            <h2 className="text-[1.9rem] md:text-[2.6rem] font-serif font-bold text-[#2C1A0E] leading-tight">
              Explore by Category
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-px w-14 bg-[#d4a853]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
              <div className="h-px w-14 bg-[#d4a853]" />
            </div>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#8B1A2D] hover:text-[#6d1422] transition-colors group shrink-0"
          >
            View All Categories
            <span className="w-8 h-8 rounded-full border-2 border-[#8B1A2D] flex items-center justify-center group-hover:bg-[#8B1A2D] group-hover:text-white transition-all duration-200">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* ── Bento Grid ───────────────────────────────────────────── */}
        {/* Desktop: 4-col bento grid */}
        <div className="hidden md:grid grid-cols-4 grid-rows-3 gap-4 auto-rows-[200px]">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.name} item={cat} priority={i < 2} />
          ))}
        </div>

        {/* Mobile: 2-col simple grid */}
        <div className="grid md:hidden grid-cols-2 gap-3">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl aspect-square block"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                priority={i < 4}
                sizes="50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-bold text-white text-[14px] leading-tight">{cat.name}</h3>
                <p className="text-[11px] text-white/65 mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
});

export default VendorCategories;
