"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { fetchMe } from "@/lib/api";
import { usePathname } from "next/navigation";

/**
 * SessionSentinel
 *
 * Silently validates the NextAuth session against the backend API.
 * If the backend session has expired (e.g., 401 Unauthorized),
 * it clears the NextAuth session without forcing a redirect.
 */
export default function SessionSentinel() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isChecking = useRef(false);

  useEffect(() => {
    const validateSession = async () => {
      // Only check if we are authenticated and have a token
      if (
        status === "authenticated" &&
        session?.accessToken &&
        !isChecking.current
      ) {
        try {
          isChecking.current = true;

          // Check if the token is still valid on the server
          const response = await fetchMe(session.accessToken);

          // If the backend returns success: false even without a 401 status
          if (response && response.success === false) {
            console.warn("Session sentinel: Server session marked as invalid.");
            await signOut({ redirect: false });
          }
        } catch (error) {
          // If backend returns 401 or 403, the session is definitely expired
          if (error.status === 401 || error.status === 403) {
            console.warn(
              `Session sentinel: Server session expired (${error.status}). Clearing NextAuth session...`,
            );
            await signOut({ redirect: false });
          } else {
            // Log other errors but don't force sign out (could be a transient network issue)
            console.error("Session sentinel: Validation error", error);
          }
        } finally {
          isChecking.current = false;
        }
      }
    };

    validateSession();
  }, [session, status, pathname]); // Re-validate on mount, session change, or navigation

  return null;
}
