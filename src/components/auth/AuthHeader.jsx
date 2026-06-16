"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AuthHeader() {
  const router = useRouter();

  return (
    <>
      {/* Mobile top bar: back button only */}
      <div className="lg:hidden w-full flex items-center px-6 h-14 absolute top-0 left-0 right-0 z-30">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-zinc-800 transition-all active:scale-90 active:bg-slate-200 dark:active:bg-zinc-800"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile-only large centered logo below the back button */}
      <div className="lg:hidden w-full flex justify-center pt-20 pb-4 relative z-20">
        <Link
          href="/"
          className="block transition-transform active:scale-95 shrink-0"
        >
          <img
            src="/logo.png"
            alt="WedHub Logo"
            className="h-24 sm:h-28 w-auto object-contain rounded-lg"
          />
        </Link>
      </div>
    </>
  );
}
