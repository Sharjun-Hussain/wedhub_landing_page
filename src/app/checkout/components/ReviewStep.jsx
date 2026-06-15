"use client";

import React from "react";
import { Truck, Banknote, Loader2, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function ReviewStep({ data, onBack, onSubmit, total, isExpired }) {
  return (
    <div className="space-y-6 animate-step">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Review Order
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Double check your details before confirming.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37]" />{" "}
              Delivering To
            </h3>
            <button
              onClick={() => onBack(1)}
              className="text-xs font-bold text-[#a97d43] dark:text-[#d4af37] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">
            {data.fullName || "Guest User"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data.address || "No Address"}
          </p>
          {data.address2 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {data.address2}
            </p>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data.city} {data.zip ? `, ${data.zip}` : ""}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data.district} {data.province}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {data.phone}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Banknote className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37]" />{" "}
              Total Amount
            </h3>
            <button
              onClick={() => onBack(2)}
              className="text-xs font-bold text-[#a97d43] dark:text-[#d4af37] hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[#a97d43] dark:text-[#d4af37] text-[10px] uppercase font-bold tracking-tight bg-[#a97d43]/10 dark:bg-[#d4af37]/10 px-2 py-1 rounded-lg border border-[#a97d43]/20 dark:border-[#d4af37]/20">
              Standard Delivery Charges Extra
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => onBack()}
          className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 font-bold h-14 rounded-2xl flex items-center justify-center transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isExpired || data.isSubmitting}
          className={`flex-2 bg-[#a97d43] hover:bg-[#c59b62] text-white dark:text-zinc-950 font-bold h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#a97d43]/10 active:scale-[0.98] group ${isExpired || data.isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {data.isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Processing...
            </>
          ) : (
            <>
              Confirm Order <Check className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
