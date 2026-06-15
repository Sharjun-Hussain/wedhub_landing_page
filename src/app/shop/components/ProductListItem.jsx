"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

// Sanitize HTML (removes scripts/JS), then strip all remaining tags → plain text only
const stripToText = (html) =>
  sanitizeHtml(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const ProductListItem = React.memo(
  ({ product, onQuickView, className = "", style = {} }) => {
    const { addToCart } = useCart();

    const handleAddToCart = useCallback(
      async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If product has multiple variants, open QuickView for variant selection
        // (same behaviour as grid view's Quick View button)
        if (product.variants && product.variants.length > 1) {
          onQuickView(product);
          return;
        }

        try {
          await addToCart(
            product.id,
            product.variants?.[0]?.id || null,
            1,
            product,
          );
        } catch (error) {
          console.error("Failed to add to cart", error);
        }
      },
      [addToCart, product, onQuickView],
    );

    const handleQuickView = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView(product);
      },
      [onQuickView, product],
    );

    return (
      <div
        className={`group flex flex-col md:flex-row gap-4 bg-white dark:bg-[#171310] border border-[#e7e3d9]/60 dark:border-[#352d28]/60 rounded-xl hover:border-[#a97d43]/30 dark:hover:border-[#d4af37]/30 hover:shadow-xl hover:shadow-[#efe9e0]/40 dark:hover:shadow-none transition-all duration-300 relative overflow-hidden ${className}`}
        style={style}
      >
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-10"
        />

        <div className="relative w-full md:w-56 aspect-square md:aspect-auto md:h-56 bg-[#efe9e0]/40 dark:bg-[#1d1815]/40 overflow-hidden shrink-0 z-0">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105"
          />

          {product.badge && (
            <span
              className={`absolute top-3 right-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border backdrop-blur-md shadow-sm z-20 ${
                product.badge.toLowerCase() === "offer"
                  ? "bg-red-700/90 text-white border-red-800/20"
                  : "bg-[#0a382c]/90 text-white border-[#0a382c]/20 dark:bg-[#d4af37]/90 dark:text-zinc-950 dark:border-[#d4af37]/20"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between relative z-20 pointer-events-none p-5 lg:p-6">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1.5">
                  {product.brand}
                </p>
                <h3 className="font-serif font-bold text-zinc-800 dark:text-zinc-100 text-lg md:text-xl group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37] transition-colors line-clamp-1">
                  {product.title}
                </h3>
              </div>
              <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 dark:text-[#d4af37] bg-amber-500/10 px-2 py-1 rounded-md shrink-0">
                <Star className="w-3.5 h-3.5 fill-current" /> {product.rating ? product.rating.toFixed(1) : "0.0"}
              </div>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 wrap-break-word overflow-hidden leading-relaxed">
              {product.description
                ? stripToText(product.description)
                : "Experience premium quality and performance with this amazing product."}
            </p>
          </div>

          <div className="flex items-end justify-between mt-4 md:mt-0">
            <div className="flex flex-col">
              <div className="flex flex-col-reverse gap-0.5">
                <span className="text-xl md:text-2xl font-black text-[#0a382c] dark:text-[#d4af37] leading-none">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs md:text-sm text-zinc-400 dark:text-zinc-500 line-through decoration-zinc-400/40">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-pulse mt-1 bg-amber-500/10 px-1.5 py-0.5 rounded w-max">
                  Only {product.stock_quantity} left in stock!
                </p>
              )}
            </div>

            <div className="flex gap-2 pointer-events-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.isOutOfStock}
                className={`h-10 px-5 font-bold rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow-md text-xs
                          ${
                            product.isOutOfStock
                              ? "bg-[#efe9e0]/80 dark:bg-[#1d1815]/80 text-zinc-400 dark:text-zinc-600 cursor-not-allowed border border-[#e7e3d9]/40 dark:border-[#352d28]/40"
                              : "bg-[#0a382c] hover:bg-[#104e3e] dark:bg-[#d4af37] dark:hover:bg-[#c49f32] text-white dark:text-zinc-950"
                          }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />{" "}
                {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
ProductListItem.displayName = "ProductListItem";
