import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchCategories, API_BASE_URL } from "@/lib/api";
import { HeaderClient } from "./HeaderClient";

// Helper for server-side CMS fetch if not passed as prop
const fetchHeaderCmsServer = async () => {
  const url = `${API_BASE_URL}/public/cms/home`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch header cms data on server:", error);
    return null;
  }
};

export async function Header({ initialCmsData }) {
  // 1. Fetch Session on Server
  let session = await getServerSession(authOptions);
  let sessionInvalid = false;

  // 1.1 Validate Session with Backend
  if (session?.accessToken) {
    try {
      const { fetchMe } = await import("@/lib/api");
      const meRes = await fetchMe(session.accessToken);
      if (!meRes || !meRes.success) {
        session = null;
        sessionInvalid = true;
      }
    } catch (error) {
      console.error("Server-side session validation failed:", error);
      if (error.status === 401) {
        session = null;
        sessionInvalid = true;
      }
    }
  }

  // 2. Fetch Categories on Server
  let categoriesResponse = null;
  try {
    categoriesResponse = await fetchCategories();
  } catch (e) {
    console.error("Failed to fetch categories in Header:", e);
  }

  // 3. Fetch CMS data if not provided
  let cmsDataRaw = initialCmsData;
  if (!cmsDataRaw) {
    cmsDataRaw = await fetchHeaderCmsServer();
  }

  // 4. Process Categories
  const apiCategories = categoriesResponse?.data || [];
  const displayCategories = apiCategories.slice(0, 4);
  const hasMoreCategories = apiCategories.length > 4;

  // 5. Process CMS Data (defaults + mapping for WedHub)
  const defaults = {
    navLinks: [
      { label: "HOME", href: "/" },
      { label: "ABOUT US", href: "/about" },
      { label: "VENDORS", href: "/vendors" /*, hasMega: "vendors" */ },
      { label: "CATEGORIES", href: "/categories", hasMega: "categories" },
      { label: "VENUES", href: "/vendors?category=venues", hasMega: "venues" },
      { label: "CONTACT", href: "/contact" },
    ],
    categories: [
      {
        label: "Wedding Venues",
        href: "/vendors?category=venues",
        icon: "venue",
        sub: ["Banquet Halls", "Beach Venues", "Garden Venues", "Hotel Venues", "Temple Venues"],
      },
      {
        label: "Photographers",
        href: "/vendors?category=photographers",
        icon: "camera",
        sub: ["Wedding Photography", "Pre-shoot", "Album Design", "Cinematography"],
      },
      {
        label: "Makeup Artists",
        href: "/vendors?category=makeup",
        icon: "makeup",
        sub: ["Bridal Makeup", "Hair Styling", "Nail Art", "Mehendi"],
      },
      {
        label: "Decorators",
        href: "/vendors?category=decorators",
        icon: "decor",
        sub: ["Floral Decor", "Stage Decor", "Aisle Decor", "Lighting"],
      },
      {
        label: "Caterers",
        href: "/vendors?category=caterers",
        icon: "food",
        sub: ["Sri Lankan Cuisine", "Indian Cuisine", "Western Cuisine", "Desserts"],
      },
      {
        label: "Wedding Cars",
        href: "/vendors?category=cars",
        icon: "car",
        sub: ["Luxury Cars", "Vintage Cars", "SUVs", "Decorated Vans"],
      },
      {
        label: "Jewelry",
        href: "/vendors?category=jewelry",
        icon: "jewelry",
        sub: ["Bridal Sets", "Gold Jewelry", "Gem Sets", "Custom Orders"],
      },
      {
        label: "Honeymoon",
        href: "/vendors?category=honeymoon",
        icon: "honeymoon",
        sub: ["Beach Resorts", "Hill Country", "City Hotels", "Travel Packages"],
      },
    ],
    vendorMegaLinks: [
      { label: "Featured Vendors", href: "/vendors?filter=featured" },
      { label: "Top Rated", href: "/vendors?filter=top-rated" },
      { label: "New Listings", href: "/vendors?filter=new" },
      { label: "Elite Vendors", href: "/vendors?filter=elite" },
    ],
    locationMegaLinks: [
      { label: "Colombo", href: "/locations/colombo" },
      { label: "Kandy", href: "/locations/kandy" },
      { label: "Galle", href: "/locations/galle" },
      { label: "Negombo", href: "/locations/negombo" },
      { label: "Nuwara Eliya", href: "/locations/nuwara-eliya" },
      { label: "Jaffna", href: "/locations/jaffna" },
      { label: "Trincomalee", href: "/locations/trincomalee" },
      { label: "Matara", href: "/locations/matara" },
    ],
    promo1: {
      title: "Find Your Dream Venue",
      subtitle: "Browse the finest venues across Sri Lanka.",
      badge: "FEATURED",
      link: "/venues",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      theme: "light",
    },
    promo2: {
      title: "Top Photographers",
      subtitle: "Capture every moment beautifully.",
      link: "/vendors?category=photographers",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
      theme: "dark",
    },
  };

  const cmsData = (() => {
    if (!cmsDataRaw?.data) return defaults;
    const cms = cmsDataRaw.data;
    const newData = { ...defaults };

    const links = [];
    for (let i = 1; i <= 4; i++) {
      const link = cms[`header_nav_link_${i}`];
      if (link) links.push(link);
    }
    if (links.length > 0) {
      newData.navLinks = [
        links[0],
        { label: "ABOUT US", href: "/about" },
        ...links.slice(1),
        { label: "CONTACT", href: "/contact" }
      ];
    }

    const cats = [];
    for (let i = 1; i <= 4; i++) {
      const cat = cms[`header_category_${i}`];
      if (cat) cats.push(cat);
    }
    if (cats.length > 0) newData.categories = cats;

    if (cms.header_promo1)
      newData.promo1 = { ...defaults.promo1, ...cms.header_promo1 };
    if (cms.header_promo2)
      newData.promo2 = { ...defaults.promo2, ...cms.header_promo2 };

    return newData;
  })();

  return (
    <Suspense fallback={null}>
      <HeaderClient
        session={session}
        sessionInvalid={sessionInvalid}
        cmsData={cmsData}
        displayCategories={displayCategories}
        hasMoreCategories={hasMoreCategories}
      />
    </Suspense>
  );
}

export default Header;
