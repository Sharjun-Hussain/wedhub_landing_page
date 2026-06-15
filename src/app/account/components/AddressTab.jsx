"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  fetchDeliveryAddresses,
  createDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
} from "@/lib/api";
import { AddressFormModal } from "./AddressFormModal";
import { cn } from "@/lib/utils";

export const AddressTab = ({ initialAddresses = [] }) => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [loading, setLoading] = useState(initialAddresses.length === 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { data: session } = useSession();

  const loadAddresses = useCallback(
    async (isRefresh = false) => {
      if (!session?.accessToken) return;
      if (!isRefresh && addresses.length > 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetchDeliveryAddresses(session.accessToken);
        if (response.status === "success" || response.success) {
          setAddresses(response.data);
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);
      } finally {
        setLoading(false);
      }
    },
    [session],
  );

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleSave = async (formData) => {
    if (!session?.accessToken) return;
    try {
      if (editingAddress) {
        const response = await updateDeliveryAddress(
          editingAddress.id,
          formData,
          session.accessToken,
        );
        toast.success("Address updated successfully");
        if (response.data) {
          setAddresses(prev => prev.map(a => a.id === editingAddress.id ? response.data : a));
        } else {
          loadAddresses(true);
        }
      } else {
        const response = await createDeliveryAddress(formData, session.accessToken);
        toast.success("Address added successfully");
        if (response.data) {
          setAddresses(prev => [response.data, ...prev]);
        } else {
          loadAddresses(true);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (
      !session?.accessToken ||
      !confirm("Are you sure you want to delete this address?")
    )
      return;
    try {
      await deleteDeliveryAddress(id, session.accessToken);
      toast.success("Address deleted successfully");
      loadAddresses(true);
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    if (!session?.accessToken) return;
    try {
      await updateDeliveryAddress(
        id,
        { is_default: true },
        session.accessToken,
      );
      toast.success("Default address updated");
      loadAddresses(true);
    } catch (error) {
      toast.error("Failed to set default address");
    }
  };

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Saved Addresses
          </h2>
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-40 bg-slate-50 dark:bg-zinc-900 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Saved Addresses
        </h2>
        <button
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
          className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all border border-blue-100 dark:border-blue-800/20 shadow-sm"
        >
          + Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 dark:text-white">
            No addresses yet
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Add your first delivery address to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border rounded-2xl p-5 relative transition-all ${
                addr.is_default
                  ? "border-blue-500 bg-blue-50/10 dark:bg-blue-900/10 shadow-sm"
                  : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              }`}
            >
              {addr.is_default && (
                <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                    addr.is_default
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-500",
                  )}
                >
                  {addr.address_name}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {addr.full_name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {addr.address_line_1}
              </p>
              {addr.address_line_2 && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {addr.address_line_2}
                </p>
              )}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {addr.city}, {addr.state} {addr.postal_code}
              </p>
              <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-500 mt-2 font-medium">
                {addr.phone}
              </p>

              <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                  onClick={() => {
                    setEditingAddress(addr);
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-blue-600 hover:underline ml-auto"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={editingAddress}
        onSave={handleSave}
      />
    </div>
  );
};
