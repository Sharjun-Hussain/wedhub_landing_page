"use client";

import React from "react";
import {
  Cookie,
  Sparkles,
  Baby,
  Coffee,
  ShoppingBag,
  Store,
  Grid,
} from "lucide-react";

export const getCategoryIcon = (slug, className) => {
  if (!slug) return <Grid className={className} />;

  const lowerSlug = slug.toLowerCase();

  // Substring matching for dynamic API slugs
  if (
    lowerSlug.includes("chocolate") ||
    lowerSlug.includes("sweet") ||
    lowerSlug.includes("candy")
  )
    return <Cookie className={className} />;
  if (
    lowerSlug.includes("perfume") ||
    lowerSlug.includes("fragrance") ||
    lowerSlug.includes("scent") ||
    lowerSlug.includes("beauty")
  )
    return <Sparkles className={className} />;
  if (
    lowerSlug.includes("baby") ||
    lowerSlug.includes("infant") ||
    lowerSlug.includes("kid")
  )
    return <Baby className={className} />;
  if (
    lowerSlug.includes("juice") ||
    lowerSlug.includes("drink") ||
    lowerSlug.includes("beverage") ||
    lowerSlug.includes("coffee")
  )
    return <Coffee className={className} />;
  if (
    lowerSlug.includes("pantry") ||
    lowerSlug.includes("grocery") ||
    lowerSlug.includes("food")
  )
    return <Store className={className} />;

  // Fallback dictionary for exact matches (legacy CMS support)
  const exactMatches = {
    chocolate: Cookie,
    perfume: Sparkles,
    baby: Baby,
    pantry: Store,
    juice: Coffee,
  };

  const IconComponent = exactMatches[lowerSlug] || Grid;
  return <IconComponent className={className} />;
};
