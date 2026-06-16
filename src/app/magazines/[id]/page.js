import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { mockMagazines } from "@/data/mockMagazines";
import { Download, ArrowLeft, Calendar, FileText, Building2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

async function fetchCmsData() {
  try {
    const res = await fetch(`${API_BASE_URL}/public/cms/home`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export function generateMetadata({ params }) {
  const magazine = mockMagazines.find((m) => m.id === params.id);
  if (!magazine) return { title: "Not Found" };
  
  return {
    title: `${magazine.title} - ${magazine.issue} | Ceylon Weddings`,
    description: magazine.description,
  };
}

export default async function MagazineDetailPage({ params }) {
  const magazine = mockMagazines.find((m) => m.id === params.id);
  
  if (!magazine) {
    notFound();
  }

  const cmsData = await fetchCmsData();

  return (
    <div className="bg-[#fdf8f0] min-h-screen flex flex-col">
      <Header initialCmsData={cmsData} />

      <main className="flex-1 pt-[100px] md:pt-[130px] pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link
            href="/magazines"
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#9a8070] hover:text-[#8B1A2D] transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Newsstand
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* ── LEFT: Large Cover ─────────────────────────── */}
            <div className="lg:col-span-5 relative perspective-1000">
              <div className="relative w-full aspect-[1/1.35] shadow-[0_30px_60px_-15px_rgba(44,26,14,0.3)] transform-gpu rotate-y-[-5deg]">
                <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-r from-black/40 to-transparent z-20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-10 pointer-events-none" />
                <Image
                  src={magazine.coverImage}
                  alt={magazine.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover rounded-sm"
                />
              </div>
            </div>

            {/* ── RIGHT: Details ────────────────────────────── */}
            <div className="lg:col-span-7 flex flex-col pt-4">
              <div className="mb-8">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#d4a853] mb-3">
                  {magazine.issue}
                </span>
                <h1 className="text-[2.5rem] md:text-[3.5rem] font-serif font-bold text-[#2C1A0E] leading-tight mb-6">
                  {magazine.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-[13px] font-medium text-[#9a8070] pb-8 border-b border-[#ede2cc]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8B1A2D]" />
                    {magazine.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8B1A2D]" />
                    {magazine.pages} Pages
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#8B1A2D]" />
                    {magazine.publisher}
                  </div>
                </div>
              </div>

              <div className="prose prose-p:text-[#6a5648] prose-p:leading-relaxed prose-p:text-[16px] max-w-none mb-10">
                <p>{magazine.description}</p>
                <p>
                  Inside this issue, you will find exclusive interviews with industry-leading planners, 
                  detailed breakdowns of budgeting for luxury venues, and an expansive gallery of the season's 
                  most breathtaking bridal gowns.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
                <a
                  href={magazine.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#8B1A2D] hover:bg-[#6d1422] text-white font-bold text-[13px] uppercase tracking-wider px-8 py-4 rounded-xl transition-colors shadow-lg shadow-[#8B1A2D]/20"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
                <p className="text-[11px] text-[#9a8070] italic">
                  *Requires a free Ceylon Weddings account to download.
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer initialCmsData={cmsData} />

    </div>
  );
}
