import React from "react";
import Link from "next/link";
import {
  Facebook, Instagram, Twitter, Youtube, Linkedin, MessageCircle, Music,
  MapPin, Phone, Mail, Heart, ArrowUpRight, ChevronRight
} from "lucide-react";

// ── STATIC DATA ────────────────────────────────────────────────────────────────

const NAV_COLUMNS = [
  {
    title: "For Couples",
    links: [
      { label: "Browse Vendors", href: "/vendors" },
      { label: "Wedding Venues", href: "/vendors?category=venues" },
      { label: "Photographers", href: "/vendors?category=photographers" },
      { label: "Makeup Artists", href: "/vendors?category=makeup" },
      { label: "Decorators", href: "/vendors?category=decorators" },
      { label: "Wedding Cars", href: "/vendors?category=cars" },
      { label: "Honeymoon Packages", href: "/vendors?category=honeymoon" },
    ],
  },
  // {
  //   title: "Planning Tools",
  //   links: [
  //     { label: "Wedding Checklist", href: "/tools/checklist" },
  //     { label: "Budget Calculator", href: "/tools/budget" },
  //     { label: "Guest List Manager", href: "/tools/guests" },
  //     { label: "Seating Planner", href: "/tools/seating" },
  //     { label: "Ideas & Inspiration", href: "/ideas" },
  //     { label: "Blog & Articles", href: "/blog" },
  //     { label: "Real Weddings", href: "/real-weddings" },
  //   ],
  // },
  {
    title: "For Vendors",
    links: [
      { label: "List Your Business", href: "/vendor-signup" },
      { label: "Advertise With Us", href: "/advertise" },
      { label: "Vendor Dashboard", href: "/vendor/dashboard" },
      { label: "Pricing Plans", href: "/pricing" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Vendor Guidelines", href: "/vendor-guidelines" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Support", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-and-conditions" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];

/*
const DISTRICTS = [
  "Colombo", "Kandy", "Galle", "Negombo", "Nuwara Eliya",
  "Jaffna", "Trincomalee", "Matara", "Kurunegala", "Anuradhapura",
  "Ratnapura", "Batticaloa",
];
*/

const SOCIALS = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Music, href: "#", label: "TikTok" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
];

// ── FOOTER COMPONENT ───────────────────────────────────────────────────────────

export default async function Footer({ initialCmsData }) {
  const year = new Date().getFullYear();

  return (
    <footer id="main-footer" className="relative w-full bg-[#022e43] text-white overflow-hidden">

      {/* ── DECORATIVE BACKGROUND ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #d4a853 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />
      {/* Gold top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4a853] to-transparent" />

      {/* ── NEWSLETTER BAND ──────────────────────────────────────────── */}
      {/* <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#d4a853] mb-2">
                Stay in the Loop
              </p>
              <h3 className="text-[1.5rem] md:text-[1.75rem] font-serif font-bold text-white leading-snug">
                Get Wedding Inspiration & Vendor Updates
              </h3>
              <p className="mt-1.5 text-[14px] text-white/55 max-w-md">
                New vendor listings, seasonal offers & real wedding stories — straight to your inbox.
              </p>
            </div>
            <form className="flex w-full md:w-auto flex-col sm:flex-row gap-3 flex-shrink-0 min-w-0 md:min-w-[420px]">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-[14px] text-white placeholder-white/40 focus:outline-none focus:border-[#d4a853] focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="bg-[#d4a853] hover:bg-[#c09240] text-[#1a0a05] font-bold text-[13px] uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors duration-200 whitespace-nowrap flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div> */}

      {/* ── MAIN FOOTER BODY ─────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* ── COL 1: BRAND ──────────────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="WedHub Logo" className="h-24 sm:h-40 w-auto brightness-0 invert" />
            </Link>

            <p className="text-[13px] text-white/90 leading-relaxed">
              Sri Lanka's Premier Luxury Wedding Marketplace. Curating the finest vendors for your unforgettable day.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[#d4a853]" />
                </div>
                <span className="text-[13px] text-white/90">252A Galle Rd, Colombo 00400</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-[#d4a853]" />
                </div>
                <span className="text-[13px] text-white/90">+94 77 289 0063</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                </div>
                <span className="text-[13px] text-white/90">+94 77 289 0063</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-[#d4a853]" />
                </div>
                <span className="text-[13px] text-white/90">info@wedhub.lk</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-[#d4a853] hover:border-[#d4a853] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── COLS 2-5: NAV LINK COLUMNS ────────────────────────────── */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-3">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4a853] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-[13px] text-white/80 hover:text-white transition-colors duration-200"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#d4a853] flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── DISTRICT QUICK LINKS (COMMENTED OUT) ──────────────────── 
        <div className="mt-12 pt-10 border-t border-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#d4a853] mb-4">
            Browse by District
          </p>
          <div className="flex flex-wrap gap-2">
            {DISTRICTS.map((district) => (
              <Link
                key={district}
                href={`/locations/${district.toLowerCase().replace(/ /g, "-")}`}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/12 text-[12px] font-medium text-white/50 hover:text-white hover:border-[#d4a853]/60 hover:bg-[#d4a853]/8 transition-all duration-200"
              >
                <MapPin className="w-3 h-3 text-[#d4a853] flex-shrink-0" />
                {district}
              </Link>
            ))}
          </div>
        </div>

        {/* ── APP DOWNLOAD BADGES (COMMENTED OUT) ──────────────────── 
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-[12px] text-white/40 font-semibold uppercase tracking-wider">Coming Soon</p>
          <div className="flex gap-3">
            {["App Store", "Google Play"].map((store) => (
              <div
                key={store}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 cursor-not-allowed opacity-50"
              >
                <div className="w-4 h-4 rounded bg-white/20" />
                <span className="text-[12px] font-semibold text-white/60">{store}</span>
              </div>
            ))}
          </div>
        </div>
        */}

      </div>

      {/* ── BOTTOM LEGAL BAR ─────────────────────────────────────────── */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/70 text-center md:text-left">
            © {year} WedHub · Sri Lanka's Premier Luxury Wedding Marketplace.
            <span className="mx-2 text-white/50">·</span>
            Developed   by{" "}
            <Link href="https://inzeedo.lk" target="_blank" className="text-white/80 hover:text-[#d4a853] transition-colors font-semibold">
              Inzeedo
            </Link>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-and-conditions" },
              { label: "Cookie Policy", href: "/cookies" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] text-white/70 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
