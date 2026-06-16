import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Register - WedHub | Premium Vendor Marketplace",
  description:
    "Create your WedHub account today to access the island's most exclusive network of wedding artisans and venues.",
  keywords: [
    "create account ceylon weddings",
    "register ceylon weddings",
    "sri lanka wedding vendors",
    "wedding planning colombo",
    "premium wedding venues",
  ],
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">
      {/* Full-screen cinematic background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Wedding Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        {/* Dark elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a120e]/90 via-[#2C1A0E]/70 to-[#1a120e]/90" />
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full flex justify-center p-4">
        <RegisterForm />
      </div>
    </div>
  );
}
