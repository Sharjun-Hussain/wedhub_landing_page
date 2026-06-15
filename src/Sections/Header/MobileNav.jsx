"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Search,
  ArrowRight,
  LogOut,
  User,
  Package,
  ShoppingBag,
  Tag,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { getCategoryIcon } from "./HeaderIcons";
import { cn } from "@/lib/utils";

const sanitizeSearchQuery = (query) => {
  if (typeof query !== "string") return "";

  // 1. Decode recursively to catch double-encoded or multiple-encoded payloads
  let decoded = query;
  let prev = "";
  let depth = 0;
  while (decoded !== prev && decoded.includes("%") && depth < 5) {
    prev = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch (e) {
      break;
    }
    depth++;
  }

  // 2. Remove angle brackets to prevent HTML/XML/SVG tag insertion
  let clean = decoded.replace(/[<>]/g, "");

  // 3. Remove javascript:, data:, vbscript: protocols and common XSS vectors case-insensitively
  clean = clean.replace(/(javascript|data|vbscript)\s*:/gi, "");
  clean = clean.replace(/\b(alert|prompt|confirm|eval|onload|onerror|onclick|onmouseover)\b/gi, "");

  // 4. Limit length
  if (clean.length > 100) {
    clean = clean.slice(0, 100);
  }
  return clean;
};

/* ─────────────────────────────────────────────────────────────────
   Keyframes — only transform + opacity (compositor-thread only).
   Injected once into <head>, never causes reflow/repaint.
───────────────────────────────────────────────────────────────── */
const KEYFRAME_CSS = `
  @keyframes _mnSlideLeft {
    from { opacity: 0; transform: translate3d(-14px,0,0); }
    to   { opacity: 1; transform: translate3d(0,0,0); }
  }
  @keyframes _mnFadeUp {
    from { opacity: 0; transform: translate3d(0,8px,0); }
    to   { opacity: 1; transform: translate3d(0,0,0); }
  }
  @keyframes _mnFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

/*
  Performance strategy for low-end devices
  ─────────────────────────────────────────
  • NO backdrop blur (most expensive GPU op on mobile)
  • Only 4 animation targets total (not per-item)
    — top-bar, search, scroll-body, bottom-section
  • willChange ONLY on the panel element (one GPU layer)
  • All animations: transform + opacity ONLY
  • Shorter durations: panel 280ms, content 300ms
  • overscroll-behavior: contain → prevents scroll chaining
  • WebkitTapHighlightColor: transparent → removes grey flash
  • contain: strict on the panel → zero layout bleed
*/

const QUICK_LINKS = [
  { label: "New Arrivals",      href: "/shop?filter=new", icon: Sparkles   },
  { label: "Exclusive Offers",  href: "/offers",          icon: Tag        },
  { label: "Shop All Products", href: "/shop",            icon: ShoppingBag},
];

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

/* Tiny helper – returns inline animation style for ONE group */
function ga(isOpen, delay, type = "left") {
  if (!isOpen)
    return { opacity: 0, animation: "none" };
  const name =
    type === "up"   ? "_mnFadeUp"    :
    type === "fade" ? "_mnFade"      :
                      "_mnSlideLeft" ;
  return {
    animation: `${name} 0.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
  };
}

