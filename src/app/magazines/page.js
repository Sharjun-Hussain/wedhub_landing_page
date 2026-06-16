import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { mockMagazines } from "@/data/mockMagazines";
import { BookOpen } from "lucide-react";
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
  title: "Digital Magazines | Ceylon Weddings",
  description: "Browse our collection of digital wedding magazines, featuring the latest trends, real weddings, and expert advice.",
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {mockMagazines.map((mag) => (
              <div key={mag.id} className="group relative flex flex-col items-center">
                
                {/* Book Cover */}
                <Link href={`/magazines/${mag.id}`} className="relative block w-full aspect-[1/1.35] mb-6 perspective-1000">
                  <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-y-[-5deg] shadow-[0_15px_30px_-10px_rgba(44,26,14,0.2)] group-hover:shadow-[15px_25px_40px_-10px_rgba(44,26,14,0.3)] transform-gpu will-change-transform">
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/40 to-transparent z-20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
                    
                    <Image
                      src={mag.coverImage}
                      alt={mag.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover rounded-sm"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="text-center px-2 w-full flex-1 flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4a853] mb-2">
                    {mag.issue}
                  </p>
                  <h3 className="text-[1.2rem] font-serif font-bold text-[#2C1A0E] leading-tight mb-3 group-hover:text-[#8B1A2D] transition-colors">
                    <Link href={`/magazines/${mag.id}`}>
                      {mag.title}
                    </Link>
                  </h3>
                  
                  <div className="mt-auto pt-4">
                    <Link
                      href={`/magazines/${mag.id}`}
                      className="inline-flex items-center justify-center gap-2 w-full h-10 bg-white border border-[#ede2cc] hover:border-[#8B1A2D] text-[#4a3728] hover:text-[#8B1A2D] text-[11px] font-bold uppercase tracking-wider transition-colors duration-200"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      View Details
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer initialCmsData={cmsData} />

    </div>
  );
}
