"use client";

import React from "react";
import { createContext, useContext, useState } from "react";

const UserContext = createContext(undefined);

// Mock users data
const mockUsers = [
  {
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    avatar: "/admin-avatar.png",
    role: "customer",
    status: "active",
    emailVerified: true,
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
    lastLogin: "2024-01-25T14:30:00Z",
    totalOrders: 12,
    totalSpent: 4567.89,
    createdAt: "2023-06-15T10:00:00Z",
    updatedAt: "2024-01-25T14:30:00Z",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    avatar: "/manager-avatar.png",
    role: "customer",
    status: "active",
    emailVerified: true,
    phone: "+1 (555) 987-6543",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "United States",
    },
    lastLogin: "2024-01-24T09:15:00Z",
    totalOrders: 8,
    totalSpent: 2890.45,
    createdAt: "2023-08-22T14:20:00Z",
    updatedAt: "2024-01-24T09:15:00Z",
  },
  {
    id: "3",
    email: "bob.johnson@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    fullName: "Bob Johnson",
    role: "customer",
    status: "active",
    emailVerified: false,
    phone: "+1 (555) 456-7890",
    address: {
      street: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "United States",
    },
    lastLogin: "2024-01-23T16:45:00Z",
    totalOrders: 3,
    totalSpent: 1234.56,
    createdAt: "2023-12-10T11:30:00Z",
    updatedAt: "2024-01-23T16:45:00Z",
  },
  {
    id: "4",
    email: "alice.brown@example.com",
    firstName: "Alice",
    lastName: "Brown",
    fullName: "Alice Brown",
    role: "customer",
    status: "inactive",
    emailVerified: true,
    phone: "+1 (555) 321-0987",
    address: {
      street: "321 Elm Street",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
    },
    lastLogin: "2023-12-15T13:20:00Z",
    totalOrders: 15,
    totalSpent: 6789.12,
    createdAt: "2023-03-08T09:45:00Z",
    updatedAt: "2023-12-15T13:20:00Z",
  },
  {
    id: "5",
    email: "charlie.wilson@example.com",
    firstName: "Charlie",
    lastName: "Wilson",
    fullName: "Charlie Wilson",
    role: "customer",
    status: "suspended",
    emailVerified: true,
    phone: "+1 (555) 654-3210",
    address: {
      street: "654 Maple Drive",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
    },
    lastLogin: "2024-01-10T08:00:00Z",
    totalOrders: 2,
    totalSpent: 567.89,
    createdAt: "2023-11-05T15:30:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "6",
    email: "sarah.manager@techmart.com",
    firstName: "Sarah",
    lastName: "Manager",
    fullName: "Sarah Manager",
    avatar: "/manager-avatar.png",
    role: "manager",
    status: "active",
    emailVerified: true,
    phone: "+1 (555) 111-2222",
    lastLogin: "2024-01-25T08:30:00Z",
    totalOrders: 0,
    totalSpent: 0,
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-01-25T08:30:00Z",
  },
  {
    id: "7",
    email: "mike.staff@techmart.com",
    firstName: "Mike",
    lastName: "Staff",
    fullName: "Mike Staff",
    avatar: "/staff-avatar.png",
    role: "staff",
    status: "active",
    emailVerified: true,
    phone: "+1 (555) 333-4444",
    lastLogin: "2024-01-24T17:45:00Z",
    totalOrders: 0,
    totalSpent: 0,
    createdAt: "2023-03-20T14:15:00Z",
    updatedAt: "2024-01-24T17:45:00Z",
  },
  {
    id: "8",
    email: "admin@techmart.com",
    firstName: "John",
    lastName: "Admin",
    fullName: "John Admin",
    avatar: "/admin-avatar.png",
    role: "admin",
    status: "active",
    emailVerified: true,
    phone: "+1 (555) 555-5555",
    lastLogin: "2024-01-25T15:00:00Z",
    totalOrders: 0,
    totalSpent: 0,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-25T15:00:00Z",
  },
];

export function UserProvider({ children }) {
  const [users, setUsers] = useState(mockUsers);

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      fullName: `${userData.firstName} ${userData.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const updateUser = (id, userData) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              ...userData,
              fullName:
                userData.firstName && userData.lastName
                  ? `${userData.firstName} ${userData.lastName}`
                  : user.fullName,
              updatedAt: new Date().toISOString(),
            }
          : user,
      ),
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const getUser = (id) => {
    return users.find((user) => user.id === id);
  };

  const updateUserRole = (id, role) => {
    updateUser(id, { role });
  };

  const updateUserStatus = (id, status) => {
    updateUser(id, { status });
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        getUser,
        updateUserRole,
        updateUserStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
}
