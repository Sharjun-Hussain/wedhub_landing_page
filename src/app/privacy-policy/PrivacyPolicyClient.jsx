"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, Heart } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";

export function PrivacyPolicyClient() {
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
      <aside className="relative md:w-5/12 lg:w-1/3 bg-[#8B1A2D] text-[#fdf8f0] overflow-hidden flex flex-col justify-center items-center py-24 px-8 md:sticky md:top-[88px] md:h-[calc(100vh-88px)] z-10 self-start">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[#8B1A2D]/85 mix-blend-multiply" />
        
        <div className="relative z-10 flex flex-col items-center text-center w-full">
          <div className="w-px h-16 bg-[#d4a853] mb-8" />
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-6">
            Privacy<br/>
            <span className="text-[#d4a853] italic font-normal">Policy</span>
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
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">Introduction</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                <span className="float-left text-6xl font-serif font-bold text-[#8B1A2D] mr-3 mt-1 leading-none">W</span>
                elcome to <strong>WedHub</strong>. We are deeply committed to protecting your personal information and safeguarding your fundamental right to absolute privacy when navigating our premium marketplace.
              </p>
              <p>
                If you have any questions, concerns, or inquiries regarding our privacy practices, please contact our dedicated security support team at{" "}
                <a href="mailto:support@wedhub.lk" className="text-[#8B1A2D] font-bold underline decoration-[#d4a853] underline-offset-4 hover:opacity-80 transition-opacity">
                  support@wedhub.lk
                </a>.
              </p>
              <p>
                When you access our boutique services and browse our curated collections, you place your trust in us. We treat your personal data with extreme care, absolute transparency, and state-of-the-art security systems.
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
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">Information We Collect</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                We capture personal information that you intentionally provide when registering for a customer account, expressing interest in our curated vendors, or communicating with us.
              </p>
              <div className="bg-white border border-[#ede2cc] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl shadow-[#2C1A0E]/5 hover:shadow-2xl hover:border-[#d4a853]/30 transition duration-500">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 border border-[#8B1A2D]/10">
                    <ArrowRight className="w-3.5 h-3.5 text-[#8B1A2D]" />
                  </div>
                  <div>
                    <strong className="text-[#2C1A0E] font-bold block mb-1">Voluntary Personal Details</strong>
                    <p className="text-sm">We collect your full name, phone number, email address, physical delivery addresses, account password, and billing preferences.</p>
                  </div>
                </div>
                <div className="w-full h-px bg-[#ede2cc]" />
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 border border-[#8B1A2D]/10">
                    <ArrowRight className="w-3.5 h-3.5 text-[#8B1A2D]" />
                  </div>
                  <div>
                    <strong className="text-[#2C1A0E] font-bold block mb-1">Automated Device Telemetry</strong>
                    <p className="text-sm">While browsing, we automatically collect basic device details (IP address, operating system, and language preferences) to optimize performance and display settings.</p>
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
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">How We Use Your Data</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                All gathered details serve strict transactional, optimization, and relationship-building purposes:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-[#ede2cc] transition-all duration-300 shadow-sm shadow-transparent hover:shadow-md">
                  <Heart className="w-5 h-5 text-[#d4a853] shrink-0" />
                  To facilitate and protect your account creation and login security.
                </li>
                <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-[#ede2cc] transition-all duration-300 shadow-sm shadow-transparent hover:shadow-md">
                  <Heart className="w-5 h-5 text-[#d4a853] shrink-0" />
                  To connect you with premium wedding vendors and manage inquiries.
                </li>
                <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-[#ede2cc] transition-all duration-300 shadow-sm shadow-transparent hover:shadow-md">
                  <Heart className="w-5 h-5 text-[#d4a853] shrink-0" />
                  To provide direct and helpful customer service support.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
