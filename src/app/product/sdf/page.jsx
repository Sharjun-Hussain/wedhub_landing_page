"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  Share2,
  ChevronRight,
  Zap,
  PlayCircle,
  X,
  ArrowLeft,
} from "lucide-react";

// --- UTILS ---
const formatCurrency = (amount) => "Rs. " + amount.toLocaleString("en-LK");

// --- MOCK DATA ---
const PRODUCT = {
  id: "apple-watch-s9",
  brand: "Apple",
  title: "Apple Watch Series 9 GPS + Cellular",
  price: 185500,
  originalPrice: 195000,
  rating: 4.9,
  reviews: 128,
  description:
    "Experience the most powerful chip in Apple Watch history. Double tap—a magical new way to use your watch without touching the screen. Brighter display, carbon neutral combinations, and advanced health sensors.",
  colors: [
    { name: "Midnight", class: "bg-slate-900", border: "border-slate-900" },
    { name: "Starlight", class: "bg-[#F0EAD6]", border: "border-[#dcd5bf]" },
    { name: "Silver", class: "bg-gray-200", border: "border-gray-300" },
    { name: "Product Red", class: "bg-red-500", border: "border-red-500" },
  ],
  sizes: ["41mm", "45mm"],
  images: [
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1200", // Main
    "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=800", // Side
    "https://images.unsplash.com/photo-1558126319-c9feecbf57ee?auto=format&fit=crop&q=80&w=800", // Wrist
    "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=800", // Lifestyle
  ],
  specs: [
    { label: "Display", value: "Always-On Retina display (2000 nits)" },
    { label: "Processor", value: "S9 SiP with 64-bit dual-core processor" },
    { label: "Connectivity", value: "LTE and UMTS, Wi-Fi 4, Bluetooth 5.3" },
    { label: "Water Resistance", value: "Water resistant 50m (Swimproof)" },
    { label: "Sensors", value: "Blood Oxygen, ECG, Temperature sensing" },
  ],
};

// --- COMPONENTS ---

