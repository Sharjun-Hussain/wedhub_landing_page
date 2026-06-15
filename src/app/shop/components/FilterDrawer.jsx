"use client";

import React, { useState, useRef } from "react";
import { X, Clock } from "lucide-react";

export function FilterDrawer({
  isOpen,
  onClose,
  initialPriceRange,
  initialSortOption,
  initialBrands,
  initialConditions,
  initialOffers,
  initialNewArrivals,
  brands,
  onApply,
}) {
  const [localPriceRange, setLocalPriceRange] = useState(initialPriceRange);
  const [localSortOption, setLocalSortOption] = useState(initialSortOption);
  const [localBrands, setLocalBrands] = useState(initialBrands || []);
  const [localConditions, setLocalConditions] = useState(
    initialConditions || [],
  );
  const [localOffers, setLocalOffers] = useState(initialOffers || false);
  const [localNewArrivals, setLocalNewArrivals] = useState(
    initialNewArrivals || false,
  );
  const drawerRef = useRef(null);

  const sanitizePrice = (val, fallback = 0) => {
    if (val === "" || val === null || val === undefined) return fallback;
    const cleaned = String(val).replace(/[^0-9]/g, "");
    if (!cleaned) return fallback;
    const num = parseInt(cleaned, 10);
    if (isNaN(num)) return fallback;
    return Math.min(10000000, Math.max(0, num));
  };

  const handlePriceKeyDown = (e) => {
    if (["-", "+", "e", "E", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  const sortOptions = [
    "Recommended",
    "Newest Arrivals",
    "Price: Low to High",
    "Price: High to Low",
  ];

  const toggleBrand = (brandName) => {
    setLocalBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName],
    );
  };

  const toggleCondition = (condition) => {
    setLocalConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  };

  // Sync local state when the drawer opens to match current URL params
  React.useEffect(() => {
    if (isOpen) {
      setLocalPriceRange(initialPriceRange);
      setLocalSortOption(initialSortOption);
      setLocalBrands(initialBrands || []);
      setLocalConditions(initialConditions || []);
      setLocalOffers(initialOffers || false);
      setLocalNewArrivals(initialNewArrivals || false);
    }
  }, [
    isOpen,
    initialPriceRange,
    initialSortOption,
    initialBrands,
    initialConditions,
    initialOffers,
    initialNewArrivals,
  ]);

  return (
    <div className="relative">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 dark:bg-black/70 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-[#faf9f6] dark:bg-[#130f0d] shadow-2xl transition-transform duration-400 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col border-l border-[#e7e3d9] dark:border-[#27211d]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#efe9e0] dark:hover:bg-[#1d1815] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pr-2">
            {/* Price Range */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                Price Range
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-zinc-500 mb-1 block uppercase tracking-wider">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={localPriceRange[0] || ""}
                    onKeyDown={handlePriceKeyDown}
                    className="w-full h-10 rounded-lg border border-[#e7e3d9] dark:border-[#352d28] bg-[#efe9e0]/40 dark:bg-[#1d1815]/40 px-3 text-xs font-medium text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#0a382c]/20 dark:focus:ring-[#d4af37]/20 outline-none transition-colors"
                    onChange={(e) =>
                      setLocalPriceRange([
                        sanitizePrice(e.target.value, 0),
                        localPriceRange[1],
                      ])
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-zinc-500 mb-1 block uppercase tracking-wider">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={localPriceRange[1] === 500000 ? "" : (localPriceRange[1] || "")}
                    onKeyDown={handlePriceKeyDown}
                    className="w-full h-10 rounded-lg border border-[#e7e3d9] dark:border-[#352d28] bg-[#efe9e0]/40 dark:bg-[#1d1815]/40 px-3 text-xs font-medium text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#0a382c]/20 dark:focus:ring-[#d4af37]/20 outline-none transition-colors"
                    onChange={(e) =>
                      setLocalPriceRange([
                        localPriceRange[0],
                        e.target.value === "" ? 500000 : sanitizePrice(e.target.value, 500000),
                      ])
                    }
                  />
                </div>
              </div>
            </div>
            {/* Special Filters */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                Special Filters
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setLocalOffers(!localOffers)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    localOffers
                      ? "bg-[#0a382c]/10 dark:bg-[#d4af37]/10 border-[#0a382c]/30 dark:border-[#d4af37]/30 shadow-sm"
                      : "bg-[#efe9e0]/30 dark:bg-[#1d1815]/30 border-[#e7e3d9] dark:border-[#27211d]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        localOffers
                          ? "bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950"
                          : "bg-[#efe9e0] dark:bg-[#1d1815] text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      <span className="text-xs font-bold font-mono">%</span>
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-xs font-bold ${localOffers ? "text-[#0a382c] dark:text-[#d4af37]" : "text-zinc-800 dark:text-white"}`}
                      >
                        Offers Only
                      </p>
                      <p className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
                        Show products with active deals
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${localOffers ? "bg-[#0a382c] dark:bg-[#d4af37]" : "bg-zinc-200 dark:bg-[#1d1815]"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${localOffers ? "left-5.5" : "left-0.5"}`}
                    />
                  </div>
                </button>

                <button
                  onClick={() => setLocalNewArrivals(!localNewArrivals)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    localNewArrivals
                      ? "bg-[#0a382c]/10 dark:bg-[#d4af37]/10 border-[#0a382c]/30 dark:border-[#d4af37]/30 shadow-sm"
                      : "bg-[#efe9e0]/30 dark:bg-[#1d1815]/30 border-[#e7e3d9] dark:border-[#27211d]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        localNewArrivals
                          ? "bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950"
                          : "bg-[#efe9e0] dark:bg-[#1d1815] text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-xs font-bold ${localNewArrivals ? "text-[#0a382c] dark:text-[#d4af37]" : "text-zinc-800 dark:text-white"}`}
                      >
                        New Arrivals
                      </p>
                      <p className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
                        Show latest products
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${localNewArrivals ? "bg-[#0a382c] dark:bg-[#d4af37]" : "bg-zinc-200 dark:bg-[#1d1815]"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${localNewArrivals ? "left-5.5" : "left-0.5"}`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              onApply(
                localPriceRange,
                localSortOption,
                localBrands,
                localConditions,
                localOffers,
                localNewArrivals,
              )
            }
            className="w-full bg-[#0a382c] hover:bg-[#104e3e] dark:bg-[#d4af37] dark:hover:bg-[#c49f32] text-white dark:text-zinc-950 font-bold h-12 rounded-xl mt-4 shadow-sm transition-all active:scale-[0.98]"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}
