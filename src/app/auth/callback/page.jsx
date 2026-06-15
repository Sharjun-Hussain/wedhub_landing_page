import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SilentLogin from "./SilentLogin";

export default async function AuthCallbackPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_callback_token")?.value;
  const returnUrl = cookieStore.get("auth_callback_return_url")?.value || "/";

  // If there's no token in the cookie, it means the middleware didn't find one
  // or the cookie expired/was cleared. Redirect back to login.
  if (!token) {
    redirect("/login");
  }

  // Render the silent client component to perform the actual sign-in
  // We don't show any UI here to ensure the process is "server-like" and invisible
  return <SilentLogin token={token} returnUrl={returnUrl} />;
}
