"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * to));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Data ───────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 1500, suffix: "+", label: "Vendors", desc: "Verified island-wide" },
  { value: 25, suffix: "", label: "Districts", desc: "Full coverage" },
  { value: 98, suffix: "%", label: "Satisfaction", desc: "Couple-rated" },
  { value: 10, suffix: "K+", label: "Couples", desc: "Trusted us" },
];

const COLLAGE = [
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
    alt: "Wedding Venue",
    className: "absolute top-0 left-0 w-[62%] h-[52%] rounded-2xl object-cover shadow-2xl",
  },
  {
    src: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
    alt: "Wedding Photography",
    className: "absolute bottom-0 left-[8%] w-[48%] h-[46%] rounded-2xl object-cover shadow-2xl border-4 border-white",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop",
    alt: "Bridal Makeup",
    className: "absolute top-[12%] right-0 w-[42%] h-[80%] rounded-2xl object-cover shadow-2xl border-4 border-white",
  },
];

const TESTIMONIAL = {
  quote: "Ceylon Weddings made finding our dream vendors effortless. From our Kandy venue to our Colombo photographer — all through one platform.",
  author: "Nimesha & Kavindu",
  location: "Kandy · March 2024",
  avatar: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?q=80&w=2076&auto=format&fit=crop",
};

const TAGS = [
  "Verified & Trusted", "Real Reviews", "Island-wide Coverage",
  "24/7 Support", "Free to Browse", "No Hidden Fees",
];

