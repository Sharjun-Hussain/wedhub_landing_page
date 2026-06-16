import { notFound } from "next/navigation";
import {
  fetchVendors,
  transformVendor,
  API_BASE_URL,
} from "@/lib/api";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import VendorDetailClient from "./VendorDetailClient";

export const revalidate = 3600; // Revalidate every hour

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const vendorsResponse = await fetchVendors();
    const vendor = vendorsResponse?.data?.find((v) => v.slug === slug);

    if (!vendor) {
      return {
        title: "Vendor Not Found | WedHub",
        description: "The requested vendor could not be found.",
      };
    }

    const productData = transformVendor(vendor);

    if (!productData) {
      return {
        title: "Vendor Not Found | WedHub",
      };
    }

    return {
      title: `${productData.name} | WedHub`,
      description:
        productData.short_description ||
        productData.description ||
        `Book ${productData.name} on WedHub - Premium Marketplace`,
      alternates: {
        canonical: `https://foreign-emporium-frontend.vercel.app/vendors/${slug}`,
      },
      openGraph: {
        title: `${productData.name} | WedHub`,
        description:
          productData.short_description || `Book ${productData.name} on WedHub`,
        images:
          productData.images.length > 0 ? [{ url: productData.images[0] }] : [],
        url: `https://foreign-emporium-frontend.vercel.app/vendors/${slug}`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "WedHub - Premium Marketplace",
    };
  }
}

// Server Component - Fetches data and passes to client component
export default async function VendorPage({ params, searchParams }) {
  const [{ slug }, sParams] = await Promise.all([params, searchParams]);
  const activeTab = sParams?.tab || null;

  let product = null;

  try {
    // Step 1: Fetch all vendors to find the matching slug
    const vendorsResponse = await fetchVendors();

    if (!vendorsResponse?.data) {
      console.error("No vendors data received from API");
    } else {
      // Step 2: Find the vendor with matching slug
      product = vendorsResponse.data.find((v) => v.slug === slug);

      if (!product) {
        console.warn(`Vendor with slug "${slug}" not found`);
      }
    }
  } catch (error) {
    if (
      error.digest === "NEXT_NOT_FOUND" ||
      error.message === "NEXT_NOT_FOUND"
    ) {
      throw error;
    }
    console.error("Error during vendor data fetching:", error);
  }

  // Step 4: Handle cases where vendor was not found or detail fetch failed
  let productData = null;
  if (!product) {
    // FALLBACK: If the API doesn't have this slug (because we are using mock data in the UI),
    // provide a generic mock vendor so the UI design can still be viewed without a 404.
    productData = {
      name: "The Galle Face Hotel",
      description: "<p>Steeped in history and colonial charm, The Galle Face Hotel stands as an iconic landmark for luxury celebrations. Our venue offers an unparalleled blend of heritage architecture and sweeping ocean views, creating a timeless canvas for your most significant moments.</p><br/><p>From grand ballroom receptions to intimate courtyard ceremonies under the stars, our dedicated team of artisans ensures every detail reflects your personal aesthetic. We specialize in curating bespoke experiences that marry traditional elegance with modern sophistication.</p>",
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
        "https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=800",
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800"
      ],
      category: { name: "HERITAGE VENUE" },
    };
  } else {
    // Transform the raw API data to match UI structure
    productData = transformVendor(product);
  }

  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      <VendorDetailClient productData={productData} serverTab={activeTab} />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}

// Optional: Generate static params for better performance
export async function generateStaticParams() {
  try {
    const url = `${API_BASE_URL}/public/vendors`;
    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return [];
    }

    const vendorsResponse = await response.json();

    if (!vendorsResponse?.data) {
      return [];
    }

    const params = vendorsResponse.data.map((vendor) => ({
      slug: vendor.slug,
    }));

    return params;
  } catch (error) {
    return [];
  }
}
