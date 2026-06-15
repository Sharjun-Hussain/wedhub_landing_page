import React from "react";
import Image from "next/image";

export const SocialButton = ({ icon: Icon, image, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-3 w-full h-12 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all active:scale-[0.98]"
  >
    {image ? (
      <Image
        src={image}
        alt={label}
        width={20}
        height={20}
        className="object-contain"
      />
    ) : (
      Icon && (
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300" />
      )
    )}
    <span className="text-[12px] sm:text-sm font-bold text-slate-700 dark:text-slate-300">
      {label}
    </span>
  </button>
);
