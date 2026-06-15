"use client";

import { useState, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Battery,
  Bluetooth,
  Play,
  ShieldCheck,
  ShoppingBag,
  Star,
  Zap,
  RotateCcw,
  Truck,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/States/Store";
import { slugify } from "@/app/Data";
import { useCart } from "@/hooks/useCart";

// --- COMPONENTS ---

// 1. Reusable Card Wrapper
const BentoItem = ({ children, className, span = "", onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    onClick={onClick}
    className={cn(
      "relative overflow-hidden rounded-3xl md:rounded-4xl bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-300 group",
      span,
      className,
    )}
  >
    {children}
  </motion.div>
);

// 2. Isolated Timer (Prevents full grid re-renders)
const FlashTimer = memo(() => {
  const [time, setTime] = useState(14400); // 4 hours

  useEffect(() => {
    const timer = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-white tabular-nums">
      {format(time)}
    </div>
  );
});

FlashTimer.displayName = "FlashTimer";

// --- MAIN GRID COMPONENT ---
const ProductShowcase = ({ initialCmsData }) => {
  const [activeColor, setActiveColor] = useState("silver");
  const { addToCart } = useCart();

  const cmsData = useMemo(() => {
    const defaults = {
      product: {
        title: "Sony WH-1000XM5",
        price: "$299",
        oldPrice: "$399",
        badge: "",
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
      },
      review: {
        rating: "4.9",
        text: "Best noise cancelling ever.",
        author: "VERIFIED BUYER",
      },
      timer: {
        endsIn: "03:46:22",
        badge: "FLASH",
      },
      video: {
        image:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
        label: "WATCH REVIEW",
        videoUrl: "https://youtube.com/",
      },
      specs: {
        battery: "30 Hours",
        connectivity: "Bluetooth 5.2",
      },
      buy: {
        label: "Buy Now",
        sublabel: "FREE EXPRESS SHIPPING",
      },
      services: [
        { id: "showcase_service_1", text: "30-Day Returns", icon: "return" },
        { id: "showcase_service_2", text: "2 Year Warranty", icon: "shield" },
        { id: "showcase_service_3", text: "Global Shipping", icon: "globe" },
      ],
    };

    if (!initialCmsData?.data) return defaults;

    const cms = initialCmsData.data;
    const newData = { ...defaults };

    // 1. Product
    if (cms.showcase_product) {
      newData.product = { ...defaults.product, ...cms.showcase_product };
    }

    // 2. Review
    if (cms.showcase_review) {
      newData.review = { ...defaults.review, ...cms.showcase_review };
    }

    // 3. Timer
    if (cms.showcase_timer) {
      newData.timer = { ...defaults.timer, ...cms.showcase_timer };
    }

    // 4. Video
    if (cms.showcase_video) {
      newData.video = { ...defaults.video, ...cms.showcase_video };
    }

    // 5. Specs
    if (cms.showcase_specs) {
      newData.specs = { ...defaults.specs, ...cms.showcase_specs };
    }

    // 6. Buy
    if (cms.showcase_buy) {
      newData.buy = { ...defaults.buy, ...cms.showcase_buy };
    }

    // 7. Services
    newData.services = defaults.services.map((s) => ({
      ...s,
      ...(cms[s.id] || {}),
    }));

    return newData;
  }, [initialCmsData]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Transform to match store format
    const productToCart = {
      title: cmsData.product.title,
      price: parseFloat(cmsData.product.price.replace(/[^0-9.]/g, "")),
      image: cmsData.product.image,
      slug: slugify(cmsData.product.title),
    };

    try {
      // Since this is a static showcase, we pass the basic details
      await addToCart(null, null, 1, productToCart);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const activeImg = cmsData.product.image;

  return (
    <section className="py-8 md:py-16 w-full px-4 md:px-0 bg-white dark:bg-zinc-950">
      {/* GRID LAYOUT STRATEGY:
         - Mobile: 1 Column (auto-rows)
         - Tablet (sm): 2 Columns
         - Desktop (md): 4 Columns
      */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1  lg:mx-12 sm:grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-4">
          {/* --- 1. HERO PRODUCT CARD (Span 2x2) --- */}
          <BentoItem
            span="col-span-1 sm:col-span-2 row-span-2 md:col-span-2 md:row-span-2"
            className="bg-zinc-50 dark:bg-zinc-800/40 p-0 flex flex-col relative isolate"
          >
            {/* Header */}
            <div className="p-6 md:p-8 z-20 w-full sm:w-2/3 pointer-events-none">
              {/* Badge removed as requested */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight mb-2 line-clamp-1">
                {cmsData.product.title}
              </h2>
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl font-bold text-red-600">
                  {cmsData.product.price}
                </span>
                <span className="text-sm sm:text-base font-medium text-zinc-400 line-through">
                  {cmsData.product.oldPrice}
                </span>
              </div>
            </div>

            {/* Product Image Stage */}
            <div className="absolute inset-0 z-10 flex items-end justify-center sm:justify-end pb-0 sm:pb-0 sm:pr-0 overflow-hidden">
              {/* Gradient for mobile text readability */}
              <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-zinc-50 via-zinc-50/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 sm:hidden z-10" />

              <AnimatePresence mode="popLayout">
                <motion.img
                  key={activeImg}
                  src={activeImg}
                  initial={{ opacity: 0, scale: 0.8, y: 50, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 50 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="w-[80%] sm:w-[65%] h-auto object-contain object-bottom drop-shadow-2xl translate-y-4 sm:translate-y-8 sm:translate-x-8"
                  alt={cmsData.product.title}
                  loading="eager"
                />
              </AnimatePresence>
            </div>

            {/* Color Switcher (Hidden for Static Showcase or updated to single selection) */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-30">
              <div className="flex gap-2 p-1.5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-full border border-zinc-200 dark:border-white/10 shadow-lg">
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md bg-zinc-200"
                  aria-label="Active Product"
                >
                  <Check className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </BentoItem>

          {/* --- 2. FLASH SALE TIMER --- */}
          <BentoItem className="bg-zinc-900 dark:bg-black text-white p-5 md:p-6 flex flex-col justify-between overflow-hidden relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />

            <div className="flex justify-between items-start z-10">
              <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 border border-white/10 text-white uppercase tracking-wider">
                {cmsData.timer.badge}
              </span>
            </div>
            <div className="z-10">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
                Ends In
              </p>
              <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-white tabular-nums">
                {cmsData.timer.endsIn}
              </div>
            </div>
          </BentoItem>

          {/* --- 3. SPECS (Stacked Grid) --- */}
          <BentoItem className="p-0 grid grid-rows-2 divide-y divide-zinc-100 dark:divide-zinc-800">
            <div className="flex items-center gap-4 px-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Battery className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {cmsData.specs.battery}
                </p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                  Battery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Bluetooth className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {cmsData.specs.connectivity}
                </p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                  Wireless
                </p>
              </div>
            </div>
          </BentoItem>

          {/* --- 4. VIDEO PREVIEW (Vertical Span) --- */}
          <BentoItem span="row-span-2" className="group p-0 relative bg-black">
            <img
              src={cmsData.video.image}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
              alt="Lifestyle usage"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-end pb-8">
              <a
                href={cmsData.video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center mb-3 cursor-pointer group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </a>
              <p className="font-bold text-white text-xs tracking-wider uppercase">
                {cmsData.video.label}
              </p>
            </div>
          </BentoItem>

          {/* --- 5. BUY CARD (High Contrast) --- */}
          <BentoItem
            onClick={handleAddToCart}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-6 flex flex-col justify-between group cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors duration-300"
          >
            <div className="flex justify-between items-start">
              <ShoppingBag className="w-6 h-6" />
              <ArrowUpRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none mb-1">
                {cmsData.buy.label}
              </p>
              <p className="text-white/60 dark:text-black/50 group-hover:text-white/80 text-[10px] font-medium uppercase tracking-wider">
                {cmsData.buy.sublabel}
              </p>
            </div>
          </BentoItem>

          {/* --- 6. REVIEWS (Span 2) --- */}
          <BentoItem
            span="col-span-1 sm:col-span-2 md:col-span-2"
            className="px-6 py-4 flex items-center justify-between bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-700/20"
          >
            <div className="flex gap-4 items-center">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-amber-900 dark:text-amber-500 leading-none">
                  {cmsData.review.rating}
                </span>
                <div className="flex text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-current" />
                  ))}
                </div>
              </div>
              <div className="h-10 w-px bg-amber-200 dark:bg-amber-800" />
              <div>
                <p className="text-sm font-bold text-amber-950 dark:text-amber-100 italic">
                  "{cmsData.review.text}"
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-amber-600" />
                  <p className="text-[10px] text-amber-800/70 dark:text-amber-300/60 font-bold uppercase">
                    {cmsData.review.author}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-700"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold flex items-center justify-center">
                +2k
              </div>
            </div>
          </BentoItem>

          {/* --- 7. TRUST BADGES --- */}
          <BentoItem className="p-5 flex flex-col justify-center gap-3">
            {cmsData.services.map((item, i) => {
              const Icon =
                item.icon === "return"
                  ? RotateCcw
                  : item.icon === "shield"
                    ? ShieldCheck
                    : item.icon === "globe"
                      ? Truck
                      : Check;
              return (
                <div key={i} className="flex items-center gap-3 group/item">
                  <div className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-200 transition-colors line-clamp-1">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </BentoItem>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
