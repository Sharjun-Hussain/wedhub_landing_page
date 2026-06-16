import { Suspense } from "react";
import {
  API_BASE_URL,
  fetchProducts,
  fetchBrands,
  fetchShopCMS,
} from "@/lib/api";
import { ShopContent } from "./components/ShopContent";
import { ShopSkeleton } from "./components/ShopSkeleton";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";

// Force dynamic rendering — product list changes frequently and the API
// must not be called at build time (it can timeout, crashing the build).
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Exclusive Wedding Vendor Offers in Sri Lanka | WedHub",
  description:
    "Explore exclusive deals, discounts, and custom packages from Sri Lanka's finest wedding vendors, venues, and bridal services. Plan your perfect wedding with WedHub.",
  alternates: {
    canonical: "https://wedhub.lk/shop",
  },
  openGraph: {
    title: "Exclusive Wedding Vendor Offers in Sri Lanka | WedHub",
    description:
      "Explore exclusive deals, discounts, and custom packages from Sri Lanka's finest wedding vendors, venues, and bridal services.",
    type: "website",
    url: "https://wedhub.lk/vendors",
    siteName: "WedHub",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "WedHub Offers",
      },
    ],
    locale: "en_LK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exclusive Wedding Vendor Offers in Sri Lanka | WedHub",
    description:
      "Explore exclusive deals, discounts, and custom packages from Sri Lanka's finest wedding vendors.",
    images: ["/logo.png"],
  },
};

const fetchCategoriesServer = async () => {
  const url = `${API_BASE_URL}/public/categories`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { data: [] };
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch categories on server:", error);
    return { data: [] };
  }
};

export default async function ShopPage({ searchParams }) {
  // Extract parameters for API and skeleton
  const params = await searchParams;
  const viewMode = params?.view || "grid";

  // Format parameters for the API call
  const apiParams = {
    category: params.category || "All",
    q: params.q || "",
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sort: params.sort,
    brands: params.brands ? params.brands.split(",") : [],
    conditions: params.conditions ? params.conditions.split(",") : [],
    is_offer: params.offers === "true" ? 1 : undefined,
    is_new_arrival: params.newArrivals === "true" ? 1 : undefined,
    page: params.page || 1,
    per_page: 24, // Increased from 8 to reduce pagination frequency, but optimized for server
  };

  // Fetch products, categories, and brands server-side.
  const [productsData, categoriesData, brandsData, shopCmsData] =
    await Promise.all([
      fetchProducts(apiParams).catch(() => null),
      fetchCategoriesServer(),
      fetchBrands().catch(() => null),
      fetchShopCMS().catch(() => null),
    ]);

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#130f0d] transition-colors duration-300">
      <Header />
      <Suspense fallback={<ShopSkeleton viewMode={viewMode} />}>
        <ShopContent
          initialProducts={productsData}
          initialCategories={categoriesData}
          initialBrands={brandsData}
          initialCmsData={shopCmsData}
        />
      </Suspense>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
