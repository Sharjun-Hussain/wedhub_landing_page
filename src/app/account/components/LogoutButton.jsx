"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

export function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-4 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors w-full p-2"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium text-sm">Sign Out</span>
      </button>

      <LogoutConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
