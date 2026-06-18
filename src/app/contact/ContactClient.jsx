"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail, MapPin, Phone, Send, Clock,
  Instagram, Facebook, ArrowRight, CheckCircle,
  MessageSquare, Users, Building2, HelpCircle, ChevronDown
} from "lucide-react";

// ── Subject Options ─────────────────────────────────────────────────────────
const SUBJECTS = [
  { id: "couple", icon: Users, label: "Couple Planning" },
  { id: "vendor", icon: Building2, label: "List My Business" },
  { id: "support", icon: MessageSquare, label: "Support" },
  { id: "other", icon: HelpCircle, label: "Other" },
];

// ── FAQ Data ────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How do I list my wedding business on WedHub?",
    a: "Simply fill out the contact form selecting 'List My Business' or visit our vendor signup page. Our team will review your portfolio and get back to you within 24 hours.",
  },
  {
    q: "Is it free for couples to use the platform?",
    a: "Yes, completely free. Couples can search, compare and message unlimited vendors at no cost. We earn through vendor listing packages, not from couples.",
  },
  {
    q: "How are vendors verified on your platform?",
    a: "Every vendor goes through a manual review process including portfolio assessment, business verification, and real review checks before going live.",
  },
  {
    q: "Can I book vendors directly through the platform?",
    a: "You can connect, discuss and confirm bookings with vendors directly via our messaging system. Payments are handled between you and the vendor.",
  },
];

// ── Floating label input ────────────────────────────────────────────────────
function FloatInput({ label, type = "text", id, value, onChange, multiline = false }) {
  const base =
    "peer w-full bg-transparent border-b-2 border-[#ede2cc] pt-6 pb-2 text-[15px] text-[#2C1A0E] placeholder-transparent focus:outline-none focus:border-[#fc0a7a] transition-colors resize-none";
  const labelBase =
    "absolute left-0 pointer-events-none transition-all duration-200 " +
    "top-0 text-[11px] font-bold uppercase tracking-wider text-[#9a8070] " +
    "peer-placeholder-shown:top-6 peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal " +
    "peer-focus:top-0 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#fc0a7a]";

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          rows={4}
          placeholder={label}
          value={value}
          onChange={onChange}
          className={base + " peer"}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={label}
          value={value}
          onChange={onChange}
          className={base + " peer"}
        />
      )}
      <label htmlFor={id} className={labelBase}>{label}</label>
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fc0a7a] peer-focus:w-full transition-all duration-300" />
    </div>
  );
}

