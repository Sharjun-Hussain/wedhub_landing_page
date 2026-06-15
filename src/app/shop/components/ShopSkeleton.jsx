import React from "react";

export function ShopSkeleton({ viewMode = "grid" }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 transition-colors duration-300">
      {/* TOOLBAR SKELETON */}
      <div className="bg-white dark:bg-zinc-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-zinc-800 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-3 md:py-4">
            <div className="w-full md:w-64 h-11 bg-slate-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-slate-100 dark:bg-zinc-900 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 flex justify-between items-end border-b border-slate-100 dark:border-zinc-800 pb-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-900 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-slate-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
          </div>
          <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-xl p-1 h-10 w-20 animate-pulse" />
        </div>

        {viewMode === "grid" ? (
          /* GRID SKELETON */
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 md:gap-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-square bg-slate-200 dark:bg-zinc-900 rounded-2xl animate-pulse shadow-sm" />
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-slate-200 dark:bg-zinc-900 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-slate-100 dark:bg-zinc-900 rounded animate-pulse" />
                  <div className="h-6 w-1/3 bg-slate-200 dark:bg-zinc-900 rounded animate-pulse pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST SKELETON */
          <div className="grid grid-cols-2 md:flex md:flex-col gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-full">
                {/* Mobile: Grid Skeleton Card */}
                <div className="block md:hidden flex flex-col gap-4">
                  <div className="aspect-square bg-slate-200 dark:bg-zinc-900 rounded-2xl animate-pulse shadow-sm" />
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-slate-200 dark:bg-zinc-900 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-slate-100 dark:bg-zinc-900 rounded animate-pulse" />
                    <div className="h-6 w-1/3 bg-slate-200 dark:bg-zinc-900 rounded animate-pulse pt-2" />
                  </div>
                </div>
                {/* Desktop: List Skeleton Row */}
                <div className="hidden md:flex flex-col md:flex-row gap-6 bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm animate-pulse">
                  <div className="w-full md:w-56 aspect-square bg-slate-200 dark:bg-zinc-900 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-4 py-2">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-slate-100 dark:bg-zinc-900 rounded" />
                      <div className="h-8 w-3/4 bg-slate-200 dark:bg-zinc-900 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-slate-100 dark:bg-zinc-900 rounded" />
                      <div className="h-4 w-2/3 bg-slate-100 dark:bg-zinc-900 rounded" />
                    </div>
                    <div className="flex justify-between items-end pt-4">
                      <div className="h-10 w-32 bg-slate-200 dark:bg-zinc-900 rounded-lg" />
                      <div className="h-12 w-40 bg-slate-300 dark:bg-zinc-800 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
