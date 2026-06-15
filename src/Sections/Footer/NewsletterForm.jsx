"use client";

import React, { useRef } from "react";
import { Send } from "lucide-react";

export function NewsletterForm() {
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    emailRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full sm:w-auto flex-1 relative max-w-md"
    >
      <input
        type="email"
        ref={emailRef}
        placeholder="Enter email address"
        className="w-full bg-[#111] border border-white/10 rounded-xl h-12 pl-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        required
      />
      <button
        type="submit"
        className="absolute right-1 top-1 h-10 w-10 bg-white rounded-lg flex items-center justify-center text-black hover:bg-blue-600 hover:text-white transition-all duration-300"
        aria-label="Subscribe"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
