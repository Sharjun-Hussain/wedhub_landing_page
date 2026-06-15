"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export const LogoutConfirmModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useGSAP(
    () => {
      if (isOpen) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
      }
    },
    { scope: modalRef, dependencies: [isOpen] },
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400">
          <LogOut className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Sign Out?
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Are you sure you want to sign out of your account?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-3.5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
          >
            Sign Out
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
