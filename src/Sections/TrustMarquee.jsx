"use client";

import React, { memo } from "react";

const TAGS = [
  "Verified & Trusted", "Real Reviews", "Island-wide Coverage",
  "24/7 Support", "Free to Browse", "No Hidden Fees",
];

const TrustMarquee = memo(function TrustMarquee({ cmsData }) {
  let tags = TAGS;
  if (cmsData?.data?.marquee_tags) {
    try {
      const parsed = JSON.parse(cmsData.data.marquee_tags);
      if (Array.isArray(parsed) && parsed.length > 0) {
        tags = parsed;
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="bg-[#fdf8f0] border-y border-[#ede2cc] py-4 overflow-hidden">
      <div className="flex items-center gap-0" style={{ animation: "marquee2 24s linear infinite" }}>
        {[...tags, ...tags, ...tags, ...tags].map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 text-[12px] font-bold uppercase tracking-widest text-[#4a3728] whitespace-nowrap">
            {i % tags.length === 0 && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
            )}
            {tag}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee2 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>
    </div>
  );
});

export default TrustMarquee;
