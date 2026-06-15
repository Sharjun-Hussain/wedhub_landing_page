"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ShoppingBag,
  Heart,
  Star,
  Zap,
  ArrowRight,
  CheckCircle2,
  Plus,
} from "lucide-react";

// --- UTILS ---
const formatCurrency = (amount) => "Rs. " + amount.toLocaleString("en-LK");

// --- MOCK DATA (Added a 5th item to show the grid row filling) ---
const ALL_PRODUCTS = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "new",
    price: 425000,
    originalPrice: 450000,
    rating: 5.0,
    reviews: 420,
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    ],
    colors: [
      { name: "Blue", class: "bg-slate-700" },
      { name: "Natural", class: "bg-stone-300" },
    ],
  },
  {
    id: 2,
    title: "Sony WH-1000XM5",
    brand: "Sony",
    category: "audio",
    price: 115000,
    originalPrice: 135000,
    rating: 4.8,
    reviews: 85,
    badge: "Sale",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
    ],
    colors: [
      { name: "Black", class: "bg-black" },
      { name: "Silver", class: "bg-stone-200" },
    ],
  },
  {
    id: 3,
    title: "Apple Watch Series 9",
    brand: "Apple",
    category: "wearables",
    price: 185500,
    originalPrice: null,
    rating: 4.9,
    reviews: 128,
    badge: "New",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=800",
    ],
    colors: [
      { name: "Midnight", class: "bg-slate-900" },
      { name: "Red", class: "bg-red-500" },
    ],
  },
  {
    id: 4,
    title: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "new",
    price: 395000,
    originalPrice: null,
    rating: 4.7,
    reviews: 210,
    badge: "Hot",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1610945265064-f4d215f7259d?auto=format&fit=crop&q=80&w=800",
    ],
    colors: [
      { name: "Black", class: "bg-slate-900" },
      { name: "Yellow", class: "bg-yellow-100" },
    ],
  },
  {
    id: 5,
    title: "JBL Flip 6",
    brand: "JBL",
    category: "audio",
    price: 38500,
    originalPrice: 45000,
    rating: 4.6,
    reviews: 340,
    badge: "-15%",
    images: [
      "https://images.unsplash.com/photo-1629219212008-62d966d54020?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1589256469067-ea99122bb5e8?auto=format&fit=crop&q=80&w=800",
    ],
    colors: [
      { name: "Red", class: "bg-red-500" },
      { name: "Blue", class: "bg-blue-500" },
    ],
  },
];

const TABS = [
  { id: "all", label: "All Products" },
  { id: "new", label: "New Arrivals" },
  { id: "audio", label: "Audio" },
  { id: "wearables", label: "Wearables" },
];

// --- PRODUCT CARD ---
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div
      className="group relative bg-white rounded-[2rem] p-3 border border-slate-100 hover:border-blue-200/60 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Area */}
      <div className="relative aspect-[1/1.1] bg-slate-50 rounded-[1.5rem] overflow-hidden mb-3">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.badge && (
            <div className="bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-white/50">
              {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="bg-red-500/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-white" /> {discount}%
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:text-red-500 transition-all duration-300 hover:scale-110 shadow-sm border border-white/50">
          <Heart className="w-3.5 h-3.5" />
        </button>

        {/* Images */}
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-opacity duration-500 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src={product.images[1] || product.images[0]}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-all duration-700 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        </Link>

        {/* Desktop Quick Add */}
        <div className="absolute inset-x-3 bottom-3 z-20 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out hidden lg:block">
          <button className="w-full bg-slate-900/80 backdrop-blur-md border border-white/10 hover:bg-slate-900 text-white font-bold h-10 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xl transition-all active:scale-[0.98]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>

        {/* Mobile Quick Add */}
        <button className="lg:hidden absolute bottom-2 right-2 z-20 w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Details Area */}
      <div className="px-1">
        {/* ROW 1: Brand & Rating (Updated Placement) */}
        <div className="flex justify-between items-center mb-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {product.brand}
          </p>

          <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-md">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-slate-700 leading-none">
              {product.rating}
            </span>
          </div>
        </div>

        {/* ROW 2: Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1 mb-2">
            {product.title}
          </h3>
        </Link>

        {/* ROW 3: Footer (Price & Colors) */}
        <div className="flex items-end justify-between pt-2 border-t border-slate-50">
          <div className="flex -space-x-1.5 hover:space-x-0.5 transition-all duration-300">
            {product.colors.map((c, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border border-white shadow-sm ${c.class}`}
              />
            ))}
          </div>

          <div className="text-right">
            {product.originalPrice && (
              <span className="block text-[10px] text-slate-400 line-through font-medium mb-0.5 leading-none">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="block font-bold text-base md:text-lg text-slate-900 leading-none">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN SECTION ---
export default function FeaturedProducts() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(ALL_PRODUCTS);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredProducts(ALL_PRODUCTS);
    } else {
      setFilteredProducts(ALL_PRODUCTS.filter((p) => p.category === activeTab));
    }
  }, [activeTab]);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Only run cards animation on desktop (>= 1024px)
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        ".home-product-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    });

    return () => mm.revert();
  }, [filteredProducts]);

  return (
    <section ref={containerRef} className="py-20 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Curated Collection
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Trending Now
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* GRID LAYOUT: 2 (Mobile) -> 3 (Tablet) -> 4 (Laptop) -> 5 (Large Screens) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="home-product-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
