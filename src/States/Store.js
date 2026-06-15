"use client";

import React from "react";
import { createContext, useContext, useReducer } from "react";

const initialState = {
  cart: [],
  wishlist: [],
  cartLoading: false,
  cartMeta: null,
  checkoutSession: null,
  isCartOpen: false,
  isMenuOpen: false,
};

function storeReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cart.find(
        (item) =>
          item.id === action.product.id ||
          (action.product.variantId &&
            item.variantId === action.product.variantId),
      );
      const requestedQty = action.product.quantity || 1;

      if (existingItem) {
        const maxStock = Math.max(1, existingItem.stock_quantity ?? 999);
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.product.id ||
            (action.product.variantId &&
              item.variantId === action.product.variantId)
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + requestedQty, maxStock),
                  selected: true,
                }
              : item,
          ),
        };
      }

      // Clamp stock to >= 1 (handles negative values from the backend)
      const stock = Math.max(1, action.product.stock_quantity ?? 999);
      const initialQuantity = Math.min(Math.max(1, requestedQty), stock);
      return {
        ...state,
        cart: [
          ...state.cart,
          { ...action.product, quantity: initialQuantity, selected: true },
        ],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.productId),
      };

    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) => {
          if (item.id === action.productId) {
            const maxStock = Math.max(1, item.stock_quantity ?? 999);
            const finalQuantity = Math.max(
              1,
              Math.min(action.quantity, maxStock),
            );
            return { ...item, quantity: finalQuantity };
          }
          return item;
        }),
      };

    case "TOGGLE_SELECTION":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.productId
            ? { ...item, selected: !item.selected }
            : item,
        ),
      };

    case "SELECT_ONLY":
      return {
        ...state,
        cart: state.cart.map((item) => ({
          ...item,
          selected: item.id === action.productId,
        })),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    case "SET_CART_LOADING":
      return {
        ...state,
        cartLoading: action.loading,
      };

    case "SET_CART_FROM_API":
      return {
        ...state,
        cart: action.items,
        cartMeta: action.meta,
        cartLoading: false,
      };

    case "SET_CHECKOUT_SESSION":
      return {
        ...state,
        checkoutSession: action.session,
      };

    case "CLEAR_CHECKOUT_SESSION":
      return {
        ...state,
        checkoutSession: null,
      };

    case "ADD_TO_WISHLIST":
      const existingWishlistItem = state.wishlist.find(
        (item) => item.id === action.product.id,
      );
      if (existingWishlistItem) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.product],
      };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.productId),
      };

    case "MOVE_TO_CART":
      const wishlistItem = state.wishlist.find(
        (item) => item.id === action.productId,
      );
      if (!wishlistItem) return state;

      const newState = {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.productId),
      };

      const existingCartItem = newState.cart.find(
        (item) => item.id === action.productId,
      );
      if (existingCartItem) {
        newState.cart = newState.cart.map((item) =>
          item.id === action.productId
            ? { ...item, quantity: item.quantity + 1, selected: true }
            : item,
        );
      } else {
        newState.cart = [
          ...newState.cart,
          { ...wishlistItem, quantity: 1, selected: true },
        ];
      }

      return newState;

    case "TOGGLE_CART":
      return {
        ...state,
        isCartOpen: action.open !== undefined ? action.open : !state.isCartOpen,
        isMenuOpen: action.open ? false : state.isMenuOpen, // Close menu if opening cart
      };

    case "TOGGLE_MENU":
      return {
        ...state,
        isMenuOpen: action.open !== undefined ? action.open : !state.isMenuOpen,
        isCartOpen: action.open ? false : state.isCartOpen, // Close cart if opening menu
      };

    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
