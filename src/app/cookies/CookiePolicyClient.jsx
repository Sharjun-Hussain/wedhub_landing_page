"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, Settings } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";

export function CookiePolicyClient() {
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
            Cookie<br/>
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
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">What Are Cookies?</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                <span className="float-left text-6xl font-serif font-bold text-[#fc0a7a] mr-3 mt-1 leading-none">C</span>
                ookies are small text files that are stored on your device when you visit our website. They help us understand how you interact with our platform and enable us to provide a seamless, premium experience.
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
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">How We Use Them</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                We use cookies exclusively to enhance your journey through WedHub. Here is a breakdown of the types we use:
              </p>
              <div className="bg-white border border-[#ede2cc] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl shadow-[#2C1A0E]/5 hover:shadow-2xl hover:border-[#d4a853]/30 transition duration-500">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 border border-[#fc0a7a]/10">
                    <ArrowRight className="w-3.5 h-3.5 text-[#fc0a7a]" />
                  </div>
                  <div>
                    <strong className="text-[#2C1A0E] font-bold block mb-1">Essential Cookies</strong>
                    <p className="text-sm">These are necessary for the website to function, such as maintaining your login session and remembering your cart items.</p>
                  </div>
                </div>
                <div className="w-full h-px bg-[#ede2cc]" />
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 border border-[#fc0a7a]/10">
                    <ArrowRight className="w-3.5 h-3.5 text-[#fc0a7a]" />
                  </div>
                  <div>
                    <strong className="text-[#2C1A0E] font-bold block mb-1">Analytics Cookies</strong>
                    <p className="text-sm">These help us anonymously track usage patterns so we can continually improve the speed and layout of our marketplace.</p>
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
            <h2 className="text-3xl font-serif font-bold text-[#2C1A0E] mb-6">Managing Preferences</h2>
            <div className="text-[#6d513e] leading-relaxed space-y-6 text-base">
              <p>
                You have full control over your data.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-[#ede2cc] transition-all duration-300 shadow-sm shadow-transparent hover:shadow-md">
                  <Settings className="w-5 h-5 text-[#d4a853] shrink-0" />
                  You can clear or block cookies directly from your browser settings at any time.
                </li>
                <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-[#ede2cc] transition-all duration-300 shadow-sm shadow-transparent hover:shadow-md">
                  <Settings className="w-5 h-5 text-[#d4a853] shrink-0" />
                  Note that blocking essential cookies may prevent you from logging in or completing bookings.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
