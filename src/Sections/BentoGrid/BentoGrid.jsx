"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

const SPAN_PATTERNS = [
  { col: "lg:col-span-3", row: "lg:row-span-4" }, // 3:4 Ratio
  { col: "lg:col-span-4", row: "lg:row-span-3" }, // 4:3 Ratio
  { col: "lg:col-span-3", row: "lg:row-span-3" }, // 1:1 Ratio
  { col: "lg:col-span-2", row: "lg:row-span-3" }, // 2:3 Ratio (Near 3:4)
  { col: "lg:col-span-4", row: "lg:row-span-4" }, // 1:1 Ratio
  { col: "lg:col-span-2", row: "lg:row-span-4" }, // 1:2 Ratio (Near 9:16)
  { col: "lg:col-span-3", row: "lg:row-span-2" }, // Landscape 3:2
  { col: "lg:col-span-5", row: "lg:row-span-4" }, // Large Square-ish
  { col: "lg:col-span-3", row: "lg:row-span-3" }, // 1:1 Ratio
  { col: "lg:col-span-2", row: "lg:row-span-2" }, // 1:1 Ratio
  { col: "lg:col-span-4", row: "lg:row-span-3" }, // 4:3 Ratio
  { col: "lg:col-span-3", row: "lg:row-span-5" }, // Portrait
];

const GRADIENTS = [
  "from-slate-900 via-zinc-800 to-neutral-700",
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-emerald-600 via-teal-600 to-cyan-600",
  "from-red-600 via-orange-600 to-amber-600",
  "from-blue-600 via-indigo-600 to-violet-600",
];

export default function MobileBentoGrid({ initialCmsData }) {
  const cms = initialCmsData?.data || {};
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const STORAGE_BASE = API_BASE?.replace("/api/v1", "");

  const { header, cards } = useMemo(() => {
    // 1. Header Logic
    const hData = {
      label: "OUR COMMUNITY",
      titleStart: "Happy",
      titleEnd: "Customers.",
      description:
        "Join thousands of satisfied customers who have experienced the premium collections of Foreign Emporium. Real people, real stories.",
    };

    const hSec = cms["collections_header"];
    if (hSec) {
      if (Array.isArray(hSec)) {
        hSec.forEach((i) => {
          if (i.key) hData[i.key] = i.value;
        });
      } else if (typeof hSec === "object") {
        Object.assign(hData, hSec);
      }
    }

    // 2. Customers Loop
    const customerList = [];
    const normalizeUrl = (path) => {
      if (!path) return null;
      if (path.startsWith("http")) return path;
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${STORAGE_BASE || "https://fe.inzeedo.lk"}${cleanPath}`;
    };

    Object.keys(cms).forEach((key) => {
      if (key.startsWith("collections_customer_")) {
        const sec = cms[key];
        let mapped = { id: key };

        if (Array.isArray(sec)) {
          sec.forEach((i) => {
            if (i.key) mapped[i.key] = i.value;
          });
        } else if (typeof sec === "object") {
          Object.assign(mapped, sec);
        }

        // ONLY map real data, NO placeholders
        if (mapped.title) {
          mapped.image = normalizeUrl(mapped.image);
          customerList.push(mapped);
        }
      }
    });

    // 3. Map Spans and Gradients
    const finalCards = customerList.map((item, i) => ({
      ...item,
      colSpan: SPAN_PATTERNS[i % SPAN_PATTERNS.length].col,
      rowSpan: SPAN_PATTERNS[i % SPAN_PATTERNS.length].row,
      gradient: GRADIENTS[i % GRADIENTS.length],
    }));

    return { header: hData, cards: finalCards };
  }, [cms]);

  if (cards.length === 0) return null; // Hide section if no data

  return (
    <section className="py-12 md:py-24 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Header Section --- */}
        <div className="mb-8 md:mb-16 flex flex-col md:flex-row justify-between lg:items-end gap-6 md:gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-8 md:pb-10">
          <div className="flex flex-col gap-3">
            <span className="text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase text-xs sm:text-sm">
              {header.label}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-white">
              {header.titleStart}{" "}
              <span className="text-zinc-400 dark:text-zinc-600">
                {header.titleEnd}
              </span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-lg text-sm md:text-xl leading-relaxed md:text-right">
            {header.description}
          </p>
        </div>

        {/* --- Grid Layout --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 md:gap-4 auto-rows-[120px] grid-flow-dense">
          {cards.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "group relative overflow-hidden bg-zinc-200 dark:bg-zinc-900",
                "rounded-2xl md:rounded-3xl",
                "border border-zinc-200 dark:border-zinc-800/60",
                "hover:shadow-2xl transition-all duration-300",
                // Mobile/Tablet spans
                i % 3 === 0 ? "col-span-2" : "col-span-1",
                // Desktop spans
                item.colSpan,
                item.rowSpan,
              )}
            >
              {/* 1. Background Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* 2. Light Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />

              {/* 3. Content */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end z-20">
                <div className="transition-transform duration-500">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[8px] md:text-[10px] font-bold bg-white/10 backdrop-blur-md border border-white/20 text-white uppercase tracking-wider mb-1.5">
                    {item.badge || "SRI LANKA"}
                  </span>
                  <h3 className="text-sm sm:text-base md:text-xl font-black text-white leading-[1.1] drop-shadow-md">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