// ── Component ──────────────────────────────────────────────────────────────────
const TrustBar2 = memo(function TrustBar2() {
  return (
    <section className="relative bg-[#fdf8f0] overflow-hidden">

      {/* ── TOP EDITORIAL STRIP ────────────────────────────────────── */}
      <div className="bg-[#fdf8f0] border-y border-[#ede2cc] py-4 overflow-hidden">
        <div className="flex items-center gap-0" style={{ animation: "marquee2 24s linear infinite" }}>
          {[...TAGS, ...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-6 text-[12px] font-bold uppercase tracking-widest text-[#4a3728] whitespace-nowrap">
              {i % TAGS.length === 0 && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
              )}
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── LEFT: STATS + TESTIMONIAL ──────────────────────────── */}
          <div className="flex flex-col gap-12">

            {/* Editorial headline */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B1A2D] mb-4">
                The Numbers Speak
              </p>
              <h2 className="text-[2.2rem] sm:text-[3rem] font-serif font-bold text-[#2C1A0E] leading-[1.1]">
                Sri Lanka's Most{" "}
                <span className="relative inline-block">
                  Trusted
                  {/* Hand-drawn underline effect */}
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9 Q50 3 100 7 Q150 11 198 5"
                      stroke="#d4a853"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>{" "}
                <br />Wedding Platform
              </h2>
            </div>

            {/* Stats — large typographic display */}
            <div className="grid grid-cols-2 gap-px bg-[#ede2cc] rounded-2xl overflow-hidden border border-[#ede2cc]">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white p-6 flex flex-col gap-1 hover:bg-[#fdf8f0] transition-colors group"
                >
                  <p className="text-[2.4rem] sm:text-[2.8rem] font-serif font-black text-[#8B1A2D] leading-none">
                    <Counter to={stat.value} suffix={stat.suffix} duration={2000 + i * 150} />
                  </p>
                  <p className="text-[14px] font-bold text-[#2C1A0E]">{stat.label}</p>
                  <p className="text-[11px] text-[#9a8070]">{stat.desc}</p>
                </div>
              ))}
            </div>



            {/* CTA row */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/vendors"
                className="inline-flex items-center gap-2 bg-[#8B1A2D] hover:bg-[#6d1422] text-white font-bold text-[13px] uppercase tracking-wider px-7 py-4 rounded-xl transition-colors duration-200"
              >
                Explore All Vendors
              </Link>
              <Link
                href="/vendor-signup"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#8B1A2D] border-2 border-[#8B1A2D]/30 hover:border-[#8B1A2D] px-7 py-4 rounded-xl transition-all duration-200 hover:bg-[#8B1A2D]/5"
              >
                List Your Business <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ── RIGHT: PHOTO COLLAGE ─────────────────────────────── */}
          <div className="relative h-[500px] md:h-[580px] hidden lg:block">
            {COLLAGE.map((img) => (
              <img
                key={img.alt}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className={img.className}
              />
            ))}

            {/* ── PREMIUM ELEMENT 1: Gold Seal Medallion ─────────── */}
            {/* Replaces the old "★ Elite Verified" text badge */}
            <div className="absolute bottom-[38%] left-[36%] z-20 rotate-[-8deg]">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#d4a853]/40 scale-[1.35] animate-ping-slow" />
              {/* Mid ring */}
              <div className="absolute inset-0 rounded-full border border-[#d4a853]/25 scale-[1.6]" />
              {/* Main medallion */}
              <div className="relative w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#f0c97a] via-[#d4a853] to-[#b8930a] shadow-xl shadow-[#d4a853]/40 flex items-center justify-center">
                {/* Inner ring */}
                <div className="absolute inset-[5px] rounded-full border border-white/30" />
                {/* Crown SVG icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17L5 8L9 13L12 6L15 13L19 8L21 17H3Z" fill="white" fillOpacity="0.95" />
                  <path d="M3 17H21V19H3V17Z" fill="white" fillOpacity="0.7" />
                  <circle cx="12" cy="6" r="1.5" fill="white" />
                  <circle cx="5" cy="8" r="1.5" fill="white" />
                  <circle cx="19" cy="8" r="1.5" fill="white" />
                </svg>
              </div>
            </div>

            {/* ── PREMIUM ELEMENT 2: Rating + Avatar Stack Card ───── */}
            {/* Replaces the old "Booking Confirmed" text chip */}
            <div className="absolute top-[50%] left-[-2%] z-20 bg-white rounded-2xl shadow-2xl p-4 w-[175px]">
              {/* Star rating row */}
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-[#d4a853]">
                    <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8z" />
                  </svg>
                ))}
                <span className="ml-1.5 text-[11px] font-bold text-[#2C1A0E]">4.9</span>
              </div>

              {/* Avatar stack */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2.5">
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-7 h-7 rounded-full object-cover border-2 border-white"
                    />
                  ))}
                  {/* +count bubble */}
                  <div className="w-7 h-7 rounded-full bg-[#8B1A2D] border-2 border-white flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">+2k</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#2C1A0E] leading-none">Happy Couples</p>
                  <p className="text-[9px] text-[#9a8070] mt-0.5">This month</p>
                </div>
              </div>

              {/* Mini bar chart — visual only */}
              <div className="mt-3 flex items-end gap-1 h-6">
                {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 5
                        ? "linear-gradient(to top, #8B1A2D, #d4a853)"
                        : "#ede2cc",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── PREMIUM ELEMENT 3: Floating Gold Diamond Sparkles ── */}
            {/* Top-right corner decorative sparkles */}
            <div className="absolute top-4 right-[44%] z-20">
              <svg viewBox="0 0 20 20" className="w-5 h-5 fill-[#d4a853] drop-shadow-md animate-spin-slow">
                <path d="M10 0L11.8 8.2L20 10L11.8 11.8L10 20L8.2 11.8L0 10L8.2 8.2Z" />
              </svg>
            </div>
            <div className="absolute top-[8%] right-[42%] z-20 translate-x-5">
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 fill-[#d4a853]/60">
                <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5Z" />
              </svg>
            </div>

            {/* ── PREMIUM ELEMENT 4: Decorative Ring Ornament ─────── */}
            {/* Between images — bottom center area */}
            <div className="absolute bottom-[8%] right-[38%] z-10">
              <div className="relative w-[52px] h-[52px]">
                {/* Outer dashed ring */}
                <svg viewBox="0 0 52 52" className="absolute inset-0 w-full h-full animate-spin-very-slow">
                  <circle cx="26" cy="26" r="24" fill="none" stroke="#d4a853" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
                {/* Inner solid ring */}
                <div className="absolute inset-[10px] rounded-full border-2 border-[#d4a853]/60 bg-[#d4a853]/10 flex items-center justify-center">
                  <svg viewBox="0 0 14 14" className="w-4 h-4 fill-[#d4a853]">
                    <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5Z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── CSS ────────────────────────────────────────────────────── */}
      <style jsx>{`
        @keyframes marquee2 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ping-slow {
          0%   { transform: scale(1.35); opacity: 0.7; }
          70%  { transform: scale(1.65); opacity: 0; }
          100% { transform: scale(1.65); opacity: 0; }
        }
        .animate-spin-slow       { animation: spin-slow 8s linear infinite; }
        .animate-spin-very-slow  { animation: spin-very-slow 18s linear infinite; }
        .animate-ping-slow       { animation: ping-slow 2.5s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>
    </section>
  );
});

export default TrustBar2;
