"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AuthDebugPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          NextAuth Debug Page
        </h1>

        {/* Status */}
        <div className="mb-6 p-4 bg-slate-100 dark:bg-zinc-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
            Authentication Status
          </h2>
          <p className="text-slate-700 dark:text-slate-300">
            Status: <span className="font-mono font-bold">{status}</span>
          </p>
        </div>

        {/* Session Data */}
        {status === "loading" && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading session...</span>
          </div>
        )}

        {status === "authenticated" && session && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h2 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100">
              ✅ Authenticated
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-green-800 dark:text-green-200">
                  User ID:
                </span>
                <span className="ml-2 font-mono text-green-700 dark:text-green-300">
                  {session.user?.id}
                </span>
              </div>
              <div>
                <span className="font-semibold text-green-800 dark:text-green-200">
                  Name:
                </span>
                <span className="ml-2 text-green-700 dark:text-green-300">
                  {session.user?.name}
                </span>
              </div>
              <div>
                <span className="font-semibold text-green-800 dark:text-green-200">
                  Email:
                </span>
                <span className="ml-2 text-green-700 dark:text-green-300">
                  {session.user?.email}
                </span>
              </div>
              <div>
                <span className="font-semibold text-green-800 dark:text-green-200">
                  Username:
                </span>
                <span className="ml-2 text-green-700 dark:text-green-300">
                  {session.user?.username}
                </span>
              </div>
              <div>
                <span className="font-semibold text-green-800 dark:text-green-200">
                  Access Token:
                </span>
                <span className="ml-2 font-mono text-xs text-green-700 dark:text-green-300">
                  {session.accessToken?.substring(0, 30)}...
                </span>
              </div>
            </div>

            <h3 className="text-md font-semibold mt-4 mb-2 text-green-900 dark:text-green-100">
              Full Session Object:
            </h3>
            <pre className="bg-green-100 dark:bg-green-950 p-3 rounded text-xs overflow-auto max-h-64 text-green-900 dark:text-green-100">
              {JSON.stringify(session, null, 2)}
            </pre>

            <button
              onClick={() => signOut()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
            >
              Sign Out
            </button>
          </div>
        )}

        {status === "unauthenticated" && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-lg font-semibold mb-4 text-yellow-900 dark:text-yellow-100">
              ⚠️ Not Authenticated
            </h2>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              You are not currently logged in.
            </p>
            <button
              onClick={() => signIn("credentials")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Sign In (Test)
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
            📋 How to Test Google OAuth
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Click "Login with Google" on the login page or checkout</li>
            <li>Complete Google authentication</li>
            <li>
              You'll be redirected to{" "}
              <code className="bg-blue-100 dark:bg-blue-950 px-1 rounded">
                /auth/callback
              </code>
            </li>
            <li>Then redirected back to this page or home</li>
            <li>Check the browser console for detailed logs</li>
            <li>Check this page to see if session was created</li>
          </ol>
        </div>

        {/* Console Logs */}
        <div className="mt-8 p-4 bg-slate-100 dark:bg-zinc-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
            🔍 Check Browser Console
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            Open your browser's developer console (F12) to see detailed
            authentication logs. Look for messages starting with 🔐, 📡, 📥, ✅,
            or ❌.
          </p>
        </div>
      </div>
    </div>
  );
}
