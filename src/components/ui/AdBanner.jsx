import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function AdBanner({ 
  imageSrc, 
  title, 
  subtitle, 
  link = "#", 
  linkText = "Discover More",
  className = "" 
}) {
  return (
    <div className={`relative w-full rounded-[2rem] overflow-hidden group shadow-xl ${className}`}>
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={title || "Advertisement"}
        className="w-full h-[250px] md:h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Dark Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Sponsored Tag */}
      <div className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest">
        <Star className="w-3 h-3 text-[#d4a853]" />
        Sponsored
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center max-w-xl">
        {subtitle && (
          <p className="text-[#d4a853] text-[12px] font-bold tracking-widest uppercase mb-3 drop-shadow-md">
            {subtitle}
          </p>
        )}
        
        {title && (
          <h3 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg">
            {title}
          </h3>
        )}

        <Link
          href={link}
          className="inline-flex items-center justify-center gap-2 w-fit px-6 py-3 rounded-xl bg-white/10 hover:bg-white backdrop-blur-md border border-white/20 text-white hover:text-[#2C1A0E] text-[12px] font-bold uppercase tracking-widest transition-all duration-300 shadow-lg"
        >
          {linkText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
