import React from "react";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { PrivacyPolicyClient } from "./PrivacyPolicyClient";

export default async function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 flex flex-col font-sans">
      <Header />
      <PrivacyPolicyClient />
      <Footer />
    </div>
  );
}
