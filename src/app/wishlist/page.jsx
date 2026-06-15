import React from "react";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { WishlistClient } from "./WishlistClient";

export const metadata = {
  title: "My Saved Inspirations | Ceylon Weddings",
  description: "View and manage your saved vendors and wedding inspirations on Ceylon Weddings.",
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f0] font-sans transition-colors duration-300">
      <Header />
      
      <main className="flex-grow pt-36 pb-16 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <h1 className="text-[32px] sm:text-[40px] font-serif font-bold text-[#2C1A0E] mb-3 leading-tight tracking-wide">
            Saved Inspirations
          </h1>
          <p className="text-[#6b584a] text-[15px] font-light max-w-2xl mx-auto">
            Curate your dream wedding. Here are the vendors and items you've saved for your special day.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <div className="w-16 h-px bg-[#8B1A2D]"></div>
            <div className="w-2 h-2 rounded-full bg-[#8B1A2D] mx-3"></div>
            <div className="w-16 h-px bg-[#8B1A2D]"></div>
          </div>
        </div>

        <WishlistClient />
      </main>

      <Footer />
    </div>
  );
}
