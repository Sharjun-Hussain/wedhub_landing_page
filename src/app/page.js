import React, { Fragment } from "react";
import dynamic from "next/dynamic";

import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Above-fold — always eager
import WeddingHero from "@/Sections/WeddingHero";
import TrustBar2 from "@/Sections/TrustBar2";
import TrustMarquee from "@/Sections/TrustMarquee";

// Below-fold — lazy loaded so they don't block first paint
const VendorCategories = dynamic(() => import("@/Sections/VendorCategories"), { ssr: true });
const HowItWorks = dynamic(() => import("@/Sections/HowItWorks"), { ssr: true });
const FeaturedVendors = dynamic(() => import("@/Sections/FeaturedVendors"), { ssr: true });
const MagazinesSection = dynamic(() => import("@/Sections/MagazinesSection"), { ssr: true });
const PlanningTools = dynamic(() => import("@/Sections/PlanningTools"), { ssr: true });

import { API_BASE_URL } from "@/lib/api";
import { AdBanner } from "@/components/ui/AdBanner";

const fetchHomeCmsServer = async () => {
  const url = `${API_BASE_URL}/public/cms/home`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch home cms data on server:", error);
    return null;
  }
};

const fetchHomeAdsServer = async () => {
  const url = `${API_BASE_URL}/public/ads?placement=homepage_banner`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch home ads on server:", error);
    return [];
  }
};

const page = async () => {
  const cmsData = await fetchHomeCmsServer();
  const adsData = await fetchHomeAdsServer();

  return (
    <Fragment>
      <div className="">
        <Header initialCmsData={cmsData} />
        <ScrollToTop />

        <WeddingHero cmsData={cmsData} />
        <TrustMarquee cmsData={cmsData} />
        <FeaturedVendors cmsData={cmsData} />
        {/* <TrustBar /> */}  {/* Design v1 — dark cinematic */}
        <TrustBar2 />      {/* Design v2 — editorial magazine */}
        {/* <VendorCategories /> */}
        <HowItWorks />

        {/* Dynamic Premium Ad Placement */}
        {adsData && adsData.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
            {adsData.map((ad) => (
              <AdBanner
                key={ad.id}
                imageSrc={`${API_BASE_URL.replace('/api/v1', '')}${ad.image}`}
                title={ad.title}
                subtitle="Sponsored Advertisement"
                link={ad.url || "#"}
                linkText={ad.url ? "Visit Website" : "Discover More"}
              />
            ))}
          </section>
        )}

        <MagazinesSection />

        {/* <PlanningTools /> */}

      </div>
      <Footer initialCmsData={cmsData} />
    </Fragment>
  );
};

export default page;

export const metadata = {
  title: "WedHub | The Best Wedding Marketplace in Sri Lanka",
  description:
    "Discover the best wedding marketplace in Sri Lanka. Your ultimate destination for wedding planning. Browse curated wedding venues, expert photographers, makeup artists, and exclusive vendor offers.",
  alternates: {
    canonical: "https://wedhub.lk",
  },
  openGraph: {
    title: "WedHub | The Best Wedding Marketplace in Sri Lanka",
    description:
      "Discover the best wedding marketplace in Sri Lanka. Your ultimate destination for wedding planning. Browse curated wedding venues, expert photographers, makeup artists, and exclusive vendor offers.",
    url: "https://wedhub.lk",
    siteName: "WedHub",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WedHub | The Best Wedding Marketplace in Sri Lanka",
    description: "Discover the best wedding marketplace in Sri Lanka.",
    images: ["/logo.png"],
  },
};
