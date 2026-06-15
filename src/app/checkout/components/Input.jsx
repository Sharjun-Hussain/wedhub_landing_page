"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function Input({
  label,
  className,
  icon: Icon,
  rightIcon: RightIcon,
  isLoading,
  ...props
}) {
  return (
    <div className="space-y-2 w-full relative">
      {label && (
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-[#a97d43] dark:group-focus-within:text-[#d4af37] transition-colors pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`flex h-12 w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a97d43] dark:focus-visible:ring-[#d4af37] focus-visible:border-transparent transition-all duration-200 ${
            Icon ? "pl-12" : ""
          } ${className}`}
          {...props}
        />

        {/* Right Icon Logic */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#a97d43] dark:text-[#d4af37]" />
          ) : (
            RightIcon && <RightIcon className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
}
