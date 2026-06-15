"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Truck,
  ShieldCheck,
  Award,
  Headphones,
  CheckCircle2,
} from "lucide-react";

const iconMap = {
  truck: Truck,
  shield: ShieldCheck,
  award: Award,
  headphone: Headphones,
};

const colorMap = {
  gold: {
    text: "text-[#a97d43] dark:text-[#d4af37]",
    bg: "bg-[#a97d43]/10 dark:bg-[#d4af37]/10",
    border: "md:group-hover:border-[#a97d43] dark:md:group-hover:border-[#d4af37]/50",
  },
};

export default function Promises({ initialCmsData }) {
  const cmsData = useMemo(() => {
    const defaults = {
      header: {
        title_start: "Our Premium",
        title_highlight: "Commitments",
        subtitle:
          "We import only the most authentic, premium-grade luxury items directly from Saudi Arabia & Dubai.",
      },
      cards: [
        {
          id: "promises_card_1",
          title: "Direct Air Cargo",
          description: "Freshly imported premium stocks flown in directly from the Gulf weekly under strict temperature control.",
          icon: "truck",
          color: "gold",
        },
        {
          id: "promises_card_2",
          title: "100% Authentic",
          description: "Certified genuine Arabian ouds, luxury perfumes, and Middle Eastern delicacies with quality guarantees.",
          icon: "shield",
          color: "gold",
        },
        {
          id: "promises_card_3",
          title: "Boutique Packaging",
          description: "Secure, signature espresso-cashmere wrapping perfect for premium gifting and absolute luxury.",
          icon: "award",
          color: "gold",
        },
        {
          id: "promises_card_4",
          title: "Bespoke Assistance",
          description: "Personal shopping assistance and custom orders for rare Middle Eastern luxury goods.",
          icon: "headphone",
          color: "gold",
        },
      ],
      stats: [
        { id: "promises_stat_1", value: "15k+", label: "HAPPY CUSTOMERS" },
        { id: "promises_stat_2", value: "4.9/5", label: "BOUTIQUE RATING" },
        { id: "promises_stat_3", value: "100%", label: "GENUINE IMPORTS" },
        { id: "promises_stat_4", value: "24/7", label: "VIP ASSISTANCE" },
      ],
    };

    if (!initialCmsData?.data) return defaults;

    const cms = initialCmsData.data;
    const newData = { ...defaults };

    if (cms.promises_header) {
      newData.header = { ...defaults.header, ...cms.promises_header };
    }
    newData.cards = defaults.cards.map((card) => ({
      ...card,
      ...(cms[card.id] || {}),
    }));
    newData.stats = defaults.stats.map((stat) => ({
      ...stat,
      ...(cms[stat.id] || {}),
    }));

    return newData;
  }, [initialCmsData]);

  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-[#faf9f6] dark:bg-[#130f0d] text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto mb-16 px-2">
          <div className="inline-flex items-center gap-2 mb-3 justify-center">
            <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#a97d43] dark:text-[#d4af37] uppercase font-sans">
              {cmsData.header.title_start}
            </span>
            <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
          </div>
          <h2 className="text-3xl lg:text-4.5xl font-serif font-black text-[#2c2520] dark:text-white tracking-tight">
            {cmsData.header.title_highlight}
          </h2>
          <p className="text-xs sm:text-sm text-[#2c2520]/60 dark:text-zinc-400 mt-3 max-w-xl mx-auto font-medium">
            {cmsData.header.subtitle}
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cmsData.cards.map((feature, index) => {
            const Icon = iconMap[feature.icon] || CheckCircle2;
            const style = colorMap[feature.color] || colorMap.gold;

            return (
              <div
                key={feature.id}
                style={{ transitionDelay: `${index * 150}ms` }}
                className={[
                  "group relative overflow-hidden rounded-[2rem]",
                  "p-8",
                  "bg-white dark:bg-[#1d1815]",
                  "border border-[#e7e3d9] dark:border-[#352d28]/60 shadow-xl shadow-[#2c2520]/5 dark:shadow-none",
                  "md:transition-all md:duration-300",
                  "md:hover:shadow-2xl md:hover:-translate-y-1",
                  "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                  style.border,
                ].join(" ")}
              >
                {/* Icon */}
                <div
                  className={[
                    "w-14 h-14 rounded-2xl",
                    style.bg,
                    "flex items-center justify-center",
                    "mb-6",
                    "md:transition-transform md:duration-500 md:group-hover:scale-110 md:group-hover:rotate-3",
                  ].join(" ")}
                >
                  <Icon className={`w-7 h-7 ${style.text}`} />
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold mb-3 text-[#2c2520] dark:text-white leading-tight uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-[#6d513e] dark:text-[#a3988e] text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative glow */}
                <div
                  className={`hidden md:block absolute top-0 right-0 w-24 h-24 ${style.bg} blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
              </div>
            );
          })}
        </div>

        {/* STATS STRIP */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-[#e7e3d9] dark:border-[#352d28]/60 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {cmsData.stats.map((stat, index) => (
            <div 
              key={stat.id}
              style={{ transitionDelay: `${(index * 100) + 300}ms` }}
              className={`transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
              }`}
            >
              <p className="text-3xl md:text-4.5xl font-black text-[#2c2520] dark:text-white mb-2 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[10px] md:text-xs font-bold text-[#a97d43] dark:text-[#d4af37] uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
