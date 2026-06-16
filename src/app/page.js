import React, { Fragment } from "react";
import dynamic from "next/dynamic";

import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Above-fold — always eager
import WeddingHero from "@/Sections/WeddingHero";
import TrustBar2 from "@/Sections/TrustBar2";

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

const page = async () => {
  const cmsData = await fetchHomeCmsServer();

  return (
    <Fragment>
      <div className="">
        <Header initialCmsData={cmsData} />
        <ScrollToTop />

        <WeddingHero />
        {/* <TrustBar /> */}  {/* Design v1 — dark cinematic */}
        <TrustBar2 />      {/* Design v2 — editorial magazine */}
        <VendorCategories />
        <HowItWorks />
        <FeaturedVendors />

        {/* Premium Ad Placement */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AdBanner
            imageSrc="/ads/jewelry_banner.png"
            title="The Aurelia & Co. Bridal Collection"
            subtitle="Fine Bridal Jewelry"
            link="/vendors"
            linkText="Explore the Collection"
          />
        </section>

        <MagazinesSection />

        {/* <PlanningTools /> */}

      </div>
      <Footer initialCmsData={cmsData} />
    </Fragment>
  );
};

export default page;

export const metadata = {
  title: "Wedding Planner | Find Local Vendors & Venues",
  description:
    "Plan your perfect wedding with our free planning tools. Search for local wedding vendors, venues, photographers, and more.",
  alternates: {
    canonical: "https://weddingplanner.com",
  },
  openGraph: {
    title: "Wedding Planner | Find Local Vendors & Venues",
    description:
      "Plan your perfect wedding with our free planning tools. Search for local wedding vendors, venues, photographers, and more.",
    url: "https://weddingplanner.com",
    siteName: "Wedding Planner",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Planner",
    description: "Your ultimate wedding planning destination.",
    images: ["/logo.png"],
  },
};
