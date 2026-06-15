import React from "react";
import Link from "next/link";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Star } from "lucide-react";

export const metadata = {
  title: "About Us | Ceylon Weddings",
  description: "Sri Lanka's premier luxury wedding marketplace connecting couples with top-tier verified vendors across all 25 districts.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header />

      <main className="pt-24 md:pt-32 pb-16">
        
        {/* ── HERO SECTION ──────────────────────────────────────────────── */}
        <section className="relative h-[65vh] min-h-[550px] flex items-center justify-center overflow-hidden mx-4 sm:mx-8 rounded-[2.5rem] mb-28 border border-[#ede2cc]">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
            alt="Sri Lankan Wedding"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a05]/95 via-[#1a0a05]/60 to-transparent" />
          
          <div className="relative z-10 text-center max-w-3xl px-6 pt-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-[#d4a853]" />
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#d4a853]">
                Our Story
              </span>
              <div className="h-px w-8 bg-[#d4a853]" />
            </div>
            
            <h1 className="text-[3rem] md:text-[4.5rem] font-serif font-bold text-white leading-[1.1] mb-6 drop-shadow-lg">
              Redefining <span className="italic text-[#d4a853] font-light">Romance</span><br className="hidden md:block" /> in Sri Lanka
            </h1>
            <p className="text-[16px] md:text-[18px] text-white/80 leading-relaxed max-w-2xl mx-auto font-light">
              Ceylon Weddings is the island's premier luxury marketplace, seamlessly connecting couples with the most extraordinary wedding professionals to craft unforgettable celebrations.
            </p>
          </div>
        </section>

        {/* ── MISSION SECTION ───────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-[#8B1A2D] rounded-[2.5rem] transform -rotate-3 opacity-10" />
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
                  alt="Couple"
                  className="w-full h-[550px] object-cover"
                />
                
                {/* Glassmorphism Stat Overlay */}
                <div className="absolute bottom-6 right-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#d4a853] flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-[#1a0a05] fill-current" />
                    </div>
                    <div>
                      <p className="text-[2rem] font-serif font-black text-white leading-none">10,000+</p>
                      <p className="text-[11px] font-bold text-white/80 uppercase tracking-wider mt-1">Weddings Brought to Life</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7">
              <h2 className="text-[2.2rem] md:text-[3rem] font-serif font-bold text-[#2C1A0E] leading-[1.1] mb-8">
                Planning your big day should be a <span className="italic text-[#8B1A2D]">joy</span>, not a chore.
              </h2>
              
              <div className="space-y-6 text-[#4a3728]/80 text-[16px] leading-relaxed mb-10 border-l-2 border-[#d4a853] pl-6">
                <p>
                  Historically, planning a wedding in Sri Lanka meant endless phone calls, disorganized spreadsheets, and relying purely on word-of-mouth. We built Ceylon Weddings to change that narrative entirely.
                </p>
                <p>
                  Our platform brings the island's finest venues, photographers, decorators, and artists into one curated, highly visual space. We rigorously verify our vendors so you can book with absolute confidence and enjoy the journey to the altar.
                </p>
              </div>

              <Link
                href="/vendors"
                className="inline-flex items-center justify-center gap-3 bg-[#2C1A0E] hover:bg-[#8B1A2D] text-white font-bold text-[13px] uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-[#2C1A0E]/10"
              >
                Explore Vendors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── ENHANCED PILLARS (Bento Grid) ─────────────────────────────── */}
        <section className="bg-white py-32 border-y border-[#ede2cc] mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8B1A2D]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-[#8B1A2D] bg-[#8B1A2D]/5 px-4 py-2 rounded-full mb-4">
                The Ceylon Standard
              </span>
              <h2 className="text-[2.5rem] md:text-[3.5rem] font-serif font-bold text-[#2C1A0E]">
                Why choose us
              </h2>
            </div>

            {/* Asymmetric Bento Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Large Card 1 */}
              <div className="md:col-span-2 bg-[#fdf8f0] p-10 rounded-[2rem] border border-[#ede2cc] group hover:border-[#d4a853] transition-colors relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                  <ShieldCheck className="w-full h-full text-[#8B1A2D]" />
                </div>
                <div className="relative z-10 max-w-sm">
                  <div className="w-14 h-14 rounded-full bg-[#8B1A2D] text-white flex items-center justify-center mb-8 shadow-lg shadow-[#8B1A2D]/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-[1.8rem] font-serif font-bold text-[#2C1A0E] mb-4">Verified Excellence</h3>
                  <p className="text-[15px] text-[#4a3728]/80 leading-relaxed">
                    Every single vendor on our platform undergoes a strict vetting process. We check past work, real reviews, and business legitimacy to ensure you only deal with premium, reliable professionals.
                  </p>
                </div>
              </div>

              {/* Square Card 2 */}
              <div className="bg-[#1a0a05] text-white p-10 rounded-[2rem] group relative overflow-hidden flex flex-col justify-end min-h-[300px]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a05] via-[#1a0a05]/80 to-transparent" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#d4a853] text-[#1a0a05] flex items-center justify-center mb-6">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-[1.5rem] font-serif font-bold mb-3">Curated Aesthetics</h3>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    A hand-picked selection of professionals who align with modern luxury standards.
                  </p>
                </div>
              </div>

              {/* Square Card 3 */}
              <div className="bg-[#fdf8f0] p-10 rounded-[2rem] border border-[#ede2cc] hover:border-[#8B1A2D]/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white border border-[#ede2cc] flex items-center justify-center mb-6 text-[#8B1A2D]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-[1.4rem] font-serif font-bold text-[#2C1A0E] mb-3">Island-wide Reach</h3>
                <p className="text-[14px] text-[#4a3728]/80 leading-relaxed">
                  From a grand Colombo ballroom to a pristine Galle beach resort, easily discover and filter vendors across all 25 districts of Sri Lanka.
                </p>
              </div>

              {/* Large Card 4 */}
              <div className="md:col-span-2 bg-[#8B1A2D] p-10 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#a62138,transparent_50%)] opacity-50" />
                <div className="relative z-10 flex-1">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                    <HeartHandshake className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[1.8rem] font-serif font-bold mb-4">Direct Connection</h3>
                  <p className="text-[15px] text-white/80 leading-relaxed max-w-lg">
                    No hidden fees and absolutely no middlemen. Message, negotiate, and share your vision directly with vendors through our secure internal messaging platform.
                  </p>
                </div>
                <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
                  <Link href="/register" className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-white text-[#8B1A2D] font-bold text-[13px] uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#fdf8f0] transition-colors">
                    Create Account
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── ENHANCED CTA SECTION ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2033&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Wedding celebration"
              />
            </div>
            
            {/* Overlay Layers for Depth */}
            <div className="absolute inset-0 bg-[#2C1A0E]/90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a05] via-[#1a0a05]/95 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#8B1A2D_0%,transparent_40%)] opacity-40" />

            {/* Content Content */}
            <div className="relative z-10 p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#d4a853] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4a853]">Your Journey Starts Here</span>
                </div>
                <h2 className="text-[2.5rem] md:text-[3.5rem] font-serif font-bold text-white leading-[1.1] mb-6">
                  Ready to plan your <br />
                  <span className="italic text-[#d4a853] font-light">dream day?</span>
                </h2>
                <p className="text-white/70 text-[16px] leading-relaxed mb-0">
                  Join thousands of couples planning their perfect day on Sri Lanka's most trusted luxury wedding platform.
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto flex-shrink-0">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-between gap-6 bg-[#d4a853] hover:bg-[#c09240] text-[#1a0a05] font-bold text-[13px] uppercase tracking-wider px-8 py-5 rounded-2xl transition-all shadow-xl shadow-[#d4a853]/20 hover:-translate-y-1"
                >
                  Start Planning <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/vendor-signup"
                  className="inline-flex items-center justify-between gap-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[13px] uppercase tracking-wider px-8 py-5 rounded-2xl transition-all backdrop-blur-md hover:-translate-y-1"
                >
                  List as a Vendor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
