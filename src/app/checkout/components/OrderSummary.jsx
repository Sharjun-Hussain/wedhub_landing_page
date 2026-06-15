"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Tag, X, Loader2, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function OrderSummary({
  checkoutItems,
  couponCode,
  setCouponCode,
  appliedCoupon,
  isApplyingCoupon,
  handleApplyCoupon,
  handleRemoveCoupon,
  couponError,
  subtotal,
  deliveryFee,
  discount,
  total,
}) {
  return (
    <div className="left-panel w-full lg:w-[45%] bg-slate-50 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white p-8 lg:p-16 pt-24 lg:pt-24 flex flex-col relative z-10 transition-colors duration-300">
      <div className="hidden lg:flex items-center justify-end mb-12 stagger-in">
        <Link
          href="/shop"
          className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />{" "}
          Shop
        </Link>
      </div>

      <div className="flex-1 space-y-8 stagger-in overflow-y-auto max-h-[50vh] pr-2 tiny-scrollbar">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">
            Order Summary
          </h2>
        </div>
        <div className="space-y-6">
          {checkoutItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-zinc-500">
              <p>Your cart is empty.</p>
              <Link
                href="/shop"
                className="text-[#a97d43] dark:text-[#d4af37] text-sm font-bold hover:underline mt-2 inline-block"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            checkoutItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center group">
                <div className="relative">
                  <div className="w-20 h-20 bg-white dark:bg-black rounded-2xl flex items-center justify-center p-2 shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.title}
                      className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#a97d43] dark:bg-[#d4af37] text-white dark:text-zinc-950 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-50 dark:border-zinc-900">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.brand}
                  </p>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* COUPON INPUT */}
      <div className="mt-6 stagger-in">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 block">
          Promo Code
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div>
                <span className="font-bold text-green-700 dark:text-green-300 block text-sm">
                  {appliedCoupon}
                </span>
                <span className="text-xs text-green-600 dark:text-green-400">
                  Coupon Applied
                </span>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded-full text-green-600 dark:text-green-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#a97d43] dark:focus:ring-[#d4af37] uppercase placeholder:normal-case"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon}
              className="h-12 px-6 bg-[#a97d43] hover:bg-[#c59b62] text-white dark:text-zinc-950 font-bold text-sm rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center min-w-[100px] shadow-lg shadow-[#a97d43]/10"
            >
              {isApplyingCoupon ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          </div>
        )}
        {couponError && (
          <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
            {couponError}
          </p>
        )}
      </div>

      <div className="mt-12 space-y-4 pt-8 border-t border-slate-200 dark:border-zinc-800 stagger-in">
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs italic bg-[#a97d43]/10 dark:bg-[#d4af37]/10 px-3 py-1.5 rounded-lg border border-[#a97d43]/20 dark:border-[#d4af37]/20 text-[#a97d43] dark:text-[#d4af37] w-full text-center">
            Standard delivery charges will be added based on your location.
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400 font-medium animate-in fade-in slide-in-from-right-4">
            <span>Discount ({appliedCoupon})</span>
            <span>- {formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between items-end pt-4">
          <span className="text-lg font-medium text-slate-900 dark:text-white">
            Total
          </span>
          <div className="text-right">
            <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
              LKR
            </span>
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
