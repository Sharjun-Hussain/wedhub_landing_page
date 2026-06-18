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
  title: "Sri Lankan Wedding Magazines & Inspiration | WedHub - The Best Wedding Marketplace",
  description: "Discover the best wedding marketplace in Sri Lanka. Browse our collection of digital wedding magazines. Discover the latest Sri Lankan bridal trends, real weddings, poruwa ceremony ideas, and expert vendor advice.",
};

export default async function MagazinesPage() {
  const cmsData = await fetchCmsData();

  return (
    <div className="bg-[#fdf8f0] min-h-screen">
      <Header initialCmsData={cmsData} />

      <main className="pt-[100px] md:pt-[130px] pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#fc0a7a] bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-14">
            {mockMagazines.map((mag) => (
              <Link 
                key={mag.id} 
                href={`/magazines/${mag.id}`}
                className="group flex flex-col items-center cursor-pointer"
              >
                {/* Image Container (Simulated Spread) */}
                <div className="relative w-full aspect-[1.4/1] bg-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.4)] mb-8">
                  <Image
                    src={mag.coverImage}
                    alt={mag.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  {/* Simulate open book spine */}
                  <div className="absolute inset-y-0 left-1/2 w-[2px] bg-gradient-to-r from-black/20 to-transparent -translate-x-1/2" />
                </div>

                {/* Card Content - Centered to match image style */}
                <div className="flex flex-col items-center text-center px-2 w-full">
                  <h3 className="text-[1.1rem] md:text-[1.2rem] font-serif font-bold text-[#4a3728] uppercase group-hover:text-[#fc0a7a] transition-colors mb-4">
                    {mag.title}
                  </h3>

                  <div className="h-9 px-6 rounded-full bg-[#fc0a7a] hover:bg-[#d90066] text-white text-[11px] font-bold uppercase flex items-center transition-colors">
                    Read Issue
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
