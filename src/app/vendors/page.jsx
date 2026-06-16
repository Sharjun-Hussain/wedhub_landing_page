import React from "react";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import VendorsClient from "./VendorsClient";

export const metadata = {
  title: "Wedding Vendors in Sri Lanka | Venues, Photographers, Decorators | WedHub",
  description: "Browse Sri Lanka's finest wedding professionals. Find and book luxury banquet halls, expert bridal makeup artists, wedding car rentals, and catering services.",
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
