import React, { Suspense } from "react";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us | WedHub",
  description: "Get in touch with WedHub for inquiries about wedding planning or vendor listings.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ContactClient />
      </Suspense>
      <Footer />
    </div>
  );
}
