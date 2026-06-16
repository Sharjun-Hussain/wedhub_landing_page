"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Star, Headphones, BadgeCheck, TrendingUp, ArrowUpRight } from "lucide-react";

// ── Animated Counter ───────────────────────────────────────────────────────────
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
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
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

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Marquee Strip ──────────────────────────────────────────────────────────────
const MARQUEE_TAGS = [
  "Wedding Halls", "Photographers", "Makeup Artists", "Decorators",
  "Caterers", "Wedding Cars", "Jewelry", "Honeymoon Packages",
  "Invitation Cards", "Videographers", "Bridal Wear", "DJs & Bands",
  "Wedding Cakes", "Florists", "Stage Décor", "Wedding Planners",
];

// ── Trust Features ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: ShieldCheck, label: "Verified Vendors",    desc: "Every listing manually reviewed" },
  { icon: Star,        label: "Genuine Reviews",     desc: "From real verified couples" },
  { icon: Headphones,  label: "7-Day Support",       desc: "Dedicated wedding concierge" },
  { icon: BadgeCheck,  label: "All 25 Districts",    desc: "Island-wide coverage" },
];

const STATS = [
  { value: 1500, suffix: "+", label: "Verified Vendors",  sub: "Across Sri Lanka" },
  { value: 10000, suffix: "+", label: "Happy Couples",    sub: "Booked through us" },
  { value: 25,    suffix: "",  label: "Districts",        sub: "Full island coverage" },
  { value: 98,    suffix: "%", label: "Satisfaction",     sub: "Average couple rating" },
];

export default function TrustBar() {
  return (
    <>
      {/* ── SCROLLING MARQUEE ───────────────────────────────────────── */}
      <div className="bg-[#8B1A2D] overflow-hidden py-3 select-none">
        <div
          className="flex items-center whitespace-nowrap"
          style={{ animation: "marquee 30s linear infinite" }}
        >
          {[...MARQUEE_TAGS, ...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-2.5 px-6 text-[11.5px] font-semibold uppercase tracking-widest text-white/75">
              <span className="w-1 h-1 rounded-full bg-[#d4a853] flex-shrink-0" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN TRUST SECTION ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0f0604]">

        {/* Full bleed background image with strong overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0604]/95 via-[#0f0604]/80 to-[#0f0604]/60" />
        </div>

        {/* Decorative gold orb */}
        <div className="absolute top-1/2 right-[-80px] -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#d4a853]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[30%] w-[300px] h-[300px] rounded-full bg-[#8B1A2D]/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* ── LEFT: Headline + Feature Pills ──────────────────── */}
            <div>
              {/* Label */}
              <div className="inline-flex items-center gap-2 bg-[#8B1A2D]/30 border border-[#8B1A2D]/50 rounded-full px-4 py-1.5 mb-6">
                <BadgeCheck className="w-3.5 h-3.5 text-[#d4a853]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4a853]">
                  Sri Lanka's #1 Wedding Marketplace
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] font-serif font-bold text-white leading-[1.1] mb-6">
                Why Couples Trust{" "}
                <span
                  className="italic"
                  style={{
                    background: "linear-gradient(135deg, #d4a853 0%, #f0c97a 50%, #d4a853 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  WedHub
                </span>
              </h2>

              <p className="text-[15px] text-white/55 leading-relaxed mb-10 max-w-md">
                From Colombo to Jaffna, we connect Sri Lankan couples with verified, reviewed, and trusted wedding professionals for their perfect day.
              </p>

              {/* Feature pills — stacked cards with left gold border */}
              <div className="space-y-3">
                {FEATURES.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-[#d4a853]/40 rounded-2xl px-5 py-4 transition-all duration-300 cursor-default"
                    style={{ borderLeft: "3px solid #d4a853" }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#d4a853]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4a853]/25 transition-colors">
                      <Icon className="w-5 h-5 text-[#d4a853]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-white leading-none">{label}</p>
                      <p className="text-[12px] text-white/45 mt-1">{desc}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-[#d4a853] ml-auto flex-shrink-0 transition-colors" />
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mt-10">
                <Link
                  href="/vendors"
                  className="inline-flex items-center gap-2 bg-[#d4a853] hover:bg-[#c09240] text-[#1a0a05] font-bold text-[13px] uppercase tracking-wider px-7 py-4 rounded-xl transition-colors duration-200 shadow-lg shadow-[#d4a853]/20"
                >
                  <TrendingUp className="w-4 h-4" />
                  Explore Vendors
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors"
                >
                  Learn About Us <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Animated Stats Grid ──────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`relative overflow-hidden rounded-2xl p-6 border flex flex-col justify-between min-h-[160px] ${
                    i === 0
                      ? "bg-[#8B1A2D]/30 border-[#8B1A2D]/50 col-span-2"
                      : "bg-white/5 border-white/10 hover:border-[#d4a853]/40 hover:bg-white/8"
                  } transition-all duration-300 group`}
                >
                  {/* Number */}
                  <p
                    className={`font-serif font-bold leading-none mb-1 ${
                      i === 0 ? "text-[3.5rem] text-[#d4a853]" : "text-[2.5rem] text-white"
                    }`}
                  >
                    <Counter to={stat.value} suffix={stat.suffix} duration={2200} />
                  </p>

                  {/* Label + sub */}
                  <div>
                    <p className={`font-bold leading-snug ${i === 0 ? "text-white text-[1rem]" : "text-white/80 text-[14px]"}`}>
                      {stat.label}
                    </p>
                    <p className="text-[11px] text-white/40 mt-0.5">{stat.sub}</p>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#d4a853]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-[#d4a853]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CSS Animation ─────────────────────────────────────────── */}
      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </>
  );
}
