"use client";

import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import useSWR from "swr";
import { X, ChevronDown, ChevronRight, Loader2, ChevronLeft } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  fetchProducts,
  transformProduct,
  fetchCategories,
  fetchSubCategories,
  fetchBrands,
} from "@/lib/api";
import { QuickView } from "@/components/shop/QuickView";
import { ShopHero } from "./ShopHero";
import { OffersHero } from "./OffersHero";
import { ShopToolbar } from "./ShopToolbar";
import { FilterDrawer } from "./FilterDrawer";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutGrid } from "lucide-react";

export function ShopContent({
  initialProducts,
  initialCategories,
  initialBrands,
  initialCmsData,
  isOffersPage = false,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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

  const sanitizeSearchQuery = (query) => {
    if (typeof query !== "string") return "";

    // 1. Decode recursively to catch double-encoded or multiple-encoded payloads
    let decoded = query;
    let prev = "";
    let depth = 0;
    while (decoded !== prev && decoded.includes("%") && depth < 5) {
      prev = decoded;
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {
        break;
      }
      depth++;
    }

    // 2. Remove angle brackets to prevent HTML/XML/SVG tag insertion
    let clean = decoded.replace(/[<>]/g, "");

    // 3. Remove javascript:, data:, vbscript: protocols and common XSS vectors case-insensitively
    clean = clean.replace(/(javascript|data|vbscript)\s*:/gi, "");
    clean = clean.replace(/\b(alert|prompt|confirm|eval|onload|onerror|onclick|onmouseover)\b/gi, "");

    // 4. Limit length to prevent buffer overflow/DoS
    if (clean.length > 100) {
      clean = clean.slice(0, 100);
    }
    return clean;
  };

  // 1. URL STATE — only q (search) stays in the URL for bookmarkability
  const searchParam = sanitizeSearchQuery(searchParams.get("q") || "");

  // 2. LOCAL FILTER STATE — initialize from URL params to support deep linking
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState(searchParams.get("subCategory") || "");
  const [sidebarView, setSidebarView] = useState("categories");
  const [activeSidebarCategory, setActiveSidebarCategory] = useState(null);
  const [minPrice, setMinPrice] = useState(parseInt(searchParams.get("minPrice")) || 0);
  const [maxPrice, setMaxPrice] = useState(parseInt(searchParams.get("maxPrice")) || 500000);
  const [sort, setSort] = useState(searchParams.get("sort") || "Recommended");
  const [brands, setBrands] = useState(searchParams.get("brands") ? searchParams.get("brands").split(",") : []);
  const [conditions, setConditions] = useState(searchParams.get("conditions") ? searchParams.get("conditions").split(",") : []);
  const [offers, setOffers] = useState(searchParams.get("offers") === "true");
  const [newArrivals, setNewArrivals] = useState(searchParams.get("newArrivals") === "true");

  // Keep apiResponse for category/brand SWR (still needed)
  const apiResponse = null;

  const { data: catResponse } = useSWR("categories", fetchCategories, {
    fallbackData: initialCategories,
    revalidateOnFocus: false,
  });

  const { data: subcatResponse } = useSWR("subcategories", fetchSubCategories, {
    revalidateOnFocus: false,
  });

  const { data: brandResponse } = useSWR("brands", fetchBrands, {
    fallbackData: initialBrands,
    revalidateOnFocus: false,
  });

  // 4. DATA PROCESSING — brands from SWR (separate from filter state var)
  const categories = useMemo(() => {
    const base = [{ name: "All", slug: "all" }];
    if (!catResponse?.data) return base;
    return [
      ...base,
      ...catResponse.data.map((cat) => ({
        name: cat.name,
        id: cat.id,
        slug: cat.slug || cat.name,
      })),
    ];
  }, [catResponse]);

  const availableBrands = useMemo(
    () => brandResponse?.data || [],
    [brandResponse],
  );

  const subCategoriesList = useMemo(() => {
    return subcatResponse?.data || [];
  }, [subcatResponse]);

  // Auto-open subcategory sheet on initial load if category has subcategories
  const hasInitializedSubcatView = useRef(false);
  useEffect(() => {
    if (!hasInitializedSubcatView.current && category && category !== "All" && categories.length > 1 && subCategoriesList.length > 0) {
      const cat = categories.find((c) => c.name === category);
      if (cat) {
        const associatedSubs = subCategoriesList.filter(
          (sub) => String(sub.category_id) === String(cat.id)
        );
        if (associatedSubs.length > 0) {
          setActiveSidebarCategory(cat);
          setSidebarView("subcategories");

          // Sync subCategoryId if subCategory name is present in URL
          if (selectedSubCategoryName) {
            const sub = associatedSubs.find((s) => s.name === selectedSubCategoryName);
            if (sub) {
              setSubCategoryId(sub.id);
            }
          }
        }
      }
      hasInitializedSubcatView.current = true;
    }
  }, [category, categories, subCategoriesList, selectedSubCategoryName]);

  // 3. LOCAL UI STATE
  const [viewMode, setViewMode] = useState("grid");
  const [searchInput, setSearchInput] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Infinite scroll state
  const isFirstRender = useRef(true);
  const [infinitePage, setInfinitePage] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState(() => {
    const raw = initialProducts?.data?.data || initialProducts?.data || [];
    return Array.isArray(raw) ? raw.map(transformProduct) : [];
  });
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(() => {
    const raw = initialProducts?.data?.data || initialProducts?.data || [];
    const lastPage = initialProducts?.data?.last_page || 1;
    return 1 < lastPage && raw.length > 0;
  });
  const sentinelRef = useRef(null);
  const PER_PAGE = 24;

  // View Mode persistence (Client-side only)
  useEffect(() => {
    const savedView = localStorage.getItem("shop_view_mode");
    if (savedView && (savedView === "grid" || savedView === "list")) {
      setViewMode(savedView);
    }
  }, []);

  const handleSetViewMode = useCallback((mode) => {
    setViewMode(mode);
    localStorage.setItem("shop_view_mode", mode);
  }, []);

  // URL update helper — ONLY used for search and page
  const updateUrlParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Debounced Search Sync (search goes to URL for shareability)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        updateUrlParams({ q: searchInput, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, searchParam, updateUrlParams]);

  // Sync search input if URL changes externally (e.g., back/forward nav)
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const filterKey = useMemo(() => JSON.stringify({
    category,
    subCategoryId,
    searchParam,
    minPrice,
    maxPrice,
    sort,
    brands,
    conditions,
    offers,
    newArrivals,
  }), [category, subCategoryId, searchParam, minPrice, maxPrice, sort, brands, conditions, offers, newArrivals]);

  // Reset infinite scroll whenever filters change
  useEffect(() => {
    if (isFirstRender.current) {
      return;
    }
    setInfinitePage(1);
    setDisplayedProducts([]);
    setHasMore(true);
  }, [filterKey]);

  // Fetch a page of products
  const fetchPage = useCallback(async (page) => {
    setIsFetchingMore(true);
    try {
      const catObj = category !== "All" ? categories.find((c) => c.name === category) : null;
      const data = await fetchProducts({
        category_id: catObj?.id || undefined,
        subcategory_id: subCategoryId || undefined,
        q: searchParam,
        minPrice,
        maxPrice,
        sort,
        brands,
        conditions,
        page,
        per_page: PER_PAGE,
        is_offer: (offers || isOffersPage) ? 1 : undefined,
        is_new_arrival: newArrivals ? 1 : undefined,
      });

      const raw = data?.data?.data || data?.data || [];
      let newProducts = Array.isArray(raw) ? raw.map(transformProduct) : [];

      if (minPrice > 0 || maxPrice < 500000)
        newProducts = newProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
      if (conditions?.length > 0)
        newProducts = newProducts.filter(p => p.condition && conditions.map(c => c.toLowerCase()).includes(p.condition.toLowerCase()));
      if (brands?.length > 0)
        newProducts = newProducts.filter(p => p.brand && brands.includes(p.brand));
      if (subCategoryId)
        newProducts = newProducts.filter(p => p._apiData?.subcategory_id === subCategoryId);
      if (offers && !isOffersPage) newProducts = newProducts.filter(p => p.isOffer);
      if (newArrivals) newProducts = newProducts.filter(p => p.isNewArrival);

      const lastPage = data?.data?.last_page || 1;
      setHasMore(page < lastPage && newProducts.length > 0);
      setDisplayedProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts]);
    } catch (e) {
      console.error("[InfiniteScroll] Failed to fetch page:", e);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  }, [category, categories, subCategoryId, searchParam, minPrice, maxPrice, sort, brands, conditions, offers, newArrivals, isOffersPage]);

  // Initial + filter-reset fetch
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (displayedProducts.length > 0) {
        return;
      }
    }
    fetchPage(1);
  }, [filterKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // IntersectionObserver sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetchingMore) {
          setInfinitePage(prev => {
            const next = prev + 1;
            fetchPage(next);
            return next;
          });
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, fetchPage]);

  const products = displayedProducts;

  // 5. HANDLERS — all filters update local state, no URL change
  const handleCategoryChange = useCallback((name) => {
    if (name === "All") {
      setCategory("All");
      setSubCategoryId(null);
      setSelectedSubCategoryName("");
      setSidebarView("categories");
      setActiveSidebarCategory(null);
      updateUrlParams({ category: null, subCategory: null, page: 1 });
      return;
    }

    const cat = categories.find((c) => c.name === name);
    if (cat) {
      updateUrlParams({ category: name, subCategory: null, page: 1 });
      const associatedSubs = subCategoriesList.filter(
        (sub) => String(sub.category_id) === String(cat.id)
      );

      if (associatedSubs.length > 0) {
        setCategory(name);
        setSubCategoryId(null);
        setSelectedSubCategoryName("");
        setActiveSidebarCategory(cat);
        setSidebarView("subcategories");
      } else {
        setCategory(name);
        setSubCategoryId(null);
        setSelectedSubCategoryName("");
        setSidebarView("categories");
        setActiveSidebarCategory(null);
      }
    }
  }, [categories, subCategoriesList, updateUrlParams]);

  const handleApplyFilters = useCallback(
    (
      priceRange,
      newSort,
      newBrands,
      newConditions,
      newOffers,
      newNewArrivals,
    ) => {
      setMinPrice(priceRange[0]);
      setMaxPrice(priceRange[1]);
      setSort(newSort);
      setBrands(newBrands);
      setConditions(newConditions);
      setOffers(newOffers);
      setNewArrivals(newNewArrivals);
      setIsFilterOpen(false);

      updateUrlParams({
        minPrice: priceRange[0] > 0 ? priceRange[0] : null,
        maxPrice: priceRange[1] < 500000 ? priceRange[1] : null,
        sort: newSort !== "Recommended" ? newSort : null,
        brands: newBrands.length > 0 ? newBrands.join(",") : null,
        conditions: newConditions.length > 0 ? newConditions.join(",") : null,
        offers: newOffers ? "true" : null,
        newArrivals: newNewArrivals ? "true" : null,
        page: 1,
      });
    },
    [updateUrlParams],
  );

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setCategory("All");
    setSubCategoryId(null);
    setSelectedSubCategoryName("");
    setMinPrice(0);
    setMaxPrice(500000);
    setSort("Recommended");
    setBrands([]);
    setConditions([]);
    setOffers(false);
    setNewArrivals(false);
    setSidebarView("categories");
    setActiveSidebarCategory(null);
    updateUrlParams({ 
      q: null, 
      category: null,
      subCategory: null,
      minPrice: null,
      maxPrice: null,
      sort: null,
      brands: null,
      conditions: null,
      offers: null,
      newArrivals: null,
      page: null 
    });
  }, [updateUrlParams]);

  const handleSetSort = useCallback((newSort) => setSort(newSort), []);
  const handleSetPage = useCallback(
    (page) => updateUrlParams({ page }),
    [updateUrlParams],
  );

  // 6. FOOTER VISIBILITY
  useEffect(() => {
    const footer = document.getElementById("main-footer");
    if (!footer) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsFooterVisible(e.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  const memoizedPriceRange = useMemo(
    () => [minPrice, maxPrice],
    [minPrice, maxPrice],
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#130f0d] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <style>{`
        @keyframes sidebarSlideIn {
          from { transform: translate3d(20px, 0, 0); opacity: 0; }
          to { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes sidebarSlideBack {
          from { transform: translate3d(-20px, 0, 0); opacity: 0; }
          to { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        .animate-sidebar-slide-in {
          animation: sidebarSlideIn 0.25s ease-out forwards;
        }
        .animate-sidebar-slide-back {
          animation: sidebarSlideBack 0.25s ease-out forwards;
        }
      `}</style>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialPriceRange={memoizedPriceRange}
        initialSortOption={sort}
        initialBrands={brands}
        initialConditions={conditions}
        initialOffers={offers}
        initialNewArrivals={newArrivals}
        brands={availableBrands}
        onApply={handleApplyFilters}
      />

      {isOffersPage ? (
        <OffersHero cmsData={initialCmsData} />
      ) : (
        <ShopHero cmsData={initialCmsData} />
      )}

      <ShopToolbar
        categories={categories}
        categoryParam={category}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchInput}
        onSearchChange={(val) => setSearchInput(sanitizeSearchQuery(val))}
        viewMode={viewMode}
        onViewModeChange={handleSetViewMode}
        onFilterOpen={() => setIsFilterOpen(true)}
        isFooterVisible={isFooterVisible}
        sort={sort}
        onSortChange={handleSetSort}
        subCategoriesList={subCategoriesList}
        subCategoryId={subCategoryId}
        onSubCategorySelect={(subcat) => {
          setSubCategoryId(subcat?.id || null);
          setSelectedSubCategoryName(subcat?.name || "");
          updateUrlParams({ subCategory: subcat?.name || null, page: 1 });
        }}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
        activeSidebarCategory={activeSidebarCategory}
        setActiveSidebarCategory={setActiveSidebarCategory}
      />

      {/* ACTIVE FILTERS CHIPS */}
      {(category !== "All" ||
        selectedSubCategoryName !== "" ||
        searchParam !== "" ||
        brands.length > 0 ||
        minPrice > 0 ||
        maxPrice < 500000 ||
        conditions.length > 0 ||
        (offers && !isOffersPage) ||
        newArrivals) && (
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mr-2">
                Active Filters:
              </span>
              {category !== "All" && (
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#0a382c] dark:hover:border-[#d4af37] transition-colors group"
                >
                  Category: {category}{" "}
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37]" />
                </button>
              )}
              {selectedSubCategoryName && (
                <button
                  onClick={() => {
                    setSubCategoryId(null);
                    setSelectedSubCategoryName("");
                    updateUrlParams({ subCategory: null, page: 1 });
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#0a382c] dark:hover:border-[#d4af37] transition-colors group"
                >
                  Subcategory: {selectedSubCategoryName}{" "}
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37]" />
                </button>
              )}
              {searchParam !== "" && (
                <button
                  onClick={() => setSearchInput("")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#0a382c] dark:hover:border-[#d4af37] transition-colors group"
                >
                  Search: {searchParam}{" "}
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37]" />
                </button>
              )}
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    const newBrands = brands.filter((b) => b !== brand);
                    setBrands(newBrands);
                    updateUrlParams({ brands: newBrands.length > 0 ? newBrands.join(",") : null, page: 1 });
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#0a382c] dark:hover:border-[#d4af37] transition-colors group"
                >
                  Brand: {brand}{" "}
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37]" />
                </button>
              ))}
              {conditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => {
                    const newConds = conditions.filter((c) => c !== cond);
                    setConditions(newConds);
                    updateUrlParams({ conditions: newConds.length > 0 ? newConds.join(",") : null, page: 1 });
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#0a382c] dark:hover:border-[#d4af37] transition-colors group"
                >
                  Condition: {cond}{" "}
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37]" />
                </button>
              ))}
              {(minPrice > 0 || maxPrice < 500000) && (
                <button
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(500000);
                    updateUrlParams({ minPrice: null, maxPrice: null, page: 1 });
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#0a382c] dark:hover:border-[#d4af37] transition-colors group"
                >
                  Price: {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}{" "}
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37]" />
                </button>
              )}
              {offers && !isOffersPage && (
                <button
                  onClick={() => {
                    setOffers(false);
                    updateUrlParams({ offers: null, page: 1 });
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#0a382c] dark:hover:border-[#d4af37] transition-colors group"
                >
                  Filter: Offers Only{" "}
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37]" />
                </button>
              )}
              {newArrivals && (
                <button
                  onClick={() => {
                    setNewArrivals(false);
                    updateUrlParams({ newArrivals: null, page: 1 });
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#efe9e0] dark:bg-[#1d1815] border border-[#e7e3d9] dark:border-[#352d28] rounded-lg text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#0a382c] dark:hover:border-[#d4af37] transition-colors group"
                >
                  Filter: New Arrivals{" "}
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-[#0a382c] dark:group-hover:text-[#d4af37]" />
                </button>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#0a382c] dark:text-[#d4af37] hover:underline ml-2 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT SIDEBAR: Filters (Visible on md and up) */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Category/Subcategory Filter list */}
              <div className="relative overflow-hidden">
                {sidebarView === "categories" ? (
                  <div className="animate-sidebar-slide-back">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
                      Shop by Category
                    </h3>
                    <ul className="space-y-1">
                      {categories.map((cat) => {
                        const isActive = category === cat.name;
                        return (
                          <li key={cat.id || cat.name}>
                            <button
                              onClick={() => handleCategoryChange(cat.name)}
                              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 active:scale-[0.98] group ${isActive
                                ? "bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 shadow-md"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-[#0a382c]/6 dark:hover:bg-[#d4af37]/8 hover:text-[#0a382c] dark:hover:text-[#d4af37]"
                                }`}
                            >
                              <span className="truncate transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                                {cat.name}
                              </span>
                              <ChevronRight
                                className={`w-4 h-4 transition-all duration-300 ease-out ${isActive
                                  ? "opacity-100 translate-x-0"
                                  : "opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 text-[#a97d43] dark:text-[#d4af37]"
                                  }`}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="animate-sidebar-slide-in space-y-4">
                    {/* Back Button */}
                    <button
                      onClick={() => {
                        setSidebarView("categories");
                        setActiveSidebarCategory(null);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-[#0a382c] dark:text-[#d4af37] bg-[#0a382c]/10 dark:bg-[#d4af37]/10 hover:bg-[#0a382c]/20 dark:hover:bg-[#d4af37]/20 transition-all duration-200 active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to Categories
                    </button>

                    {/* Section Header */}
                    <div>
                      <span className="text-[10px] font-bold text-[#a97d43] dark:text-[#d4af37] tracking-widest uppercase block mb-1">
                        Category
                      </span>
                      <h3 className="text-lg font-serif font-black text-slate-900 dark:text-white leading-tight">
                        {activeSidebarCategory?.name}
                      </h3>
                      <div className="h-0.5 w-8 bg-[#a97d43] dark:bg-[#d4af37] mt-2" />
                    </div>

                    {/* Subcategories List */}
                    <ul className="space-y-1.5 pt-1">
                      {/* Shop All Option */}
                      <li>
                        <button
                          onClick={() => {
                            setCategory(activeSidebarCategory.name);
                            setSubCategoryId(null);
                            setSelectedSubCategoryName("");
                            updateUrlParams({ category: activeSidebarCategory.name, subCategory: null, page: 1 });
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 active:scale-[0.98] group ${subCategoryId === null
                            ? "bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 shadow-md"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-[#0a382c]/6 dark:hover:bg-[#d4af37]/8 hover:text-[#0a382c] dark:hover:text-[#d4af37]"
                            }`}
                        >
                          <span className="truncate transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                            Shop All {activeSidebarCategory?.name}
                          </span>
                          <ChevronRight
                            className={`w-4 h-4 transition-all duration-300 ease-out ${subCategoryId === null
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 text-[#a97d43] dark:text-[#d4af37]"
                              }`}
                          />
                        </button>
                      </li>

                      {/* Subcategories list */}
                      {subCategoriesList
                        .filter((sub) => String(sub.category_id) === String(activeSidebarCategory?.id))
                        .map((subcat) => {
                          const isSelected = subCategoryId === subcat.id;
                          return (
                            <li key={subcat.id}>
                              <button
                                onClick={() => {
                                  setCategory(activeSidebarCategory.name);
                                  setSubCategoryId(subcat.id);
                                  setSelectedSubCategoryName(subcat.name);
                                  updateUrlParams({ category: activeSidebarCategory.name, subCategory: subcat.name, page: 1 });
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 active:scale-[0.98] group ${isSelected
                                  ? "bg-[#0a382c] dark:bg-[#d4af37] text-white dark:text-zinc-950 shadow-md"
                                  : "text-zinc-600 dark:text-zinc-400 hover:bg-[#0a382c]/6 dark:hover:bg-[#d4af37]/8 hover:text-[#0a382c] dark:hover:text-[#d4af37]"
                                  }`}
                              >
                                <span className="truncate transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                                  {subcat.name}
                                </span>
                                <ChevronRight
                                  className={`w-4 h-4 transition-all duration-300 ease-out ${isSelected
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 text-[#a97d43] dark:text-[#d4af37]"
                                    }`}
                                />
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </div>

              <div className="h-px bg-[#e7e3d9] dark:bg-[#27211d]" />

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
                  Price Range
                </h3>
                <div className="flex gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice || ""}
                      onKeyDown={handlePriceKeyDown}
                      className="w-full h-10 rounded-xl border border-[#e7e3d9] dark:border-[#352d28] bg-white dark:bg-[#1a1714] px-3.5 text-[13px] font-bold text-zinc-900 dark:text-white focus:ring-1 focus:ring-[#0a382c] dark:focus:ring-[#d4af37] outline-none transition-colors"
                      onChange={(e) => setMinPrice(sanitizePrice(e.target.value, 0))}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice === 500000 ? "" : maxPrice}
                      onKeyDown={handlePriceKeyDown}
                      className="w-full h-10 rounded-xl border border-[#e7e3d9] dark:border-[#352d28] bg-white dark:bg-[#1a1714] px-3.5 text-[13px] font-bold text-zinc-900 dark:text-white focus:ring-1 focus:ring-[#0a382c] dark:focus:ring-[#d4af37] outline-none transition-colors"
                      onChange={(e) => setMaxPrice(e.target.value === "" ? 500000 : sanitizePrice(e.target.value, 500000))}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#e7e3d9] dark:bg-[#27211d]" />

              {/* Special Filters */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
                  Status
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setOffers(!offers)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-[13px] font-bold transition-all duration-200 active:scale-[0.98] ${offers
                      ? "bg-[#0a382c]/10 dark:bg-[#d4af37]/10 border-[#0a382c]/30 dark:border-[#d4af37]/30 text-[#0a382c] dark:text-[#d4af37]"
                      : "bg-white dark:bg-[#1a1714] border-[#e7e3d9] dark:border-[#27211d] text-zinc-700 dark:text-zinc-300"
                      }`}
                  >
                    <span>Offers Only</span>
                    <div
                      className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${offers ? "bg-[#0a382c] dark:bg-[#d4af37]" : "bg-zinc-200 dark:bg-[#27211d]"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${offers ? "left-4.5" : "left-0.5"}`}
                      />
                    </div>
                  </button>

                  <button
                    onClick={() => setNewArrivals(!newArrivals)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-[13px] font-bold transition-all duration-200 active:scale-[0.98] ${newArrivals
                      ? "bg-[#0a382c]/10 dark:bg-[#d4af37]/10 border-[#0a382c]/30 dark:border-[#d4af37]/30 text-[#0a382c] dark:text-[#d4af37]"
                      : "bg-white dark:bg-[#1a1714] border-[#e7e3d9] dark:border-[#27211d] text-zinc-700 dark:text-zinc-300"
                      }`}
                  >
                    <span>New Arrivals</span>
                    <div
                      className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${newArrivals ? "bg-[#0a382c] dark:bg-[#d4af37]" : "bg-zinc-200 dark:bg-[#27211d]"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${newArrivals ? "left-4.5" : "left-0.5"}`}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT LIST AREA */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 md:mb-8 flex justify-between items-end gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate max-w-[60%] sm:max-w-none transition-all duration-300">
                {category}
              </h2>
              <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-4 shrink-0 transition-all duration-300 md:hidden">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest whitespace-nowrap">
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
                          onClick={() => handleSetSort(opt)}
                          className={`rounded-lg px-3 py-2 text-xs font-bold cursor-pointer transition-colors ${sort === opt ? "bg-[#0a382c]/10 dark:bg-[#d4af37]/10 text-[#0a382c] dark:text-[#d4af37]" : "text-zinc-600 dark:text-zinc-400 hover:bg-[#efe9e0] dark:hover:bg-[#1d1815] hover:text-zinc-800 dark:hover:text-zinc-200"}`}
                        >
                          {opt}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                  <LayoutGrid className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-slate-500 dark:text-zinc-500 max-w-xs">
                  We couldn't find any products matching your current filters. Try
                  adjusting them.
                </p>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-8 md:gap-x-6 md:gap-y-12"
                      : "grid grid-cols-2 md:flex md:flex-col gap-4 md:gap-6"
                  }
                >
                  {products.map((product, index) => (
                    <div key={`${product.id}-${index}`} className="w-full">
                      <div className={viewMode === "grid" ? "block" : "block md:hidden"}>
                        <ProductCard
                          product={product}
                          onQuickView={setQuickViewProduct}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${Math.min(index, 8) * 0.04}s`, opacity: 0 }}
                        />
                      </div>
                      {viewMode === "list" && (
                        <div className="hidden md:block">
                          <ProductListItem
                            product={product}
                            onQuickView={setQuickViewProduct}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${Math.min(index, 8) * 0.04}s`, opacity: 0 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* INFINITE SCROLL SENTINEL */}
                <div ref={sentinelRef} className="h-1" />

                {/* Loading spinner */}
                {isFetchingMore && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 text-[#0a382c] dark:text-[#d4af37] animate-spin" />
                  </div>
                )}

                {/* End of results */}
                {!hasMore && products.length > 0 && (
                  <p className="text-center text-sm text-zinc-400 dark:text-zinc-600 py-10 font-medium">
                    You&apos;ve seen all {products.length} products
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
