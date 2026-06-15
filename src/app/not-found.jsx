import React, { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import Header from "@/Sections/Header/Header";
import Footer from "@/Sections/Footer/Footer";
import { NotFoundClient } from "./not-found/NotFoundClient";

export default function NotFound() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col bg-white dark:bg-zinc-950 font-sans antialiased text-slate-900 dark:text-zinc-50 min-h-screen relative">
        <Header />
        
        <Suspense fallback={null}>
          <NotFoundClient />
        </Suspense>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
