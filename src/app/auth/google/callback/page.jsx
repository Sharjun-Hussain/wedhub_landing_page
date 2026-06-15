"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Authenticating with Google...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage("Google authentication failed. Please try again.");
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authentication code found.");
      return;
    }

    const handleCallback = async () => {
      try {
        // Construct the callback URL with all parameters from Google
        const queryString = searchParams.toString();
        console.log(queryString);

        const response = await fetch(
          `${API_BASE_URL}/customer/auth/google/callback?${queryString}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include", // Important: Send cookies (session) to backend
          },
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");

          // Store the token
          if (data.token) {
            localStorage.setItem("token", data.token);
            // You might want to update global state here if you have one
          }

          // Redirect to home or dashboard
          // setTimeout(() => {
          //   router.push("/");
          // }, 1000);
        } else {
          console.error("Backend Auth Error:", data);
          throw new Error(
            data.message || JSON.stringify(data) || "Authentication failed",
          );
        }
      } catch (err) {
        console.error("Google Auth Error:", err);
        setStatus("error");
        setMessage(err.message || "An error occurred during authentication.");

        // Redirect back to login after a delay
        // setTimeout(() => {
        //   router.push("/login");
        // }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Loading State */}
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Just a moment...
            </h2>
            <p className="text-slate-500 dark:text-slate-400">{message}</p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Success!
            </h2>
            <p className="text-slate-500 dark:text-slate-400">{message}</p>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Authentication Failed
            </h2>
            <p className="text-slate-500 dark:text-slate-400">{message}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
