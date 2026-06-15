"use server";

import { API_BASE_URL } from "@/lib/api";

export async function resendVerificationAction(email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/customer/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (process.env.NODE_ENV === "development") {
      console.log("Server Action [resendVerificationAction]:", {
        status: response.status,
        data,
      });
    }

    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Server Action Error [resendVerificationAction]:", error);
    }
    return {
      success: false,
      status: 500,
      data: { message: "Internal Server Error. Please try again later." },
    };
  }
}

export async function verifyEmailAction(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/customer/verify-email?token=${token}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (process.env.NODE_ENV === "development") {
      console.log("Server Action [verifyEmailAction]:", {
        status: response.status,
        data,
      });
    }

    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Server Action Error [verifyEmailAction]:", error);
    }
    return {
      success: false,
      status: 500,
      data: { message: "Internal Server Error during verification." },
    };
  }
}
