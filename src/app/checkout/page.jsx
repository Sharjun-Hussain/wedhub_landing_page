import React from "react";
import CheckoutPageClient from "./CheckoutPageClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchMe } from "@/lib/api";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout | WedHub - The Best Wedding Marketplace",
  description: "Discover the best wedding marketplace in Sri Lanka. Secure checkout for your order.",
};

export default async function CheckoutPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const session = await getServerSession(authOptions);

  let userProfile = null;
  if (session?.accessToken) {
    try {
      const response = await fetchMe(session.accessToken);
      if (response.success) {
        userProfile = response.data;
      }
    } catch (error) {
      console.error("Server-side profile fetch error:", error);
      // If backend returns 401, the session is stale/expired
      if (error.status === 401) {
        redirect(`/login?redirect=/checkout&expired=true`);
      }
    }
  }

  return (
    <CheckoutPageClient
      searchParams={resolvedSearchParams}
      userProfile={userProfile}
    />
  );
}
