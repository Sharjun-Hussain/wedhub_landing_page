"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search, MapPin, MessageCircle, ChevronDown,
  ChevronLeft, ChevronRight, SlidersHorizontal, X, BadgeCheck, Phone, Facebook, Instagram
} from "lucide-react";
import { AdBanner } from "@/components/ui/AdBanner";
import { API_BASE_URL } from "@/lib/api";

const DISTRICTS  = [
  "All Districts", "Colombo", "Kandy", "Galle", "Negombo", "Nuwara Eliya",
  "Jaffna", "Trincomalee", "Matara", "Kurunegala", "Anuradhapura",
  "Ratnapura", "Badulla", "Batticaloa", "Ampara", "Hambantota",
  "Kalutara", "Gampaha", "Kegalle", "Polonnaruwa", "Monaragala",
  "Vavuniya", "Mannar", "Mullaitivu", "Kilinochchi", "Puttalam",
];

const SORT_OPTIONS = ["Featured", "Rating: High to Low", "Newest"];

// ── Vendor Card ───────────────────────────────────────────────────────────────
function VendorCard({ vendor }) {
  return (
    <div className="bg-white border border-[#ede2cc] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={vendor.cover_image ? (vendor.cover_image.startsWith('/') ? `${API_BASE_URL.replace('/api/v1', '')}${vendor.cover_image}` : vendor.cover_image) : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop"}
          alt={vendor.name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {/* Badge (Category Only) */}
        <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#fc0a7a] text-white shadow-md">
          {vendor.category}
        </span>
        {/* Initials circle */}
        <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-[#d4a853] text-[#1a0a05] text-[11px] font-black flex items-center justify-center border-2 border-white shadow">
          {vendor.name ? vendor.name.substring(0, 2).toUpperCase() : "WH"}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-1.5 mb-1">
          <h3 className="text-[16px] font-bold text-[#2C1A0E] leading-snug flex-1 hover:text-[#fc0a7a] transition-colors truncate">
            {vendor.name}
          </h3>
          {(vendor.verified || vendor.status === 'Active') && <BadgeCheck className="w-4 h-4 text-[#1a4d8B] flex-shrink-0 mt-0.5" />}
        </div>

        <div className="flex items-center gap-1 text-[#9a8070] mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="text-[12px]">{vendor.location || vendor.city}</span>
        </div>

        <p className="text-[13px] text-[#4a3728]/70 leading-relaxed line-clamp-2 flex-1 mb-3">
          {vendor.description || "No description provided."}
        </p>

        {/* Phone and Socials */}
        <div className="flex items-center justify-between mt-auto mb-4">
          <div className="flex items-center gap-1.5 text-[#2C1A0E]">
            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-[#fc0a7a]" />
            <span className="text-[12px] font-semibold">{vendor.contact_phone || "Contact to view"}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <a href={vendor.facebook || "#"} target="_blank" rel="noopener noreferrer" className="text-[#9a8070] hover:text-[#1877F2] transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href={vendor.instagram || "#"} target="_blank" rel="noopener noreferrer" className="text-[#9a8070] hover:text-[#E4405F] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-[#f0e6d3]">
          <button className="w-9 h-9 rounded-xl border border-[#ede2cc] flex items-center justify-center text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a] transition-all flex-shrink-0">
            <MessageCircle className="w-4 h-4" />
          </button>
          <Link
            href={`/vendors/${vendor.slug || vendor.id}`}
            className="flex-1 text-center py-2.5 rounded-xl bg-[#fc0a7a] hover:bg-[#d90066] text-white text-[12px] font-bold uppercase tracking-wider transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Client Component ────────────────────────────────────────────────────
export default function VendorsClient({ ads = [] }) {
  const middleAd = ads.length > 0 ? ads[0] : null;

  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const catRes = await fetch(`${API_BASE_URL}/public/categories`);
        const catData = await catRes.json();
        if (catData?.data) {
          setFetchedCategories(catData.data.map(c => c.name || c.label));
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    const fetchVendors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/vendors`);
        const json = await res.json();
        if (json.success) {
          const activeVendors = json.data.filter(v => v.status === 'Active');
          setVendorsData(activeVendors);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSidebarData();
    fetchVendors();
  }, []);

  const [search,    setSearch]    = useState("");
  const [cats,      setCats]      = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [sort,      setSort]      = useState("Featured");
  const [page,      setPage]      = useState(1);
  const [sideOpen,  setSideOpen]  = useState(false);
  const [applied,   setApplied]   = useState({ cats: [], districts: [] });

  const PER_PAGE = 6;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      const dist = params.get("district");
      
      const newCats = cat ? [cat] : [];
      const newDistricts = dist ? [dist] : [];

      setCats(newCats);
      setSelectedDistricts(newDistricts);
      setApplied({ cats: newCats, districts: newDistricts });
    }
  }, []);

  const toggleCat = (c) =>
    setCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const toggleDistrict = (d) =>
    setSelectedDistricts((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const applyFilters = () => {
    setApplied({ cats, districts: selectedDistricts });
    setPage(1);
    setSideOpen(false);
  };

  const clearFilters = () => {
    setCats([]); setSelectedDistricts([]); setSearch("");
    setApplied({ cats: [], districts: [] });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let v = [...vendorsData];
    if (search)                v = v.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
    if (applied.cats.length)   v = v.filter(x => applied.cats.includes(x.category));
    if (applied.districts.length > 0) v = v.filter(x => applied.districts.includes(x.district));
    if (sort === "Rating: High to Low")    v = v.sort((a,b) => b.rating - a.rating);
    return v;
  }, [vendorsData, search, applied, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const catLabel = applied.cats.length === 1 ? applied.cats[0] : "All Vendors";
  const districtLabel = applied.districts.length === 1 ? ` in ${applied.districts[0]}` : applied.districts.length > 1 ? ` in multiple locations` : " Across Sri Lanka";

  const activeFilterCount = applied.cats.length + applied.districts.length;

  const sidebarContent = (
    <div className="space-y-7">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#4a3728] mb-3">Search Vendors</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a8070]" />
          <input
            type="text"
            placeholder="e.g. Shangri-La…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fdf8f0] border border-[#ede2cc] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[#2C1A0E] placeholder:text-[#9a8070] focus:outline-none focus:border-[#fc0a7a] transition-colors"
          />
        </div>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#4a3728] mb-3">Category</p>
        <div className="space-y-2.5 pr-1">
          {fetchedCategories.map((c) => (
            <div key={c} onClick={() => toggleCat(c)} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${cats.includes(c) ? "bg-[#fc0a7a] border-[#fc0a7a]" : "border-[#ede2cc] group-hover:border-[#fc0a7a]"}`}>
                {cats.includes(c) && <span className="text-white text-[10px] font-black">✓</span>}
              </div>
              <span className="text-[13px] text-[#2C1A0E] group-hover:text-[#fc0a7a] transition-colors">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#4a3728] mb-3">District</p>
        <div className="space-y-2.5 pr-1">
          {DISTRICTS.filter(d => d !== "All Districts").map((d) => (
            <div key={d} onClick={() => toggleDistrict(d)} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${selectedDistricts.includes(d) ? "bg-[#fc0a7a] border-[#fc0a7a]" : "border-[#ede2cc] group-hover:border-[#fc0a7a]"}`}>
                {selectedDistricts.includes(d) && <span className="text-white text-[10px] font-black">✓</span>}
              </div>
              <span className="text-[13px] text-[#2C1A0E] group-hover:text-[#fc0a7a] transition-colors">{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={applyFilters}
          className="w-full py-3 rounded-xl bg-[#fc0a7a] hover:bg-[#d90066] text-white text-[12px] font-bold uppercase tracking-widest transition-colors"
        >
          Apply Filters
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full py-3 rounded-xl border border-[#ede2cc] hover:border-[#fc0a7a] text-[#4a3728] text-[12px] font-bold uppercase tracking-widest transition-all"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {sideOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setSideOpen(false)} />
          <div className="w-80 max-w-[85vw] bg-white h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#2C1A0E] text-[16px]">Refine Search</h3>
              <button onClick={() => setSideOpen(false)} className="w-8 h-8 rounded-full bg-[#fdf8f0] flex items-center justify-center text-[#4a3728] hover:text-[#fc0a7a] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      <main className="pt-24 md:pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-2 text-[12px] text-[#9a8070] mb-6">
            <Link href="/"       className="hover:text-[#fc0a7a] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/vendors" className="hover:text-[#fc0a7a] transition-colors">Vendors</Link>
            {applied.cats.length === 1 && <>
              <span>/</span>
              <span className="text-[#2C1A0E] font-semibold">{applied.cats[0]}</span>
            </>}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[2rem] md:text-[2.8rem] font-serif font-bold text-[#2C1A0E] leading-tight">
                {catLabel === "Wedding Halls" ? "Luxury Wedding Halls" : catLabel}
              </h1>
              <p className="text-[14px] text-[#9a8070] mt-1">
                Curated spaces for your unforgettable day{districtLabel}.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setSideOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-[#ede2cc] rounded-xl px-4 py-2.5 text-[13px] font-bold text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a] transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFilterCount > 0 && <span className="bg-[#fc0a7a] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#9a8070] hidden sm:block">Sort by:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-white border border-[#ede2cc] rounded-xl pl-4 pr-8 py-2.5 text-[13px] font-semibold text-[#2C1A0E] focus:outline-none focus:border-[#fc0a7a] cursor-pointer transition-colors"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9a8070] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[13px] text-[#9a8070] mb-6">
            Showing <strong className="text-[#2C1A0E]">{filtered.length}</strong> vendors
          </p>

          <div className="flex gap-8 items-start">
            <aside data-lenis-prevent className="hidden lg:block w-56 flex-shrink-0 bg-white border border-[#ede2cc] rounded-2xl p-6 sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h2 className="text-[15px] font-bold text-[#2C1A0E] mb-6">Refine Search</h2>
              {sidebarContent}
            </aside>

            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#fc0a7a] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : paged.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paged.map((v, index) => (
                    <React.Fragment key={v.id}>
                      <VendorCard vendor={v} />
                      {index === 2 && middleAd && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                          <AdBanner 
                            imageSrc={`${API_BASE_URL.replace('/api/v1', '')}${middleAd.image}`}
                            title={middleAd.title}
                            subtitle="Sponsored Advertisement"
                            link={middleAd.url || "#"}
                            linkText={middleAd.url ? "Visit Website" : "Discover More"}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="text-[1.2rem] font-serif font-bold text-[#2C1A0E] mb-2">No vendors found</p>
                  <p className="text-[#9a8070] text-[14px] mb-6">Try adjusting your filters or search term.</p>
                  <button onClick={clearFilters} className="inline-flex items-center gap-2 text-[13px] font-bold text-[#fc0a7a] border-2 border-[#fc0a7a]/20 hover:border-[#fc0a7a] px-6 py-3 rounded-xl transition-all">
                    Clear Filters
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-xl border border-[#ede2cc] flex items-center justify-center text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-xl text-[13px] font-bold transition-all ${page === n ? "bg-[#fc0a7a] text-white shadow-md shadow-[#fc0a7a]/20" : "border border-[#ede2cc] text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a]"}`}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 rounded-xl border border-[#ede2cc] flex items-center justify-center text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
