"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Download } from "lucide-react";
import { mockMagazines } from "@/data/mockMagazines";

const MagazinesSection = memo(function MagazinesSection() {
  // Take only the first 3 for the landing page
  const featuredMagazines = mockMagazines.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-[#fdf8f0] border-t border-[#ede2cc]">
      {/* Shared CSS for smooth card hover identical to FeaturedVendors */}
      <style>{`
        .mag-card { box-shadow: 0 1px 4px rgba(44,26,14,0.08); transition: box-shadow 0.25s ease, transform 0.25s ease; will-change: transform; }
        .mag-card:hover { box-shadow: 0 20px 48px rgba(44,26,14,0.16); transform: translateY(-6px); }
        .mag-img { transition: transform 0.5s ease; will-change: transform; }
        .mag-card:hover .mag-img { transform: scale(1.04); }
        .mag-title { transition: color 0.2s ease; }
        .mag-card:hover .mag-title { color: #fc0a7a; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#fc0a7a] bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">
              Inspiration & Ideas
            </span>
            <h2 className="text-[1.9rem] md:text-[2.6rem] font-serif font-bold text-[#2C1A0E] leading-tight">
              Wedding <em className="text-[#fc0a7a] italic not-italic">Magazines</em>
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-px w-14 bg-[#d4a853]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
              <div className="h-px w-14 bg-[#d4a853]" />
            </div>
            <p className="mt-4 text-[14px] text-[#9a8070] max-w-lg">
              Explore our exclusive digital magazines packed with the latest wedding trends, real ceremonies, and expert planning advice.
            </p>
          </div>
          
          <Link
            href="/magazines"
            className="hidden md:inline-flex items-center gap-2 text-[13px] font-bold text-[#fc0a7a] hover:text-[#d90066] transition-colors group shrink-0"
          >
            View All Publications
            <span className="w-8 h-8 rounded-full border-2 border-[#fc0a7a] flex items-center justify-center group-hover:bg-[#fc0a7a] group-hover:text-white transition-colors duration-200">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* ── Magazine Grid ──────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMagazines.map((mag) => (
            <Link 
              key={mag.id} 
              href={`/magazines/${mag.id}`}
              className="mag-card flex flex-col rounded-3xl overflow-hidden bg-white border border-[#ede2cc] cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[1/1.1] overflow-hidden bg-[#f5efe4]">
                <Image
                  src={mag.coverImage}
                  alt={mag.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="mag-img object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                
                {/* Issue Badge */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#1a0a05] bg-[#d4a853] uppercase tracking-wider shadow-md">
                  {mag.issue}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#9a8070] mb-1.5">
                  {mag.date}
                </p>
                
                <h3 className="mag-title text-[1.4rem] font-serif font-bold text-[#2C1A0E] leading-snug mb-3">
                  {mag.title}
                </h3>
                
                <p className="text-[13px] text-[#9a8070] line-clamp-2 leading-relaxed mb-6 flex-1">
                  {mag.description}
                </p>

                <div className="h-px bg-[#f0e6d3] mb-5" />

                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-[#6d513e]">
                    {mag.pages} Pages
                  </div>
                  <div className="h-9 px-5 rounded-xl bg-[#fc0a7a] text-white text-[12px] font-bold flex items-center transition-colors">
                    Read Issue
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile View All Link ──────────────────────────────────────── */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/magazines"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#fc0a7a] hover:text-[#d90066] transition-colors group"
          >
            View All Publications
            <span className="w-8 h-8 rounded-full border-2 border-[#fc0a7a] flex items-center justify-center group-hover:bg-[#fc0a7a] group-hover:text-white transition-colors duration-200">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
});

export default MagazinesSection;
