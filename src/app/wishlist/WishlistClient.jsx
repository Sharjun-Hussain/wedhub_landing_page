"use client";

import React, { memo, useCallback } from "react";
import { useStore } from "@/States/Store";
import { ProductCard } from "@/components/eCommerce/ProductCard";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";

export const WishlistClient = memo(function WishlistClient() {
  const { state, dispatch } = useStore();
  const wishlistItems = state.wishlist || [];

  const handleRemove = useCallback((productId) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", productId });
  }, [dispatch]);

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-100">
          <Heart className="w-10 h-10 text-[#8B1A2D]" strokeWidth={1.5} />
        </div>
        <h2 className="text-[24px] font-serif font-bold text-[#2C1A0E] mb-3 text-center">
          Your collection is empty
        </h2>
        <p className="text-[#6b584a] text-[15px] font-light max-w-md text-center mb-8">
          You haven't saved any vendors or inspirations yet. Explore our curated selection to start planning your perfect day.
        </p>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#834b53] hover:bg-[#6c3b42] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg uppercase tracking-widest text-[13px]"
        >
          Discover Inspirations <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
      {wishlistItems.map((item, index) => (
        <div key={item.id} className="relative group animate-fade-in-up" style={{ animationDelay: `${(index + 2) * 100}ms`, animationFillMode: "both" }}>
          {/* We wrap the ProductCard to inject a remove button overlay */}
          <ProductCard product={item} />
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove(item.id);
            }}
            className="absolute top-12 right-2 z-30 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            title="Remove from Saved"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
});
