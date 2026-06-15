"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, Plus, ShoppingBag, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { slugify } from "@/app/Data";
import { useStore } from "@/States/Store";
import { useCart } from "@/hooks/useCart";

// --- HELPER ---
const formatPrice = (price) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price);

// --- COMPONENT ---
const ProductCard = memo(
  ({
    product,
    isFeatured = false,
    isSponsored = false,
    isOutOfStock = false,
    className = "",
    onAddToCart,
    onShare,
    onQuickView,
  }) => {
    const { dispatch } = useStore();
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleShare = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const shareUrl = `${window.location.protocol}//${window.location.host}/product/${slugify(product.name)}?id=${product.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      if (onShare) onShare(product.id, shareUrl);
    };

    const handleAddToCart = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock) return;

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);

      // Transform product to match store structure
      const productToCart = {
        ...product,
        id: product.id,
        productId: product.id,
        title: product.name,
        name: product.name,
        price: parseFloat(product.currentPrice || 0),
        image: product.image || "/placeholder.svg",
        images: [product.image || "/placeholder.svg"],
        slug: product.slug || slugify(product.name),
        brand: product.brand || "Unknown",
        quantity: 1,
      };

      try {
        await addToCart(
          product.id,
          product.variants?.[0]?.id || null, // Will be null if no variants, check API allowance
          1,
          productToCart,
        );
        if (onAddToCart) onAddToCart(product.id);
      } catch (err) {
        console.error("Failed to add to cart", err);
      }
    };

    const discount =
      product.originalPrice > product.currentPrice
        ? Math.round(
            ((product.originalPrice - product.currentPrice) /
              product.originalPrice) *
              100,
          )
        : 0;

    return (
      <div
        className={cn(
          "group relative flex flex-col w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-zinc-300 dark:hover:border-white/10",
          isSponsored && "ring-1 ring-blue-500/20",
          isOutOfStock && "opacity-75 grayscale-[0.5]",
          className,
        )}
      >
        {/* --- IMAGE AREA --- */}
        <div className="relative w-full aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <Link
            href={`/product/${product.slug || slugify(product.name)}?id=${product.id}&utm_source=product-card`}
            className="block w-full h-full"
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </Link>

          {/* TOP RIGHT: Hover Actions (Desktop) */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* TOP LEFT: Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
            {isFeatured && (
              <span className="px-2 py-0.5 rounded-sm bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                Featured
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-0.5 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-black text-[9px] font-bold shadow-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* BOTTOM: Desktop Slide-Up Button (Overlays Image) */}
          <div className="hidden md:block absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                "w-full h-9 rounded-lg shadow-lg flex items-center justify-center gap-2 text-xs font-bold backdrop-blur-md transition-all active:scale-95",
                isAdded
                  ? "bg-blue-600 text-white border-none shadow-blue-500/25"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25",
              )}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </>
              )}
            </button>
          </div>

          {/* MOBILE UNIQUE BUTTON: Floating 'Plus' Circle (Bottom Right) */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              "md:hidden absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg shadow-black/20 transition-transform active:scale-90 z-20",
              isAdded
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white shadow-blue-500/25",
            )}
          >
            {isAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-[1px]">
              <span className="px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest rounded">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* --- DETAILS AREA (Compact) --- */}
        <div className="p-3 pt-2.5 flex flex-col gap-1.5 bg-white dark:bg-zinc-900 z-30">
          {/* Title */}
          <Link
            href={`/product/${product.slug || slugify(product.name)}?id=${product.id}&utm_source=product-card`}
            className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-snug line-clamp-2 h-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            {product.name}
          </Link>

          {/* Price & Rating Row */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 line-through decoration-zinc-400/50 leading-none h-3">
                {product.originalPrice > product.currentPrice
                  ? formatPrice(product.originalPrice)
                  : ""}
              </span>
              <span className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white leading-tight">
                {formatPrice(product.currentPrice)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold">
                {product.rating && product.rating > 0 ? product.rating : "0.0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
