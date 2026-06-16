import Link from "next/link";
import React from "react";

export function AuthBranding() {
  return (
    <div className="hidden lg:flex w-full lg:w-1/2 relative bg-zinc-900 overflow-hidden flex-col justify-between p-12 lg:p-16 text-white min-h-screen">
      {/* Full Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop" 
        alt="Wedding rings" 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between w-full max-w-xl">
        {/* Top Logo */}
        <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
          <span className="font-serif text-[28px] font-bold tracking-tight text-white leading-none">
            WedHub
          </span>
        </Link>

        {/* Bottom Text */}
        <div className="mt-auto pb-8">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold leading-[1.1] mb-4">
            The Journey Begins Here.
          </h1>
          <p className="text-white/80 text-[17px] leading-relaxed max-w-md">
            Access the island's most exclusive network of wedding artisans and venues.
          </p>
        </div>
      </div>
    </div>
  );
}
