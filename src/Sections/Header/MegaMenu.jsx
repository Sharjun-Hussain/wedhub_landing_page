"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight, ArrowUpRight, MapPin, Camera, Utensils, Car, Gem, Palmtree,
  Building2, Brush, Flower2, Star, Users, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icon map for vendor categories
const ICONS = {
  venue:     <Building2 className="w-4 h-4" />,
  camera:    <Camera className="w-4 h-4" />,
  makeup:    <Brush className="w-4 h-4" />,
  decor:     <Flower2 className="w-4 h-4" />,
  food:      <Utensils className="w-4 h-4" />,
  car:       <Car className="w-4 h-4" />,
  jewelry:   <Gem className="w-4 h-4" />,
  honeymoon: <Palmtree className="w-4 h-4" />,
  location:  <MapPin className="w-4 h-4" />,
  default:   <Star className="w-4 h-4" />,
};

function getIcon(key) {
  return ICONS[key] || ICONS.default;
}

/** Mega Menu: Categories Panel */
function CategoriesMegaMenu({ cmsData, onClose }) {
  const cats = cmsData.categories || [];

  return (
    <div className="grid grid-cols-4 gap-0">
      {/* LEFT: Category List (2 cols) */}
      <div className="col-span-2 grid grid-cols-2 gap-px bg-[#e8d9c0]/30">
        {cats.map((cat, i) => (
          <Link
            key={cat.label}
            href={cat.href}
            onClick={onClose}
            className="group flex items-start gap-4 p-5 bg-white/50 hover:bg-[#fdf7ef] transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
          >
            <span className="mt-0.5 w-10 h-10 rounded-xl bg-[#fdf8f0] shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[#fc0a7a]/10 group-hover:scale-110 transition-all duration-300 text-[#fc0a7a]">
              {getIcon(cat.icon)}
            </span>
            <div className="min-w-0 transform group-hover:translate-x-1 transition-transform duration-300">
              <p className="text-[14px] font-bold text-[#2C1A0E] group-hover:text-[#fc0a7a] transition-colors leading-tight">
                {cat.label}
              </p>
              {cat.sub && (
                <p className="text-[12px] text-[#8a7060] mt-1 leading-tight line-clamp-1">
                  {cat.sub.slice(0, 2).join(" · ")}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* RIGHT: Featured promo + quick links (2 cols) */}
      <div className="col-span-2 flex flex-col divide-y divide-[#e8d9c0]/30 bg-[#fdf8f0]/80 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        {/* Featured image card */}
        <div className="relative flex-1 min-h-[240px] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
            alt="Featured Venue"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
          <div className="absolute bottom-0 left-0 p-6 transform transition-transform duration-300 group-hover:-translate-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4b986] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm">Featured</span>
            <p className="text-white font-bold text-base mt-2 drop-shadow-md">Find Your Dream Venue</p>
            <p className="text-white/80 text-sm drop-shadow-md">Sri Lanka's finest wedding venues</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-6 flex items-center justify-center bg-[#fdf8f0]/80">
          <Link
            href="/categories"
            onClick={onClose}
            className="group flex items-center gap-2 text-[14px] font-bold text-[#fc0a7a] hover:text-[#6c1422] transition-colors animate-fade-in-up"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            <span className="underline underline-offset-4 decoration-[#fc0a7a]/30 group-hover:decoration-[#fc0a7a]">View All Categories</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Mega Menu: Vendors Panel */
function VendorsMegaMenu({ cmsData, onClose }) {
  const links = cmsData.vendorMegaLinks || [];
  const cats = (cmsData.categories || []).slice(0, 4);

  return (
    <div className="grid grid-cols-3 gap-0">
      {/* Col 1: Popular searches */}
      <div className="p-8 bg-white/60 border-r border-[#e8d9c0]/40">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a7060] mb-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4b986]"></span> Browse Vendors
        </p>
        <div className="space-y-1.5">
          {links.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold text-[#2C1A0E] hover:bg-[#fdf8f0] hover:text-[#fc0a7a] hover:shadow-sm transition-all duration-300 group animate-fade-in-up border border-transparent hover:border-[#e8d9c0]/50"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
            >
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-[#fc0a7a]" />
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-[#e8d9c0]/40 animate-fade-in-up" style={{ animationDelay: `${links.length * 40 + 50}ms`, animationFillMode: "both" }}>
          <Link
            href="/vendors"
            onClick={onClose}
            className="group flex items-center gap-2 text-[13px] font-bold text-[#fc0a7a] hover:text-[#6c1422] transition-colors"
          >
            <span className="underline underline-offset-4 decoration-[#fc0a7a]/30 group-hover:decoration-[#fc0a7a]">View All Vendors</span> 
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Col 2: Top categories */}
      <div className="p-8 bg-[#fdf8f0]/60 border-r border-[#e8d9c0]/40">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a7060] mb-5 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4b986]"></span> Top Categories
        </p>
        <div className="space-y-1.5">
          {cats.map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-[14px] font-semibold text-[#2C1A0E] hover:bg-white hover:text-[#fc0a7a] hover:shadow-sm border border-transparent hover:border-[#e8d9c0]/50 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${150 + i * 40}ms`, animationFillMode: "both" }}
            >
              <span className="text-[#fc0a7a] bg-[#f9f1e4] p-1.5 rounded-md group-hover:bg-[#fc0a7a]/10 transition-colors">{getIcon(cat.icon)}</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Col 3: Feature promo */}
      <div className="relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        <img
          src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
          alt="Top Vendors"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120e]/90 via-[#2C1A0E]/50 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-300 group-hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#d4b986]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4b986]">Elite Vendors</span>
          </div>
          <p className="text-white font-bold text-lg leading-snug drop-shadow-md">Sri Lanka's Top Rated Wedding Professionals</p>
          <Link
            href="/vendors?filter=elite"
            onClick={onClose}
            className="group/btn mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-[#1a120e] bg-white hover:bg-[#fdf8f0] px-4 py-2.5 rounded-xl transition-all shadow-lg"
          >
            Explore Elite <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Mega Menu: Venues Panel */
function VenuesMegaMenu({ cmsData, onClose }) {
  const styles = [
    { label: "Banquet Halls", href: "/vendors?category=venues&style=banquet" },
    { label: "Luxury Hotels", href: "/vendors?category=venues&style=hotel" },
    { label: "Beachfront Venues", href: "/vendors?category=venues&style=beach" },
    { label: "Heritage Settings", href: "/vendors?category=venues&style=heritage" },
    { label: "Garden & Outdoor", href: "/vendors?category=venues&style=outdoor" },
  ];

  const locations = [
    { label: "Colombo Venues", href: "/vendors?category=venues&location=colombo" },
    { label: "Kandy Venues", href: "/vendors?category=venues&location=kandy" },
    { label: "Negombo Venues", href: "/vendors?category=venues&location=negombo" },
    { label: "Galle Venues", href: "/vendors?category=venues&location=galle" },
    { label: "Nuwara Eliya Venues", href: "/vendors?category=venues&location=nuwara-eliya" },
  ];

  return (
    <div className="grid grid-cols-3 gap-0">
      {/* Col 1: by Style */}
      <div className="p-8 bg-white/60 border-r border-[#e8d9c0]/40">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a7060] mb-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4b986]"></span> Browse by Style
        </p>
        <div className="space-y-1.5">
          {styles.map((style, i) => (
            <Link
              key={style.label}
              href={style.href}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold text-[#2C1A0E] hover:bg-[#fdf8f0] hover:text-[#fc0a7a] hover:shadow-sm transition-all duration-300 group animate-fade-in-up border border-transparent hover:border-[#e8d9c0]/50"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
            >
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">{style.label}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-[#fc0a7a]" />
            </Link>
          ))}
        </div>
      </div>

      {/* Col 2: Top Locations */}
      <div className="p-8 bg-[#fdf8f0]/60 border-r border-[#e8d9c0]/40">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a7060] mb-5 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4b986]"></span> Popular Locations
        </p>
        <div className="space-y-1.5">
          {locations.map((loc, i) => (
            <Link
              key={loc.label}
              href={loc.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-[#2C1A0E] hover:bg-white hover:text-[#fc0a7a] hover:shadow-sm border border-transparent hover:border-[#e8d9c0]/50 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${150 + i * 40}ms`, animationFillMode: "both" }}
            >
              <span className="bg-[#f9f1e4] p-1.5 rounded-md group-hover:bg-[#fc0a7a]/10 transition-colors">
                <MapPin className="w-4 h-4 text-[#fc0a7a] flex-shrink-0" />
              </span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">{loc.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-[#fc0a7a]" />
            </Link>
          ))}
        </div>
      </div>

      {/* Col 3: Feature promo */}
      <div className="relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Venues"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120e]/90 via-[#2C1A0E]/50 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-300 group-hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-[#d4b986]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4b986]">Explore Venues</span>
          </div>
          <p className="text-white font-bold text-lg leading-snug drop-shadow-md">Find Your Perfect Setting</p>
          <Link
            href="/vendors?category=venues"
            onClick={onClose}
            className="group/btn mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-[#1a120e] bg-white hover:bg-[#fdf8f0] px-4 py-2.5 rounded-xl transition-all shadow-lg"
          >
            View All Venues <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Main exported NavMegaMenu — renders the correct panel based on activeMega key */
export function NavMegaMenu({ activeMega, cmsData, onMouseEnter, onMouseLeave, onClose }) {
  const isVisible = !!activeMega;

  return (
    <div
      className={cn(
        "w-full bg-white/95 backdrop-blur-xl border-b border-[#e8d9c0] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] rounded-b-2xl transition-all duration-300 ease-out overflow-hidden relative z-[45]",
        isVisible ? "opacity-100 max-h-[550px]" : "opacity-0 max-h-0 pointer-events-none"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-[1440px] mx-auto w-full">
        {activeMega === "categories" && <CategoriesMegaMenu cmsData={cmsData} onClose={onClose} />}
        {activeMega === "vendors"    && <VendorsMegaMenu    cmsData={cmsData} onClose={onClose} />}
        {activeMega === "venues"     && <VenuesMegaMenu     cmsData={cmsData} onClose={onClose} />}
      </div>
    </div>
  );
}

// Keep named export for backwards compatibility with old MegaMenu import
export function MegaMenu(props) {
  return null; // legacy — replaced by NavMegaMenu
}
