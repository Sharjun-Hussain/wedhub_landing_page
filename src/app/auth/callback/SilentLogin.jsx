"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SilentLogin({ token, returnUrl }) {
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        console.log("Starting silent login process...");

        // Perform the sign in
        const result = await signIn("credentials", {
          token: token,
          redirect: false,
        });

        // Clear the cookies after attempting login
        // We do this client-side for simplicity as they are not httpOnly
        document.cookie =
          "auth_callback_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "auth_callback_return_url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        if (result?.ok) {
          toast.success("Welcome back!", {
            description: "You have successfully logged in.",
          });
          router.replace(returnUrl || "/");
        } else {
          console.error("Login failed:", result?.error);
          toast.error("Authentication Failed", {
            description: result?.error || "Could not verify your session.",
          });
          router.replace("/login");
        }
      } catch (err) {
        console.error("Error during silent login:", err);
        router.replace("/login");
      }
    };

    if (token) {
      handleLogin();
    }
  }, [token, returnUrl, router]);

  // Return nothing to keep the screen clean and "invisible"
  return null;
}
