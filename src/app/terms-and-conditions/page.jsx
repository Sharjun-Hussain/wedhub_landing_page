import React from "react";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { TermsAndConditionsClient } from "./TermsAndConditionsClient";

export default async function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 flex flex-col font-sans">
      <Header />
      <TermsAndConditionsClient />
      <Footer />
    </div>
  );
}
