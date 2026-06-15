"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);

  // Handle scroll visibility
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // GSAP Animations
  useGSAP(() => {
    if (isVisible) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
          display: "flex",
        },
      );
    } else {
      gsap.to(buttonRef.current, {
        scale: 0,
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(buttonRef.current, { display: "none" });
        },
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="fixed bottom-20 md:bottom-8 right-5 md:right-8 z-50 w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group border border-white/10 dark:border-slate-200"
      aria-label="Scroll to top"
      style={{ display: "none" }}
    >
      <ChevronUp className="w-6 h-6 transition-transform group-hover:-translate-y-1" />

      {/* Subtle Ring Animation */}
      <span className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
    </button>
  );
};

export default ScrollToTop;
