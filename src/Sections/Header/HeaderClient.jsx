"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Globe, Heart, User, LogOut, MessageSquare, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { NavMegaMenu } from "./MegaMenu";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function HeaderClient({
  session,
  sessionInvalid,
  cmsData,
  displayCategories,
  hasMoreCategories,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null); // "vendors" | "categories" | "locations" | null
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const megaTimeoutRef = useRef(null);
  const headerRef = useRef(null);

  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu on route change
  useEffect(() => { setActiveMega(null); }, [pathname]);

  const openMega = useCallback((key) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(key);
  }, []);

  const closeMega = useCallback(() => {
    megaTimeoutRef.current = setTimeout(() => setActiveMega(null), 150);
  }, []);

  const keepMegaOpen = useCallback(() => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Fixed header wrapper */}
      <div className="fixed top-0 left-0 w-full z-50" ref={headerRef}>
        {/* Top Announcement / Ads Bar */}
        <div className="w-full bg-[#1a120e]">
          <div className="mx-auto max-w-[1440px] w-full text-[#e8d9c0] py-2 px-4 text-center text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase flex flex-col sm:flex-row items-center justify-center sm:gap-2">
            <span>Exclusive Launch: Connect with premium wedding vendors across Sri Lanka.</span>
            <Link href="/register" className="text-[#d4b986] underline underline-offset-4 decoration-[#d4b986]/50 hover:text-white hover:decoration-white transition-colors mt-1 sm:mt-0">
              Join for Free
            </Link>
          </div>
        </div>

        <header
          className={cn(
            "w-full transition-all duration-300 ease-in-out bg-white",
            isScrolled
              ? "shadow-md border-b border-[#e8d9c0]"
              : "border-b border-[#f0e6d3]"
          )}
        >
          <div className="mx-auto max-w-[1440px] w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[60px] sm:h-[68px]">
            {/* LEFT: Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="shrink-0 flex items-center">
                <img src="/logo.png" alt="WedHub Logo" className="h-14 sm:h-26 w-auto" />
              </Link>

              {/* DESKTOP NAV */}
              <nav className="hidden lg:flex items-center gap-1">
                {cmsData.navLinks.map((link) => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => link.hasMega ? openMega(link.hasMega) : setActiveMega(null)}
                    onMouseLeave={link.hasMega ? closeMega : undefined}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 text-[13px] font-semibold tracking-wide transition-colors duration-200 rounded",
                        isActive(link.href)
                          ? "text-[#8B1A2D]"
                          : "text-[#4a3728] hover:text-[#8B1A2D]"
                      )}
                    >
                      {link.label}
                      {link.hasMega && (
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            activeMega === link.hasMega ? "rotate-180 text-[#8B1A2D]" : ""
                          )}
                        />
                      )}
                    </Link>
                    {/* Underline active indicator */}
                    {isActive(link.href) && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#8B1A2D] rounded-full" />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* RIGHT: Icons + CTA */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Saved/Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-[#4a3728] hover:text-[#8B1A2D] hover:bg-rose-50 transition-colors"
                aria-label="My Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Language / Globe */}
              {/* <button
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-[#4a3728] hover:text-[#8B1A2D] hover:bg-rose-50 transition-colors"
                aria-label="Language"
              >
                <Globe className="w-5 h-5" />
              </button> */}

              {/* User Auth */}
              {session && !sessionInvalid ? (
                <div
                  className="relative"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <button
                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#e8d9c0] hover:border-[#8B1A2D] transition-colors bg-[#f9f3eb] flex items-center justify-center shadow-sm"
                    aria-label="Account options"
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-[#8B1A2D]">{getInitials(session.user?.name)}</span>
                    )}
                  </button>

                  {/* Dropdown */}
                  <div className={cn(
                    "absolute top-full right-0 pt-2 w-60 transition-all duration-200 transform origin-top-right z-50",
                    isUserMenuOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"
                  )}>
                    <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-2 space-y-0.5">
                      <div className="px-4 py-3 border-b border-gray-100 mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{session.user?.email}</p>
                      </div>
                      <Link href="/account?tab=planning" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#8B1A2D] transition-colors">
                        <Heart className="w-4 h-4" /> My Vendors
                      </Link>
                      <Link href="/account?tab=messages" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#8B1A2D] transition-colors">
                        <MessageSquare className="w-4 h-4" /> Messages
                      </Link>
                      <Link href="/account?tab=profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-[#8B1A2D] transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="text-[13px] font-semibold text-[#4a3728] hover:text-[#8B1A2D] transition-colors px-3 py-2">
                    Log in
                  </Link>
                </div>
              )}

              {/* ADVERTISE CTA */}
              <Link
                href="/advertise"
                className="hidden md:flex items-center text-[12px] font-bold uppercase tracking-wider text-[#8B1A2D] border-2 border-[#8B1A2D] hover:bg-[#8B1A2D] hover:text-white transition-all duration-200 px-4 py-[7px] rounded-sm"
              >
                Advertise With Us
              </Link>

              {/* MOBILE HAMBURGER */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex w-9 h-9 items-center justify-center rounded-md text-[#4a3728] hover:bg-gray-100 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* MEGA MENU PANEL — full width below header */}
        {mounted && (
          <NavMegaMenu
            activeMega={activeMega}
            cmsData={cmsData}
            onMouseEnter={keepMegaOpen}
            onMouseLeave={closeMega}
            onClose={() => setActiveMega(null)}
          />
        )}
      </div>

      {/* MOBILE NAV */}
      <MobileNav
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        displayCategories={displayCategories}
        cmsData={cmsData}
        hasMoreCategories={hasMoreCategories}
        session={session}
      />
    </>
  );
}
