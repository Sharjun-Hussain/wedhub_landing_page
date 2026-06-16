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

const page = async () => {
  const cmsData = await fetchHomeCmsServer();

  return (
    <Fragment>
      <div className="">
        <Header initialCmsData={cmsData} />
        <ScrollToTop />

        <WeddingHero />
        <TrustMarquee />
        <FeaturedVendors />
        {/* <TrustBar /> */}  {/* Design v1 — dark cinematic */}
        <TrustBar2 />      {/* Design v2 — editorial magazine */}
        {/* <VendorCategories /> */}
        <HowItWorks />

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
  title: "WedHub | Sri Lanka's Premium Wedding Marketplace & Directory",
  description:
    "Your ultimate destination for wedding planning in Sri Lanka. Browse curated wedding venues, expert photographers, makeup artists, and exclusive vendor offers.",
  alternates: {
    canonical: "https://wedhub.lk",
  },
  openGraph: {
    title: "WedHub | Sri Lanka's Premium Wedding Marketplace & Directory",
    description:
      "Your ultimate destination for wedding planning in Sri Lanka. Browse curated wedding venues, expert photographers, makeup artists, and exclusive vendor offers.",
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
    title: "WedHub | Sri Lanka's Premium Wedding Marketplace & Directory",
    description: "Your ultimate destination for wedding planning in Sri Lanka.",
    images: ["/logo.png"],
  },
};
