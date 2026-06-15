"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

export const AuthInput = forwardRef(
  ({ label, className, icon: Icon, type = "text", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-2 w-full relative">
        {label && (
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
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
            ref={ref}
            type={inputType}
            className={`flex h-12 w-full rounded-2xl border ${
              error
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#e7e3d9] dark:border-[#352d28] focus-visible:ring-[#a97d43] dark:focus-visible:ring-[#d4af37]"
            } bg-white dark:bg-zinc-900 px-4 py-2 text-[13px] sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent transition-all duration-200 ${
              Icon ? "pl-12" : ""
            } ${isPassword ? "pr-12" : ""} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 pl-1 animate-fade-in-up">
            {error}
          </p>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
