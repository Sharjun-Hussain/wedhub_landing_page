import React from "react";

export function LoginBranding() {
  return (
    <div className="left-panel hidden lg:flex w-full lg:w-[45%] bg-[#faf9f6] dark:bg-[#130f0d] text-slate-900 dark:text-white p-8 lg:p-16 flex-col justify-between relative z-10 transition-colors duration-300">
      <div className="stagger-in">
        <Link
          href="/"
          className="inline-block shrink-0 transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/logo.png"
            alt="Foreign Emporium Logo"
            className="h-16 sm:h-20 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Middle Content */}
      <div className="max-w-md stagger-in my-12 lg:my-0">
        <h1 className="text-4xl lg:text-5xl font-serif font-black mb-6 leading-tight text-[#2c2520] dark:text-white">
          Welcome back to the world of fine taste.
        </h1>
        <p className="text-[#6d513e] dark:text-slate-400 text-lg leading-relaxed font-medium">
          "Foreign Emporium has brought the finest Belgian chocolates and
          authentic French perfumes straight to Colombo. Absolute perfection."
        </p>
        <div className="mt-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-white dark:border-zinc-700">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              Dilshan Silva
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
              Verified Customer
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs tracking-wider font-semibold text-slate-400 dark:text-zinc-500 uppercase stagger-in">
        © 2026 Foreign Emporium. All rights reserved.
      </div>
    </div>
  );
}
