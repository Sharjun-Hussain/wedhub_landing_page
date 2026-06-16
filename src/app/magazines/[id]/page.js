import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { mockMagazines } from "@/data/mockMagazines";
import { ArrowLeft, Calendar, FileText, Building2 } from "lucide-react";
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

export async function generateMetadata({ params }) {
  const { id } = await params;
  const magazine = mockMagazines.find((m) => m.id === id);
  if (!magazine) return { title: "Not Found" };
  
  return {
    title: `${magazine.title} - ${magazine.issue} | WedHub`,
    description: magazine.description,
  };
}

export default async function MagazineDetailPage({ params }) {
  const { id } = await params;
  const magazine = mockMagazines.find((m) => m.id === id);
  
  if (!magazine) {
    notFound();
  }

  const isImage = magazine.pdfUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

  const cmsData = await fetchCmsData();

  return (
    <div className="bg-[#fdf8f0] min-h-screen flex flex-col">
      <Header initialCmsData={cmsData} />

      <main className="flex-1 pt-[100px] md:pt-[130px] pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link
            href="/magazines"
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#9a8070] hover:text-[#fc0a7a] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Newsstand
          </Link>

          {/* Header Info */}
          <div className="mb-8 max-w-4xl">
            <h1 className="text-[2.5rem] md:text-[3.5rem] font-serif font-bold text-[#2C1A0E] leading-tight mb-4">
              {magazine.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-[13px] font-medium text-[#9a8070] mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#fc0a7a]" />
                {magazine.date}
              </div>
            </div>
            
            <p className="text-[15px] text-[#6a5648] leading-relaxed max-w-3xl border-l-2 border-[#d4a853] pl-4">
              {magazine.description}
            </p>
          </div>

          {/* 8-4 Layout Split */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT: 8 Columns for Viewer ──────────────────────── */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="w-full bg-white rounded-3xl overflow-hidden border border-[#ede2cc] shadow-xl shadow-[#2C1A0E]/5" style={{ height: "calc(100vh - 120px)", minHeight: "800px" }}>
                {magazine.pdfUrl ? (
                  isImage ? (
                    <div className="relative w-full h-full bg-[#f9f5ed]">
                      <Image 
                        src={magazine.pdfUrl} 
                        alt={magazine.title} 
                        fill 
                        className="object-contain p-4"
                      />
                    </div>
                  ) : (
                    <iframe 
                      src={`${magazine.pdfUrl}#toolbar=0&view=FitH`} 
                      className="w-full h-full border-none"
                      title={`${magazine.title} PDF viewer`}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center p-10 bg-[#f9f5ed]">
                    <div>
                      <p className="text-[#fc0a7a] font-bold text-lg mb-2">Publication Not Available</p>
                      <p className="text-[#9a8070]">The requested file could not be loaded.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: 4 Columns for Ads ────────────────────────────── */}
            <div className="lg:col-span-4 hidden lg:flex flex-col gap-6 sticky top-[100px]">
              {/* Ad Space 1 */}
              <div className="w-full relative bg-white border border-[#ede2cc] p-2 rounded-2xl flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white/90">
                  Sponsored
                </div>
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-3">
                  <Image 
                    src="/banner_perfume.png" 
                    alt="Sponsored Ad 1" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-[11px] font-bold text-[#2C1A0E] text-center px-1 pb-1">
                  Luxury Bridal Fragrances
                </p>
              </div>

              {/* Ad Space 2 */}
              <div className="w-full relative bg-white border border-[#ede2cc] p-2 rounded-2xl flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white/90">
                  Sponsored
                </div>
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-3">
                  <Image 
                    src="/banner_pantry.png" 
                    alt="Sponsored Ad 2" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-[11px] font-bold text-[#2C1A0E] text-center px-1 pb-1">
                  Premium Wedding Catering
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
