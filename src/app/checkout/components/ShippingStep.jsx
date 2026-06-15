"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Loader2, ArrowRight } from "lucide-react";
import {
  DeliveryAddressSelectionModal,
  AddressFormModal,
} from "./AddressModals";
import { toast } from "sonner";

export function ShippingStep({
  data,
  onChange,
  onNext,
  userProfile,
  isAddressModalOpen,
  setIsAddressModalOpen,
  isSelectionModalOpen,
  setIsSelectionModalOpen,
  deliveryAddresses,
  loadingAddresses,
  session,
  setDeliveryAddresses,
  setEditingAddress,
}) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isFetchingLocal, setIsFetchingLocal] = useState(false);

  // Auto-fetch addresses on mount and pre-select the default one
  useEffect(() => {
    const fetchAndAutoSelect = async () => {
      if (!session?.accessToken) return;
      setIsFetchingLocal(true);
      try {
        const { fetchDeliveryAddresses } = await import("@/lib/api");
        const response = await fetchDeliveryAddresses(session.accessToken);
        if (response.success || response.status === "success") {
          const addresses = response.data || [];
          setDeliveryAddresses(addresses);
          // Auto-select default address if no address is already chosen
          if (!data.deliveryAddressId && addresses.length > 0) {
            const defaultAddr =
              addresses.find((a) => a.is_default) || addresses[0];
            onChange("fullName", defaultAddr.full_name);
            onChange("phone", defaultAddr.phone);
            onChange("address", defaultAddr.address_line_1);
            onChange("address2", defaultAddr.address_line_2 || "");
            onChange("city", defaultAddr.city);
            onChange("district", defaultAddr.state);
            onChange("zip", defaultAddr.postal_code);
            onChange("province", defaultAddr.state);
            onChange("deliveryAddressId", defaultAddr.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch delivery addresses:", error);
      } finally {
        setIsFetchingLocal(false);
      }
    };
    fetchAndAutoSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken]);

  const loadDeliveryAddresses = async () => {
    if (session?.accessToken) {
      setIsFetchingLocal(true);
      try {
        const { fetchDeliveryAddresses } = await import("@/lib/api");
        const response = await fetchDeliveryAddresses(session.accessToken);
        if (response.success || response.status === "success") {
          setDeliveryAddresses(response.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch delivery addresses on modal open:",
          error,
        );
      } finally {
        setIsFetchingLocal(false);
      }
    }
  };

  return (
    <div className="space-y-6 animate-step w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 pl-1">
          Shipping Details
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 pl-1">
          Review your account and set your delivery destination.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden stagger-in">
        {/* User row */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#a97d43] dark:bg-[#d4af37] flex items-center justify-center text-white dark:text-zinc-950 font-bold text-sm">
            {(userProfile?.name || session?.user?.name || "G")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {userProfile?.name || session?.user?.name || "Guest Customer"}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
              {session?.user?.email ||
                userProfile?.customer_profile?.phone ||
                ""}
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-zinc-800 mx-5" />

        {/* Delivery address row */}
        <div className="px-5 py-4">
          {(isFetchingLocal || loadingAddresses) && !data.deliveryAddressId ? (
            <div className="flex items-center gap-3 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#a97d43] dark:text-[#d4af37] shrink-0" />
              <span className="text-xs">Loading your address...</span>
            </div>
          ) : data.deliveryAddressId ? (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 shrink-0 rounded-xl bg-[#a97d43]/10 dark:bg-[#d4af37]/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {data.fullName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {[data.address, data.city, data.district]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <button
                onClick={() => setIsSelectionModalOpen(true)}
                className="shrink-0 text-xs font-bold text-[#a97d43] dark:text-[#d4af37] hover:underline"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingAddress(null);
                setIsAddressModalOpen(true);
              }}
              className="w-full flex items-center gap-3 p-3 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl hover:border-[#a97d43] hover:bg-[#a97d43]/5 dark:hover:bg-[#d4af37]/5 transition-all group"
            >
              <div className="w-8 h-8 shrink-0 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-[#a97d43]/20 dark:group-hover:bg-[#d4af37]/30 transition-colors">
                <MapPin className="w-4 h-4 text-slate-400 group-hover:text-[#a97d43] dark:group-hover:text-[#d4af37] transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#a97d43] dark:group-hover:text-[#d4af37] transition-colors">
                  Add Delivery Address
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Tap to add your delivery address
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Address Modals */}
      <DeliveryAddressSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        addresses={deliveryAddresses}
        loading={loadingAddresses || isFetchingLocal}
        onOpen={loadDeliveryAddresses}
        onSelect={(addr) => {
          onChange("fullName", addr.full_name);
          onChange("phone", addr.phone);
          onChange("address", addr.address_line_1);
          onChange("address2", addr.address_line_2 || "");
          onChange("city", addr.city);
          onChange("district", addr.state);
          onChange("zip", addr.postal_code);
          onChange("province", addr.state);
          onChange("deliveryAddressId", addr.id);
          toast.success("Delivery address updated!");
        }}
        onAddNew={() => {
          setIsSelectionModalOpen(false);
          setEditingAddress(null);
          setIsAddressModalOpen(true);
        }}
      />

      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={async (formData) => {
          try {
            const { createDeliveryAddress } = await import("@/lib/api");
            const response = await createDeliveryAddress(
              formData,
              session.accessToken,
            );
            if (response.success || response.status === "success") {
              const newAddr = response.data;
              setDeliveryAddresses((prev) => [newAddr, ...prev]);
              // Auto select the new address
              onChange("fullName", newAddr.full_name);
              onChange("phone", newAddr.phone);
              onChange("address", newAddr.address_line_1);
              onChange("address2", newAddr.address_line_2 || "");
              onChange("city", newAddr.city);
              onChange("district", newAddr.state);
              onChange("zip", newAddr.postal_code);
              onChange("province", newAddr.state);
              onChange("deliveryAddressId", newAddr.id);
              toast.success("New address saved and selected!");
            }
          } catch (error) {
            console.error("Failed to save address:", error);
            toast.error("Could not save address. Please try again.");
          }
        }}
      />

      <button
        onClick={async () => {
          if (!data.address) {
            toast.error("Please provide a delivery address.");
            return;
          }

          if (!data.deliveryAddressId) {
            toast.error(
              "Please select or save a valid delivery address before continuing.",
            );
            return;
          }

          setLoadingLocation(true);
          try {
            await onNext(data.deliveryAddressId);
          } catch (error) {
            console.error("Failed to set address:", error);
          } finally {
            setLoadingLocation(false);
          }
        }}
        disabled={loadingLocation}
        className={`w-full bg-[#2c2520] dark:bg-white text-white dark:text-[#2c2520] hover:opacity-90 font-bold h-16 rounded-4xl mt-4 flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl group stagger-in ${loadingLocation ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loadingLocation ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-white dark:text-[#2c2520]" /> Confirming Address...
          </>
        ) : (
          <>
            Confirm & Continue{" "}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
}
