import React from "react";
import { Header } from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { CookiePolicyClient } from "./CookiePolicyClient";

export const metadata = {
  title: "Cookie Policy | WedHub - The Best Wedding Marketplace",
  description: "Discover the best wedding marketplace in Sri Lanka. Read the Cookie Policy for WedHub.",
};

export default async function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white transition-colors duration-300 flex flex-col font-sans">
      <Header />
      <CookiePolicyClient />
      <Footer />
    </div>
  );
}
