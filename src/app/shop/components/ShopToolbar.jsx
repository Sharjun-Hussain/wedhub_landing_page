"use client";

import React from "react";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Grid,
  Smartphone,
  Headphones,
  Watch,
  Laptop,
  Zap,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CATEGORY_ICON_MAP = {
  All: Grid,
  "Mobile Phones": Smartphone,
  Phones: Smartphone,
  Audio: Headphones,
  Wearables: Watch,
  Laptops: Laptop,
  Gaming: Zap,
  Accessories: SlidersHorizontal,
};

export function ShopToolbar({
  categories,
  categoryParam,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFilterOpen,
  isFooterVisible,
  sort,
  onSortChange,
  subCategoriesList = [],
  subCategoryId = null,
  onSubCategorySelect,
  sidebarView = "categories",
  setSidebarView,
  activeSidebarCategory = null,
  setActiveSidebarCategory,
}) {
  return (
    <div
      className={`sticky top-14 md:top-14 z-40 bg-[#faf9f6]/95 dark:bg-[#130f0d]/95 backdrop-blur-xl border-b border-[#e7e3d9] dark:border-[#27211d] transition-all duration-500 ease-in-out ${isFooterVisible ? "-translate-y-[200%]" : "translate-y-0"}`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2.5">

          {/* Categories — horizontal scroll */}
          <div className="flex-1 overflow-x-auto no-scrollbar md:hidden">
            {sidebarView === "categories" ? (
              <div className="flex items-center gap-1.5 pr-2 animate-sidebar-slide-back">
                {categories.map((cat) => {
                  const Icon = CATEGORY_ICON_MAP[cat.name] || Grid;
                  const isActive = categoryParam === cat.name;
                  return (
                    <button
                      key={cat.id || cat.name}
                      onClick={() => onCategoryChange(cat.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                        isActive
                          ? "bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 shadow-sm"
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-[#efe9e0] dark:hover:bg-[#1d1815] hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pr-2 animate-sidebar-slide-in">
                {/* Back Button */}
                <button
                  onClick={() => {
                    setSidebarView("categories");
                    setActiveSidebarCategory(null);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0a382c] dark:text-[#d4af37] bg-[#0a382c]/10 dark:bg-[#d4af37]/10 hover:bg-[#0a382c]/20 dark:hover:bg-[#d4af37]/20 transition-all duration-200 shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                {/* Shop All Option */}
                <button
                  onClick={() => {
                    onSubCategorySelect(null);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    subCategoryId === null
                      ? "bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-[#efe9e0] dark:hover:bg-[#1d1815] hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  Shop All
                </button>

                {/* Subcategories list */}
                {subCategoriesList
                  .filter((sub) => String(sub.category_id) === String(activeSidebarCategory?.id))
                  .map((subcat) => {
                    const isSelected = subCategoryId === subcat.id;
                    return (
                      <button
                        key={subcat.id}
                        onClick={() => {
                          onSubCategorySelect(subcat);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                          isSelected
                            ? "bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 shadow-sm"
                            : "text-zinc-500 dark:text-zinc-400 hover:bg-[#efe9e0] dark:hover:bg-[#1d1815] hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        {subcat.name}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative w-40 sm:w-52 shrink-0 hidden sm:block md:w-64 md:mr-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-8 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg pl-8 pr-3 text-xs font-medium outline-none focus:ring-2 focus:ring-[#a97d43]/30 dark:focus:ring-[#d4af37]/20 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 transition-all"
            />
          </div>

          {/* Sorting Dropdown (Desktop Only) */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest whitespace-nowrap">
              Sort by:
            </span>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-[#0a382c] dark:hover:text-[#d4af37] transition-colors outline-none group bg-[#efe9e0] dark:bg-[#1d1815] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#e7e3d9] dark:border-[#352d28]">
                  {sort}
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37] transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 p-1 rounded-xl border border-[#e7e3d9] dark:border-[#27211d] bg-[#faf9f6]/95 dark:bg-[#130f0d]/95 backdrop-blur-xl shadow-2xl z-50"
              >
                {[
                  "Recommended",
                  "Newest Arrivals",
                  "Price: Low to High",
                  "Price: High to Low",
                ].map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => onSortChange(opt)}
                    className={`rounded-lg px-3 py-2 text-xs font-bold cursor-pointer transition-colors ${sort === opt ? "bg-[#0a382c]/10 dark:bg-[#d4af37]/10 text-[#0a382c] dark:text-[#d4af37]" : "text-zinc-600 dark:text-zinc-400 hover:bg-[#efe9e0] dark:hover:bg-[#1d1815] hover:text-zinc-800 dark:hover:text-zinc-200"}`}
                  >
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#efe9e0] dark:bg-[#1d1815] rounded-lg p-0.5 border border-[#e7e3d9] dark:border-[#352d28] shrink-0">
            <button
              onClick={() => onViewModeChange("grid")}
              title="Grid View"
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-[#faf9f6] dark:bg-[#2a211b] text-[#a97d43] dark:text-[#d4af37] shadow-sm"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              title="List View"
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-[#faf9f6] dark:bg-[#2a211b] text-[#a97d43] dark:text-[#d4af37] shadow-sm"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter Button */}
          <button
            onClick={onFilterOpen}
            title="Filters"
            className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-[#0a382c] dark:bg-[#d4af37] hover:bg-[#104e3e] dark:hover:bg-[#b89569] text-white dark:text-zinc-950 shadow-sm transition-all active:scale-95 md:hidden"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </div>
  );
}
