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
      router.push("/login?callbackUrl=/offers");
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
    <div className="min-h-screen bg-[#fdf8f0] font-sans transition-colors duration-300 pb-20">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[440px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
          alt="Exclusive Offers"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a05]/70 via-[#1a0a05]/60 to-[#fdf8f0]" />

        {/* Decorative gold rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-[#d4a853]/10 absolute -translate-x-1/2 -translate-y-1/2" />
          <div className="w-[400px] h-[400px] rounded-full border border-[#d4a853]/15 absolute -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-24">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#d4a853]" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#d4a853]">Exclusive Deals</span>
            <div className="h-px w-8 bg-[#d4a853]" />
          </div>
          <h1 className="text-[3rem] md:text-[5rem] font-serif font-bold text-white leading-none mb-4">
            Special <span className="italic text-[#d4a853] font-light">Offers</span>
          </h1>
          <p className="text-white/70 text-[16px] max-w-lg leading-relaxed">
            Discover limited-time deals and coupons from Sri Lanka's premium wedding vendors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">

        {coupons.length === 0 ? (
          <div className="text-center py-20">
            <Gift className="w-16 h-16 mx-auto text-[#d4a853] mb-4" />
            <h3 className="text-xl font-semibold text-[#2C1A0E]">No active offers at the moment.</h3>
            <p className="text-[#9a8070] mt-2">Please check back later for exciting deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-[#2C1A0E]/5 hover:shadow-2xl hover:shadow-[#fc0a7a]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer border border-[#ede2cc] relative"
                onClick={() => handleCouponClick(coupon)}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-[#fdf8f0]">
                  {coupon.image ? (
                    <img 
                      src={`${API_BASE_URL.replace('/api/v1', '')}${coupon.image}`} 
                      alt={coupon.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-16 h-16 text-[#d4a853]/40" />
                    </div>
                  )}
                  {coupon.vendor && coupon.vendor.category && (
                    <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#fc0a7a] text-white shadow-lg">
                      {coupon.vendor.category}
                    </span>
                  )}
                  {/* Subtle gradient overlay for premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Dashed Divider for "Coupon" Look */}
                <div className="relative flex items-center justify-between px-2 -mt-3 -mb-3 z-10 pointer-events-none">
                  <div className="w-6 h-6 rounded-full bg-[#fdf8f0] border-r border-[#ede2cc] -ml-5"></div>
                  <div className="flex-1 border-t-2 border-dashed border-[#ede2cc]"></div>
                  <div className="w-6 h-6 rounded-full bg-[#fdf8f0] border-l border-[#ede2cc] -mr-5"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1 bg-white relative z-0">
                  <h3 className="text-[18px] font-bold text-[#2C1A0E] leading-snug flex-1 group-hover:text-[#fc0a7a] transition-colors line-clamp-2 mb-4">
                    {coupon.title}
                  </h3>
                  
                  {coupon.vendor && (
                    <div className="mb-6 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#d4a853] text-[#1a0a05] text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                        {coupon.vendor.name.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="text-[13px] text-[#9a8070] font-medium truncate">
                        {coupon.vendor.name}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    <button className="w-full relative overflow-hidden text-center py-3 rounded-xl bg-[#2C1A0E] group-hover:bg-[#fc0a7a] text-white text-[12px] font-bold uppercase tracking-widest transition-colors shadow-md">
                      <span className="relative z-10">Claim Offer</span>
                    </button>
                  </div>
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !isSubmitting && !successMessage && setSelectedCoupon(null)} 
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#ede2cc] animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedCoupon(null)}
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-200 bg-black/30 hover:bg-black/50 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative h-56 w-full bg-slate-100">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A0E]/90 via-[#2C1A0E]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                {selectedCoupon.vendor && selectedCoupon.vendor.category && (
                  <span className="inline-block mb-2 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#fc0a7a] text-white shadow-md">
                    {selectedCoupon.vendor.category}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white line-clamp-2 leading-snug">
                  {selectedCoupon.title}
                </h3>
                {selectedCoupon.vendor && (
                  <p className="text-white/80 mt-2 font-medium text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#d4a853] text-[#1a0a05] text-[9px] font-black flex items-center justify-center border border-white shadow-sm">
                      {selectedCoupon.vendor.name.substring(0, 2).toUpperCase()}
                    </span>
                    {selectedCoupon.vendor.name}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6">
              {successMessage ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#fdf8f0] text-[#fc0a7a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#fc0a7a]/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[#2C1A0E] mb-2">Success!</h4>
                  <p className="text-[#9a8070]">{successMessage}</p>
                  <button 
                    onClick={() => setSelectedCoupon(null)}
                    className="mt-6 w-full px-6 py-3 bg-[#fc0a7a] hover:bg-[#d90066] text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[#4a3728]/80 text-sm mb-6 leading-relaxed">
                    You are about to claim this exclusive offer. By submitting, your contact details will be shared with the vendor, and they will reach out to you with the details!
                  </p>
                  
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedCoupon(null)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-[#fdf8f0] hover:bg-[#f0e6d3] text-[#4a3728] border border-[#ede2cc] rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleClaim}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-[#fc0a7a] hover:bg-[#d90066] text-white rounded-xl font-bold uppercase text-[12px] tracking-wider transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
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
