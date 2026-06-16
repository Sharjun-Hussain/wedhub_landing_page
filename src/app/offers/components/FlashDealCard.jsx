"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Star } from "lucide-react";

export function FlashDealCard({ product, onQuickView }) {
  const handleAction = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView?.(product);
    },
    [onQuickView, product],
  );

  const price = product.price || 0;
  const originalPrice = product.originalPrice || price * 1.25; 
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100) || 20;

  return (
    <div className="group relative bg-white dark:bg-[#1a1714] border border-[#ede2cc] dark:border-[#352d28] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#fc0a7a]/30 transition-all duration-300 flex flex-col h-full w-[260px] sm:w-[280px] shrink-0">
      {/* Badge */}
      <div className="absolute top-3 left-3 z-20 bg-[#fc0a7a] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
        -{discountPercent}% OFF
      </div>
      
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#efe9e0]/40 dark:bg-[#1d1815]/40 overflow-hidden cursor-pointer w-full" onClick={handleAction}>
        <Image 
          src={product.images?.[0] || "/placeholder.jpg"} 
          alt={product.title} 
          fill 
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-[#fc0a7a]/10 transition-colors duration-300 z-10" />
        
        {/* Out of Stock Overlay */}
        {product.isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] z-20 pointer-events-none flex items-center justify-center">
            <span className="px-3 py-1.5 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded shadow-2xl">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 relative z-10">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 truncate">
          {product.brand || "Exclusive"}
        </div>
        <Link href={`/product/${product.slug || product.id}`} className="block flex-1">
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#fc0a7a] transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 mb-3">
          <Star className="w-3 h-3 fill-current" />
          {product.rating ? product.rating.toFixed(1) : "5.0"}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-[#352d28] flex items-end justify-between gap-2">
          <div>
            <div className="text-[12px] text-gray-400 line-through mb-0.5">
              {formatCurrency(originalPrice)}
            </div>
            <div className="text-[18px] font-black text-[#fc0a7a] leading-none">
              {formatCurrency(price)}
            </div>
          </div>
          
          <button 
            onClick={handleAction}
            disabled={product.isOutOfStock}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md ${
              product.isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#fc0a7a] text-white hover:bg-[#d90066]"
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
