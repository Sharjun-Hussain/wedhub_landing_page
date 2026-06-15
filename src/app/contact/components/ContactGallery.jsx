import React from "react";

const FALLBACK_ITEMS = [
  { image: "/hero_truffles.png", name: "Dubai Pistachio Bar", category: "Chocolates" },
  { image: "/hero_perfume.png", name: "Arabian Musk & Oud", category: "Perfumes" },
  { image: "/hero_infant_care.png", name: "Exotic Sodas", category: "Beverages" },
  { image: "/category_pantry.png", name: "Gourmet Ajwa Dates", category: "Foods" },
  { image: "/category_beverages.png", name: "Royal Saudi Coffee", category: "Gahwa" },
];

export default function ContactGallery({ galleryImages = [] }) {
  const items = galleryImages.length > 0 ? galleryImages : FALLBACK_ITEMS;

  return (
    <div className="mt-20">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
          <span className="text-[10px] font-bold tracking-widest text-[#a97d43] dark:text-[#d4af37] uppercase font-sans">
            Boutique Highlights
          </span>
          <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
        </div>
        <h2 className="text-3xl font-serif font-black text-[#2c2520] dark:text-white tracking-tight">
          Explore Sourced Luxury
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 text-xs mt-2 max-w-md mx-auto leading-relaxed font-light">
          Taste the viral delicacies and experience the authentic fragrances handpicked from the best markets of Dubai and Saudi Arabia.
        </p>
      </div>

      {/* Image-only grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="relative h-64 rounded-xl overflow-hidden bg-[#f0ece4] dark:bg-[#1d1815] border border-[#e7e3d9]/60 dark:border-[#352d28]/60 shadow-sm"
          >
            <img
              src={item.image}
              alt={item.name || "Shop product"}
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105 transform-gpu"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
