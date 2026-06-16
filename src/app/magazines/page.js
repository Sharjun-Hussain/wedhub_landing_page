import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { mockMagazines } from "@/data/mockMagazines";
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

export const metadata = {
  title: "Sri Lankan Wedding Magazines & Inspiration | WedHub",
  description: "Browse our collection of digital wedding magazines. Discover the latest Sri Lankan bridal trends, real weddings, poruwa ceremony ideas, and expert vendor advice.",
};

export default async function MagazinesPage() {
  const cmsData = await fetchCmsData();

  return (
    <div className="bg-[#fdf8f0] min-h-screen">
      <Header initialCmsData={cmsData} />

      {/* Shared CSS for card hovers */}
      <style>{`
        .mag-card { box-shadow: 0 1px 4px rgba(44,26,14,0.08); transition: box-shadow 0.25s ease, transform 0.25s ease; will-change: transform; }
        .mag-card:hover { box-shadow: 0 20px 48px rgba(44,26,14,0.16); transform: translateY(-6px); }
        .mag-img { transition: transform 0.5s ease; will-change: transform; }
        .mag-card:hover .mag-img { transform: scale(1.04); }
        .mag-title { transition: color 0.2s ease; }
        .mag-card:hover .mag-title { color: #8B1A2D; }
      `}</style>

      <main className="pt-[100px] md:pt-[130px] pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#8B1A2D] bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">
              Digital Newsstand
            </span>
            <h1 className="text-[2.6rem] md:text-[3.5rem] font-serif font-bold text-[#2C1A0E] leading-tight mb-4">
              Our Publications
            </h1>
            <p className="text-[15px] text-[#9a8070] leading-relaxed">
              Immerse yourself in the world of luxury weddings. Our curated digital magazines bring you the best of Sri Lankan bridal fashion, decor trends, and real love stories.
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockMagazines.map((mag) => (
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="mag-img object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  
                  {/* Issue Badge */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#1a0a05] bg-[#d4a853] uppercase tracking-wider shadow-md">
                    {mag.issue}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#9a8070] mb-1.5">
                    {mag.date}
                  </p>
                  
                  <h3 className="mag-title text-[1.2rem] font-serif font-bold text-[#2C1A0E] leading-snug mb-3">
                    {mag.title}
                  </h3>
                  
                  <p className="text-[13px] text-[#9a8070] line-clamp-2 leading-relaxed mb-5 flex-1">
                    {mag.description}
                  </p>

                  <div className="h-px bg-[#f0e6d3] mb-4" />

                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-[#6d513e]">
                      {mag.pages} Pages
                    </div>
                    <div className="h-8 px-4 rounded-xl bg-[#8B1A2D] hover:bg-[#6d1422] text-white text-[11px] font-bold flex items-center transition-colors">
                      Read Issue
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer initialCmsData={cmsData} />
    </div>
  );
}
