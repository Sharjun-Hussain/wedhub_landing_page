import { Suspense } from "react";
import {
  fetchPublicCoupons,
} from "@/lib/api";
import { CouponsContent } from "./components/CouponsContent";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";

// Force dynamic rendering — product list changes frequently and the API
// must not be called at build time (it can timeout, crashing the build).
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Exclusive Offers & Deals | WedHub - The Best Wedding Marketplace",
  description:
    "Discover the best wedding marketplace in Sri Lanka. Shop our exclusive offers and discounted premium imports. Discover luxury Arabian ouds, viral pistachio chocolates, premium Ajwa dates, roasted nuts, and Middle Eastern delicacies at unbeatable prices.",
  alternates: {
    canonical: "https://wedhub.lk/offers",
  },
  openGraph: {
    title: "Exclusive Offers & Deals | WedHub - The Best Wedding Marketplace",
    description:
      "Discover the best wedding marketplace in Sri Lanka. Shop our exclusive offers and discounted premium imports. Discover luxury Arabian ouds, viral pistachio chocolates, premium Ajwa dates, and more at unbeatable prices.",
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
    title: "Exclusive Offers & Deals | WedHub - The Best Wedding Marketplace",
    description:
      "Discover the best wedding marketplace in Sri Lanka. Shop our exclusive offers and discounted premium imports at WedHub.",
    images: ["/logo.png"],
  },
};

export default async function OffersPage() {
  const couponsData = await fetchPublicCoupons().catch(() => null);

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#130f0d] transition-colors duration-300">
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#fc0a7a] border-t-transparent rounded-full animate-spin"></div></div>}>
        <CouponsContent initialCoupons={couponsData} />
      </Suspense>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
