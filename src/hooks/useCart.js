"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/States/Store";
import {
  fetchCustomerCart,
  clearCustomerCart,
  addCustomerCartItem,
  updateCustomerCartItem,
  removeCustomerCartItem,
  initiateCheckout,
  API_BASE_URL,
} from "@/lib/api";
import { toast } from "sonner";

// Normalise a server image path to a full URL
const normalizeImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const baseUrl = API_BASE_URL.replace("/api/v1", "");
  const cleanPath = path.replace(/\/+/g, "/");
  return `${baseUrl}/${cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath}`;
};

// Map a single API cart item to the shape used by ShoppingCartComponent
const mapCartItem = (item) => {
  // The backend returns Sequelize associations as PascalCase (Product, ProductVariant).
  // Local fallback items (from transformProduct) use lowercase or flat shape.
  const product = item.Product || item.product || item;
  const variant = item.ProductVariant || item.variant || item.selectedVariant;

  // Best display price: offer_price → sales_price → price
  const price = parseFloat(
    variant?.offer_price ||
      variant?.sales_price ||
      variant?.price ||
      item.price ||
      0,
  );

  // Build a readable sub-label from variant attributes
  const variantParts = [
    variant?.color,
    variant?.storage_size,
    variant?.ram_size,
    variant?.condition,
  ].filter(Boolean);
  const brand = variantParts.join(" · ") || product?.type || item.brand || "";

  // Primary image — prefer product's stored primary path, then gallery images
  const rawImagePath =
    product?.primary_image_path ||
    item.image ||
    item.images?.[0] ||
    null;
  const imageUrl = normalizeImageUrl(rawImagePath);
  const images = imageUrl
    ? [imageUrl]
    : ["https://via.placeholder.com/400?text=No+Image"];

  const originalPrice = parseFloat(
    item.originalPrice || item.original_price || variant?.price || 0
  );

  return {
    id: item.id,
    productId: item.product_id || item.productId || product?.id,
    variantId: item.variant_id || item.variantId || variant?.id,
    title: product?.name || item.title || item.name || "Product",
    name: product?.name || item.title || item.name || "Product",
    slug: product?.slug || item.slug,
    price,
    originalPrice,
    quantity: item.quantity,
    stock_quantity: Math.max(
      0,
      variant?.stock_quantity ?? item.stock_quantity ?? 0,
    ),
    unit_price: parseFloat(item.unit_price || price),
    total_price: parseFloat(item.total_price || price * item.quantity),
    images,
    brand,
    selected: true,
    _cartItem: item,
  };
};

/**
 * useCart
 *
 * Fetches the server-side cart for the currently logged-in customer and
 * hydrates the global store. Call this once near the top of the app
 * (e.g. inside Header) — it runs automatically whenever the session changes.
 * Returns actions for modifying the cart.
 */
