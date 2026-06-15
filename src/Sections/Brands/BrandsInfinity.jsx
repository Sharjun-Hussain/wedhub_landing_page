"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const BRANDS = [
  { id: 1, name: "Amazon", logo: "/brands/aws.png", color: "#FF9900" },
  { id: 2, name: "Google", logo: "/brands/google.png", color: "#4285F4" },
  { id: 3, name: "Meta", logo: "/brands/meta.png", color: "#0668E1" },
  { id: 4, name: "Netflix", logo: "/brands/netflix.png", color: "#E50914" },
  { id: 5, name: "Airbnb", logo: "/brands/airbnb.png", color: "#FF5A5F" },
  { id: 6, name: "Uber", logo: "/brands/uber.png", color: "#000000" },
  { id: 7, name: "Twitch", logo: "/brands/twitch.png", color: "#9146FF" },
  { id: 8, name: "Spotify", logo: "/brands/spotify.png", color: "#1DB954" },
];

export default function IsometricPipeline() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-24 bg-slate-950 overflow-hidden flex flex-col items-center justify-center min-h-[800px] w-full max-w-full">
      {/* --- BACKGROUND GRID --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(1000px)_rotateX(60deg)] origin-top pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 text-center mb-20 max-w-2xl px-4">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
          Integration{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Pipeline
          </span>
        </h2>
        <p className="text-slate-400 mt-4">
          Continuous delivery to the world&apos;s biggest platforms.
        </p>
      </div>

      {/* --- ISOMETRIC CONTAINER --- */}
      {/* We wrap the moving tracks in a container that is rotated.
         rotateX(60deg) gives the "flat on table" look.
         rotateZ(-45deg) gives the diagonal angle.
      */}
      <div className="relative transform-gpu [transform:perspective(1000px)_rotateX(50deg)_rotateZ(-20deg)] scale-75 md:scale-100">
        {/* THE SCANNER BEAM 
            This is the static "laser" line that brands pass under.
        */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[600px] z-50 bg-cyan-500/50 blur-sm shadow-[0_0_30px_rgba(34,211,238,0.8)] pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        </div>

        {/* TRACK 1 (Moving Right) */}
        <div className="flex gap-8 mb-8">
          <MovingTrack brands={BRANDS} speed={30} direction="normal" />
        </div>

        {/* TRACK 2 (Moving Left) */}
        <div className="flex gap-8 mb-8 translate-x-12">
          <MovingTrack brands={BRANDS} speed={40} direction="reverse" />
        </div>

        {/* TRACK 3 (Moving Right) */}
        <div className="flex gap-8">
          <MovingTrack brands={BRANDS} speed={35} direction="normal" />
        </div>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_20%,#020617_80%)] z-10" />
    </section>
  );
}

function MovingTrack({ brands, speed, direction }) {
  const duplicated = [...brands, ...brands, ...brands];

  return (
    <motion.div
      className="flex gap-8"
      initial={{ x: direction === "normal" ? "-33%" : "0%" }}
      animate={{ x: direction === "normal" ? "0%" : "-33%" }}
      transition={{
        duration: speed,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {duplicated.map((brand, idx) => (
        <PipelineBlock key={`${brand.id}-${idx}`} brand={brand} />
      ))}
    </motion.div>
  );
}

function PipelineBlock({ brand }) {
  return (
    <div className="group relative w-48 h-32">
      {/* 3D Block Effect using CSS Shadows.
               The 'hover' effect lifts the block slightly.
            */}
      <div className="relative w-full h-full bg-slate-900 border border-slate-700/50 backdrop-blur-md rounded-xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[10px_10px_0px_rgba(0,0,0,0.5)] shadow-[5px_5px_0px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Internal Glow on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent" />

        {/* The "Scanner" Reaction 
                    We use a mix-blend mode to make the logo glow when passing the center?
                    For simplicity, we just make it glow on hover here.
                */}
        <div className="relative w-20 h-20 filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className="object-contain invert"
          />
        </div>

        {/* Tech Detail: Barcode/ID */}
        <div className="absolute bottom-3 left-4 right-4 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-slate-600 group-hover:bg-cyan-400 group-hover:animate-progress" />
        </div>
      </div>

      {/* Reflection under the block */}
      <div className="absolute -bottom-4 left-0 w-full h-4 bg-black/20 blur-md transform scale-x-90" />
    </div>
  );
}
