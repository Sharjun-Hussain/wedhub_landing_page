import React from "react";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us | Ceylon Weddings",
  description: "Get in touch with Ceylon Weddings for inquiries about wedding planning or vendor listings.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header />
      <ContactClient />
      <Footer />
    </div>
  );
}
