"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const ProductCard = React.memo(
  ({ product, onQuickView, className = "", style = {} }) => {
    const handleAction = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView?.(product);
      },
      [onQuickView, product],
    );

    return (
      <div
        className={`group flex flex-col gap-2.5 sm:gap-3 relative border border-[#e7e3d9]/60 dark:border-[#352d28]/60 rounded-xl hover:border-[#a97d43]/30 dark:hover:border-[#d4af37]/30 hover:shadow-xl hover:shadow-[#efe9e0]/40 dark:hover:shadow-none transition-all duration-300 bg-white dark:bg-[#171310] p-1.5 sm:p-3 ${className}`}
        style={style}
      >
        <div className="relative aspect-square bg-[#efe9e0]/40 dark:bg-[#1d1815]/40 rounded-lg overflow-hidden border border-[#e7e3d9]/40 dark:border-[#352d28]/40 z-0">
          {/* IMAGE */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* CLICKABLE LINK OVERLAY */}
          <Link
            href={`/product/${product.slug}`}
            className="absolute inset-0 z-10"
          />

          {/* Out of Stock Overlay */}
          {product.isOutOfStock && (
            <div className="absolute inset-0 bg-[#faf9f6]/40 dark:bg-[#130f0d]/40 backdrop-blur-[2px] z-10 pointer-events-none flex items-center justify-center animate-in fade-in duration-500">
              <span className="px-3 py-1.5 bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 text-[9px] font-bold uppercase tracking-[0.2em] rounded shadow-2xl">
                Sold Out
              </span>
            </div>
          )}



          {/* Custom Promo Badge (Top Right) */}
          {product.badge && (
            <div className="absolute top-2.5 right-2.5 z-20">
              <span
                className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border backdrop-blur-md shadow-sm ${product.badge.toLowerCase() === "offer"
                  ? "bg-red-700/90 text-white border-red-800/20"
                  : "bg-[#0a382c]/90 text-white border-[#0a382c]/20 dark:bg-[#d4af37]/90 dark:text-zinc-950 dark:border-[#d4af37]/20"
                  }`}
              >
                {product.badge}
              </span>
            </div>
          )}

          {/* Add to Cart Button (Bottom Overlay) */}
          <div className="absolute md:inset-x-3 md:bottom-3 bottom-2 right-2 z-20 transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
            <button
              onClick={handleAction}
              disabled={product.isOutOfStock}
              className={`flex items-center justify-center transition-all shadow-lg active:scale-95 text-xs font-bold
                   ${product.isOutOfStock
                  ? "bg-[#efe9e0]/80 dark:bg-[#1d1815]/80 text-zinc-400 dark:text-zinc-600 cursor-not-allowed border border-[#e7e3d9]/40 dark:border-[#352d28]/40"
                  : "bg-[#0a382c] hover:bg-[#104e3e] dark:bg-[#d4af37] dark:hover:bg-[#c49f32] text-white dark:text-zinc-950 cursor-pointer"
                }
                   /* Desktop styles */
                   md:w-full md:h-9 md:rounded-lg md:gap-1.5 md:px-3
                   /* Mobile styles */
                   w-8 h-8 rounded-full
                 `}
            >
              <ShoppingBag className="w-4 h-4 md:w-3.5 md:h-3.5 shrink-0" />
              {!product.isOutOfStock && (
                <span className="hidden md:inline">
                  Add to Cart
                </span>
              )}
              {product.isOutOfStock && (
                <span className="hidden md:inline text-[9px] uppercase tracking-tighter">
                  Sold Out
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content Info */}
        <div className="space-y-1 relative z-10 px-0.5">
          <Link href={`/product/${product.slug}`} className="block">
            <div className="flex justify-between items-start gap-1">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">
                  {product.brand && typeof product.brand === "string" && product.brand.toLowerCase() !== "unknown"
                    ? product.brand
                    // : "\u00A0"} 
                    : ""}
                </p>
                <h3 className="font-serif font-bold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm leading-snug group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37] transition-colors line-clamp-2 h-10 sm:h-11">
                  {product.title}
                </h3>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 dark:text-[#d4af37] shrink-0 mt-0.5">
                <Star className="w-3 h-3 fill-current" />{" "}
                {product.rating && product.rating > 0 ? product.rating.toFixed(1) : "0.0"}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-1.5 flex-wrap">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-black text-[#0a382c] dark:text-[#d4af37]">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 line-through decoration-zinc-400/40">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 animate-pulse uppercase tracking-tighter shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {product.stock_quantity} Left
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    );
  },
);
ProductCard.displayName = "ProductCard";
