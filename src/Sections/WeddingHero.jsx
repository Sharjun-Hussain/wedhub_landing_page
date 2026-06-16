"use client";

import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, MapPin, ChevronDown, Star, BadgeCheck, X } from "lucide-react";

const SRI_LANKA_DISTRICTS = [
  "Colombo", "Kandy", "Galle", "Negombo", "Nuwara Eliya",
  "Jaffna", "Trincomalee", "Matara", "Kurunegala", "Anuradhapura",
  "Ratnapura", "Badulla", "Batticaloa", "Ampara", "Hambantota",
  "Kalutara", "Gampaha", "Kegalle", "Polonnaruwa", "Monaragala",
  "Vavuniya", "Mannar", "Mullaitivu", "Kilinochchi", "Puttalam",
];

const CATEGORIES = [
  "Wedding Halls", "Photographers", "Makeup Artists", "Decorators",
  "Caterers", "Wedding Cars", "Jewelry", "Honeymoon Services",
  "Wedding Cakes", "Videographers", "DJs & Bands", "Invitation Cards",
];

const STATS = [
  { value: "1,500+", label: "VENDORS" },
  { value: "25", label: "DISTRICTS" },
  { value: "50+", label: "SERVICES" },
  { value: "Elite", label: "LISTINGS", icon: <Star className="w-3.5 h-3.5 fill-[#d4a853] text-[#d4a853]" /> },
];

