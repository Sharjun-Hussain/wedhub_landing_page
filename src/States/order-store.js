"use client";

import React from "react";
import { createContext, useContext, useState } from "react";

const OrderContext = createContext(undefined);

// Mock orders data
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerId: "cust-1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    status: "processing",
    paymentStatus: "paid",
    items: [
      {
        id: "item-1",
        productId: "1",
        productName: "MacBook Pro M3 14-inch",
        productImage: "/macbook-pro.png",
        sku: "MBP-M3-14-512",
        quantity: 1,
        price: 1999,
        total: 1999,
      },
      {
        id: "item-2",
        productId: "3",
        productName: "Sony WH-1000XM5 Headphones",
        productImage: "/sony-headphones.png",
        sku: "WH1000XM5-BLK",
        quantity: 1,
        price: 399,
        total: 399,
      },
    ],
    subtotal: 2398,
    tax: 191.84,
    shipping: 0,
    discount: 100,
    total: 2489.84,
    shippingAddress: {
      fullName: "John Doe",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    billingAddress: {
      fullName: "John Doe",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card (**** 4242)",
    trackingNumber: "1Z999AA1234567890",
    notes: "Customer requested expedited shipping",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-21T14:15:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerId: "cust-2",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    status: "pending",
    paymentStatus: "paid",
    items: [
      {
        id: "item-3",
        productId: "2",
        productName: "Samsung Galaxy S24 Ultra",
        productImage: "/samsung-galaxy-s24.png",
        sku: "SGS24U-256-BLK",
        quantity: 2,
        price: 1299,
        total: 2598,
      },
    ],
    subtotal: 2598,
    tax: 207.84,
    shipping: 15,
    discount: 0,
    total: 2820.84,
    shippingAddress: {
      fullName: "Jane Smith",
      addressLine1: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "United States",
      phone: "+1 (555) 987-6543",
    },
    billingAddress: {
      fullName: "Jane Smith",
      addressLine1: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "United States",
      phone: "+1 (555) 987-6543",
    },
    paymentMethod: "PayPal",
    createdAt: "2024-01-22T09:15:00Z",
    updatedAt: "2024-01-22T09:15:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerId: "cust-3",
    customerName: "Bob Johnson",
    customerEmail: "bob.johnson@example.com",
    status: "shipped",
    paymentStatus: "paid",
    items: [
      {
        id: "item-4",
        productId: "4",
        productName: "Dell XPS 13 Plus",
        productImage: "/dell-xps-13.png",
        sku: "XPS13P-I7-512",
        quantity: 1,
        price: 1299,
        total: 1299,
      },
    ],
    subtotal: 1299,
    tax: 103.92,
    shipping: 25,
    discount: 50,
    total: 1377.92,
    shippingAddress: {
      fullName: "Bob Johnson",
      addressLine1: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "United States",
      phone: "+1 (555) 456-7890",
    },
    billingAddress: {
      fullName: "Bob Johnson",
      addressLine1: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "United States",
      phone: "+1 (555) 456-7890",
    },
    paymentMethod: "Credit Card (**** 1234)",
    trackingNumber: "1Z999AA9876543210",
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-23T11:30:00Z",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerId: "cust-4",
    customerName: "Alice Brown",
    customerEmail: "alice.brown@example.com",
    status: "delivered",
    paymentStatus: "paid",
    items: [
      {
        id: "item-5",
        productId: "5",
        productName: "iPad Pro 12.9-inch M2",
        productImage: "/ipad-pro.png",
        sku: "IPADPRO-M2-128",
        quantity: 1,
        price: 1099,
        total: 1099,
      },
    ],
    subtotal: 1099,
    tax: 87.92,
    shipping: 0,
    discount: 0,
    total: 1186.92,
    shippingAddress: {
      fullName: "Alice Brown",
      addressLine1: "321 Elm Street",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
      phone: "+1 (555) 321-0987",
    },
    billingAddress: {
      fullName: "Alice Brown",
      addressLine1: "321 Elm Street",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
      phone: "+1 (555) 321-0987",
    },
    paymentMethod: "Apple Pay",
    trackingNumber: "1Z999AA5555555555",
    createdAt: "2024-01-15T13:20:00Z",
    updatedAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customerId: "cust-5",
    customerName: "Charlie Wilson",
    customerEmail: "charlie.wilson@example.com",
    status: "cancelled",
    paymentStatus: "refunded",
    items: [
      {
        id: "item-6",
        productId: "2",
        productName: "Samsung Galaxy S24 Ultra",
        productImage: "/samsung-galaxy-s24.png",
        sku: "SGS24U-256-BLK",
        quantity: 1,
        price: 1299,
        total: 1299,
      },
    ],
    subtotal: 1299,
    tax: 103.92,
    shipping: 15,
    discount: 0,
    total: 1417.92,
    shippingAddress: {
      fullName: "Charlie Wilson",
      addressLine1: "654 Maple Drive",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
      phone: "+1 (555) 654-3210",
    },
    billingAddress: {
      fullName: "Charlie Wilson",
      addressLine1: "654 Maple Drive",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
      phone: "+1 (555) 654-3210",
    },
    paymentMethod: "Credit Card (**** 5678)",
    notes: "Customer requested cancellation due to change of mind",
    createdAt: "2024-01-19T11:00:00Z",
    updatedAt: "2024-01-20T09:30:00Z",
  },
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(mockOrders);

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  };

  const updatePaymentStatus = (orderId, paymentStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, paymentStatus, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  };

  const addTrackingNumber = (orderId, trackingNumber) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, trackingNumber, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  };

  const addOrderNotes = (orderId, notes) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, notes, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  };

  const getOrder = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        updateOrderStatus,
        updatePaymentStatus,
        addTrackingNumber,
        addOrderNotes,
        getOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
