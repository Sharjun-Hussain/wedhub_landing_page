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
  metadataBase: new URL("https://wedhub.lk"),
  title: {
    template: "%s | WedHub - The Best Wedding Marketplace in Sri Lanka",
    default: "WedHub | The Best Wedding Marketplace for Venues & Vendors",
  },
  description:
    "Plan your perfect Sri Lankan wedding with WedHub, the best wedding marketplace. Discover top-rated local wedding vendors, luxury venues, bridal dressing, photographers, and comprehensive planning tools.",
  keywords: [
    "best wedding marketplace",
    "best wedding marketplace Sri Lanka",
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
  openGraph: {
    title: "WedHub | The Best Wedding Marketplace in Sri Lanka",
    description: "Discover the best wedding marketplace in Sri Lanka. Connect with top-tier verified wedding vendors across Sri Lanka. Plan your dream wedding effortlessly.",
    url: "https://wedhub.lk",
    siteName: "WedHub",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "WedHub Logo",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  // Pre-fetch server session so SessionProvider is hydrated immediately.
  // This eliminates the status: "loading" → "authenticated" transition
  // that caused extra re-renders on every page load across the whole app.
  const session = await getServerSession(authOptions);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WedHub",
    url: "https://wedhub.lk/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://wedhub.lk/vendors?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    description: "Sri Lanka's Premier Luxury Wedding Marketplace",
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WedHub",
    url: "https://wedhub.lk",
    logo: "https://wedhub.lk/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+94-77-289-0063",
      contactType: "customer service",
      email: "info@wedhub.lk",
      availableLanguage: ["English", "Sinhala"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "252A Galle Rd",
      addressLocality: "Colombo",
      postalCode: "00400",
      addressCountry: "LK",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </head>
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
