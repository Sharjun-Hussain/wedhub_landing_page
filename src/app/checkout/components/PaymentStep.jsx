"use client";

import React from "react";
import {
  CreditCard,
  Banknote,
  Building,
  FileText,
  UploadCloud,
  Truck,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export function PaymentStep({
  data,
  onChange,
  onNext,
  onBack,
  total,
  paymentSlip,
  setPaymentSlip,
}) {
  const method = data.paymentMethod;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentSlip(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (method === "bank_transfer" && !paymentSlip) {
      toast.error("Please upload your payment slip to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6 animate-step">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Payment Method
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Secure transactions or pay on arrival.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onChange("paymentMethod", "card")}
          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all opacity-60 cursor-not-allowed border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400`}
          disabled
        >
          <CreditCard className="w-6 h-6" />
          <span className="font-bold text-xs">Card</span>
          <span className="text-[10px] text-[#a97d43] dark:text-[#d4af37]">Coming Soon</span>
        </button>
        <button
          onClick={() => onChange("paymentMethod", "cash_on_delivery")}
          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
            method === "cash_on_delivery"
              ? "border-[#a97d43] dark:border-[#d4af37] bg-[#a97d43]/10 dark:bg-[#d4af37]/10 text-[#a97d43] dark:text-[#d4af37]"
              : "border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Banknote className="w-6 h-6" />
          <span className="font-bold text-xs">Cash (COD)</span>
        </button>
        <button
          onClick={() => onChange("paymentMethod", "bank_transfer")}
          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
            method === "bank_transfer"
              ? "border-[#a97d43] dark:border-[#d4af37] bg-[#a97d43]/10 dark:bg-[#d4af37]/10 text-[#a97d43] dark:text-[#d4af37]"
              : "border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Building className="w-6 h-6" />
          <span className="font-bold text-xs">Bank Transfer</span>
        </button>
      </div>

      {method === "bank_transfer" && (
        <div className="bg-[#a97d43]/5 dark:bg-zinc-900 p-6 rounded-2xl border border-[#a97d43]/20 dark:border-zinc-800 space-y-5 animate-in fade-in slide-in-from-top-2">
          <div>
            <h4 className="font-bold text-[#a97d43] dark:text-[#d4af37]">
              Bank Transfer Details
            </h4>
            <p className="text-sm text-[#6d513e] dark:text-[#a3988e] mt-1">
              Please transfer{" "}
              <span className="font-bold text-[#a97d43] dark:text-[#d4af37]">{formatCurrency(total)}</span> to our
              bank account and upload the slip below.
            </p>
            <div className="mt-3 p-3 bg-white dark:bg-zinc-950 rounded-lg text-sm text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800">
              <p>
                <strong>Bank:</strong> Commercial Bank
              </p>
              <p>
                <strong>Account Name:</strong> Foreign Emporium
              </p>
              <p>
                <strong>Account No:</strong> 1000 0000 0000
              </p>
              <p>
                <strong>Branch:</strong> Colombo 03
              </p>
            </div>
          </div>
          <div className="border-2 border-dashed border-[#a97d43]/30 dark:border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#a97d43]/10 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer relative overflow-hidden group">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {paymentSlip ? (
              <div className="flex flex-col items-center text-[#a97d43] dark:text-[#d4af37]">
                <FileText className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm truncate max-w-[200px]">
                  {paymentSlip.name}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Click to change file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                <UploadCloud className="w-8 h-8 mb-2 text-[#a97d43] dark:text-[#d4af37] group-hover:-translate-y-1 transition-transform" />
                <span className="font-medium text-sm">Upload Payment Slip</span>
                <span className="text-xs mt-1">JPG, PNG, or PDF max 5MB</span>
              </div>
            )}
          </div>
        </div>
      )}

      {method === "cash_on_delivery" && (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-900/50 flex items-start gap-4 animate-in fade-in zoom-in-95">
          <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full text-green-600 dark:text-green-400 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-green-800 dark:text-green-300">
              Pay when you receive
            </h4>
            <p className="text-sm text-green-700 dark:text-green-400/80 mt-1">
              Have <span className="font-bold">{formatCurrency(total)}</span>{" "}
              ready for the courier.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 font-bold h-14 rounded-2xl flex items-center justify-center transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-2 bg-[#2c2520] dark:bg-white text-white dark:text-[#2c2520] hover:opacity-90 font-bold h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
        >
          Review Order{" "}
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
