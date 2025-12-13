"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar"; // Import Navbar
import Footer from "@/components/Footer"; // Import Footer
import { usePathname } from "next/navigation";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isSpecialRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/vendor-signup") ||
    pathname.startsWith("/vendor-signin") ||
    pathname.startsWith("/delivery-signup") ||
    pathname.startsWith("/delivery-signin") ||
    pathname.startsWith("/delivery-dashboard") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/vendor-dashboard");

  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <ToastContainer />
        <AppContextProvider>
          {!isSpecialRoute && <Navbar />} {/* Conditionally render Navbar */}
          {children}
          {!isSpecialRoute && <Footer />} {/* Conditionally render Footer */}
        </AppContextProvider>
        <Script src="https://cdn.botpress.cloud/webchat/v3.5/inject.js" strategy="lazyOnload" />
        <Script
          src="https://files.bpcontent.cloud/2025/12/13/16/20251213161208-0D9LWGZJ.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
