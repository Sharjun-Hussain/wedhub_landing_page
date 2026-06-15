import React from "react";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import VendorsClient from "./VendorsClient";

export const metadata = {
  title: "Luxury Wedding Vendors | Ceylon Weddings",
  description: "Discover Sri Lanka's finest wedding venues, photographers, bridal wear, and more.",
};

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header />
      <VendorsClient />
      <Footer />
    </div>
  );
}
