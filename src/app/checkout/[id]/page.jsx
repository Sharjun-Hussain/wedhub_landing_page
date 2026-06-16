import React from "react";
import CheckoutPageClient from "../CheckoutPageClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchCheckoutSession, fetchMe } from "@/lib/api";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Checkout | WedHub",
  description: "Secure checkout for your order.",
};

export default async function CheckoutIdPage({ params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  let initialSessionData = null;
  let userProfile = null;

  if (session?.accessToken) {
    // Parallel fetch for session and profile
    try {
      const [sessionRes, profileRes] = await Promise.all([
        fetchCheckoutSession(id, session.accessToken),
        fetchMe(session.accessToken),
      ]);

      if (sessionRes.status === "success") {
        initialSessionData = sessionRes.data;
      }

      if (profileRes.success) {
        userProfile = profileRes.data;
      }
    } catch (error) {
      console.error("Server-side checkout/profile fetch error:", error);
      // If backend returns 401, the session is stale/expired
      if (error.status === 401) {
        redirect(`/login?redirect=/checkout/${id}&expired=true`);
      }
    }
  }

  return (
    <CheckoutPageClient
      checkoutId={id}
      initialSessionData={initialSessionData}
      userProfile={userProfile}
    />
  );
}
