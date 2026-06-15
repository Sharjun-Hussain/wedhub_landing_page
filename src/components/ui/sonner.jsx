"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
        info: <Info className="w-5 h-5 text-[#a97d43] shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        close: <X className="w-3.5 h-3.5" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-white dark:group-[.toaster]:!bg-zinc-900 group-[.toaster]:!text-slate-900 dark:group-[.toaster]:!text-white group-[.toaster]:!border group-[.toaster]:!border-slate-200 dark:group-[.toaster]:!border-zinc-800 group-[.toaster]:!shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:group-[.toaster]:!shadow-[0_4px_12px_rgba(0,0,0,0.2)] group-[.toaster]:!rounded-full group-[.toaster]:!py-2.5 group-[.toaster]:!px-4 group-[.toaster]:!flex group-[.toaster]:!items-center group-[.toaster]:!gap-3",
          title:
            "group-[.toast]:!font-semibold group-[.toast]:!text-[14px]",
          description:
            "hidden", // Hides the description to enforce a compact one-line design
          actionButton:
            "group-[.toast]:!bg-[#2c2520] dark:group-[.toast]:!bg-[#d4af37] group-[.toast]:!text-white dark:group-[.toast]:!text-zinc-950 group-[.toast]:!font-bold group-[.toast]:!rounded-full group-[.toast]:!px-3 group-[.toast]:!py-1.5",
          cancelButton:
            "group-[.toast]:!bg-slate-100 dark:group-[.toast]:!bg-zinc-800 group-[.toast]:!text-slate-800 dark:group-[.toast]:!text-zinc-200 group-[.toast]:!font-bold group-[.toast]:!rounded-full group-[.toast]:!px-3 group-[.toast]:!py-1.5",
          closeButton:
            "group-[.toast]:!rounded-full dark:group-[.toast]:!bg-zinc-800 dark:group-[.toast]:!border-zinc-700 hover:group-[.toast]:!opacity-80 group-[.toast]:!left-auto group-[.toast]:!right-2 group-[.toast]:!top-1/2 group-[.toast]:!-translate-y-1/2 group-[.toast]:!w-6 group-[.toast]:!h-6 group-[.toast]:!flex group-[.toast]:!items-center group-[.toast]:!justify-center group-[.toast]:!bg-transparent",
          success: "",
          error: "",
          info: "",
          warning: "",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
