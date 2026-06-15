"use client";

import React, { useState } from "react";
import { Menu, X, LogOut, User, Package, MapPin } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  profile: User,
  orders: Package,
  addresses: MapPin,
};

export function MobileNavToggle({ navItems, activeTab, logoUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors lg:hidden"
      >
        <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
      </button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-zinc-900 z-60 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform-gpu lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-6 mb-4">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-12 w-auto object-contain rounded-lg"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = ICON_MAP[item.id];
            return (
              <a
                key={item.id}
                href={`/account?tab=${item.id}`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
                  isActive
                    ? "bg-[#a97d43] text-white dark:bg-[#d4af37] dark:text-[#130f0d] shadow-lg shadow-[#a97d43]/20 dark:shadow-[#d4af37]/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2d2520] hover:text-slate-900 dark:hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive
                      ? "text-white"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white",
                  )}
                />
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-4 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors w-full p-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>

          {/* Bottom Space for BottomNav */}
          <div className="h-20 lg:hidden" />
        </div>
      </div>
    </div>
  );
}
