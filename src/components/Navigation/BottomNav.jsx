"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/States/Store";
import { motion, AnimatePresence } from "framer-motion";

const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export default function BottomNav() {
  const pathname = usePathname();
  const { state, dispatch } = useStore();

  // Hide on auth pages
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) return null;

  const cartCount =
    state.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const toggleMenu = () => dispatch({ type: "TOGGLE_MENU" });

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
      isActive: pathname === "/",
    },
    {
      id: "shop",
      label: "Shop",
      icon: Search,
      href: "/shop",
      isActive: pathname.startsWith("/shop"),
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      onClick: toggleCart,
      isActive: state.isCartOpen,
      badge: cartCount,
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      href: "/account",
      isActive: pathname.startsWith("/account"),
    },
    {
      id: "menu",
      label: "Menu",
      icon: Grid3X3,
      onClick: toggleMenu,
      isActive: state.isMenuOpen,
    },
  ];

  // Commented out the mobile bottom bar per user request
  return null;

  return (
    <div className="lg:hidden fixed bottom-6 inset-x-0 z-50 px-4">
      <nav className="max-w-md mx-auto h-16 relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[2rem] border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          const content = (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center justify-center w-14 h-12 gap-1 group"
            >
              {/* Active Background Indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-blue-600/10 dark:bg-blue-500/15 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon */}
              <div
                className={cn(
                  "relative transition-all duration-300 transform",
                  isActive
                    ? "text-blue-600 dark:text-blue-500 scale-110"
                    : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100",
                )}
              >
                <Icon
                  className={cn("w-5.5 h-5.5", isActive && "stroke-[2.5px]")}
                />

                {/* Cart Badge */}
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-4.5 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-sm">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-bold tracking-tight transition-all duration-300",
                  isActive
                    ? "text-blue-600 dark:text-blue-500 translate-y-0"
                    : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100",
                )}
              >
                {item.label}
              </span>

              {/* Dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute -bottom-1.5 w-1 h-1 bg-blue-600 dark:bg-blue-500 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
          );

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex-1 flex justify-center"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="flex-1 flex justify-center cursor-pointer"
            >
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
