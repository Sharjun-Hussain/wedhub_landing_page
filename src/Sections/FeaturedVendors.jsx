"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, ChevronLeft, ChevronRight, ArrowRight,
  BadgeCheck, Heart, MessageCircle, ChevronDown
} from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

// ── Vendor Data (module-level — fallback) ────────────────────
const VENDORS = [
  {
    id: 1,
    name: "Aman Colombo Residences",
    category: "Wedding Venue",
    categoryColor: "#fc0a7a",
    location: "Colombo 03",
    district: "Western Province",
    price: "LKR 350,000",
    priceNote: "per event",
    tags: ["Ballroom", "Garden", "400 Pax"],
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
    verified: true,
    saved: false,
  },
  {
    id: 2,
    name: "Kalindu Photography Studio",
    category: "Photographer",
    categoryColor: "#1a4d8B",
    location: "Kandy",
    district: "Central Province",
    price: "LKR 85,000",
    priceNote: "starting package",
    tags: ["Pre-shoot", "Album", "Drone"],
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
    verified: true,
    saved: false,
  },
  {
    id: 3,
    name: "Nelum Bridal Studio",
    category: "Makeup Artist",
    categoryColor: "#6b3fa0",
    location: "Galle",
    district: "Southern Province",
    price: "LKR 45,000",
    priceNote: "bridal package",
    tags: ["Bridal", "Hair", "Mehendi"],
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop",
    verified: false,
    saved: false,
  },
  {
    id: 4,
    name: "WedHub Bloom Decorators",
    category: "Decorator",
    categoryColor: "#1a6b4a",
    location: "Negombo",
    district: "Western Province",
    price: "LKR 120,000",
    priceNote: "per setup",
    tags: ["Floral", "Stage", "Lighting"],
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=2069&auto=format&fit=crop",
    verified: true,
    saved: false,
  },
  {
    id: 5,
    name: "Royal Luxury Cars",
    category: "Wedding Cars",
    categoryColor: "#b8830a",
    location: "Colombo 07",
    district: "Western Province",
    price: "LKR 25,000",
    priceNote: "per day",
    tags: ["Rolls Royce", "Vintage", "Decorated"],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
    verified: true,
    saved: false,
  },
  {
    id: 6,
    name: "Paradise Beach Resort",
    category: "Honeymoon",
    categoryColor: "#0e6b78",
    location: "Bentota",
    district: "Southern Province",
    price: "LKR 180,000",
    priceNote: "per couple / night",
    tags: ["Beach", "All-inclusive", "Spa"],
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2033&auto=format&fit=crop",
    verified: true,
    saved: false,
  },
];

const FALLBACK_FILTERS = ["All", "Venues", "Photographers", "Makeup", "Decorators", "Cars", "Honeymoon"];

// ── VendorCard — memoized, only re-renders when vendor prop changes ─────────────
const VendorCard = memo(function VendorCard({ vendor }) {
  const [saved, setSaved] = useState(vendor.saved);

  const toggleSaved = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((s) => !s);
  }, []);

  return (
    <div className="fv-card flex-shrink-0 w-[295px] sm:w-[315px] rounded-3xl overflow-hidden bg-white border border-[#ede2cc] cursor-pointer">
      <div className="relative h-[205px] overflow-hidden">
        <Image
          src={vendor.cover_image ? (vendor.cover_image.startsWith('/') ? `${API_BASE_URL.replace('/api/v1', '')}${vendor.cover_image}` : vendor.cover_image) : (vendor.image || "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=80&w=2000&auto=format&fit=crop")}
          alt={vendor.name}
          fill
          sizes="(max-width: 640px) 295px, 315px"
          className="fv-img object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
        <button
          onClick={toggleSaved}
          className="fv-heart-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10"
          aria-label={saved ? "Remove from saved" : "Save vendor"}
        >
          <Heart className={`w-4 h-4 ${saved ? "fill-[#fc0a7a] text-[#fc0a7a]" : "text-[#4a3728]"}`} />
        </button>
        <div
          className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
          style={{ backgroundColor: (vendor.categoryColor || "#1a4d8B") + "dd" }}
        >
          {vendor.category || "Vendor"}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="fv-name text-[15px] font-bold text-[#2C1A0E] leading-snug line-clamp-1 flex-1">
            {vendor.name}
          </h3>
          {vendor.verified && <BadgeCheck className="w-4 h-4 text-[#1a4d8B] flex-shrink-0" />}
        </div>

        <div className="flex items-center gap-1.5 text-[#9a8070] mb-4">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="text-[12px] truncate">{vendor.location || "Sri Lanka"} {vendor.district ? `· ${vendor.district}` : ""}</span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/vendors/${vendor.slug || vendor.id}#contact`}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-xl border border-[#ede2cc] flex items-center justify-center text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a] transition-colors"
              title="Enquire"
              aria-label="Enquire with vendor"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/vendors/${vendor.slug || vendor.id}`}
              onClick={(e) => e.stopPropagation()}
              className="h-8 px-4 rounded-xl bg-[#fc0a7a] hover:bg-[#d90066] text-white text-[11px] font-bold transition-colors flex items-center"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── FilterPill — memoized ──────────────────────────────────────────────────────
const FilterPill = memo(function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all duration-200 ${
        active
          ? "bg-[#fc0a7a] text-white shadow-md shadow-[#fc0a7a]/20"
          : "bg-white border border-[#ede2cc] text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a]"
      }`}
    >
      {label}
    </button>
  );
});

