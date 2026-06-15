"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Gamepad2,
  Laptop,
  Smartphone,
  Zap,
  Camera,
  Tag,
} from "lucide-react";

const iconMap = {
  gamepad: Gamepad2,
  camera: Smartphone,
  smartphone: Smartphone,
  laptop: Laptop,
  zap: Zap,
  tag: Tag,
};

export default function PromoBanner({ initialCmsData }) {
  const brandImages = [
    { name: "Apple", src: "/brands/apple.png" },
    { name: "Samsung", src: "/brands/samsung.png" },
    { name: "Sony", src: "/brands/sony.png" },
    { name: "Huawei", src: "/brands/huawei.png" },
    { name: "Xiaomi", src: "/brands/mi.png" },
    { name: "OnePlus", src: "/brands/oneplus.png" },
    { name: "Vivo", src: "/brands/vivo.png" },
    { name: "HP", src: "/brands/hp.png" },
    { name: "Dell", src: "/brands/dell.png" },
    { name: "Lenovo", src: "/brands/lenovo.png" },
    { name: "Acer", src: "/brands/acer.png" },
    { name: "Asus", src: "/brands/asuz.png" },
  ];

  const bannerData = useMemo(() => {
    const defaults = {
      promo_banner_1: {
        title: "Mobile Gaming Power.",
        description:
          "Dominate the arena with 144Hz displays and Snapdragon 8 Gen 3 processors.",
        badge: "NEXT-GEN READY",
        badge_icon: "gamepad",
        button_text: "Shop Gaming",
        link: "/shop?cat=gaming",
        theme: "purple",
        image:
          "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=1200",
      },
      promo_banner_2: {
        title: "Pro Mobile Photography.",
        description:
          "Capture cinematic shots with 200MP sensors and AI-enhanced editing.",
        badge: "PRO CAMERA",
        badge_icon: "camera",
        button_text: "Upgrade Setup",
        link: "/shop?cat=macbook",
        theme: "black",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1200",
      },
    };

    if (!initialCmsData?.data) return defaults;

    const cms = initialCmsData.data;
    return {
      promo_banner_1: {
        ...defaults.promo_banner_1,
        ...(cms.promo_banner_1 || {}),
      },
      promo_banner_2: {
        ...defaults.promo_banner_2,
        ...(cms.promo_banner_2 || {}),
      },
    };
  }, [initialCmsData]);

  const renderBanner = (data) => {
    const Icon = iconMap[data.badge_icon] || Zap;

    // Theme mapping based on backend logic
    const themeStyles = {
      purple: {
        bg: "bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950",
        shadow: "shadow-indigo-900/20",
        badge: "bg-white/10 border-white/10 text-white",
        icon: "text-purple-400",
        title: "text-white",
        desc: "text-slate-300",
        btn: "bg-white text-slate-950 hover:bg-blue-500 hover:text-white",
        overlay: "bg-gradient-to-t from-black via-black/40 to-transparent",
      },
      black: {
        bg: "bg-slate-900",
        shadow: "shadow-slate-900/20",
        badge: "bg-white/10 border-white/10 text-white",
        icon: "text-blue-400",
        title: "text-white",
        desc: "text-slate-300",
        btn: "bg-white text-slate-950 hover:bg-blue-500 hover:text-white",
        overlay: "bg-gradient-to-t from-black via-black/40 to-transparent",
      },
      blue: {
        bg: "bg-gradient-to-br from-blue-950 to-slate-900",
        shadow: "shadow-blue-900/20",
        badge: "bg-white/10 border-white/10 text-white",
        icon: "text-blue-400",
        title: "text-white",
        desc: "text-slate-300",
        btn: "bg-white text-slate-950 hover:bg-blue-500 hover:text-white",
        overlay: "bg-gradient-to-t from-black via-black/40 to-transparent",
      },
      green: {
        bg: "bg-gradient-to-br from-emerald-950 to-slate-900",
        shadow: "shadow-emerald-900/20",
        badge: "bg-white/10 border-white/10 text-white",
        icon: "text-emerald-400",
        title: "text-white",
        desc: "text-slate-300",
        btn: "bg-white text-slate-950 hover:bg-blue-500 hover:text-white",
        overlay: "bg-gradient-to-t from-black via-black/40 to-transparent",
      },
    };

    const style = themeStyles[data.theme] || themeStyles.black;

    const titleParts = data.title.split(" ");
    const titleFirstLine = titleParts
      .slice(0, Math.max(1, titleParts.length - 1))
      .join(" ");
    const titleSecondLine =
      titleParts.length > 1 ? titleParts[titleParts.length - 1] : "";

    return (
      <div
        className={`promo-card group relative h-[450px] lg:h-[550px] rounded-[2.5rem] overflow-hidden ${style.bg} shadow-2xl ${style.shadow} animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both`}
      >
        <div className="absolute inset-0">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-70"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className={`absolute inset-0 ${style.overlay}`} />

        <div className="absolute inset-0 p-10 lg:p-14 flex flex-col justify-end items-start z-10">
          <div
            className={`mb-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${style.badge} backdrop-blur-md border text-xs font-bold uppercase tracking-wider shadow-lg`}
          >
            <Icon className={`w-4 h-4 ${style.icon}`} />
            <span>{data.badge}</span>
          </div>

          <h3
            className={`text-4xl lg:text-5xl font-black ${style.title} mb-4 leading-[1.1]`}
          >
            {titleFirstLine} <br /> {titleSecondLine}
          </h3>
          <p
            className={`${style.desc} mb-8 max-w-sm text-lg font-medium leading-relaxed`}
          >
            {data.description}
          </p>

          <Link
            href={data.link}
            className={`h-14 px-10 rounded-2xl ${style.btn} font-bold flex items-center gap-3 transition-all shadow-xl group/btn`}
          >
            {data.button_text}
            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section className="hidden md:block py-16 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {renderBanner(bannerData.promo_banner_1)}
          {renderBanner(bannerData.promo_banner_2)}
        </div>

        {/* --- BRAND MARQUEE --- */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-white/5 overflow-hidden">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">
            Trusted Authorized Retailer For
          </p>

          <div className="relative w-full overflow-hidden opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50 dark:from-zinc-950 to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50 dark:from-zinc-950 to-transparent" />

            <div className="flex w-max animate-marquee gap-24 items-center will-change-transform">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  {brandImages.map((brand) => (
                    <div
                      key={brand.name}
                      className="flex items-center justify-center shrink-0 w-40 md:w-56 h-24 relative transition-all duration-300 px-4"
                    >
                      <img
                        src={brand.src}
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
