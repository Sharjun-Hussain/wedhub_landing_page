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
  title: {
    template: "%s | WedHub - Sri Lanka's Premier Luxury Wedding Marketplace",
    default: "WedHub | Find Wedding Vendors & Venues in Sri Lanka",
  },
  description:
    "Plan your perfect Sri Lankan wedding with WedHub. Discover top-rated local wedding vendors, luxury venues, bridal dressing, photographers, and comprehensive planning tools.",
  keywords: [
    "Sri Lanka weddings",
    "wedding vendors Sri Lanka",
    "Colombo wedding venues",
    "bridal dressing Sri Lanka",
    "wedding planner Sri Lanka",
    "Kandyan weddings",
    "poruwa ceremony",
    "WedHub",
    "luxury weddings Sri Lanka",
  ],
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
          color="#fc0a7a"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #fc0a7a,0 0 5px #fc0a7a"
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
