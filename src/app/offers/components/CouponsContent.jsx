"use client";
import React, { useState } from "react";
import Image from "next/image";
import { API_BASE_URL, submitCouponClaim } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Gift, X } from "lucide-react";

export function CouponsContent({ initialCoupons }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const coupons = initialCoupons?.data || [];
  
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCouponClick = (coupon) => {
    if (status !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/offers");
      return;
    }
    setSelectedCoupon(coupon);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleClaim = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const customerId = session?.user?.id;
      if (!customerId) throw new Error("User ID not found");
      
      const res = await submitCouponClaim(selectedCoupon.id, customerId);
      setSuccessMessage(res.message || "Coupon claimed successfully!");
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#130f0d] font-sans transition-colors duration-300 pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2C1A0E] dark:text-white tracking-tight mb-4">
            Exclusive <span className="text-[#fc0a7a]">Offers</span>
          </h1>
          <p className="text-[#9a8070] dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Discover limited-time deals and coupons from Sri Lanka's premium wedding vendors.
          </p>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-20">
            <Gift className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-500 dark:text-slate-400">No active offers at the moment.</h3>
            <p className="text-slate-400 dark:text-slate-500 mt-2">Please check back later for exciting deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#ede2cc] dark:border-slate-700 flex flex-col"
                onClick={() => handleCouponClick(coupon)}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  {coupon.image ? (
                    <img 
                      src={`${API_BASE_URL.replace('/api/v1', '')}${coupon.image}`} 
                      alt={coupon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-2.5 bg-white text-[#fc0a7a] font-bold rounded-full text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Claim Offer
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#2C1A0E] dark:text-white leading-snug line-clamp-2">
                    {coupon.title}
                  </h3>
                  {coupon.vendor && (
                    <div>
                      <p className="text-sm text-[#9a8070] dark:text-slate-400 mt-2 font-medium">
                        by {coupon.vendor.name}
                      </p>
                      {coupon.vendor.category && (
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                          {coupon.vendor.category}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => !isSubmitting && !successMessage && setSelectedCoupon(null)} 
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#ede2cc] dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedCoupon(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
              {selectedCoupon.image ? (
                <img 
                  src={`${API_BASE_URL.replace('/api/v1', '')}${selectedCoupon.image}`} 
                  alt={selectedCoupon.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gift className="w-12 h-12 text-slate-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-xl font-bold text-white line-clamp-2">
                  {selectedCoupon.title}
                </h3>
                {selectedCoupon.vendor && (
                  <div>
                    <p className="text-white/80 mt-1 font-medium text-sm">
                      by {selectedCoupon.vendor.name}
                    </p>
                    {selectedCoupon.vendor.category && (
                      <p className="text-white/60 text-xs mt-0.5">
                        {selectedCoupon.vendor.category}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {successMessage ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[#2C1A0E] dark:text-white mb-2">Success!</h4>
                  <p className="text-slate-600 dark:text-slate-400">{successMessage}</p>
                  <button 
                    onClick={() => setSelectedCoupon(null)}
                    className="mt-6 w-full px-6 py-3 bg-[#fc0a7a] hover:bg-[#d90066] text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    You are about to claim this exclusive offer. By submitting, your contact details will be shared with the vendor, and they will reach out to you with the details!
                  </p>
                  
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/50">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedCoupon(null)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleClaim}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-[#fc0a7a] hover:bg-[#d90066] text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Submit Claim"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
