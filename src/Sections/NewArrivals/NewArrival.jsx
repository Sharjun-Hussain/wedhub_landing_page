"use client";

import { clsx } from "clsx";
import {
  Coffee,
  Cookie,
  Grid,
  Sparkles,
  Store,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { transformProduct } from "@/lib/api";
import { ProductCard } from "@/app/shop/components/ProductCard";
import { QuickView } from "@/components/shop/QuickView";

function _cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Luxury Categories for WedHub ---
const DEFAULT_CATEGORIES = [
  { id: "all", label: "View All", icon: Grid },
  { id: "chocolates", label: "Chocolates", icon: Cookie },
  { id: "perfumes", label: "Perfumes", icon: Sparkles },
  { id: "beverages", label: "Sodas & Juices", icon: Coffee },
  { id: "foods", label: "Imported Foods", icon: ShoppingBag },
  { id: "nuts", label: "Nuts & Seeds", icon: Store },
  { id: "coffee", label: "Gahwa & Coffee", icon: Coffee },
];

export default function NewArrivals({ initialProducts = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const arrivals = useMemo(() => {
    const productsArray = Array.isArray(initialProducts)
      ? initialProducts
      : Array.isArray(initialProducts?.data)
        ? initialProducts.data
        : [];
    return productsArray.map(transformProduct);
  }, [initialProducts]);

  const { filteredItems, counts, categories } = useMemo(() => {
    const counts = arrivals.reduce(
      (acc, item) => {
        const categoryKey = (item.category || "").toLowerCase();
        acc[categoryKey] = (acc[categoryKey] || 0) + 1;
        return acc;
      },
      { all: arrivals.length },
    );

    // Filter categories that actually have products in stock
    const availableCategories = DEFAULT_CATEGORIES.filter(
      (cat) => cat.id === "all" || (counts[cat.id] && counts[cat.id] > 0),
    );

    const filtered =
      activeTab === "all"
        ? arrivals
        : arrivals.filter(
          (item) => (item.category || "").toLowerCase() === activeTab,
        );

    return { filteredItems: filtered, counts, categories: availableCategories };
  }, [activeTab, arrivals]);

  return (
    <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] dark:bg-[#130f0d] overflow-hidden transition-colors duration-500">
      {/* Subtle Gold Dotted Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#a97d43_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0" />

      <div className="lg:px-10 max-w-full mx-auto relative z-10">
        {/* --- SIMPLE & ELEGANT HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
              <span className="text-[10px] font-bold tracking-widest text-[#a97d43] dark:text-[#d4af37] uppercase font-sans">
                Fresh Drops
              </span>
            </div>
            <h2 className="text-3xl lg:text-4.5xl font-serif font-black text-[#2c2520] dark:text-white tracking-tight">
              New Arrivals
            </h2>
          </div>

          {/* Desktop View All Link */}
          <div className="flex items-center mt-4 md:mt-0">
            <Link
              href="/shop?newArrivals=true"
              className="relative pb-1 text-xs font-bold tracking-widest uppercase transition-colors duration-300 select-none whitespace-nowrap text-[#a97d43] dark:text-[#d4af37] hover:opacity-80"
            >
              VIEW ALL
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a97d43] dark:bg-[#d4af37] rounded-full" />
            </Link>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-2">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white dark:bg-[#1d1815] rounded-md border border-[#e7e3d9]/40 dark:border-[#352d28]/40 mx-2">
            <p className="text-slate-400 dark:text-zinc-500 font-medium">
              No items currently available in this category.
            </p>
          </div>
        )}

      </div>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
