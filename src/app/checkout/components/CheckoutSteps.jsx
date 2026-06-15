"use client";

import React from "react";
import { Check } from "lucide-react";

export function CheckoutSteps({ step }) {
  const steps = [
    { id: 1, label: "Shipping" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Review" },
  ];

  return (
    <div className="flex items-center w-full mb-8 lg:mb-12 stagger-in">
      {steps.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div
            className={`flex items-center gap-1.5 md:gap-2 shrink-0 ${
              step >= s.id ? "opacity-100" : "opacity-50"
            }`}
          >
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-colors ${
                step >= s.id
                  ? "bg-[#a97d43] dark:bg-[#d4af37] text-white dark:text-zinc-950"
                  : "border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-600"
              }`}
            >
              {step > s.id ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : s.id}
            </div>
            <span
              className={`text-[10px] sm:text-sm font-bold uppercase tracking-wider ${
                step === s.id
                  ? "text-[#a97d43] dark:text-[#d4af37]"
                  : "text-slate-500 dark:text-zinc-500 hidden sm:block"
              }`}
            >
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`h-px flex-1 mx-2 sm:mx-4 transition-colors ${
                step > s.id ? "bg-[#a97d43] dark:bg-[#d4af37]" : "bg-slate-200 dark:bg-zinc-800"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
