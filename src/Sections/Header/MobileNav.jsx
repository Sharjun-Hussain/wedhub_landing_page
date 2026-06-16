"use client";

import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import {
  X,
  Search,
  ArrowRight,
  LogOut,
  User,
  Heart,
  MessageSquare,
  CalendarHeart,
  Sparkles,
  Camera,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { getCategoryIcon } from "./HeaderIcons";
import { cn } from "@/lib/utils";

const sanitizeSearchQuery = (query) => {
  if (typeof query !== "string") return "";

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

  let clean = decoded.replace(/[<>]/g, "");
  clean = clean.replace(/(javascript|data|vbscript)\s*:/gi, "");
  clean = clean.replace(/\b(alert|prompt|confirm|eval|onload|onerror|onclick|onmouseover)\b/gi, "");

  if (clean.length > 100) {
    clean = clean.slice(0, 100);
  }
  return clean;
};

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

const QUICK_LINKS = [
  { label: "Planning Tools", href: "/planning", icon: CalendarHeart },
  { label: "Inspiration",    href: "/inspiration", icon: Sparkles },
  { label: "Real Weddings",  href: "/real-weddings", icon: Camera },
];

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

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

export function MobileNav({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  displayCategories,
  cmsData,
  hasMoreCategories,
  session,
}) {
  useEffect(() => {
    if (document.getElementById("__mn-kf")) return;
    const s = document.createElement("style");
    s.id = "__mn-kf";
    s.textContent = KEYFRAME_CSS;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const close = useCallback(
    () => setIsMobileMenuOpen(false),
    [setIsMobileMenuOpen]
  );

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [close]);

  const cats = (
    displayCategories.length > 0 ? displayCategories : cmsData.categories
  ).map((c) => ({
    key:     c.id    ?? c.label,
    label:   c.name  ?? c.label,
    href:    c.href  ?? `/vendors?category=${encodeURIComponent(c.name)}`,
    iconKey: c.slug  ?? c.icon,
  }));

  const tapStyle = { WebkitTapHighlightColor: "transparent" };

  return (
    <>
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

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-y-0 left-0 z-[80] w-[85vw] max-w-[340px]",
          "flex flex-col",
          "bg-[#fdf8f0]",
          "border-r border-[#ede2cc]",
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
          <Link href="/" onClick={close} className="flex items-center">
            <img src="/logo.png" alt="WedHub Logo" className="h-8 w-auto" />
          </Link>

          <button
            onClick={close}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#ede2cc]/70 text-[#2C1A0E] hover:bg-[#8B1A2D] hover:text-white transition-colors duration-150"
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
                window.location.href = `/vendors?q=${encodeURIComponent(clean)}`;
              }
            }}
            className="relative"
          >
            <input
              type="text"
              name="search"
              placeholder="Search vendors, venues..."
              className="w-full h-11 rounded-xl pl-4 pr-11 text-sm font-medium bg-white border border-[#ede2cc] text-[#2C1A0E] placeholder-zinc-400 outline-none focus:border-[#d4a853] transition-colors duration-200 shadow-sm"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#8B1A2D] text-white flex items-center justify-center active:scale-95 transition-transform duration-150"
              style={tapStyle}
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ── Group 3: Scroll body ─── */}
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
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#d4a853] mb-2.5">
              Wedding Categories
            </p>
            <ul className="space-y-2">
              {cats.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={cat.href}
                    onClick={close}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl bg-white border border-[#ede2cc]/70 active:scale-[0.98] active:bg-rose-50 transition-transform duration-100"
                    style={tapStyle}
                  >
                    <span className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#8B1A2D]">
                        {getCategoryIcon(cat.iconKey, "w-[18px] h-[18px]")}
                      </span>
                    </span>
                    <span className="flex-1 text-[15px] font-bold text-[#2C1A0E] leading-none">
                      {cat.label}
                    </span>
                    <ChevronRight className="w-[18px] h-[18px] text-zinc-300 flex-shrink-0" />
                  </Link>
                </li>
              ))}

              {hasMoreCategories && (
                <li>
                  <Link
                    href="/vendors"
                    onClick={close}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl border border-dashed border-[#d4a853]/40 active:bg-rose-50 transition-colors duration-100"
                    style={tapStyle}
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-[18px] h-[18px] text-[#d4a853]" />
                    </span>
                    <span className="flex-1 text-[15px] font-bold text-[#d4a853] leading-none">
                      Browse All Vendors
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </section>

          <div className="h-px bg-[#ede2cc]" />

          {/* Quick links */}
          <section>
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2.5">
              Quick Links
            </p>
            <ul className="space-y-1">
              {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={close}
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[15px] font-semibold text-zinc-600 active:bg-white transition-colors duration-100"
                    style={tapStyle}
                  >
                    <Icon className="w-[18px] h-[18px] text-[#d4a853] flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Browse / CMS nav links */}
          {cmsData.navLinks?.length > 0 && (
            <>
              <div className="h-px bg-[#ede2cc]" />
              <section>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2.5">
                  Explore
                </p>
                <nav className="flex flex-col gap-1">
                  {cmsData.navLinks.map((link) => {
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={close}
                        className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-[15px] font-bold text-[#2C1A0E] active:bg-white transition-colors duration-100 tracking-wide"
                        style={tapStyle}
                      >
                        {link.label}
                        <ChevronRight className="w-[18px] h-[18px] text-zinc-300 flex-shrink-0" />
                      </Link>
                    );
                  })}
                </nav>
              </section>
            </>
          )}
        </div>

        {/* ── Group 4: User section ───────────────────────────────── */}
        <div
          className="shrink-0 border-t border-[#ede2cc] bg-white px-5 pt-4 pb-5"
          style={ga(isMobileMenuOpen, 210, "up")}
        >
          {session ? (
            <div className="space-y-2.5">
              {/* User card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fdf8f0] border border-[#ede2cc]/60">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#d4a853]/30 flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ring-2 ring-[#d4a853]/30"
                    style={{ background: "linear-gradient(135deg,#8B1A2D 0%,#d4a853 100%)" }}
                  >
                    <span className="text-sm font-black text-white tracking-wider">
                      {getInitials(session.user?.name)}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#2C1A0E] truncate leading-none mb-0.5">
                    {session.user?.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/account?tab=planning"
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#fdf8f0] border border-[#ede2cc] text-xs font-bold text-[#2C1A0E] active:scale-[0.97] transition-transform duration-100"
                  style={tapStyle}
                >
                  <Heart className="w-3.5 h-3.5 text-[#8B1A2D]" />
                  Saved
                </Link>
                <Link
                  href="/account?tab=messages"
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#fdf8f0] border border-[#ede2cc] text-xs font-bold text-[#2C1A0E] active:scale-[0.97] transition-transform duration-100"
                  style={tapStyle}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#8B1A2D]" />
                  Messages
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/account?tab=profile"
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#fdf8f0] border border-[#ede2cc] text-xs font-bold text-[#2C1A0E] active:scale-[0.97] transition-transform duration-100"
                  style={tapStyle}
                >
                  <User className="w-3.5 h-3.5 text-[#d4a853]" />
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-rose-50 border border-rose-100 text-xs font-bold text-red-600 active:scale-[0.98] transition-transform duration-100"
                  style={tapStyle}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl text-sm font-bold text-white tracking-wide active:scale-[0.98] transition-transform duration-100 shadow-md shadow-[#8B1A2D]/20"
                style={{
                  ...tapStyle,
                  background:  "linear-gradient(135deg,#8B1A2D 0%,#a9293e 100%)",
                }}
              >
                Login / Sign Up
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[11px] text-zinc-500">
                Join our premium vendor network
              </p>
            </div>
          )}

          <div style={{ height: "max(12px, env(safe-area-inset-bottom))" }} />
        </div>

      </div>
    </>
  );
}
