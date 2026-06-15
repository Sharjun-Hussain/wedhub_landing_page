import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password - Ceylon Weddings | Premium Vendor Marketplace",
  description: "Reset your Ceylon Weddings password to regain access to your account.",
};

export default async function ForgotPasswordPage() {
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
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