/* ══════════════════════════════════════════════════════════════════ */
export function MobileNav({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  displayCategories,
  cmsData,
  hasMoreCategories,
  session,
}) {
  /* Inject keyframes once */
  useEffect(() => {
    if (document.getElementById("__mn-kf")) return;
    const s = document.createElement("style");
    s.id = "__mn-kf";
    s.textContent = KEYFRAME_CSS;
    document.head.appendChild(s);
  }, []);

  /* Body-scroll lock */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const close = useCallback(
    () => setIsMobileMenuOpen(false),
    [setIsMobileMenuOpen]
  );

  /* Escape key */
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [close]);

  /* Flatten categories */
  const cats = (
    displayCategories.length > 0 ? displayCategories : cmsData.categories
  ).map((c) => ({
    key:     c.id    ?? c.label,
    label:   c.name  ?? c.label,
    href:    c.href  ?? `/shop?category=${encodeURIComponent(c.name)}`,
    iconKey: c.slug  ?? c.icon,
  }));

  const tapStyle = { WebkitTapHighlightColor: "transparent" };

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────
          NO blur — blur is the single biggest GPU cost on low-end.
          Simple opacity transition on a solid overlay is free.
      ─────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-[70] bg-black/60 transition-opacity duration-300",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── Drawer ───────────────────────────────────────────────────
          willChange ONLY here — one GPU layer for the whole panel.
          contain: strict → browser skips layout/paint outside it.
      ─────────────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-y-0 left-0 z-[80] w-[85vw] max-w-[340px]",
          "flex flex-col",
          "bg-[#faf9f6] dark:bg-[#0f0e0c]",
          "border-r border-[#e7e3d9] dark:border-[#27211d]",
          "shadow-xl lg:hidden"
        )}
        style={{
          transform:  isMobileMenuOpen ? "translate3d(0,0,0)" : "translate3d(-100%,0,0)",
          transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
          willChange: "transform",
          contain:    "strict",
        }}
      >

        {/* ── Group 1: Brand bar ──────────────────────────────────── */}
        <div
          className="shrink-0 flex items-center justify-between px-5 pt-5 pb-4"
          style={ga(isMobileMenuOpen, 80, "left")}
        >
          <Link href="/" onClick={close}>
            <Image 
              src="/logo.png" 
              alt="Foreign Emporium" 
              width={140}
              height={36}
              priority
              className="h-9 w-auto object-contain" 
            />
          </Link>

          <button
            onClick={close}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e7e3d9]/70 dark:bg-[#27211d]/70 text-[#2c2520] dark:text-zinc-300 hover:bg-[#0a382c] hover:text-white dark:hover:bg-[#d4af37] dark:hover:text-zinc-950 transition-colors duration-150"
            style={tapStyle}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Group 2: Search ─────────────────────────────────────── */}
        <div
          className="shrink-0 px-5 pb-4"
          style={ga(isMobileMenuOpen, 130, "left")}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const raw = e.currentTarget.search.value.trim();
              const clean = sanitizeSearchQuery(raw);
              if (clean) {
                close();
                window.location.href = `/shop?q=${encodeURIComponent(clean)}`;
              }
            }}
            className="relative"
          >
            <input
              type="text"
              name="search"
              placeholder="Search products…"
              className="w-full h-11 rounded-xl pl-4 pr-11 text-sm font-medium bg-white dark:bg-[#1a1714] border border-[#e7e3d9] dark:border-[#27211d] text-[#2c2520] dark:text-white placeholder-zinc-400 outline-none focus:border-[#a97d43] dark:focus:border-[#d4af37] transition-colors duration-200 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 flex items-center justify-center active:scale-95 transition-transform duration-150"
              style={tapStyle}
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ── Group 3: Scroll body (ONE animation for all content) ─── */}
        <div
          className="flex-1 overflow-y-auto px-5 space-y-5 pb-4"
          style={{
            ...ga(isMobileMenuOpen, 170, "up"),
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Categories */}
          <section>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#a97d43] dark:text-[#d4af37] mb-2.5">
              Shop by Category
            </p>
            <ul className="space-y-2">
              {cats.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={cat.href}
                    onClick={close}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl bg-white dark:bg-[#1a1714] border border-[#e7e3d9]/70 dark:border-[#27211d]/70 active:scale-[0.98] active:bg-[#f0ebe0] dark:active:bg-[#27211d] transition-transform duration-100"
                    style={tapStyle}
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#faf6ee] dark:bg-[#27211d] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#a97d43] dark:text-[#d4af37]">
                        {getCategoryIcon(cat.iconKey, "w-[18px] h-[18px]")}
                      </span>
                    </span>
                    <span className="flex-1 text-[15px] font-bold text-[#2c2520] dark:text-white leading-none">
                      {cat.label}
                    </span>
                    <ChevronRight className="w-[18px] h-[18px] text-zinc-300 dark:text-zinc-700 flex-shrink-0" />
                  </Link>
                </li>
              ))}

              {hasMoreCategories && (
                <li>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl border border-dashed border-[#a97d43]/30 dark:border-[#d4af37]/20 active:bg-[#faf6ee] dark:active:bg-[#d4af37]/5 transition-colors duration-100"
                    style={tapStyle}
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#a97d43]/8 dark:bg-[#d4af37]/8 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-[18px] h-[18px] text-[#a97d43] dark:text-[#d4af37]" />
                    </span>
                    <span className="flex-1 text-[15px] font-bold text-[#a97d43] dark:text-[#d4af37] leading-none">
                      View All Categories
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </section>

          <div className="h-px bg-[#e7e3d9] dark:bg-[#27211d]" />

          {/* Quick links */}
          <section>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-2.5">
              Quick Links
            </p>
            <ul className="space-y-1">
              {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={close}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[15px] font-semibold text-zinc-600 dark:text-zinc-400 active:bg-white dark:active:bg-[#1a1714] transition-colors duration-100"
                    style={tapStyle}
                  >
                    <Icon className="w-[18px] h-[18px] text-[#a97d43] dark:text-[#d4af37] flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Browse / CMS nav links */}
          {cmsData.navLinks?.length > 0 && (
            <>
              <div className="h-px bg-[#e7e3d9] dark:bg-[#27211d]" />
              <section>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-2.5">
                  Browse
                </p>
                <nav className="flex flex-col gap-1">
                  {cmsData.navLinks.map((link) => {
                    const isOffers = link.label.toLowerCase().includes("offer");
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={close}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-[15px] font-bold active:bg-white dark:active:bg-[#1a1714] transition-colors duration-100 tracking-wide ${
                          isOffers ? "text-[#a97d43] dark:text-[#d4af37]" : "text-[#2c2520] dark:text-white/80"
                        }`}
                        style={tapStyle}
                      >
                        {link.label}
                        <ChevronRight className={`w-[18px] h-[18px] flex-shrink-0 ${isOffers ? "text-[#a97d43] dark:text-[#d4af37]" : "text-zinc-300 dark:text-zinc-700"}`} />
                      </Link>
                    );
                  })}
                  
                  {/* Fallback if Offers isn't in CMS navLinks */}
                  {!cmsData.navLinks?.some((link) => link.label.toLowerCase().includes("offer")) && (
                    <Link
                      href="/offers"
                      onClick={close}
                      className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-[15px] font-bold text-[#a97d43] dark:text-[#d4af37] active:bg-white dark:active:bg-[#1a1714] transition-colors duration-100 tracking-wide"
                      style={tapStyle}
                    >
                      OFFERS
                      <ChevronRight className="w-[18px] h-[18px] text-[#a97d43] dark:text-[#d4af37] flex-shrink-0" />
                    </Link>
                  )}
                </nav>
              </section>
            </>
          )}
        </div>

        {/* ── Group 4: User section ───────────────────────────────── */}
        <div
          className="shrink-0 border-t border-[#e7e3d9] dark:border-[#27211d] bg-white dark:bg-[#0f0e0c] px-5 pt-4 pb-5"
          style={ga(isMobileMenuOpen, 210, "up")}
        >
          {session ? (
            <div className="space-y-2.5">
              {/* User card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf6ee] dark:bg-[#1a1714] border border-[#e7e3d9]/60 dark:border-[#27211d]/60">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#a97d43]/20 flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ring-2 ring-[#a97d43]/20"
                    style={{ background: "linear-gradient(135deg,#a97d43 0%,#d4af37 100%)" }}
                  >
                    <span className="text-sm font-black text-white tracking-wider">
                      {getInitials(session.user?.name)}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#2c2520] dark:text-white truncate leading-none mb-0.5">
                    {session.user?.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/account?tab=profile"
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#faf6ee] dark:bg-[#1a1714] border border-[#e7e3d9] dark:border-[#27211d] text-xs font-bold text-[#2c2520] dark:text-white active:scale-[0.97] transition-transform duration-100"
                  style={tapStyle}
                >
                  <User className="w-3.5 h-3.5 text-[#a97d43] dark:text-[#d4af37]" />
                  Profile
                </Link>
                <Link
                  href="/account?tab=orders"
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#faf6ee] dark:bg-[#1a1714] border border-[#e7e3d9] dark:border-[#27211d] text-xs font-bold text-[#2c2520] dark:text-white active:scale-[0.97] transition-transform duration-100"
                  style={tapStyle}
                >
                  <Package className="w-3.5 h-3.5 text-[#a97d43] dark:text-[#d4af37]" />
                  Orders
                </Link>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-100 dark:border-red-900/20 text-xs font-bold text-red-600 dark:text-red-400 active:scale-[0.98] transition-transform duration-100"
                style={tapStyle}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl text-sm font-bold text-white tracking-wide active:scale-[0.98] transition-transform duration-100"
                style={{
                  ...tapStyle,
                  background:  "linear-gradient(135deg,#0a382c 0%,#104e3e 100%)",
                  boxShadow:   "0 4px 12px rgba(10,56,44,0.22)",
                }}
              >
                Login / Sign Up
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
                Exclusive deals &amp; order tracking
              </p>
            </div>
          )}

          {/* iOS safe-area */}
          <div style={{ height: "max(12px, env(safe-area-inset-bottom))" }} />
        </div>

      </div>
    </>
  );
}
