"use client";
import React, { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 35,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(targetDate.getHours() + 14);
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#fc0a7a] text-white py-3 px-4 shadow-lg flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
          <Timer className="w-5 h-5" />
          <span>Mega Brand Sale Ends In:</span>
        </div>
        <div className="flex gap-3 text-lg font-black font-mono bg-white/20 px-4 py-1.5 rounded-lg">
          <span>{String(timeLeft.days).padStart(2, '0')}d</span>
          <span>:</span>
          <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
          <span>:</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
          <span>:</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    </div>
  );
}