const WeddingHero = memo(function WeddingHero() {
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const [catOpen, setCatOpen] = useState(false);
  const [distOpen, setDistOpen] = useState(false);

  const [catQuery, setCatQuery] = useState("");
  const [distQuery, setDistQuery] = useState("");

  const catRef = useRef(null);
  const distRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catRef.current && !catRef.current.contains(event.target)) {
        setCatOpen(false);
      }
      if (distRef.current && !distRef.current.contains(event.target)) {
        setDistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pickCat = useCallback((c) => { setCategory(c); setCatOpen(false); setCatQuery(""); }, []);
  const pickDist = useCallback((d) => { setDistrict(d); setDistOpen(false); setDistQuery(""); }, []);
  const handleCity = useCallback((e) => setCity(e.target.value), []);


  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center pt-[120px] z-20">
      {/* ── BACKGROUND IMAGE ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <picture>
          <source media="(max-width: 768px)" srcSet="https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=80&w=800&auto=format&fit=crop" />
          <img
            src="https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=80&w=2187&auto=format&fit=crop"
            alt="Wedding Hero Background"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            decoding="sync"
          />
        </picture>
        {/* Multi-layered overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a04]/30 via-transparent to-[#1a0a04]/20" />
      </div>





      {/* ── HERO CONTENT ──────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl px-4 md:px-8 text-center flex flex-col items-center gap-7">

        {/* Headline */}
        <div>
          <h1 className="text-[2.6rem] sm:text-[3.4rem] md:text-[4rem] font-serif font-bold text-white leading-[1.12] tracking-tight drop-shadow-xl">
            Find Everything You Need For
            <br />
            <span className="relative">
              Your{" "}
              <em className="not-italic italic font-serif"
                style={{ color: "#d4a853", textShadow: "0 2px 12px rgba(212,168,83,0.35)" }}>
                Perfect Wedding
              </em>
            </span>
          </h1>
          <p className="mt-5 text-[16px] md:text-[18px] text-white/85 font-light leading-relaxed max-w-2xl mx-auto">
            Discover elite wedding vendors, venues, photographers, decorators,
            caterers and more across Sri Lanka's most breathtaking locations.
          </p>
        </div>

        {/* ── SEARCH BAR ─────────────────────────────────────────────────── */}
        <div className="w-full max-w-[820px] bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl flex flex-col sm:flex-row items-stretch border border-[#e8d9c0] relative">

          {/* Category Dropdown */}
          <div ref={catRef} className="relative flex-1 border-b sm:border-b-0 sm:border-r border-[#e8d9c0] rounded-t-xl sm:rounded-t-none sm:rounded-l-xl">
            <div className="flex items-center gap-2.5 px-4 py-4 w-full bg-white/50 hover:bg-[#fdf7ef] transition-colors rounded-t-xl sm:rounded-t-none sm:rounded-l-xl cursor-text" onClick={() => { setCatOpen(true); setDistOpen(false); }}>
              <svg className="w-4 h-4 text-[#fc0a7a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h10" />
              </svg>
              <input
                type="text"
                placeholder="Select Category"
                value={catOpen ? catQuery : (category || "")}
                onChange={(e) => {
                  setCatQuery(e.target.value);
                  if (!catOpen) setCatOpen(true);
                  if (distOpen) setDistOpen(false);
                  if (category && e.target.value !== category) setCategory("");
                }}
                onFocus={() => {
                  setCatOpen(true);
                  setDistOpen(false);
                }}
                className="flex-1 w-full text-[14px] font-medium text-[#2C1A0E] placeholder-[#9a8070] bg-transparent border-none focus:outline-none"
              />
              {category && !catOpen ? (
                <button onClick={(e) => { e.stopPropagation(); setCategory(""); setCatQuery(""); }} className="p-0.5 hover:bg-black/5 rounded-full transition-colors">
                  <X className="w-3.5 h-3.5 text-[#8a7060]" />
                </button>
              ) : (
                <ChevronDown className={`w-4 h-4 text-[#8a7060] transition-transform ${catOpen ? "rotate-180" : ""}`} />
              )}
            </div>
            {catOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-full sm:w-[320px] z-50 bg-white border border-[#e8d9c0] rounded-xl shadow-2xl max-h-64 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-200 no-scrollbar">
                {CATEGORIES.filter(c => c.toLowerCase().includes(catQuery.toLowerCase())).length > 0 ? (
                  CATEGORIES.filter(c => c.toLowerCase().includes(catQuery.toLowerCase())).map((c) => (
                    <button
                      key={c}
                      onClick={() => pickCat(c)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-[14px] font-medium rounded-lg transition-colors ${category === c ? 'bg-[#fc0a7a]/10 text-[#fc0a7a]' : 'text-[#2C1A0E] hover:bg-[#fdf7ef] hover:text-[#fc0a7a]'}`}
                    >
                      <svg className={`w-4 h-4 flex-shrink-0 ${category === c ? 'text-[#fc0a7a]' : 'text-[#fc0a7a]/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h10" />
                      </svg>
                      {c}
                    </button>
                  ))
                ) : (
                  <div className="px-3.5 py-6 text-center text-[13px] text-[#9a8070]">No categories found</div>
                )}
              </div>
            )}
          </div>

          {/* District Dropdown */}
          <div ref={distRef} className="relative flex-1 border-b sm:border-b-0 sm:border-r border-[#e8d9c0]">
            <div className="flex items-center gap-2.5 px-4 py-4 w-full bg-white/50 hover:bg-[#fdf7ef] transition-colors cursor-text" onClick={() => { setDistOpen(true); setCatOpen(false); }}>
              <svg className="w-4 h-4 text-[#fc0a7a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Select District"
                value={distOpen ? distQuery : (district || "")}
                onChange={(e) => {
                  setDistQuery(e.target.value);
                  if (!distOpen) setDistOpen(true);
                  if (catOpen) setCatOpen(false);
                  if (district && e.target.value !== district) setDistrict("");
                }}
                onFocus={() => {
                  setDistOpen(true);
                  setCatOpen(false);
                }}
                className="flex-1 w-full text-[14px] font-medium text-[#2C1A0E] placeholder-[#9a8070] bg-transparent border-none focus:outline-none"
              />
              {district && !distOpen ? (
                <button onClick={(e) => { e.stopPropagation(); setDistrict(""); setDistQuery(""); }} className="p-0.5 hover:bg-black/5 rounded-full transition-colors">
                  <X className="w-3.5 h-3.5 text-[#8a7060]" />
                </button>
              ) : (
                <ChevronDown className={`w-4 h-4 text-[#8a7060] transition-transform ${distOpen ? "rotate-180" : ""}`} />
              )}
            </div>
            {distOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-full sm:w-[320px] z-50 bg-white border border-[#e8d9c0] rounded-xl shadow-2xl max-h-64 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-200 no-scrollbar">
                {SRI_LANKA_DISTRICTS.filter(d => d.toLowerCase().includes(distQuery.toLowerCase())).length > 0 ? (
                  SRI_LANKA_DISTRICTS.filter(d => d.toLowerCase().includes(distQuery.toLowerCase())).map((d) => (
                    <button
                      key={d}
                      onClick={() => pickDist(d)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-[14px] font-medium rounded-lg transition-colors ${district === d ? 'bg-[#fc0a7a]/10 text-[#fc0a7a]' : 'text-[#2C1A0E] hover:bg-[#fdf7ef] hover:text-[#fc0a7a]'}`}
                    >
                      <MapPin className={`w-4 h-4 flex-shrink-0 ${district === d ? 'text-[#fc0a7a]' : 'text-[#fc0a7a]/60'}`} />
                      {d}
                    </button>
                  ))
                ) : (
                  <div className="px-3.5 py-6 text-center text-[13px] text-[#9a8070]">No districts found</div>
                )}
              </div>
            )}
          </div>

          {/* City input */}
          <div className="flex-1 flex items-center gap-2.5 px-4 py-4 border-b sm:border-b-0 sm:border-r border-[#e8d9c0] bg-white/50 hover:bg-[#fdf7ef] transition-colors">
            <MapPin className="w-4 h-4 text-[#fc0a7a] flex-shrink-0" />
            <input
              type="text"
              value={city}
              onChange={handleCity}
              placeholder="City (Optional)"
              className="w-full bg-transparent border-none focus:outline-none text-[14px] font-medium text-[#2C1A0E] placeholder-[#9a8070]"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (category) params.append("category", category);
              if (district) params.append("district", district);
              if (city) params.append("city", city);
              window.location.href = `/vendors?${params.toString()}`;
            }}
            className="flex items-center justify-center gap-2 bg-[#fc0a7a] hover:bg-[#d90066] text-white font-bold text-[14px] uppercase tracking-wider px-8 py-4 transition-colors duration-200 min-w-[130px] rounded-b-xl sm:rounded-b-none sm:rounded-r-xl"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* ── STATS ROW ─────────────────────────────────────────────────── */}
        {/* <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-2">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                {stat.icon}
                <span className="text-white font-bold text-[1.5rem] sm:text-[1.75rem] leading-none drop-shadow-md">
                  {stat.value}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
});

export default WeddingHero;
