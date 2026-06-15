"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { AuthInput } from "@/components/auth/AuthInput";

export const AddressFormModal = ({ isOpen, onClose, address, onSave }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    address_name: "",
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    state: "",
    country: "Sri Lanka",
    postal_code: "",
    is_default: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        ...address,
        address_line_2: address.address_line_2 || "",
        landmark: address.landmark || "",
      });
    } else {
      setFormData({
        address_name: "",
        full_name: "",
        phone: "",
        address_line_1: "",
        address_line_2: "",
        landmark: "",
        city: "",
        state: "",
        country: "Sri Lanka",
        postal_code: "",
        is_default: false,
      });
    }
  }, [address, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useGSAP(
    () => {
      if (isOpen) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
      }
    },
    { scope: modalRef, dependencies: [isOpen] },
  );

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        address_name: formData.address_name,
        full_name: formData.full_name,
        phone: formData.phone,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postal_code,
        is_default: formData.is_default,
      };
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error(error.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-white">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {address ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput
              label="Address Label (e.g. Home, Work)"
              placeholder="Home"
              value={formData.address_name}
              onChange={(e) =>
                setFormData({ ...formData, address_name: e.target.value })
              }
              required
            />
            <AuthInput
              label="Full Name"
              placeholder="Mohamed Insath"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              required
            />
          </div>
          <AuthInput
            label="Phone Number"
            placeholder="0771234567"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />
          <AuthInput
            label="Address Line 1"
            placeholder="123 Main Street"
            value={formData.address_line_1}
            onChange={(e) =>
              setFormData({ ...formData, address_line_1: e.target.value })
            }
            required
          />
          <AuthInput
            label="Address Line 2 (Optional)"
            placeholder="Apt 4B"
            value={formData.address_line_2}
            onChange={(e) =>
              setFormData({ ...formData, address_line_2: e.target.value })
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput
              label="Landmark (Optional)"
              placeholder="Near City Park"
              value={formData.landmark}
              onChange={(e) =>
                setFormData({ ...formData, landmark: e.target.value })
              }
            />
            <AuthInput
              label="City"
              placeholder="Colombo"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput
              label="State / Province"
              placeholder="Western Province"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              required
            />
            <AuthInput
              label="Postal Code"
              placeholder="00100"
              value={formData.postal_code}
              onChange={(e) =>
                setFormData({ ...formData, postal_code: e.target.value })
              }
              required
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) =>
                setFormData({ ...formData, is_default: e.target.checked })
              }
              className="w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="is_default"
              className="text-sm font-medium cursor-pointer"
            >
              Set as default address
            </label>
          </div>
        </form>
        <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none px-10 h-12 text-slate-600 dark:text-slate-400 font-black rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors uppercase tracking-wider text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-12 h-12 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
};
