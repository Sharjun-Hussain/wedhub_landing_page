"use client";

import React from "react";
import { AdminLogin } from "./admin-login";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/States/auth-context";

export function ProtectedRoute({ children, requiredPermission }) {
  const { user, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