// 1. Magnifier Image Component
const MagnifierImage = ({ src }) => {
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    gsap.to(imgRef.current, {
      transformOrigin: `${x}% ${y}%`,
      scale: 1.5,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imgRef.current, {
      scale: 1,
      transformOrigin: "center center",
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      className="w-full h-full overflow-hidden rounded-3xl cursor-zoom-in relative bg-slate-100"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={src}
        alt="Product"
        className="w-full h-full object-cover mix-blend-multiply"
      />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-slate-900 pointer-events-none">
        Hover to Zoom
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function ProductPage() {
  const containerRef = useRef(null);
  const mainActionsRef = useRef(null);
  const scrollRef = useRef(null);

  // State
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // Scroll Listener for Floating Bar
  // Floating Bar Visibility (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating bar only when main actions are NOT intersecting (off-screen)
        // AND they have scrolled past the top of the viewport
        setShowFloatingBar(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );

    if (mainActionsRef.current) {
      observer.observe(mainActionsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animations
  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".fade-in",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      );

      tl.fromTo(
        ".slide-up",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white font-sans text-slate-900 pb-32 pt-16 md:pt-0"
    >
      {/* --- MOBILE FIXED HEADER --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-6 h-16 bg-white/90 backdrop-blur-lg pointer-events-none">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-start text-slate-900 pointer-events-auto active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <span className="text-slate-900 font-bold text-base pointer-events-none">
          Details
        </span>

        <button className="w-10 h-10 flex items-center justify-end text-slate-900 pointer-events-auto active:scale-95 transition-transform">
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* --- FLOATING BOTTOM BAR (Mobile/Desktop) --- */}
      <div
        className={`fixed bottom-[80px] lg:bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 transition-all duration-500 ease-in-out ${
          showFloatingBar
            ? "translate-y-0 opacity-100 visible"
            : "translate-y-full opacity-0 invisible"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4">
            <img
              src={PRODUCT.images[activeImage]}
              className="w-12 h-12 rounded-lg object-cover bg-slate-100 mix-blend-multiply"
            />
            <div>
              <p className="font-bold text-slate-900">{PRODUCT.title}</p>
              <p className="text-xs text-slate-500">
                {PRODUCT.colors[selectedColor].name} •{" "}
                {PRODUCT.sizes[selectedSize]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="font-bold text-xl text-slate-900 hidden md:block">
              {formatCurrency(PRODUCT.price)}
            </span>
            <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* --- HEADER / BREADCRUMBS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 fade-in hidden md:block">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <button
            onClick={() => router.back()}
            className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all active:scale-95 group shadow-sm shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Shop
          </a>
          <ChevronRight className="w-3 h-3" />
          <a href="#" className="hover:text-blue-600 transition-colors">
            Smart Watches
          </a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">{PRODUCT.title}</span>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT: GALLERY (Sticky) */}
          <div className="lg:col-span-7 slide-up">
            <div className="sticky top-24 space-y-6">
              {/* Main Showcase (Magnifier) */}
              <div className="aspect-[4/3] w-full bg-slate-100 rounded-none sm:rounded-[2rem] shadow-sm relative group overflow-hidden border-none sm:border sm:border-slate-100">
                {/* Image Showcase - No absolute header inside here anymore */}

                <MagnifierImage src={PRODUCT.images[activeImage]} />

                {/* Overlay Controls */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <button className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm hover:shadow-md transition-all">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm hover:shadow-md transition-all">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Bento Grid Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {PRODUCT.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-slate-50 transition-all duration-300 ${
                      activeImage === idx
                        ? "ring-2 ring-blue-600 ring-offset-2 opacity-100"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                    {activeImage === idx && (
                      <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS (Scrollable) */}
          <div className="lg:col-span-5 slide-up px-4 sm:px-0 py-4">
            {/* Brand & Title */}
            <div className="mb-6">
              <div className="mb-4">
                {/* Badge removed */}
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                  {PRODUCT.brand}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-[1.1] tracking-tight">
                {PRODUCT.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-900 mt-0.5">
                  {PRODUCT.rating}
                </span>
                <span className="text-sm text-slate-400 mt-0.5">•</span>
                <a
                  href="#"
                  className="text-sm font-medium text-slate-500 hover:text-blue-600 underline decoration-slate-300 underline-offset-4 mt-0.5"
                >
                  Read {PRODUCT.reviews} Reviews
                </a>
              </div>
            </div>

            {/* Price Block */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900">
                  {formatCurrency(PRODUCT.price)}
                </span>
                <span className="text-lg text-slate-400 line-through font-medium">
                  {formatCurrency(PRODUCT.originalPrice)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                In stock, ready to ship
              </div>
            </div>

            {/* Description Snippet */}
            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              {PRODUCT.description}
            </p>

            {/* SELECTORS */}
            <div className="space-y-8 mb-10 border-t border-slate-100 pt-8">
              {/* Colors */}
              <div>
                <label className="text-sm font-bold text-slate-900 mb-4 block uppercase tracking-wide">
                  Select Finish
                </label>
                <div className="flex flex-wrap gap-4">
                  {PRODUCT.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedColor === idx
                          ? "ring-2 ring-offset-2 ring-blue-600 scale-110"
                          : "hover:scale-105"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full shadow-inner ${color.class} ${color.border} border`}
                      />
                      {selectedColor === idx && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-100 transition-opacity">
                          {color.name}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-sm font-bold text-slate-900 mb-4 block uppercase tracking-wide">
                  Case Size
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {PRODUCT.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(idx)}
                      className={`relative h-16 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                        selectedSize === idx
                          ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-lg shadow-blue-100"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-bold text-lg">{size}</span>
                      {selectedSize === idx && (
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-600 text-white p-1 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* --- PRIMARY ACTION BUTTONS --- */}
            <div
              ref={mainActionsRef}
              className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12"
            >
              <div className="flex items-center bg-slate-100 rounded-xl h-14 w-36 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="flex-1 text-center font-bold text-lg text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] group">
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Fast Delivery
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    2-3 days to Kandy
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Official Warranty
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    1 Year Apple Care
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TABS SECTION (Animated Pill) --- */}
        <div className="mt-24 slide-up" ref={scrollRef}>
          <div className="flex justify-center mb-10">
            <div className="bg-slate-100 p-1.5 rounded-full inline-flex relative">
              {["Description", "Specs", "Reviews"].map((tab) => {
                const isActive = activeTab === tab.toLowerCase();
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <div className="absolute inset-0 bg-slate-900 rounded-full -z-10 animate-in fade-in zoom-in-95 duration-300 shadow-md" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[2rem] p-8 lg:p-12 shadow-2xl shadow-slate-200/50 min-h-[400px]">
            {activeTab === "description" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="relative rounded-3xl overflow-hidden h-80 group">
                  <img
                    src="https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <h3 className="text-3xl font-bold text-white">
                      Smarter. Brighter. Mightier.
                    </h3>
                  </div>
                </div>
                <div className="prose prose-lg text-slate-600 leading-relaxed">
                  <p>
                    Custom-designed Apple silicon makes Apple Watch Series 9
                    more capable, intuitive, and faster. The new dual-core CPU
                    has 5.6 billion transistors — 60 percent more than the S8
                    chip. A new four-core Neural Engine processes machine
                    learning tasks up to two times faster.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {PRODUCT.specs.map((spec, i) => (
                    <div key={i} className="group">
                      <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 group-hover:text-blue-600 transition-colors">
                        {spec.label}
                      </dt>
                      <dd className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
                  <div className="text-center md:text-left">
                    <div className="text-6xl font-black text-slate-900 mb-2">
                      {PRODUCT.rating}
                    </div>
                    <div className="flex gap-1 text-amber-400 justify-center md:justify-start mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="fill-current w-6 h-6" />
                      ))}
                    </div>
                    <p className="text-slate-500 font-medium">
                      Based on 128 verified reviews
                    </p>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-500 w-3">
                          {rating}
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{
                              width:
                                rating === 5
                                  ? "85%"
                                  : rating === 4
                                    ? "10%"
                                    : "2%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                          JP
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            Janith Perera
                          </p>
                          <p className="text-xs text-slate-500">
                            Kandy • Verified Purchase
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">2 days ago</span>
                    </div>
                    <div className="flex text-amber-400 gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="fill-current w-4 h-4" />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      "The battery life is amazing compared to my Series 6. The
                      double tap feature works perfectly when I'm driving.
                      WedHub delivered it the next day!"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
