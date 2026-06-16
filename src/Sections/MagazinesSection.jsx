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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#8B1A2D] bg-rose-50 px-4 py-1.5 rounded-full mb-4">
              Digital Newsstand
            </span>
            <h2 className="text-[1.9rem] md:text-[2.6rem] font-serif font-bold text-[#2C1A0E] leading-tight">
              Editorial <em className="text-[#8B1A2D] italic not-italic">Lookbook</em>
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
            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#8B1A2D] hover:text-[#6d1422] transition-colors group shrink-0"
          >
            View All Publications
            <span className="w-8 h-8 rounded-full border-2 border-[#8B1A2D] flex items-center justify-center group-hover:bg-[#8B1A2D] group-hover:text-white transition-colors duration-200">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* ── Magazine Grid ──────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {featuredMagazines.map((mag) => (
            <div key={mag.id} className="group relative flex flex-col items-center">
              
              {/* Magazine Cover with 3D physical book effect */}
              <Link href={`/magazines/${mag.id}`} className="relative block w-full max-w-[320px] aspect-[1/1.35] mb-6 perspective-1000">
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-y-[-5deg] shadow-[0_20px_40px_-15px_rgba(44,26,14,0.3)] group-hover:shadow-[20px_30px_50px_-15px_rgba(44,26,14,0.4)] transform-gpu will-change-transform">
                  {/* Spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/40 to-transparent z-20" />
                  {/* Cover reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
                  
                  <Image
                    src={mag.coverImage}
                    alt={mag.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover rounded-sm"
                  />
                  
                  {/* Issue Badge Overlay */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-md">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2C1A0E]">
                      {mag.issue}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="text-center px-4 w-full">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#d4a853] mb-2">
                  {mag.date}
                </p>
                <h3 className="text-[1.3rem] font-serif font-bold text-[#2C1A0E] leading-snug mb-3 group-hover:text-[#8B1A2D] transition-colors">
                  <Link href={`/magazines/${mag.id}`}>
                    {mag.title}
                  </Link>
                </h3>
                <p className="text-[13px] text-[#9a8070] line-clamp-2 leading-relaxed mb-5">
                  {mag.description}
                </p>
                
                <Link
                  href={`/magazines/${mag.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full max-w-[200px] h-11 bg-white border border-[#ede2cc] hover:border-[#8B1A2D] text-[#4a3728] hover:text-[#8B1A2D] text-[12px] font-bold uppercase tracking-wider transition-colors duration-200"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Read Issue
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
});

export default MagazinesSection;
