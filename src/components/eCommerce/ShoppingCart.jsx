"use client";

import React, { useEffect, useRef } from "react";
import { ShoppingCart, Plus, Minus, X, Trash2, ArrowRight } from "lucide-react";

/*
  Performance strategy — same as MobileNav
  ─────────────────────────────────────────
  • NO framer-motion / AnimatePresence (JS-driven = janky on low-end)
  • NO backdrop blur
  • Panel: single CSS translate3d transition on the compositor thread
  • willChange: transform ONLY on the panel element
  • contain: strict  → zero layout bleed outside the sheet
  • Item enter/exit: CSS opacity transition only — no layout animations
  • WebkitTapHighlightColor: transparent on all interactive elements
  • overscroll-behavior: contain on scroll area
*/

const tap = { WebkitTapHighlightColor: "transparent" };

const formatCurrency = (amount) =>
  "Rs. " + Number(amount).toLocaleString("en-LK");

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "https://fe.inzeedo.lk";
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};

export const ShoppingCartComponent = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isOpen,
  onToggle,
  onCheckout,
}) => {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  /* Escape key to close */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onToggle(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onToggle]);

  /* Body-scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── Backdrop — plain opacity, NO blur ───────────────────── */}
      <div
        aria-hidden="true"
        onClick={onToggle}
        className="fixed inset-0 z-[60] bg-black/55 transition-opacity duration-300"
        style={{
          opacity:        isOpen ? 1 : 0,
          pointerEvents:  isOpen ? "auto" : "none",
        }}
      />

      {/* ── Cart drawer ─────────────────────────────────────────────
          Single GPU layer, compositor-only transform transition.
          contain:strict → browser skips all layout outside this box.
      ─────────────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed z-[70] top-2 bottom-2 right-2 md:top-4 md:bottom-4 md:right-4 w-[calc(100vw-1rem)] md:w-full md:max-w-md bg-[#faf9f6] dark:bg-[#130f0d] border border-[#e7e3d9] dark:border-[#27211d] flex flex-col rounded-[2rem] overflow-hidden shadow-2xl"
        style={{
          transform:  isOpen ? "translate3d(0,0,0)" : "translate3d(110%,0,0)",
          transition: "transform 0.30s cubic-bezier(0.22,1,0.36,1)",
          willChange: "transform",
          contain:    "strict",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#e7e3d9] dark:border-[#27211d] shrink-0">
          <div className="flex items-end gap-2">
            <h2 className="text-2xl font-serif font-black text-[#0a382c] dark:text-[#d4af37] tracking-tight">
              Cart
            </h2>
            <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mb-0.5">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                title="Clear cart"
                style={tap}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 active:scale-95 transition-all duration-150"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onToggle}
              style={tap}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-[#0a382c] dark:hover:text-[#d4af37] hover:bg-[#efe9e0] dark:hover:bg-[#1d1815] active:scale-95 transition-all duration-150"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Scroll area ─────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-5"
          style={{
            overscrollBehavior:       "contain",
            WebkitOverflowScrolling:  "touch",
            scrollbarWidth:           "none",
            msOverflowStyle:          "none",
          }}
        >
          {items.length === 0 ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center text-center gap-5">
              <div className="w-24 h-24 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#27211d] rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-[#0a382c]/40 dark:text-[#d4af37]/40" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#130f0d] dark:text-[#faf9f6]">
                  Your cart is empty
                </p>
                <p className="text-zinc-500 mt-1.5 text-sm max-w-[200px] mx-auto">
                  Looks like you haven&apos;t added anything yet.
                </p>
              </div>
              <button
                onClick={onToggle}
                style={tap}
                className="px-8 py-3 bg-[#efe9e0] dark:bg-[#1d1815] text-[#0a382c] dark:text-[#d4af37] border border-[#e7e3d9] dark:border-[#27211d] font-bold rounded-xl text-sm active:scale-[0.98] transition-transform duration-100"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white dark:bg-[#1a1612] rounded-2xl border border-[#e7e3d9] dark:border-[#27211d] p-3"
                  /* Simple opacity — no layout animation, no framer-motion */
                  style={{ transition: "opacity 0.15s ease" }}
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 bg-[#efe9e0] dark:bg-[#1d1815] rounded-xl overflow-hidden border border-[#e7e3d9] dark:border-[#27211d] shrink-0">
                    <img
                      src={getImageUrl(item.images?.[0] || item.image)}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover p-2"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    <div className="flex justify-between items-start gap-1.5">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-[#130f0d] dark:text-[#faf9f6] line-clamp-2 leading-snug">
                          {item.title || item.name}
                        </h4>
                        {item.brand && !['physical', 'unknown'].includes(item.brand.toLowerCase()) && (
                          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                            {item.brand}
                          </p>
                        )}
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5">
                            {formatCurrency(item.price)} each
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={tap}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 active:scale-90 transition-all duration-100 flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-col">
                        {(item.originalPrice > item.price || item.original_price > item.price) && (
                          <span className="text-[10px] text-zinc-400 line-through decoration-zinc-400/50 leading-none h-3">
                            {formatCurrency((item.originalPrice || item.original_price) * item.quantity)}
                          </span>
                        )}
                        <p className="font-serif font-black text-[#0a382c] dark:text-[#d4af37] text-base leading-tight">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Qty control */}
                      <div className="flex items-center gap-1 bg-[#f0ebe0] dark:bg-[#1d1815] rounded-xl p-1 border border-[#e7e3d9] dark:border-[#27211d]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={tap}
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-[#130f0d] rounded-lg text-zinc-600 dark:text-zinc-300 shadow-sm active:scale-90 disabled:opacity-40 transition-transform duration-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center text-zinc-900 dark:text-white select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.stock_quantity > 0 && item.quantity >= item.stock_quantity}
                          style={tap}
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-[#130f0d] rounded-lg text-zinc-600 dark:text-zinc-300 shadow-sm active:scale-90 disabled:opacity-30 transition-transform duration-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer — checkout ────────────────────────────────────── */}
        {items.length > 0 && (
          <div className="shrink-0 px-5 py-5 border-t border-[#e7e3d9] dark:border-[#27211d] bg-[#faf9f6] dark:bg-[#130f0d] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-zinc-700 dark:text-zinc-300">
                Total
              </span>
              <span className="text-2xl font-serif font-black text-[#0a382c] dark:text-[#d4af37]">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-white font-bold active:scale-[0.98] transition-transform duration-100"
              style={{
                WebkitTapHighlightColor: "transparent",
                background:  "linear-gradient(135deg,#0a382c 0%,#104e3e 100%)",
                boxShadow:   "0 4px 14px rgba(10,56,44,0.22)",
              }}
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* iOS safe-area */}
            <div style={{ height: "max(0px, env(safe-area-inset-bottom))" }} />
          </div>
        )}
      </div>
    </>
  );
};
