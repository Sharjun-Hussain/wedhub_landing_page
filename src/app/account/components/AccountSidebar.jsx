import React from "react";
import Link from "next/link";
import { User, Package, MapPin, ArrowLeft, ChevronRight } from "lucide-react";
import { MobileNavToggle } from "./MobileNavToggle";
import { LogoutButton } from "./LogoutButton";

const ICON_MAP = {
  profile: User,
  orders: Package,
  addresses: MapPin,
};

export function AccountSidebar({ activeTab }) {
  const navItems = [
    { id: "profile", label: "My Profile" },
    { id: "orders", label: "Orders" },
    { id: "addresses", label: "Addresses" },
  ];

  const logoUrl = "/logo.png";

  return (
    <>
      {/* MOBILE HEADER (Server Rendered) */}
      <div className="lg:hidden h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <MobileNavToggle
            navItems={navItems}
            activeTab={activeTab}
            logoUrl={logoUrl}
          />
          <span className="font-bold text-slate-900 dark:text-white">
            My Account
          </span>
        </div>
        <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain rounded-lg" />
      </div>

      {/* DESKTOP SIDEBAR (Server Rendered) */}
      <div className="left-panel hidden lg:flex w-full lg:w-[35%] xl:w-[30%] bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white p-8 lg:p-12 flex-col z-10 h-screen sticky top-0 transition-colors duration-300">
        <div className="flex items-center justify-between mb-16">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-16 w-auto object-contain rounded-lg"
          />
          <Link
            href="/shop"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />{" "}
            Shop
          </Link>
        </div>
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
            My Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your details and orders.
          </p>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={`/account?tab=${item.id}`}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-[#a97d43] text-white dark:bg-[#d4af37] dark:text-[#130f0d] shadow-lg shadow-[#a97d43]/20 dark:shadow-[#d4af37]/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2d2520] hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {(() => {
                  const Icon = ICON_MAP[item.id];
                  return (
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white"}`}
                    />
                  );
                })()}
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="pt-8 border-t border-slate-200 dark:border-zinc-800 mt-auto">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
