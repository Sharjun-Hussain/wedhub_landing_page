"use client";

import React, { useEffect, useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

const STEPS = [
  {
    num: "01",
    title: "Search & Discover",
    desc: "Browse 1,500+ verified vendors across all 25 districts. Filter by category, location and budget to build your perfect shortlist.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop",
    cta: { label: "Browse Vendors", href: "/vendors" },
  },
  {
    num: "02",
    title: "Compare & Shortlist",
    desc: "View full profiles, portfolios and packages. Save favourites with one tap and build your dream wedding team.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1000&auto=format&fit=crop",
    cta: { label: "Create Account", href: "/register" },
  },
  {
    num: "03",
    title: "Connect Directly",
    desc: "Message vendors in real-time, request custom quotes and schedule meetings — all within your dashboard.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop",
    cta: { label: "Get Started", href: "/register" },
  },
  {
    num: "04",
    title: "Celebrate Your Day",
    desc: "Confirm bookings, track your checklist and enjoy your perfect Sri Lankan wedding day with complete peace of mind.",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=1000&auto=format&fit=crop",
    cta: { label: "Start Planning", href: "/register" },
  },
];

const HowItWorks = memo(function HowItWorks({ cmsData }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const subtitle = cmsData?.data?.how_it_works_subtitle || "Simple Process";
  const titleMain = cmsData?.data?.how_it_works_title_main || "Your Perfect Wedding,";
  const titleHighlight = cmsData?.data?.how_it_works_title_highlight || "4 Steps Away";
  
  let stepsList = STEPS;
  if (cmsData?.data?.how_it_works_steps) {
    try {
      const parsed = JSON.parse(cmsData.data.how_it_works_steps);
      if (Array.isArray(parsed) && parsed.length > 0) {
        stepsList = parsed;
      }
    } catch (e) {
      // ignore
    }
  }

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((p) => (p + 1) % stepsList.length), 3800);
    return () => clearInterval(id);
  }, [paused, stepsList.length]);

  const step = stepsList[active];

  return (
    <section className="pt-10 pb-16 md:pt-16 md:pb-24 bg-[#fdf8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ─────────────────────────────────────── */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#fc0a7a] bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">
              {subtitle}
            </span>
            <h2 className="text-[1.9rem] md:text-[2.6rem] font-serif font-bold text-[#2C1A0E] leading-tight">
              {titleMain}<br />
              <span className="italic text-[#fc0a7a]">{titleHighlight}</span>
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-px w-14 bg-[#d4a853]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
              <div className="h-px w-14 bg-[#d4a853]" />
            </div>
          </div>

          {/* Auto-play toggle */}
          <button
            onClick={() => setPaused((p) => !p)}
            className="hidden md:inline-flex items-center gap-2 self-start md:self-auto text-[12px] font-bold text-[#4a3728] border border-[#ede2cc] hover:border-[#fc0a7a] hover:text-[#fc0a7a] px-4 py-2.5 rounded-xl transition-all"
          >
            <Play className={`w-3 h-3 ${paused ? "text-[#fc0a7a]" : "fill-current"}`} />
            {paused ? "Resume Auto-play" : "Auto-playing"}
          </button>
        </div>

        {/* ── Main Layout ───────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6 items-stretch">

          {/* ── LEFT: Active Step Preview ──────────────────────── */}
          <div className="lg:col-span-3 relative overflow-hidden rounded-3xl min-h-[440px] lg:min-h-[520px]">
            {/* Background image with crossfade */}
            {stepsList.map((s, i) => (
              <Image
                key={s.num}
                src={s.image?.startsWith('/') ? `${API_BASE_URL.replace('/api/v1', '')}${s.image}` : s.image}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-opacity duration-700 will-change-opacity"
                style={{ opacity: active === i ? 1 : 0, zIndex: active === i ? 1 : 0 }}
              />
            ))}

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

            {/* Ghost large step number */}
            <span
              className="absolute top-2 right-4 font-serif font-black text-white/[0.07] select-none pointer-events-none leading-none"
              style={{ fontSize: "12rem" }}
            >
              {step.num}
            </span>

            {/* Progress bar — top */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10">
              <div
                key={active}
                className="h-full bg-[#d4a853] origin-left"
                style={{ animation: paused ? "none" : "progress 3.8s linear forwards" }}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
              {/* Step badge */}
              <div className="inline-flex items-center self-start gap-2 bg-[#d4a853]/20 border border-[#d4a853]/40 text-[#d4a853] text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
                Step {step.num}
              </div>

              {/* Title */}
              <h3 className="text-[2rem] sm:text-[2.5rem] font-serif font-bold text-white leading-tight mb-3">
                {step.title}
              </h3>

              {/* Desc */}
              <p className="text-[15px] text-white/65 leading-relaxed mb-7 max-w-md">
                {step.desc}
              </p>

              {/* CTA */}
              <Link
                href={step.cta.href}
                className="inline-flex items-center gap-2 self-start bg-[#d4a853] hover:bg-[#c09240] text-[#1a0a05] font-bold text-[12px] uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#d4a853]/20 hover:shadow-[#d4a853]/40"
              >
                {step.cta.label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Step Selector List ──────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {stepsList.map((s, i) => (
              <button
                key={s.num}
                onClick={() => { setActive(i); setPaused(true); }}
                className={`group relative text-left overflow-hidden rounded-2xl transition-colors duration-300 border ${
                  active === i
                    ? "bg-[#2C1A0E] border-[#2C1A0E] shadow-xl shadow-[#2C1A0E]/20"
                    : "bg-white border-[#ede2cc] hover:border-[#fc0a7a]/40 hover:bg-[#fffaf4]"
                }`}
              >
                {/* Thumbnail strip — only when active */}
                {active === i && (
                  <div className="absolute top-0 right-0 w-24 h-full opacity-30 overflow-hidden rounded-r-2xl">
                    <Image src={s.image?.startsWith('/') ? `${API_BASE_URL.replace('/api/v1', '')}${s.image}` : s.image} alt="" fill sizes="96px" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2C1A0E] to-transparent" />
                  </div>
                )}

                <div className="relative p-5">
                  {/* Number + title row */}
                  <div className="flex items-center gap-4">
                    {/* Step number circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-black transition-all duration-300 ${
                        active === i
                          ? "bg-[#d4a853] text-[#1a0a05]"
                          : "bg-[#f5efe4] text-[#4a3728] group-hover:bg-[#fc0a7a]/10 group-hover:text-[#fc0a7a]"
                      }`}
                    >
                      {s.num}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold leading-snug transition-colors ${
                          active === i ? "text-white text-[15px]" : "text-[#2C1A0E] text-[14px] group-hover:text-[#fc0a7a]"
                        }`}
                      >
                        {s.title}
                      </h4>

                      {/* Smooth expanding description */}
                      <div
                        className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          active === i ? "grid-rows-[1fr] opacity-100 mt-1.5" : "grid-rows-[0fr] opacity-0 mt-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-[12px] text-white/55 leading-relaxed line-clamp-2">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight
                      className={`w-4 h-4 flex-shrink-0 transition-all ${
                        active === i ? "text-[#d4a853]" : "text-[#ccc] group-hover:text-[#fc0a7a] opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </div>
              </button>
            ))}

            {/* Bottom CTA card */}
            <div className="relative overflow-hidden rounded-2xl mt-1 min-h-[90px]">
              <Image
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop"
                alt="For Vendors"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#fc0a7a]/90 to-[#b30054]/95" />
              <div className="relative p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4a853] mb-1">For Vendors</p>
                  <p className="text-[14px] font-bold text-white leading-snug">List your business &amp; grow bookings</p>
                </div>
                <Link
                  href="/vendor-signup"
                  aria-label="Sign up as a vendor"
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4a853] hover:bg-[#c09240] flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-[#1a0a05]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar animation */}
      <style jsx>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
});

export default HowItWorks;