// ── FAQ Item ────────────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-[#ede2cc] rounded-2xl overflow-hidden transition-all duration-300 ${open ? "bg-white shadow-md" : "bg-[#fdf8f0] hover:border-[#d4a853]"}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <span className={`text-[15px] font-bold transition-colors ${open ? "text-[#fc0a7a]" : "text-[#2C1A0E]"}`}>
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 text-[#d4a853] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">
            <p className="text-[14px] text-[#4a3728]/80 leading-relaxed border-t border-[#f0e6d3] pt-4">
              {a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Security / Sanitization ─────────────────────────────────────────────────
const sanitizeInput = (str) => {
  if (!str) return "";
  // Strip < and > to prevent basic XSS or HTML injection via URL params
  return str.replace(/[<>]/g, "");
};

// ── Main Client Component ───────────────────────────────────────────────────
export default function ContactClient() {
  const searchParams = useSearchParams();
  const [subject, setSubject] = useState("couple");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const sub = searchParams.get("subject");
    if (sub) setSubject(sanitizeInput(sub));
    const msg = searchParams.get("message");
    if (msg) setMessage(sanitizeInput(msg));
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[440px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
          alt="Get in Touch"
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
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#d4a853]">Reach Out</span>
            <div className="h-px w-8 bg-[#d4a853]" />
          </div>
          <h1 className="text-[3rem] md:text-[5rem] font-serif font-bold text-white leading-none mb-4">
            Let's <span className="italic text-[#d4a853] font-light">Talk</span>
          </h1>
          <p className="text-white/70 text-[16px] max-w-lg leading-relaxed">
            Our team is ready to help you plan your perfect day or grow your wedding business.
          </p>
        </div>
      </div>

      {/* ── MAIN GRID ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-24">
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── LEFT PANEL ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Dark info card */}
            <div className="bg-[#022e43] rounded-[2rem] p-8 relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#fc0a7a] rounded-full blur-[80px] opacity-40 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a853] to-transparent opacity-50" />

              <h3 className="text-[1.4rem] font-serif font-bold text-white mb-8">Contact Details</h3>

              <div className="space-y-6 relative z-10">
                {[
                  { Icon: MapPin, label: "Our Office", lines: ["252A Galle Rd,", "Colombo 00400"] },
                  { Icon: Phone, label: "Phone & WhatsApp", lines: ["+94 77 289 0063"] },
                  { Icon: Mail, label: "Email", lines: ["info@wedhub.lk"] },
                  { Icon: Clock, label: "Hours", lines: ["Mon – Fri: 9:00 AM – 6:00 PM", "Saturday: 9:00 AM – 1:00 PM"] },
                ].map(({ Icon, label, lines }) => (
                  <div key={label} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4a853] group-hover:border-[#d4a853] transition-all duration-200">
                      <Icon className="w-4 h-4 text-white group-hover:text-[#1a0a05] transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#d4a853] mb-1">{label}</p>
                      {lines.map((l) => (
                        <p key={l} className="text-[14px] text-white/70 leading-relaxed">{l}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-white/10" />

              {/* Social */}
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Follow</span>
                {[
                  { Icon: Instagram, href: "#" },
                  { Icon: Facebook, href: "#" },
                ].map(({ Icon, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4a853] hover:border-[#d4a853] hover:text-[#1a0a05] text-white transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>


          </div>

          {/* ── RIGHT: FORM ─────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#ede2cc] rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-[#2C1A0E]/5">

              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-[2rem] font-serif font-bold text-[#2C1A0E] mb-1">Send a message</h3>
                    <p className="text-[14px] text-[#9a8070]">We read every message and respond personally.</p>
                  </div>

                  {/* Subject pills */}
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#4a3728] mb-4">I'm reaching out about…</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {SUBJECTS.map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSubject(id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200 ${subject === id
                              ? "border-[#fc0a7a] bg-[#fc0a7a]/5 text-[#fc0a7a]"
                              : "border-[#ede2cc] text-[#4a3728] hover:border-[#d4a853]"
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[11px] font-bold leading-tight">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Floating label inputs */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <FloatInput id="name" label="Full Name" value={name} onChange={(e) => setName(sanitizeInput(e.target.value))} />
                    <FloatInput id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(sanitizeInput(e.target.value))} />
                  </div>

                  <FloatInput id="message" label="Your Message" value={message} onChange={(e) => setMessage(sanitizeInput(e.target.value))} multiline />

                  {/* Submit */}
                  <button
                    type="submit"
                    className="group w-full flex items-center justify-between bg-[#2C1A0E] hover:bg-[#fc0a7a] text-white font-bold text-[13px] uppercase tracking-widest px-8 py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-[#2C1A0E]/10 hover:shadow-[#fc0a7a]/20"
                  >
                    <span>Send Message</span>
                    <span className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all group-hover:scale-110">
                      <Send className="w-4 h-4" />
                    </span>
                  </button>

                  <p className="text-center text-[12px] text-[#9a8070]">
                    By submitting, you agree to our{" "}
                    <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-[#fc0a7a] transition-colors">Privacy Policy</Link>.
                  </p>
                </form>
              ) : (
                /* ── Success State ── */
                <div className="min-h-[480px] flex flex-col items-center justify-center text-center gap-6 py-12">
                  <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-[2rem] font-serif font-bold text-[#2C1A0E] mb-3">Message Sent!</h3>
                    <p className="text-[15px] text-[#9a8070] max-w-sm">
                      Thank you for reaching out. Our team will get back to you within 2 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setSent(false)}
                    className="inline-flex items-center gap-2 text-[13px] font-bold text-[#fc0a7a] border-2 border-[#fc0a7a]/20 hover:border-[#fc0a7a] px-6 py-3 rounded-xl transition-all"
                  >
                    Send another message <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FAQ SECTION ────────────────────────────────────────────── */}
        <div className="mt-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#fc0a7a] bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-[2rem] md:text-[2.5rem] font-serif font-bold text-[#2C1A0E]">
              Common Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
