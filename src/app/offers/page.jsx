import { Suspense } from "react";
import {
  API_BASE_URL,
  fetchProducts,
  fetchBrands,
  fetchShopCMS,
} from "@/lib/api";
import { OffersContent } from "./components/OffersContent";
import { ShopSkeleton } from "@/app/shop/components/ShopSkeleton";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";

// Force dynamic rendering — product list changes frequently and the API
// must not be called at build time (it can timeout, crashing the build).
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Exclusive Offers & Deals | WedHub",
  description:
    "Shop our exclusive offers and discounted premium imports. Discover luxury Arabian ouds, viral pistachio chocolates, premium Ajwa dates, roasted nuts, and Middle Eastern delicacies at unbeatable prices.",
  alternates: {
    canonical: "https://wedhub.lk/offers",
  },
  openGraph: {
    title: "Exclusive Offers & Deals | WedHub",
    description:
      "Shop our exclusive offers and discounted premium imports. Discover luxury Arabian ouds, viral pistachio chocolates, premium Ajwa dates, and more at unbeatable prices.",
    type: "website",
    url: "https://wedhub.lk/offers",
    siteName: "WedHub",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "WedHub Offers",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exclusive Offers & Deals | WedHub",
    description:
      "Shop our exclusive offers and discounted premium imports at WedHub.",
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

export default async function OffersPage({ searchParams }) {
  // Extract parameters for API and skeleton
  const params = await searchParams;
  const viewMode = params?.view || "grid";

  // Format parameters for the API call - Hardcode is_offer to 1
  const apiParams = {
    category: params.category || "All",
    q: params.q || "",
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sort: params.sort,
    brands: params.brands ? params.brands.split(",") : [],
    conditions: params.conditions ? params.conditions.split(",") : [],
    is_offer: "true", // ALWAYS TRUE FOR THIS PAGE
    page: params.page || 1,
    per_page: 24, 
  };

  // Fetch products, categories, and brands server-side.
  const [productsData, categoriesData, brandsData, shopCmsData] =
    await Promise.all([
      fetchProducts(apiParams).catch(() => null),
      fetchCategoriesServer(),
      fetchBrands().catch(() => null),
      fetchShopCMS().catch(() => null),
    ]);

  // Override the CMS Title and Banner for the Offers page
  const customCmsData = shopCmsData ? {
    ...shopCmsData,
    data: {
      ...shopCmsData.data,
      shop_title: "Exclusive Offers",
      shop_description: "Discover limited-time deals on our premium imported collections.",
    }
  } : null;

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#130f0d] transition-colors duration-300">
      <Header />
      <Suspense fallback={<ShopSkeleton viewMode={viewMode} />}>
        <OffersContent
          initialProducts={productsData}
          initialCmsData={customCmsData}
        />
      </Suspense>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
