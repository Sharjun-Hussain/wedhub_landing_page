// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://fe.inzeedo.lk/api/v1";

// Generic fetcher for SWR
export const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");

    // Clone before reading so we can fall back to .text() if .json() fails
    const cloned = response.clone();
    try {
      error.info = await cloned.json();
    } catch (e) {
      // If parsing JSON fails (e.g. 500 HTML page), fall back to text or status text
      try {
        error.info = {
          message: (await response.text()) || response.statusText,
        };
      } catch {
        error.info = { message: response.statusText };
      }
    }

    error.status = response.status;
    throw error;
  }

  return response.json();
};

// Products API fetcher
export const fetchProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();

  // Add pagination parameters
  if (params.page) queryParams.append("page", params.page);
  if (params.per_page) queryParams.append("per_page", params.per_page);

  // Add filter parameters
  if (params.category_id) queryParams.append("category_id", params.category_id);
  if (params.subcategory_id) queryParams.append("subcategory_id", params.subcategory_id);
  if (params.brand_id) queryParams.append("brand_id", params.brand_id);
  if (params.search || params.q)
    queryParams.append("search", params.search || params.q);
  if (params.is_featured) queryParams.append("is_featured", params.is_featured);
  if (params.is_trending) queryParams.append("is_trending", params.is_trending);
  if (params.is_offer) queryParams.append("is_offer", params.is_offer);
  if (params.is_new_arrival)
    queryParams.append("is_new_arrival", params.is_new_arrival);

  // Extended filter parameters
  if (params.minPrice) queryParams.append("min_price", params.minPrice);
  if (params.maxPrice) queryParams.append("max_price", params.maxPrice);
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.brands && Array.isArray(params.brands)) {
    params.brands.forEach((b) => queryParams.append("brands[]", b));
  }
  if (params.conditions && Array.isArray(params.conditions)) {
    // Lowercase for backend consistency (new, used, refurbished)
    params.conditions.forEach((c) =>
      queryParams.append("conditions[]", c.toLowerCase()),
    );
  }
  if (params.category && params.category !== "All") {
    queryParams.append("category", params.category);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/public/products${queryString ? `?${queryString}` : ""}`;

  return fetcher(url);
};

// Vendors API fetcher
export const fetchVendors = async () => {
  const url = `${API_BASE_URL}/public/vendors`;
  return fetcher(url);
};

export const transformVendor = (vendor) => {
  if (!vendor) return null;
  const baseUrl = API_BASE_URL.replace("/api/v1", "");
  const normalizeUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/\/+/g, "/");
    return `${baseUrl}/${cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath}`;
  };

  const images = [];
  if (vendor.cover_image) {
    const url = normalizeUrl(vendor.cover_image);
    if (url) images.push(url);
  }
  
  if (vendor.gallery_images && Array.isArray(vendor.gallery_images)) {
    vendor.gallery_images.forEach(img => {
      const url = normalizeUrl(img);
      if (url) images.push(url);
    });
  }

  return {
    id: vendor.id,
    name: vendor.name,
    category: { name: vendor.category || "Uncategorized" },
    description: vendor.description,
    short_description: vendor.description ? vendor.description.substring(0, 100) + '...' : "",
    slug: vendor.slug,
    images: images.length > 0 ? images : [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
      "https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=800",
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800"
    ],
    ...vendor
  };
};

// Categories API fetcher
export const fetchCategories = async () => {
  const url = `${API_BASE_URL}/public/categories`;
  return fetcher(url);
};

// SubCategories API fetcher
export const fetchSubCategories = async () => {
  const url = `${API_BASE_URL}/public/sub-categories`;
  return fetcher(url);
};

// Brands API fetcher
export const fetchBrands = async () => {
  const url = `${API_BASE_URL}/public/featured-brands`;
  return fetcher(url);
};

// Home CMS fetcher
export const fetchHomeCMS = async () => {
  const url = `${API_BASE_URL}/public/cms/home`;
  return fetcher(url);
};

// Trending Products fetcher
export const fetchTrendingProducts = async () => {
  const url = `${API_BASE_URL}/public/trending-products`;
  return fetcher(url);
};

// Offer Products fetcher
export const fetchOfferProducts = async () => {
  const url = `${API_BASE_URL}/public/offer-products`;
  return fetcher(url);
};

// New Arrival Products fetcher
export const fetchNewArrivalProducts = async () => {
  const url = `${API_BASE_URL}/public/new-arrival-products`;
  return fetcher(url);
};

// Category-wise Products fetcher
export const fetchProductsByCategory = async (categoryName, perPage = 6) => {
  const url = `${API_BASE_URL}/public/products?category=${encodeURIComponent(categoryName)}&per_page=${perPage}`;
  return fetcher(url);
};

// Shop CMS fetcher
export const fetchShopCMS = async () => {
  const url = `${API_BASE_URL}/public/cms/shop`;
  return fetcher(url);
};

// Product by ID fetcher (for product detail page)
export const fetchProductById = async (id) => {
  const url = `${API_BASE_URL}/public/products/${id}`;
  return fetcher(url);
};

// Transform API product data to match UI structure
export const transformProduct = (apiProduct, deep = true) => {
  if (!apiProduct) return null;
  // Get the first variant for pricing (or use default values)
  const firstVariant = apiProduct.variants?.[0];

  // Determine the host product or any variant has an active offer
  const isOffer = !!(
    apiProduct.is_offer === true ||
    apiProduct.is_offer === 1 ||
    apiProduct.is_offer === "1" ||
    apiProduct.variants?.some(
      (v) => v.is_offer === true || v.is_offer === 1 || v.is_offer === "1",
    )
  );

  const isNewArrival = !!(
    apiProduct.is_new_arrival === true ||
    apiProduct.is_new_arrival === 1 ||
    apiProduct.is_new_arrival === "1" ||
    apiProduct.variants?.some(
      (v) =>
        v.is_new_arrival === true ||
        v.is_new_arrival === 1 ||
        v.is_new_arrival === "1",
    )
  );

  const price =
    isOffer && firstVariant?.offer_price
      ? parseFloat(firstVariant.offer_price)
      : firstVariant?.sales_price
        ? parseFloat(firstVariant.sales_price)
        : firstVariant?.price
          ? parseFloat(firstVariant.price)
          : 0;

  const originalPrice =
    firstVariant?.is_offer && firstVariant?.sales_price
      ? parseFloat(firstVariant.sales_price)
      : firstVariant?.price &&
          firstVariant?.sales_price &&
          parseFloat(firstVariant.price) > parseFloat(firstVariant.sales_price)
        ? parseFloat(firstVariant.price)
        : null;

  // Get images - prioritize primary image, then gallery images
  const images = [];
  const baseUrl = API_BASE_URL.replace("/api/v1", "");

  const normalizeUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/\/+/g, "/"); // Replace multiple slashes with single slash
    return `${baseUrl}/${cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath}`;
  };

  // Add primary image first
  if (apiProduct.primary_image_path) {
    const url = normalizeUrl(apiProduct.primary_image_path);
    if (url) images.push(url);
  }

  // Add gallery images
  if (apiProduct.images && apiProduct.images.length > 0) {
    apiProduct.images.forEach((img) => {
      const url = normalizeUrl(img.image_path);
      if (url) images.push(url);
    });
  }

  // Ensure we always have at least one image (fallback)
  if (images.length === 0) {
    images.push("https://via.placeholder.com/400?text=No+Image");
  }

  // Determine badge
  let badge = null;
  // Set default badge if not provided
  if (apiProduct.is_featured) badge = ""; // Removed 'Best Seller'
  if (apiProduct.discount_percentage)
    badge = `-${apiProduct.discount_percentage}%`;
  else if (isOffer) badge = "Offer";
  else if (apiProduct.is_trending) badge = "Hot";

  // Use the actual condition from the API
  const rootCondition = apiProduct.condition || "New";

  const variantsWithCondition = (apiProduct.variants || []).map((v) => ({
    ...v,
    condition: v.condition || rootCondition,
  }));

  return {
    id: apiProduct.id,
    title: apiProduct.name, // Used by ProductCard but ProductCard uses product.name
    name: apiProduct.name, // Used by ProductCard and ProductDetailClient
    brand: apiProduct.brand?.name || "Unknown",
    category: apiProduct.category?.name || "Uncategorized",
    currentPrice: price, // Added for ProductCard
    price: price, // Keep for backward compatibility
    originalPrice: originalPrice,
    rating:
      apiProduct.rating ||
      apiProduct.average_rating ||
      apiProduct.avg_rating ||
      0,
    reviewsCount: apiProduct.total_reviews || 0,
    reviews: apiProduct.reviews || [],
    image: images[0], // ProductCard expects 'image' (singular)
    images: images, // Always has at least one image due to fallback above
    badge: badge,
    isOffer: isOffer,
    isNewArrival: isNewArrival,
    slug: apiProduct.slug,
    stock_quantity: firstVariant?.stock_quantity ?? 999,
    description: apiProduct.short_description,
    short_description: apiProduct.short_description, // Used by ProductDetailClient
    added: apiProduct.relative_time || "Just now", // For New Arrivals section
    full_description: apiProduct.full_description, // Used by ProductDetailClient
    // Pass through complex data for detail page
    variants: variantsWithCondition,
    condition: rootCondition, // Add root condition
    specifications: apiProduct.specifications || [],
    features: apiProduct.features || [],
    compatible_products: deep
      ? (apiProduct.compatible_products || []).map((p) =>
          transformProduct(p, false),
        )
      : [],
    bundled_products: deep
      ? (apiProduct.bundled_products || []).map((p) =>
          transformProduct(p, false),
        )
      : [],
    // Determine overall stock status
    isOutOfStock:
      variantsWithCondition.length > 0
        ? variantsWithCondition.every((v) => (v.stock_quantity || 0) <= 0)
        : true,
    // Keep original API data for reference
    _apiData: apiProduct,
  };
};

// Customer Login API
export const loginCustomer = async (credentials) => {
  const url = `${API_BASE_URL}/customer/login`;
  console.log("Login API URL:", url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: credentials.email,
      password: credentials.password,
    }),
  });
  console.log("Login API Status:", response.status);

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Login failed");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Customer Registration API
export const registerCustomer = async (customerData) => {
  const url = `${API_BASE_URL}/customer/register`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Registration failed");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Fetch Customer Profile API
export const fetchCustomerProfile = async (token) => {
  const url = `${API_BASE_URL}/customer/profile`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to fetch profile");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Fetch Current User (Me) API
export const fetchMe = async (token) => {
  const url = `${API_BASE_URL}/customer/me`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to fetch user profile");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Update User Profile API
export const updateUserProfile = async (profileData, token) => {
  const url = `${API_BASE_URL}/customer/profile`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to update profile");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Fetch Customer Cart API
export const fetchCustomerCart = async (token) => {
  const url = `${API_BASE_URL}/customer/cart`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to fetch cart");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Add Item to Customer Cart API
export const addCustomerCartItem = async (payload, token) => {
  const url = `${API_BASE_URL}/customer/cart/add`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to add item to cart");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Update Customer Cart Item Quantity API
export const updateCustomerCartItem = async (itemId, quantity, token) => {
  const url = `${API_BASE_URL}/customer/cart/update/${itemId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to update item in cart");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Remove Item from Customer Cart API
export const removeCustomerCartItem = async (itemId, token) => {
  const url = `${API_BASE_URL}/customer/cart/remove/${itemId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to remove item from cart");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Initiate Checkout Session (Buy Now)
export const initiateCheckout = async (payload, token) => {
  const url = `${API_BASE_URL}/customer/checkout`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to initiate checkout");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Clear Customer Cart API
export const clearCustomerCart = async (token) => {
  const url = `${API_BASE_URL}/customer/cart/clear`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to clear cart");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Apply Coupon API
export const applyCoupon = async (checkoutId, code, amount, token) => {
  // Basic sanitization
  const sanitizedCode = String(code).trim().toUpperCase();
  const sanitizedAmount = Number(amount);

  const url = `${API_BASE_URL}/customer/checkout/${checkoutId}/apply-coupon`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      code: sanitizedCode,
      amount: sanitizedAmount,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to apply coupon");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// Remove Coupon API
export const removeCoupon = async (checkoutId, token) => {
  const url = `${API_BASE_URL}/customer/checkout/${checkoutId}/remove-coupon`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to remove coupon");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};
// Fetch Checkout Session details
export const fetchCheckoutSession = async (id, token) => {
  const url = `${API_BASE_URL}/customer/checkout/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to fetch checkout session");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};
// --- ORDER CONFIRMATION ---

export const confirmOrder = async (checkoutId, formData, token) => {
  const url = `${API_BASE_URL}/customer/checkout/${checkoutId}/confirm`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      // Note: Content-Type is intentionally omitted for FormData to allow the browser to set the boundary
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to confirm order");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// --- DELIVERY ADDRESSES ---

export const setCheckoutAddress = async (
  checkoutId,
  deliveryAddressId,
  token,
) => {
  const url = `${API_BASE_URL}/customer/checkout/${checkoutId}/set-address`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ delivery_address_id: deliveryAddressId }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to set delivery address");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const fetchDeliveryAddresses = async (token) => {
  const url = `${API_BASE_URL}/customer/delivery-addresses`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Failed to fetch delivery addresses",
    );
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const createDeliveryAddress = async (payload, token) => {
  const url = `${API_BASE_URL}/customer/delivery-addresses`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Failed to create delivery address",
    );
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const updateDeliveryAddress = async (id, payload, token) => {
  const url = `${API_BASE_URL}/customer/delivery-addresses/${id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Failed to update delivery address",
    );
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const deleteDeliveryAddress = async (id, token) => {
  const url = `${API_BASE_URL}/customer/delivery-addresses/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Failed to delete delivery address",
    );
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const setDefaultDeliveryAddress = async (id, token) => {
  const url = `${API_BASE_URL}/customer/delivery-addresses/${id}/set-default`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Failed to set default delivery address",
    );
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

// --- CUSTOMER ORDERS ---

export const fetchCustomerOrders = async (token, page = 1) => {
  const url = `${API_BASE_URL}/customer/orders?page=${page}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to fetch orders");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};
export const cancelOrder = async (orderId, token, reason = "") => {
  const url = `${API_BASE_URL}/customer/orders/${orderId}/cancel`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to cancel order");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const markOrderReceived = async (orderId, token) => {
  const url = `${API_BASE_URL}/customer/orders/${orderId}/received`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to mark order as received");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const submitProductReview = async (formData, token) => {
  const url = `${API_BASE_URL}/customer/reviews`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to submit review");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const fetchProductReviews = async (productId) => {
  const url = `${API_BASE_URL}/public/products/${productId}/reviews`;
  return fetcher(url);
};

// --- PUBLIC CONTACT API ---
export const submitContact = async (payload) => {
  const url = `${API_BASE_URL}/public/contact`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to submit contact form");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};
