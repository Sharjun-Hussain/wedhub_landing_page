"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin, Share2, Heart, ExternalLink,
  MessageCircle, Phone, ArrowUpRight,
  X, ChevronLeft, ChevronRight, Image as ImageIcon,
  Utensils, Bed, TreePine, Car
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  date: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function VendorDetailClient({ productData }) {
  // Destructure product data
  const {
    name = "Premium Vendor",
    description = "<p>No description provided.</p>",
    images = [],
    category = { name: "Wedding Venue" },
    contact_person_name,
    contact_person_designation,
    contact_person_image,
    contact_phone,
  } = productData || {};

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).origin : 'http://localhost:5000';
  const displayContactName = contact_person_name || "Sales Team";
  const displayContactDesignation = contact_person_designation || "Vendor Representative";
  const displayContactImage = contact_person_image ? `${backendUrl}${contact_person_image}` : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop";

  // Form state
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", email: "", phone: "", date: "", message: ""
    }
  });
  
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1'}/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: productData?.id,
          customer_name: values.name,
          email: values.email,
          contact_number: values.phone,
          message: values.message,
          event_date: values.date || null
        })
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setErrorMsg(data.message || "Failed to send inquiry.");
      }
    } catch (err) {
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure we have at least 3 images for the grid, using placeholders if needed
  const displayImages = [
    images[0] || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
    images[1] || "https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=800",
    images[2] || "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800",
    ...images.slice(3)
  ];

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <main className="min-h-screen bg-[#fdf8f0] pt-24 md:pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── IMAGE GALLERY ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 h-[400px] md:h-[600px] mb-8 md:mb-12">
          {/* Main Large Image */}
          <div 
            className="md:col-span-2 h-full rounded-[2rem] overflow-hidden cursor-pointer relative group shadow-sm"
            onClick={() => openLightbox(0)}
          >
            <img
              src={displayImages[0]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
          
          {/* Stacked Images (Right) */}
          <div className="hidden md:flex flex-col gap-3 md:gap-4 h-full">
            <div 
              className="flex-1 rounded-[2rem] overflow-hidden cursor-pointer relative group shadow-sm"
              onClick={() => openLightbox(1)}
            >
              <img 
                src={displayImages[1]} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
            
            <div 
              className="flex-1 rounded-[2rem] overflow-hidden cursor-pointer relative group shadow-sm"
              onClick={() => openLightbox(2)}
            >
              <img 
                src={displayImages[2]} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              
              {/* View Gallery Button */}
              {displayImages.length > 3 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                  className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-[13px] font-bold text-[#2C1A0E] shadow-xl flex items-center gap-2 hover:bg-white hover:scale-105 transition-all duration-300"
                >
                  <ImageIcon className="w-4 h-4 text-[#fc0a7a]" />
                  View All {displayImages.length}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#ede2cc] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#ede2cc]/50 text-[#4a3728]">
                {category?.name || "Premium Vendor"}
              </span>
              <div className="w-5 h-5 rounded flex items-center justify-center border border-[#d4a853] text-[#d4a853]">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <h1 className="text-[2.5rem] md:text-[4rem] font-serif font-bold text-[#2C1A0E] leading-none mb-3">
              {name}
            </h1>
            <div className="flex items-center gap-2 text-[#9a8070] text-[14px]">
              <MapPin className="w-4 h-4" />
              <span>Colombo, Western Province, Sri Lanka</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-full border border-[#ede2cc] flex items-center justify-center text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full border border-[#ede2cc] flex items-center justify-center text-[#4a3728] hover:border-[#fc0a7a] hover:text-[#fc0a7a] transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-2 space-y-16">
            



            {/* Location */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-[#fc0a7a]/30" />
                <h2 className="text-[1.8rem] font-serif font-bold text-[#2C1A0E]">Location</h2>
              </div>
              <div className="bg-[#ede2cc] h-64 md:h-96 rounded-[2rem] relative overflow-hidden flex items-end shadow-sm border border-[#ede2cc]">
                {/* Real Interactive Map */}
                <iframe 
                  src={`https://www.google.com/maps?q=${encodeURIComponent(name + ', Sri Lanka')}&output=embed`}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${name} Location Map`}
                />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Contact Sticky Card */}
          <div className="lg:sticky lg:top-32 bg-white border border-[#ede2cc] rounded-[2rem] p-8 shadow-2xl shadow-[#2C1A0E]/5">
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={displayContactImage} 
                alt={displayContactName}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-serif font-bold text-[#2C1A0E] text-[18px]">{displayContactName}</p>
                <p className="text-[12px] text-[#9a8070] uppercase tracking-wider font-bold">{displayContactDesignation}</p>
              </div>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="font-serif font-bold text-[#2C1A0E] text-[1.4rem]">Send an Inquiry</h3>
                {errorMsg && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{errorMsg}</div>}
                <div className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className={`w-full border-b bg-transparent pb-3 text-[14px] text-[#2C1A0E] placeholder:text-[#9a8070] focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-[#ede2cc] focus:border-[#fc0a7a]'}`}
                      {...register("name")}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`w-full border-b bg-transparent pb-3 text-[14px] text-[#2C1A0E] placeholder:text-[#9a8070] focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-[#ede2cc] focus:border-[#fc0a7a]'}`}
                      {...register("email")}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className={`w-full border-b bg-transparent pb-3 text-[14px] text-[#2C1A0E] placeholder:text-[#9a8070] focus:outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-[#ede2cc] focus:border-[#fc0a7a]'}`}
                      {...register("phone")}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Estimated Wedding Date"
                      className={`w-full border-b bg-transparent pb-3 text-[14px] text-[#2C1A0E] placeholder:text-[#9a8070] focus:outline-none transition-colors ${errors.date ? 'border-red-500' : 'border-[#ede2cc] focus:border-[#fc0a7a]'}`}
                      {...register("date")}
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Tell us about your vision..."
                      rows={2}
                      className={`w-full border-b bg-transparent pb-3 text-[14px] text-[#2C1A0E] placeholder:text-[#9a8070] focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-[#ede2cc] focus:border-[#fc0a7a]'}`}
                      {...register("message")}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#5A5A5A] hover:bg-[#2C1A0E] disabled:bg-[#9a8070] text-white py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-colors mt-2"
                >
                  {isSubmitting ? 'Sending...' : 'Request Proposal'}
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8" />
                </div>
                <p className="font-bold text-[#2C1A0E] text-[18px] mb-2">Inquiry Sent</p>
                <p className="text-[13px] text-[#9a8070]">The vendor will review your details and contact you shortly.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX OVERLAY ───────────────────────────────────────────── */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button 
            onClick={prevPhoto}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Main Image Container */}
          <div className="relative w-full max-w-6xl max-h-[90vh] px-4 md:px-24 flex items-center justify-center">
            <img 
              src={displayImages[photoIndex]} 
              alt={`${name} Gallery ${photoIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Image Counter */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/70 text-[14px] tracking-widest font-bold">
              {photoIndex + 1} / {displayImages.length}
            </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={nextPhoto}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </main>
  );
}
