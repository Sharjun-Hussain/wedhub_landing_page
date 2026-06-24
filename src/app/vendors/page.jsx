import React from "react";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import VendorsClient from "./VendorsClient";

import { API_BASE_URL } from "@/lib/api";

export const metadata = {
  title: "Wedding Vendors in Sri Lanka | Venues, Photographers, Decorators | WedHub - The Best Wedding Marketplace",
  description: "Discover the best wedding marketplace in Sri Lanka. Browse Sri Lanka's finest wedding professionals. Find and book luxury banquet halls, expert bridal makeup artists, wedding car rentals, and catering services.",
};

const fetchVendorsAdsServer = async () => {
  const url = `${API_BASE_URL}/public/ads?placement=vendors_middle`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch vendors ads on server:", error);
    return [];
  }
};

export default async function VendorsPage() {
  const adsData = await fetchVendorsAdsServer();

  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header />
      <VendorsClient ads={adsData} />
      <Footer />
    </div>
  );
}
