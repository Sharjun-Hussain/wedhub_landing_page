"use client";

import React, { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/States/Store";
import { useCart } from "@/hooks/useCart";
import {
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  Check,
  CreditCard,
  ChevronDown,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const formatCurrency = (amount) => "Rs. " + amount.toLocaleString("en-LK");

// ─── Native Mobile Bottom Sheet ───────────────────────────────────────────────
function NativeBottomSheet({ isOpen, onClose, children }) {
  const sheetRef = useRef(null);
  const startYRef = useRef(null);
  const currentYRef = useRef(0);

  // Handle touch-to-dismiss swipe
  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (startYRef.current === null) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0 && sheetRef.current) {
      currentYRef.current = delta;
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      sheetRef.current.style.transition = "none";
    }
  };

  const handleTouchEnd = () => {
    if (currentYRef.current > 100) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = "translateY(0)";
      sheetRef.current.style.transition =
        "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)";
    }
    startYRef.current = null;
    currentYRef.current = 0;
  };

  // Reset transform when re-opened
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      sheetRef.current.style.transform = "translateY(0)";
      sheetRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)";
    }
  }, [isOpen]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative z-10 bg-white dark:bg-zinc-950 rounded-t-[28px] max-h-[92dvh] flex flex-col"
        style={{
          transform: "translateY(100%)",
          animation: "slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Drag Handle / Header */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 pt-3 pb-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag pill */}
          <div className="absolute left-1/2 -translate-x-1/2 top-3 w-10 h-1 rounded-full bg-slate-200 dark:bg-zinc-700" />

          {/* Spacer */}
          <div className="w-8 h-8 mt-4" />

          <span className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-4">
            Quick Add
          </span>

          {/* Native close button */}
          <button
            onClick={onClose}
            className="mt-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
            aria-label="Close"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto overscroll-contain flex-1 px-5 pb-8">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function QuickView({ product, isOpen, onClose }) {
  const isMobile = useIsMobile();
  const { dispatch } = useStore();
  const { addToCart, buyNow } = useCart();
  const { status } = useSession();
  const router = useRouter();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] || null);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const currentVariant = selectedVariant || product.variants?.[0];

  const finalPrice = currentVariant?.offer_price
    ? parseFloat(currentVariant.offer_price)
    : currentVariant?.sales_price
      ? parseFloat(currentVariant.sales_price)
      : currentVariant?.price
        ? parseFloat(currentVariant.price)
        : parseFloat(product.price);

  const originalPrice = currentVariant?.price
    ? parseFloat(currentVariant.price)
    : product.originalPrice || finalPrice;
  const savings = originalPrice - finalPrice;

  const handleAddToCart = async () => {
    setIsAdding(true);
    const productToCart = {
      ...product,
      id: selectedVariant?.id || product.id,
      price: finalPrice,
      quantity,
      selectedVariant,
    };
    try {
      await addToCart(
        product.id,
        selectedVariant?.id || null,
        quantity,
        productToCart,
      );
    } catch (error) {
      console.error("Failed to add to cart", error);
    } finally {
      setIsAdding(false);
      onClose();
    }
  };

  const handleBuyNow = async () => {
    if (status === "unauthenticated") {
      const query = `?buyNow=true&productId=${product.id}&variantId=${selectedVariant?.id || ""}&quantity=${quantity}`;
      router.push(`/checkout${query}`);
      return;
    }
    setIsBuying(true);
    try {
      const success = await buyNow(
        product.id,
        selectedVariant?.id || null,
        quantity,
      );
      if (success) router.push("/checkout");
    } catch (error) {
      console.error("Failed to initiate buy now", error);
    } finally {
      setIsBuying(false);
      onClose();
    }
  };

  // ── Mobile Native Sheet Content ──
  if (isMobile) {
    return (
      <NativeBottomSheet isOpen={isOpen} onClose={onClose}>
        {/* Product mini-header */}
        <div className="flex items-center gap-3 mb-5 pt-1">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 flex-shrink-0 border border-slate-100 dark:border-zinc-800">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover mix-blend-multiply dark:mix-blend-normal"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {product.brand}
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
              {product.title}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-base font-black text-slate-900 dark:text-white">
                {formatCurrency(finalPrice)}
              </span>
              {savings > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Image strip */}
        {product.images.length > 1 && (
          <div className="flex gap-2 mb-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {product.images.map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900"
              >
                <Image
                  src={img}
                  alt={`Image ${i + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-slate-100 dark:bg-zinc-800 mb-5" />

        {/* Variants — only show when product has multiple real variants */}
        {product.variants && product.variants.length > 1 && (
          <div className="mb-5">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 block">
              Select Option
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {product.variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariant(variant)}
                  className={`relative flex flex-col items-start p-3 rounded-2xl border-2 transition-all duration-200 text-left ${
                    selectedVariant?.id === variant.id
                      ? "border-[#0a382c] dark:border-[#d4af37] bg-[#0a382c]/5 dark:bg-[#d4af37]/5 shadow-sm"
                      : "border-[#e7e3d9] dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  }`}
                >
                  <div className="flex w-full justify-between items-start mb-1">
                    <span
                      className={`text-sm font-bold ${
                        selectedVariant?.id === variant.id
                          ? "text-[#0a382c] dark:text-[#d4af37]"
                          : "text-zinc-900 dark:text-white"
                      }`}
                    >
                      {variant.storage_size}
                    </span>
                    {selectedVariant?.id === variant.id && (
                      <div className="w-4 h-4 rounded-full bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{variant.ram_size}</span>
                    {variant.ram_size && variant.color && (
                      <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    )}
                    <span>{variant.color}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-5">
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3 block">
            Quantity
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-zinc-900 rounded-2xl h-12 w-36 border border-slate-200 dark:border-zinc-800">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-full flex items-center justify-center text-slate-600 dark:text-slate-400 active:scale-90 transition-transform"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-bold text-base text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-full flex items-center justify-center text-slate-600 dark:text-slate-400 active:scale-90 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isBuying}
            className="w-full h-14 bg-[#efe9e0] dark:bg-[#1d1815] hover:bg-[#e4dcce] dark:hover:bg-[#2a211b] text-zinc-900 dark:text-white border border-[#e7e3d9] dark:border-[#352d28] font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed text-[15px]"
          >
            {isAdding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isAdding || isBuying}
            className="w-full h-14 bg-[#0a382c] hover:bg-[#104e3e] dark:bg-[#d4af37] dark:hover:bg-[#c49f32] text-white dark:text-zinc-950 font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-[#0a382c]/10 dark:shadow-none transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed text-[15px]"
          >
            {isBuying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Buy Now
              </>
            )}
          </button>
        </div>
      </NativeBottomSheet>
    );
  }

  // ── Desktop Dialog ──
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl p-0 overflow-hidden rounded-[2rem] bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
        <DialogHeader className="hidden">
          <DialogTitle>Quick View</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 h-full md:h-[520px]">
          {/* Image */}
          <div className="relative h-full bg-slate-50 dark:bg-zinc-900">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover p-8 mix-blend-multiply dark:mix-blend-normal"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col p-8 md:p-10 h-full overflow-y-auto">
            <div className="mb-8">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-3">
                {product.title}
                {currentVariant?.condition && (
                  <span className="text-slate-400 font-medium text-xl">
                    {" "}
                    ({currentVariant.condition.toLowerCase()})
                  </span>
                )}
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(finalPrice)}
                </span>
                {originalPrice > finalPrice && (
                  <span className="text-lg text-slate-400 line-through font-medium">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Variants — only show when product has multiple real variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-8">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 block">
                  Select Option
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative flex flex-col items-start p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedVariant?.id === variant.id
                          ? "border-[#0a382c] dark:border-[#d4af37] bg-[#0a382c]/5 dark:bg-[#d4af37]/5 shadow-sm"
                          : "border-[#e7e3d9] dark:border-zinc-800 hover:border-[#0a382c]/30 dark:hover:border-[#d4af37]/30 bg-white dark:bg-zinc-900"
                      }`}
                    >
                      <div className="flex w-full justify-between items-start mb-1">
                        <span
                          className={`text-sm font-bold ${
                            selectedVariant?.id === variant.id
                              ? "text-[#0a382c] dark:text-[#d4af37]"
                              : "text-zinc-900 dark:text-white"
                          }`}
                        >
                          {variant.storage_size}
                        </span>
                        {selectedVariant?.id === variant.id && (
                          <div className="w-4 h-4 rounded-full bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{variant.ram_size}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span>{variant.color}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="mt-auto pt-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="flex items-center bg-[#efe9e0] dark:bg-[#1d1815] rounded-xl px-2 h-14 w-32 shrink-0 border border-[#e7e3d9] dark:border-[#352d28]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center hover:text-[#0a382c] dark:hover:text-[#d4af37] transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="flex-1 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center hover:text-[#0a382c] dark:hover:text-[#d4af37] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || isBuying}
                  className="flex-1 bg-[#efe9e0] dark:bg-[#1d1815] hover:bg-[#e4dcce] dark:hover:bg-[#2a211b] text-zinc-900 dark:text-white border border-[#e7e3d9] dark:border-[#352d28] font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed h-14 text-sm md:text-base"
                >
                  {isAdding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={isAdding || isBuying}
                className="w-full bg-[#0a382c] hover:bg-[#104e3e] dark:bg-[#d4af37] dark:hover:bg-[#c49f32] text-white dark:text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0a382c]/10 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed h-14 text-sm md:text-base"
              >
                {isBuying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" /> Buy Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
