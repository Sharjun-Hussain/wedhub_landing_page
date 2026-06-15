"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MainWrapper({ children }) {
  const pathname = usePathname();

  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ].some((path) => pathname.startsWith(path));

  return (
    <div className="flex-1">{children}</div>
  );
}