export function useCart() {
  const { data: session, status } = useSession();
  const { state, dispatch } = useStore();

  useEffect(() => {
    // Only fetch when we have a valid authenticated session with a token
    if (status !== "authenticated" || !session?.accessToken) return;

    let cancelled = false;

    const loadCart = async () => {
      dispatch({ type: "SET_CART_LOADING", loading: true });

      try {
        // Sync logic: push local-only items (no server ID) to server
        const localOnlyItems = state.cart.filter(
          (item) => !item._cartItem?.product_id,
        );
        if (localOnlyItems.length > 0) {
          const { addCustomerCartItem } = await import("@/lib/api");
          for (const item of localOnlyItems) {
            const pid = item.product_id || item.productId || item.id;
            if (pid) {
              try {
                await addCustomerCartItem(
                  {
                    product_id: pid,
                    variant_id: item.variant_id || item.variantId,
                    quantity: item.quantity,
                  },
                  session.accessToken,
                );
              } catch (e) {
                console.error("[useCart] Sync error for item:", item, e);
              }
            }
          }
        }

        const data = await fetchCustomerCart(session.accessToken);

        if (cancelled) return;

        if (data?.status === "success" && data?.data) {
          const cartData = data.data;
          const items = (cartData.items || []).map(mapCartItem);

          dispatch({
            type: "SET_CART_FROM_API",
            items,
            meta: {
              id: cartData.id,
              status: cartData.status,
              total_amount: parseFloat(cartData.total_amount || 0),
              item_count: cartData.item_count,
              session_id: cartData.session_id,
              notes: cartData.notes,
            },
          });
        } else {
          dispatch({ type: "SET_CART_LOADING", loading: false });
        }
      } catch (err) {
        console.error("[useCart] Failed to load/sync cart:", err);
        dispatch({ type: "SET_CART_LOADING", loading: false });
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  // Use session?.accessToken (primitive string) not session (object) to avoid
  // re-firing this effect whenever next-auth creates a new session object reference
  }, [session?.accessToken, status, dispatch]);

  // Expose actions
  const addToCart = async (
    product_id,
    variant_id,
    quantity = 1,
    localFallbackProduct = null,
    showCart = true,
  ) => {
    // --- CART-AWARE STOCK VALIDATION ---
    const existingItem = state.cart.find((i) =>
      variant_id ? i.variantId === variant_id : i.productId === product_id,
    );

    if (existingItem) {
      const currentQty = existingItem.quantity || 0;
      const stock =
        existingItem.stock_quantity > 0
          ? existingItem.stock_quantity
          : Infinity;
      if (currentQty + quantity > stock) {
        toast.warning(
          `Only ${stock} item${stock === 1 ? "" : "s"} available in stock`,
        );
        return false;
      }
    }

    if (status === "authenticated" && session?.accessToken) {
      try {
        const { addCustomerCartItem } = await import("@/lib/api");
        const data = await addCustomerCartItem(
          { product_id, variant_id, quantity },
          session.accessToken,
        );

        if (data?.status === "success" && data?.data) {
          const cartData = data.data;
          const items = (cartData.items || []).map(mapCartItem);

          dispatch({
            type: "SET_CART_FROM_API",
            items,
            meta: {
              id: cartData.id,
              status: cartData.status,
              total_amount: parseFloat(cartData.total_amount || 0),
              item_count: cartData.item_count,
              session_id: cartData.session_id,
              notes: cartData.notes,
            },
          });

          if (showCart) {
            dispatch({ type: "TOGGLE_CART", open: true });
          }
          return true;
        }
      } catch (err) {
        console.error("[useCart] Failed to add item to API cart:", err);
        throw err;
      }
    } else {
      if (localFallbackProduct) {
        dispatch({ type: "ADD_TO_CART", product: localFallbackProduct });
        if (showCart) {
          dispatch({ type: "TOGGLE_CART", open: true });
        }
        return true;
      }
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);

    // Optimistic UI update: Dispatch immediately to the local store
    dispatch({ type: "UPDATE_QUANTITY", productId: id, quantity });

    if (status === "authenticated" && session?.accessToken) {
      try {
        const data = await updateCustomerCartItem(
          id,
          quantity,
          session.accessToken,
        );
        if (data?.status === "success" && data?.data) {
          const cartData = data.data;
          const items = (cartData.items || []).map(mapCartItem);
          dispatch({
            type: "SET_CART_FROM_API",
            items,
            meta: {
              id: cartData.id,
              status: cartData.status,
              total_amount: parseFloat(cartData.total_amount || 0),
              item_count: cartData.item_count,
              session_id: cartData.session_id,
              notes: cartData.notes,
            },
          });
        }
      } catch (err) {
        const msg = err?.message || "";
        const isStockError = /insufficient stock|stock|out of stock/i.test(msg);
        // Always revert the optimistic update — either the API rejected it (stock error)
        // or a real error occurred. quantity - 1 is the previous value before the + click.
        dispatch({
          type: "UPDATE_QUANTITY",
          productId: id,
          quantity: Math.max(1, quantity - 1),
        });
        if (!isStockError) {
          console.error("[useCart] Failed to sync quantity update:", err);
          toast.error("Couldn't update quantity. Please try again.");
        }
      }
    }
  };

  const removeFromCart = async (id) => {
    // Optimistic UI update: Remove immediately from the local store
    dispatch({ type: "REMOVE_FROM_CART", productId: id });

    if (status === "authenticated" && session?.accessToken) {
      try {
        const data = await removeCustomerCartItem(id, session.accessToken);
        if (data?.status === "success" && data?.data) {
          const cartData = data.data;
          const items = (cartData.items || []).map(mapCartItem);
          dispatch({
            type: "SET_CART_FROM_API",
            items,
            meta: {
              id: cartData.id,
              status: cartData.status,
              total_amount: parseFloat(cartData.total_amount || 0),
              item_count: cartData.item_count,
              session_id: cartData.session_id,
              notes: cartData.notes,
            },
          });
        }
      } catch (err) {
        console.error("[useCart] Failed to sync item removal:", err);
        toast.error("Failed to sync cart removal");
      }
    }
  };

  const clearCart = async () => {
    // Optimistic UI update: Clear immediately from the local store
    dispatch({ type: "CLEAR_CART" });

    if (status === "authenticated" && session?.accessToken) {
      try {
        await clearCustomerCart(session.accessToken);
      } catch (err) {
        console.error("[useCart] Failed to sync API cart clear:", err);
        toast.error("Failed to sync cart clear");
      }
    }
  };

  // useCallback gives stable references — without this, every state.cart change
  // would produce new function refs, re-triggering CheckoutPageClient's init effect
  const buyNow = useCallback(async (product_id, variant_id, quantity = 1) => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const data = await initiateCheckout(
          { product_id, variant_id, quantity },
          session.accessToken,
        );
        if ((data?.success || data?.status === "success") && data?.data) {
          dispatch({ type: "SET_CHECKOUT_SESSION", session: data.data });
          return data.data;
        }
      } catch (err) {
        console.error("[useCart] Failed to initiate buy now checkout:", err);
        throw err;
      }
    }
    return false;
  }, [status, session?.accessToken, dispatch]);

  const checkout = useCallback(async () => {
    if (status === "authenticated" && session?.accessToken) {
      try {
        const data = await initiateCheckout({}, session.accessToken);
        if ((data?.success || data?.status === "success") && data?.data) {
          dispatch({ type: "SET_CHECKOUT_SESSION", session: data.data });
          return data.data;
        }
      } catch (err) {
        console.error("[useCart] Failed to initiate cart checkout:", err);
        throw err;
      }
    }
    return false;
  }, [status, session?.accessToken, dispatch]);

  return useMemo(
    () => ({
      cart: state.cart.map(mapCartItem),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      buyNow,
      checkout,
    }),
    // buyNow and checkout are now stable useCallback refs, so this memo
    // only recomputes when the cart items actually change
    [state.cart, buyNow, checkout],
  );
}
