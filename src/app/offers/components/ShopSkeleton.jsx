import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ShopSkeleton({ viewMode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] max-w-full" />
              <Skeleton className="h-4 w-[200px] max-w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
