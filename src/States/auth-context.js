"use client";

import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

// Mock users for demonstration
const mockUsers = {
  "admin@techmart.com": {
    password: "admin123",
    user: {
      id: "1",
      email: "admin@techmart.com",
      name: "John Admin",
      role: "admin",
      avatar: "/admin-avatar.png",
      permissions: ["all"],
    },
  },
  "manager@techmart.com": {
    password: "manager123",
    user: {
      id: "2",
      email: "manager@techmart.com",
      name: "Sarah Manager",
      role: "manager",
      avatar: "/manager-avatar.png",
      permissions: [
        "products.read",
        "products.write",
        "orders.read",
        "orders.write",
        "users.read",
        "analytics.read",
      ],
    },
  },
  "staff@techmart.com": {
    password: "staff123",
    user: {
      id: "3",
      email: "staff@techmart.com",
      name: "Mike Staff",
      role: "staff",
      avatar: "/staff-avatar.png",
      permissions: ["products.read", "orders.read", "orders.write"],
    },
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem("admin_user", JSON.stringify(mockUser.user));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin_user");
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.permissions.includes("all")) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
