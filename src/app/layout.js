import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/Theme-Provider";
import { Header } from "@/Sections/Header/Header";
import { StoreProvider } from "@/States/Store";
import { Toaster } from "@/components/ui/sonner";
import BottomNav from "@/components/Navigation/BottomNav";
import MainWrapper from "@/components/Navigation/MainWrapper";
import { AuthProvider } from "@/providers/Session-Provider";
import SessionSentinel from "@/components/auth/SessionSentinel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Foreign Emporium | Premium Imported Goods",
  description:
    "Your elite boutique storefront for imported Belgian chocolates, perfumes, baby care products, and gourmet pantry goods.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({ children }) {
  // Pre-fetch server session so SessionProvider is hydrated immediately.
  // This eliminates the status: "loading" → "authenticated" transition
  // that caused extra re-renders on every page load across the whole app.
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#d4af37"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #d4af37,0 0 5px #d4af37"
        />
        <StoreProvider>
          <AuthProvider session={session}>
            <SessionSentinel />
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <MainWrapper>{children}</MainWrapper>
              <BottomNav />
              <Toaster
                position="top-center"
                closeButton
                expand={false}
                theme="system"
              />
            </ThemeProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
