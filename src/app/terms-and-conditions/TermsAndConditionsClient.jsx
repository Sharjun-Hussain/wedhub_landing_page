"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";

export function TermsAndConditionsClient() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("translate-y-0", "opacity-100");
            entry.target.classList.remove("translate-y-12", "opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#fdf8f0]">
      <ScrollToTop />
      
      {/* LEFT SIDEBAR (Sticky on Desktop) */}
      <aside className="relative md:w-5/12 lg:w-1/3 bg-[#fc0a7a] text-[#fdf8f0] overflow-hidden flex flex-col justify-center items-center py-24 px-8 md:sticky md:top-[88px] md:h-[calc(100vh-88px)] z-10 self-start">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[#fc0a7a]/85 mix-blend-multiply" />
        
        <div className="relative z-10 flex flex-col items-center text-center w-full">
          <div className="w-px h-16 bg-[#d4a853] mb-8" />
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-6">
            Terms &<br/>
            <span className="text-[#d4a853] italic font-normal">Conditions</span>
          </h1>
          <p className="text-xs md:text-sm font-bold text-[#fdf8f0]/80 tracking-[0.2em] uppercase mb-8">
            Last Updated: Mar 2026
          </p>
          <div className="w-px h-16 bg-[#d4a853]" />
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <section className="md:w-7/12 lg:w-2/3 py-16 md:py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl space-y-20 mx-auto">
          
          {/* SECTION 1 */}
          <div 
            ref={el => sectionsRef.current[0] = el}
            className="transform-gpu translate-y-12 opacity-0 transition-all duration-1000 ease-out will-change-transform"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold tracking-widest text-[#d4a853]">01.</span>
              <div className="h-px w-12 bg-[#ede2cc]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">Acceptance of Terms</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                <span className="float-left text-6xl font-serif font-bold text-[#fc0a7a] mr-3 mt-1 leading-none">B</span>
                y accessing and using our marketplace services (the "Site") provided by <strong>WedHub</strong>, you agree to comply with and be bound by these Terms and Conditions.
              </p>
              <p>
                If you do not agree to these terms, please do not use our Site or services. We reserve the right to modify these terms at any time without prior notice.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-[#ede2cc]/0 via-[#ede2cc] to-[#ede2cc]/0" />

          {/* SECTION 2 */}
          <div 
            ref={el => sectionsRef.current[1] = el}
            className="transform-gpu translate-y-12 opacity-0 transition-all duration-1000 ease-out will-change-transform delay-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold tracking-widest text-[#d4a853]">02.</span>
              <div className="h-px w-12 bg-[#ede2cc]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">Account Responsibilities</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                To access premium features, contact vendors, or complete bookings, you are required to register for a customer account.
              </p>
              <div className="bg-white border border-[#ede2cc] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl shadow-[#2C1A0E]/5 hover:shadow-2xl hover:border-[#d4a853]/30 transition duration-500">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 border border-[#fc0a7a]/10">
                    <ArrowRight className="w-3.5 h-3.5 text-[#fc0a7a]" />
                  </div>
                  <div>
                    <strong className="text-[#2C1A0E] font-bold block mb-1">Confidentiality</strong>
                    <p className="text-sm">You are responsible for maintaining the strict confidentiality of your account credentials and for all activities that occur under your account.</p>
                  </div>
                </div>
                <div className="w-full h-px bg-[#ede2cc]" />
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 border border-[#fc0a7a]/10">
                    <ArrowRight className="w-3.5 h-3.5 text-[#fc0a7a]" />
                  </div>
                  <div>
                    <strong className="text-[#2C1A0E] font-bold block mb-1">Unauthorized Access</strong>
                    <p className="text-sm">You must notify us immediately of any unauthorized use of your account or any other breach of security.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-[#ede2cc]/0 via-[#ede2cc] to-[#ede2cc]/0" />

          {/* SECTION 3 */}
          <div 
            ref={el => sectionsRef.current[2] = el}
            className="transform-gpu translate-y-12 opacity-0 transition-all duration-1000 ease-out will-change-transform delay-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold tracking-widest text-[#d4a853]">03.</span>
              <div className="h-px w-12 bg-[#ede2cc]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">Vendor Bookings & Payments</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                WedHub acts as a marketplace to connect couples with wedding vendors. Please note the following regarding transactions:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-[#ede2cc] transition-all duration-300 shadow-sm shadow-transparent hover:shadow-md">
                  <CheckCircle2 className="w-5 h-5 text-[#d4a853] shrink-0" />
                  WedHub is not responsible for the fulfillment of services by third-party vendors.
                </li>
                <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-[#ede2cc] transition-all duration-300 shadow-sm shadow-transparent hover:shadow-md">
                  <CheckCircle2 className="w-5 h-5 text-[#d4a853] shrink-0" />
                  Any disputes regarding payments, cancellations, or refunds must be handled directly with the vendor based on their specific policies.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