// ── Main Section ───────────────────────────────────────────────────────────────
const FeaturedVendors = memo(function FeaturedVendors({ cmsData }) {
  const scrollRef = useRef(null);
  const [active, setActive] = useState("All");

  const title = cmsData?.data?.featured_vendors_title || "Featured Vendors";
  const subtitle = cmsData?.data?.featured_vendors_subtitle || "Hand-Picked For You";
  const linkText = cmsData?.data?.featured_vendors_link_text || "View All";

  const vendorList = cmsData?.data?.featured_vendors?.length > 0 ? cmsData.data.featured_vendors : VENDORS;

  const [categories, setCategories] = useState(FALLBACK_FILTERS);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/public/districts`)
      .then(res => res.json())
      .then(data => {
        if(data?.success && data?.data) {
          setDistricts(data.data);
        } else if (Array.isArray(data)) {
          setDistricts(data);
        } else if (data?.data && Array.isArray(data.data)) {
           setDistricts(data.data);
        }
      })
      .catch(err => console.error("Error fetching districts", err));

    fetch(`${API_BASE_URL}/public/categories`)
      .then(res => res.json())
      .then(data => {
        if (data?.success && data?.data) {
            const catNames = data.data.map(c => c.name);
            if (catNames.length > 0) {
              setCategories(["All", ...catNames]);
            }
        }
      })
      .catch(err => console.error("Error fetching categories", err));
  }, []);

  const filtered = useMemo(() => {
    let list = vendorList;
    if (active !== "All") {
      list = list.filter((v) => (v.category || "").toLowerCase().includes(active.toLowerCase()));
    }
    if (selectedDistrict) {
      list = list.filter((v) => (v.district || "").toLowerCase() === selectedDistrict.toLowerCase());
    }
    return list;
  }, [active, selectedDistrict, vendorList]);

  const scrollLeft  = useCallback(() => scrollRef.current?.scrollBy({ left: -350, behavior: "smooth" }), []);
  const scrollRight = useCallback(() => scrollRef.current?.scrollBy({ left:  350, behavior: "smooth" }), []);

  return (
    <section className="py-16 md:py-24 bg-[#fdf8f0] overflow-hidden">
      {/* Shared CSS injected once for all cards */}
      <style>{`
        .fv-card { box-shadow: 0 1px 4px rgba(44,26,14,0.08); transition: box-shadow 0.25s ease, transform 0.25s ease; will-change: transform; }
        .fv-card:hover { box-shadow: 0 20px 48px rgba(44,26,14,0.16); transform: translateY(-6px); }
        .fv-img { transition: transform 0.5s ease; will-change: transform; }
        .fv-card:hover .fv-img { transform: scale(1.06); }
        .fv-name { transition: color 0.2s ease; }
        .fv-card:hover .fv-name { color: #fc0a7a; }
        .fv-heart-btn { transition: transform 0.15s ease; }
        .fv-heart-btn:hover { transform: scale(1.15); }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#fc0a7a] bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">
              {subtitle}
            </span>
            <h2 className="text-[1.9rem] md:text-[2.6rem] font-serif font-bold text-[#2C1A0E] leading-tight">
              {title}
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-px w-14 bg-[#d4a853]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
              <div className="h-px w-14 bg-[#d4a853]" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={scrollLeft} aria-label="Scroll left" className="w-10 h-10 rounded-full border-2 border-[#ede2cc] hover:border-[#fc0a7a] hover:bg-[#fc0a7a] text-[#4a3728] hover:text-white flex items-center justify-center transition-all duration-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={scrollRight} aria-label="Scroll right" className="w-10 h-10 rounded-full border-2 border-[#ede2cc] hover:border-[#fc0a7a] hover:bg-[#fc0a7a] text-[#4a3728] hover:text-white flex items-center justify-center transition-all duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link href="/vendors" className="hidden sm:inline-flex items-center gap-2 text-[13px] font-bold text-[#fc0a7a] hover:text-[#d90066] transition-colors group ml-2">
              {linkText}
              <span className="w-7 h-7 rounded-full border-2 border-[#fc0a7a] flex items-center justify-center group-hover:bg-[#fc0a7a] group-hover:text-white transition-all">
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>

        {/* Filters and District Dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-7">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full" style={{ scrollbarWidth: "none" }}>
            {categories.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={active === f}
                onClick={() => setActive(f)}
              />
            ))}
          </div>

          {/* District Dropdown */}
          <div className="relative w-full md:w-[250px] z-20 flex-shrink-0">
            <input 
              type="text"
              placeholder="Search District..."
              value={selectedDistrict ? selectedDistrict : districtSearch}
              onChange={(e) => {
                setDistrictSearch(e.target.value);
                setSelectedDistrict("");
                setShowDistrictDropdown(true);
              }}
              onFocus={() => setShowDistrictDropdown(true)}
              onBlur={() => setTimeout(() => setShowDistrictDropdown(false), 200)}
              className="w-full bg-white border border-[#ede2cc] rounded-full pl-5 pr-10 py-2.5 text-[13px] font-bold text-[#4a3728] focus:outline-none focus:border-[#fc0a7a] transition-all placeholder:text-[#9a8070] shadow-sm"
            />
            {selectedDistrict ? (
                <button 
                  onClick={() => { setSelectedDistrict(""); setDistrictSearch(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-[#4a3728] hover:bg-[#fc0a7a] hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            ) : (
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a8070] pointer-events-none" />
            )}
            
            {showDistrictDropdown && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ede2cc] rounded-2xl shadow-xl max-h-60 overflow-y-auto z-30" 
                style={{ scrollbarWidth: "thin" }}
                data-lenis-prevent="true"
              >
                {districts.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase())).map(d => (
                  <div 
                    key={d}
                    onClick={() => {
                      setSelectedDistrict(d);
                      setDistrictSearch("");
                      setShowDistrictDropdown(false);
                    }}
                    className="px-5 py-2.5 hover:bg-[#fc0a7a]/10 cursor-pointer text-[13px] font-bold text-[#4a3728] transition-colors"
                  >
                    {d}
                  </div>
                ))}
                {districts.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase())).length === 0 && (
                  <div className="px-5 py-3 text-[13px] text-[#9a8070] text-center font-medium">No districts found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filtered.map((v) => <VendorCard key={v.id} vendor={v} />)}

          <Link
            href="/vendors"
            className="flex-shrink-0 w-[200px] rounded-3xl border-2 border-dashed border-[#d4a853]/50 hover:border-[#d4a853] bg-white hover:bg-[#fdf3e3] flex flex-col items-center justify-center gap-4 transition-all duration-300 group"
            style={{ minHeight: "330px" }}
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#d4a853] flex items-center justify-center group-hover:bg-[#d4a853] transition-colors">
              <ArrowRight className="w-5 h-5 text-[#d4a853] group-hover:text-white transition-colors" />
            </div>
            <p className="text-[13px] font-bold text-[#4a3728] group-hover:text-[#fc0a7a] text-center px-6 transition-colors leading-relaxed">
              Browse All<br />
              <span className="text-[#fc0a7a]">1,500+</span> Vendors
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
});

export default FeaturedVendors;
