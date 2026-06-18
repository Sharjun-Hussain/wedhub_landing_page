import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  fetchMe,
  fetchCustomerOrders,
  fetchDeliveryAddresses,
} from "@/lib/api";
import { AccountSidebar } from "./components/AccountSidebar";
import { AccountLayout } from "./components/AccountLayout";
import { ProfileTab } from "./components/ProfileTab";
import { OrdersTab } from "./components/OrdersTab";
import { AddressTab } from "./components/AddressTab";

export const metadata = {
  title: "My Account | WedHub - The Best Wedding Marketplace",
  description:
    "Discover the best wedding marketplace in Sri Lanka. Manage your profile, track orders, and update your delivery addresses at WedHub.",
};

export default async function AccountPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?redirect=/account");
  }

  const { tab = "profile" } = await searchParams;

  // Pre-fetch all account data concurrently on server
  let initialProfile = null;
  let initialOrders = [];
  let initialAddresses = [];

  try {
    const [profileRes, ordersRes, addressesRes] = await Promise.all([
      fetchMe(session.accessToken),
      fetchCustomerOrders(session.accessToken),
      fetchDeliveryAddresses(session.accessToken),
    ]);

    if (profileRes.success) initialProfile = profileRes.data.user || profileRes.data;
    if (ordersRes.success || ordersRes.status === "success") {
      initialOrders = ordersRes.data?.data || [];
    }
    if (addressesRes.success || addressesRes.status === "success") {
      initialAddresses = addressesRes.data || [];
    }
  } catch (error) {
    console.error("Error fetching account data on server:", error);
    // If backend returns 401, the session is stale/expired
    if (error.status === 401) {
      redirect(`/login?redirect=/account&expired=true`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-zinc-950 overflow-hidden font-sans transition-colors duration-300">
      <AccountSidebar activeTab={tab} />

      <AccountLayout activeTab={tab}>
        {tab === "profile" && <ProfileTab profile={initialProfile} />}
        {tab === "orders" && <OrdersTab initialOrders={initialOrders} />}
        {tab === "addresses" && (
          <AddressTab initialAddresses={initialAddresses} />
        )}
      </AccountLayout>
    </div>
  );
}
