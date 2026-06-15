import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginCustomer } from "@/lib/api";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        // 1. Add 'token' here so we can call signIn('credentials', { token: ... })
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        // --- SCENARIO 1: GOOGLE / SOCIAL LOGIN (Token Based) ---
        if (credentials?.token) {
          try {
            console.log("🔐 Token-based auth attempt");
            console.log(
              "Token (first 20 chars):",
              credentials.token.substring(0, 20) + "...",
            );

            // Decode JWT to get user data (JWT format: header.payload.signature)
            const tokenParts = credentials.token.split(".");
            if (tokenParts.length !== 3) {
              console.error("❌ Invalid JWT format");
              return null;
            }

            // Decode the payload (second part of JWT)
            const payload = JSON.parse(
              Buffer.from(tokenParts[1], "base64").toString("utf-8"),
            );

            console.log("📦 Decoded JWT payload:", payload);

            // Extract user data from JWT payload
            if (payload.id && payload.email) {
              console.log("✅ User data extracted from JWT:", {
                id: payload.id,
                name: payload.name,
                email: payload.email,
                username: payload.username,
              });

              return {
                id: String(payload.id),
                name: payload.name || payload.email.split("@")[0],
                email: payload.email,
                username: payload.username || payload.email.split("@")[0],
                token: credentials.token,
                image: payload.avatar || payload.profile_photo_url || null,
              };
            }

            console.error(
              "❌ JWT payload missing required fields (id or email)",
            );
            return null;
          } catch (error) {
            console.error("❌ Token decode error:", error);
            console.error("Error details:", {
              message: error.message,
              stack: error.stack,
            });
            return null;
          }
        }

        // --- SCENARIO 2: LEGACY LOGIN (Email & Password) ---
        if (credentials?.email && credentials?.password) {
          try {
            console.log("Authorize called with:", {
              email: credentials.email,
              password: "***",
            });

            const data = await loginCustomer({
              email: credentials.email,
              password: credentials.password,
            });

            console.log("Login API response:", data);

            const accessToken = data && data.data ? (data.data.access_token || data.data.token) : null;
            const userObj = data && data.data ? (data.data.user || data.data) : null;

            if (data && data.success && accessToken && userObj) {
              return {
                id: String(userObj.id),
                name: userObj.name,
                email: userObj.email,
                username: userObj.username,
                token: accessToken,
                image: userObj.avatar || userObj.profile_image || null,
              };
            }

            return null;
          } catch (error) {
            console.error("Login API error:", error);

            // Check for specific unverified email error from API
            if (error.info && error.info.email_verified === false) {
              throw new Error(
                JSON.stringify({
                  type: "UNVERIFIED_EMAIL",
                  email: error.info.email,
                  message: error.info.message,
                }),
              );
            }

            throw new Error(error.message || "Login failed");
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.username = user.username;
        // token.picture is automatically set if user.image exists
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
