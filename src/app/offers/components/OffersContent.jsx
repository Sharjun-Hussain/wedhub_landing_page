"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { transformProduct } from "@/lib/api";
import { QuickView } from "@/components/shop/QuickView";
import { CountdownBanner } from "./CountdownBanner";
import { FlashDealCard } from "./FlashDealCard";
import { ProductCard } from "@/components/eCommerce/ProductCard";

export function OffersContent({ initialProducts, initialCmsData }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Parse products
  const rawProducts = initialProducts?.data?.data || initialProducts?.data || [];
  const products = Array.isArray(rawProducts) ? rawProducts.map(transformProduct) : [];

  // Split products for different sections
  const flashDeals = products.slice(0, 6); // First 6 for horizontal carousel
  const topPicks = products.slice(6, 14); // Next 8 for grid
  const allDeals = products.slice(14); // Rest

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#130f0d] font-sans transition-colors duration-300 pb-20">
      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CountdownBanner />

      {/* Promotional Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black">
        <Image 
          src={initialCmsData?.data?.banner_image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"}
          alt="Offers Banner"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#130f0d] via-transparent to-black/30" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4 text-[#fc0a7a]" />
            Season's Biggest Sale
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif font-black text-white mb-6 leading-tight drop-shadow-xl">
            {initialCmsData?.data?.shop_title || "Exclusive Offers"}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-medium">
            {initialCmsData?.data?.shop_description || "Discover limited-time deals on our premium collections. Unbeatable prices while stocks last."}
          </p>
        </div>
      </section>

      {/* Flash Deals Carousel */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-[#fc0a7a] rounded-full inline-block" />
                Lightning Flash Deals
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 ml-5">Hurry up! These offers won't last long.</p>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {flashDeals.map((product) => (
              <div key={product.id} className="snap-start">
                <FlashDealCard product={product} onQuickView={setQuickViewProduct} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promotional Banner Middle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fc0a7a] to-[#d90066] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="relative z-10 max-w-xl text-white">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Premium Bridal Collection</h3>
            <p className="text-white/80 text-lg mb-6">Up to 40% off on all luxury bridal accessories and authentic venue bookings when you reserve today.</p>
            <Link href="/shop?category=Bridal" className="inline-flex items-center gap-2 bg-white text-[#fc0a7a] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative w-full md:w-1/3 h-48 md:h-64 z-10">
             <Image src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop" alt="Promo" fill className="object-cover rounded-2xl shadow-xl" />
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>
      </section>

      {/* Top Picks Grid */}
      {topPicks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">Curated Top Picks</h2>
            <p className="text-gray-500 dark:text-gray-400">Hand-selected deals exclusively for you</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {topPicks.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}

      {/* All Other Deals */}
      {allDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 dark:border-[#352d28]">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8">More Unbeatable Deals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {allDeals.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
