"use client";

import React from "react";
import { createContext, useContext, useState } from "react";

const ProductContext = createContext(undefined);

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "MacBook Pro M3 14-inch",
    description:
      "The most advanced MacBook Pro ever, with the M3 chip for incredible performance.",
    price: 1999,
    originalPrice: 2199,
    category: "Laptops",
    brand: "Apple",
    sku: "MBP-M3-14-512",
    stock: 25,
    status: "active",
    images: ["/macbook-pro.png", "/macbook-pro-2.png"],
    tags: ["laptop", "apple", "m3", "professional"],
    specifications: {
      Processor: "Apple M3 chip",
      Memory: "16GB unified memory",
      Storage: "512GB SSD",
      Display: "14-inch Liquid Retina XDR",
      Graphics: "10-core GPU",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    description:
      "The ultimate smartphone with AI-powered features and S Pen functionality.",
    price: 1299,
    category: "Smartphones",
    brand: "Samsung",
    sku: "SGS24U-256-BLK",
    stock: 45,
    status: "active",
    images: ["/samsung-galaxy-s24.png"],
    tags: ["smartphone", "samsung", "android", "s-pen"],
    specifications: {
      Display: "6.8-inch Dynamic AMOLED 2X",
      Processor: "Snapdragon 8 Gen 3",
      Memory: "12GB RAM",
      Storage: "256GB",
      Camera: "200MP main camera",
    },
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling with premium sound quality.",
    price: 399,
    originalPrice: 449,
    category: "Headphones",
    brand: "Sony",
    sku: "WH1000XM5-BLK",
    stock: 12,
    status: "active",
    images: ["/sony-headphones.png"],
    tags: ["headphones", "sony", "noise-canceling", "wireless"],
    specifications: {
      Type: "Over-ear wireless",
      Battery: "30 hours",
      Connectivity: "Bluetooth 5.2",
      Weight: "250g",
      Features: "Active Noise Canceling",
    },
    createdAt: "2024-01-05T11:30:00Z",
    updatedAt: "2024-01-22T10:15:00Z",
  },
  {
    id: "4",
    name: "Dell XPS 13 Plus",
    description:
      "Ultra-thin laptop with stunning InfinityEdge display and premium design.",
    price: 1299,
    category: "Laptops",
    brand: "Dell",
    sku: "XPS13P-I7-512",
    stock: 8,
    status: "active",
    images: ["/dell-xps-13.png"],
    tags: ["laptop", "dell", "ultrabook", "business"],
    specifications: {
      Processor: "Intel Core i7-1360P",
      Memory: "16GB LPDDR5",
      Storage: "512GB SSD",
      Display: "13.4-inch OLED",
      Graphics: "Intel Iris Xe",
    },
    createdAt: "2024-01-08T14:20:00Z",
    updatedAt: "2024-01-19T09:30:00Z",
  },
  {
    id: "5",
    name: "iPad Pro 12.9-inch M2",
    description:
      "The ultimate iPad experience with M2 chip and Liquid Retina XDR display.",
    price: 1099,
    category: "Tablets",
    brand: "Apple",
    sku: "IPADPRO-M2-128",
    stock: 0,
    status: "inactive",
    images: ["/ipad-pro.png"],
    tags: ["tablet", "apple", "m2", "professional"],
    specifications: {
      Processor: "Apple M2 chip",
      Memory: "8GB unified memory",
      Storage: "128GB",
      Display: "12.9-inch Liquid Retina XDR",
      Camera: "12MP Wide camera",
    },
    createdAt: "2024-01-12T16:00:00Z",
    updatedAt: "2024-01-25T11:20:00Z",
  },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(mockProducts);

  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id, productData) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, ...productData, updatedAt: new Date().toISOString() }
          : product,
      ),
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProduct = (id) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
