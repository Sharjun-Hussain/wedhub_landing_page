"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Plus, Check, Loader2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Input } from "./Input";
import { toast } from "sonner";

export const AddressFormModal = ({ isOpen, onClose, address, onSave }) => {
  const [formData, setFormData] = useState({
    address_name: "",
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    country: "Sri Lanka",
    postal_code: "",
    is_default: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sanitizeText = (text, maxLength = 200) => {
    if (typeof text !== "string") return "";

    // 1. Decode recursively to catch double-encoded or multiple-encoded payloads
    let decoded = text;
    let prev = "";
    let depth = 0;
    while (decoded !== prev && decoded.includes("%") && depth < 5) {
      prev = decoded;
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {
        break;
      }
      depth++;
    }

    // 2. Remove angle brackets to prevent HTML/XML/SVG tag insertion
    let clean = decoded.replace(/[<>]/g, "");

    // 3. Remove javascript:, data:, vbscript: protocols and common XSS vectors case-insensitively
    clean = clean.replace(/(javascript|data|vbscript)\s*:/gi, "");
    clean = clean.replace(/\b(alert|prompt|confirm|eval|onload|onerror|onclick|onmouseover)\b/gi, "");

    // 4. Limit length
    if (clean.length > maxLength) {
      clean = clean.slice(0, maxLength);
    }
    return clean;
  };

  useEffect(() => {
    if (address) {
      setFormData({ ...address, address_line_2: address.address_line_2 || "" });
    } else {
      setFormData({
        address_name: "",
        full_name: "",
        phone: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        country: "Sri Lanka",
        postal_code: "",
        is_default: false,
      });
    }
  }, [address, isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // 1. Validate fields
    const addressName = (formData.address_name || "").trim();
    const fullName = (formData.full_name || "").trim();
    const phone = (formData.phone || "").trim();
    const addressLine1 = (formData.address_line_1 || "").trim();
    const addressLine2 = (formData.address_line_2 || "").trim();
    const city = (formData.city || "").trim();
    const state = (formData.state || "").trim();
    const postalCode = (formData.postal_code || "").trim();

    if (addressName.length < 2) {
      toast.error("Address Label must be at least 2 characters");
      return;
    }
    if (fullName.length < 2) {
      toast.error("Full Name must be at least 2 characters");
      return;
    }
    // Phone validation: allow optional +, digits, spaces, dashes, parentheses. 7 to 20 chars
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number (7 to 20 digits)");
      return;
    }
    if (addressLine1.length < 5) {
      toast.error("Address Line 1 must be at least 5 characters");
      return;
    }
    if (city.length < 2) {
      toast.error("City must be at least 2 characters");
      return;
    }
    if (state.length < 2) {
      toast.error("State / Province must be at least 2 characters");
      return;
    }
    if (postalCode.length < 3) {
      toast.error("Postal Code must be at least 3 characters");
      return;
    }

    // 2. Sanitize fields
    const sanitizedData = {
      ...formData,
      address_name: sanitizeText(addressName, 50),
      full_name: sanitizeText(fullName, 100),
      phone: sanitizeText(phone, 20),
      address_line_1: sanitizeText(addressLine1, 150),
      address_line_2: sanitizeText(addressLine2, 150),
      city: sanitizeText(city, 100),
      state: sanitizeText(state, 100),
      postal_code: sanitizeText(postalCode, 20),
    };

    setIsSubmitting(true);
    try {
      await onSave(sanitizedData);
      onClose();
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error(error.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex justify-end text-slate-900 dark:text-white">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative top-2 bottom-2 right-2 md:top-4 md:bottom-4 md:right-4 w-[calc(100vw-1rem)] md:w-full md:max-w-md bg-white dark:bg-zinc-950 shadow-2xl border border-slate-100 dark:border-zinc-800 flex flex-col rounded-[3rem] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md shrink-0">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {address ? "Edit Address" : "Add Address"}
              </h3>
              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-5 tiny-scrollbar"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Label (e.g. Home)"
                  placeholder="Home"
                  value={formData.address_name}
                  onChange={(e) =>
                    setFormData({ ...formData, address_name: e.target.value })
                  }
                  required
                  maxLength={50}
                />
                <Input
                  label="Full Name"
                  placeholder="Kasun Perera"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>
              <Input
                label="Phone Number"
                placeholder="0771234567"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                maxLength={20}
              />
              <Input
                label="Address Line 1"
                placeholder="123 Main Street"
                value={formData.address_line_1}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_1: e.target.value })
                }
                required
                maxLength={150}
              />
              <Input
                label="Address Line 2 (Optional)"
                placeholder="Apt 4B"
                value={formData.address_line_2}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_2: e.target.value })
                }
                maxLength={150}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="Colombo"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  maxLength={100}
                />
                <Input
                  label="State / Province"
                  placeholder="Western Province"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>
              <Input
                label="Postal Code"
                placeholder="00100"
                value={formData.postal_code}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
                required
                maxLength={20}
              />
            </form>

            <div className="p-6 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#2c2520] dark:bg-white hover:opacity-90 text-white dark:text-[#2c2520] font-bold h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-[#2c2520]/10 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white dark:text-[#2c2520]" /> Saving...
                  </>
                ) : address ? (
                  "Update Address"
                ) : (
                  "Save Address"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
};

export const DeliveryAddressSelectionModal = ({
  isOpen,
  onClose,
  addresses,
  onSelect,
  onAddNew,
  loading,
  onOpen,
}) => {
  const modalRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && onOpen) {
      onOpen();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-white">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/50">
          <div>
            <h3 className="text-2xl font-bold">Select Delivery Address</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose where you'd like your order delivered.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 tiny-scrollbar">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <>
              {addresses.length === 0 ? (
                <div className="text-center py-10">
                  <MapPin className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500">
                    No saved delivery addresses found.
                  </p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelect(addr);
                      onClose();
                    }}
                    className="p-5 border-2 border-slate-100 dark:border-zinc-800 rounded-2xl hover:border-[#a97d43] dark:hover:border-[#d4af37] hover:bg-[#a97d43]/5 dark:hover:bg-[#d4af37]/5 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-[#a97d43] dark:group-hover:text-[#d4af37] transition-colors">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-slate-200 dark:bg-zinc-800 px-2 py-0.5 rounded-md uppercase text-slate-600 dark:text-slate-400">
                              {addr.address_name}
                            </span>
                            <p className="text-sm font-bold">
                              {addr.full_name}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {addr.address_line_1}, {addr.city}
                          </p>
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-[#a97d43] dark:text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={onAddNew}
                className="w-full p-5 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-[#a97d43] dark:hover:border-[#d4af37] hover:bg-[#a97d43]/5 text-sm font-bold text-slate-500 hover:text-[#a97d43] dark:hover:text-[#d4af37] flex items-center justify-center gap-3 transition-all group mt-4"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-[#a97d43]/10 dark:group-hover:bg-[#d4af37]/20">
                  <Plus className="w-4 h-4" />
                </div>
                Add New Delivery Address
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
};
