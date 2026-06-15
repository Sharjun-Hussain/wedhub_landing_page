import React from "react";

export function AccountLayout({ children, activeTab }) {
  return (
    <div className="right-panel w-full lg:w-[65%] xl:w-[70%] p-6 sm:p-8 lg:p-16 min-h-screen lg:h-screen lg:overflow-y-auto bg-white dark:bg-zinc-950 transition-colors duration-300 pb-32 lg:pb-16">
      <div className="max-w-2xl mx-auto w-full pt-8">
        <div className="mb-10 flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <span>Account</span>
          <span className="text-slate-300 dark:text-zinc-700">/</span>
          <span className="text-slate-900 dark:text-white font-medium capitalize">
            {(activeTab || "profile").replace("-", " ")}
          </span>
        </div>

        <div className="min-h-[400px]">{children}</div>
      </div>
    </div>
  );
}
