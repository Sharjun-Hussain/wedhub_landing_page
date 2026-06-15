"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  User,
  Package,
  LogOut,
  ShoppingBag,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { useStore } from "@/States/Store";
import { cn } from "@/lib/utils";

export function NavActions({
  session,
  sessionInvalid,
  setIsMobileMenuOpen,
  toggleCart,
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { state, dispatch } = useStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger signOut if server-side validation failed
  React.useEffect(() => {
    if (sessionInvalid) {
      console.warn("Session invalid detected, signing out...");
      signOut({ redirect: false }).then(() => {
        // Optional: refresh or redirect
        window.location.href = "/login";
      });
    }
  }, [sessionInvalid]);

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        {mounted &&
          (resolvedTheme === "dark" ? (
            <Sun className="w-4.5 h-4.5" />
          ) : (
            <Moon className="w-4.5 h-4.5" />
          ))}
      </button>

      {/* User Profile Dropdown */}
      {session && !sessionInvalid ? (
        <div
          className="relative hidden lg:block"
          onMouseEnter={() => setIsUserMenuOpen(true)}
          onMouseLeave={() => setIsUserMenuOpen(false)}
        >
          <button className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:border-[#a97d43] dark:hover:border-[#d4af37] transition-colors bg-[#a97d43] dark:bg-[#d4af37] flex items-center justify-center">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-black text-white dark:text-zinc-950 tracking-tighter">
                {getInitials(session.user?.name)}
              </span>
            )}
          </button>
          <div
            className={cn(
              "absolute top-full right-0 pt-4 w-56 transition-all duration-300 transform origin-top-right",
              isUserMenuOpen
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-95 invisible pointer-events-none",
            )}
          >
            <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-2 space-y-1">
              <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                  {session.user?.name}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {session.user?.email}
                </p>
              </div>
              <Link
                href="/account?tab=profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link
                href="/account?tab=orders"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition-colors"
              >
                <Package className="w-4 h-4" /> Orders
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href="/login"
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
        >
          Login
        </Link>
      )}

      {/* Cart - Hidden on mobile, handled by BottomNav */}
      <button
        onClick={toggleCart}
        className="relative hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors group"
      >
        <ShoppingBag className="w-4.5 h-4.5 text-zinc-900 dark:text-white" />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#a97d43] dark:bg-[#d4af37] rounded-full flex items-center justify-center text-[10px] font-black text-white dark:text-zinc-950 border-2 border-white dark:border-zinc-950">
            {totalItems}
          </span>
        )}
      </button>

      {/* Mobile Toggle - Hidden as we use BottomNav now */}
      {/* <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden text-zinc-900 dark:text-white hover:opacity-70 transition-opacity"
      >
        <Menu className="w-6 h-6" />
      </button> */}
    </div>
  );
}
