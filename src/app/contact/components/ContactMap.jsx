"use client";

import React, { memo } from "react";
import { MapPin } from "lucide-react";

const ContactMap = memo(function ContactMap() {
  const mapQuery = "Main Street, Sainthamruthu, Eastern Province, Sri Lanka";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div id="showroom-map" className="space-y-6 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center md:text-left space-y-2">
        <span className="text-[10px] font-bold text-[#a97d43] dark:text-[#d4af37] uppercase tracking-widest block">
          #Find Us
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
          Visit Our Showroom
        </h2>
        <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
          Step in to experience our curated collection of Saudi and Dubai chocolates, authentic Arabian oud perfumes, and gourmet food imports.
        </p>
      </div>

      {/* Map Card */}
      <div className="relative w-full h-[400px] sm:h-[450px] rounded-xl bg-white dark:bg-[#1d1815] border border-[#e7e3d9]/60 dark:border-[#352d28]/60 p-2 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-100 dark:bg-[#130f0d]">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full transition-all duration-500 filter grayscale-[20%] dark:invert-[90%] dark:hue-rotate-180 dark:contrast-[85%]"
          />
          
          {/* Floating Address Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#faf9f6]/95 dark:bg-[#130f0d]/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-[#e7e3d9] dark:border-[#27211d] shadow-xl max-w-sm flex gap-3 transition-colors duration-500">
            <div className="w-8 h-8 rounded-lg bg-[#efe9e0] dark:bg-[#1d1815] flex items-center justify-center shrink-0 border border-[#e7e3d9]/60 dark:border-[#352d28]/60">
              <MapPin className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">
                Our Address
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                Main Street, Sainthamruthu, <br />
                Eastern Province, Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ContactMap.displayName = "ContactMap";

export default ContactMap;
