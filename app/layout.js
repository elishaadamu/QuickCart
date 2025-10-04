"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar"; // Import Navbar
import Footer from "@/components/Footer"; // Import Footer
import { usePathname } from "next/navigation";

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
    pathname.startsWith("/seller");

  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <ToastContainer />
        <AppContextProvider>
          {!isSpecialRoute && <Navbar />} {/* Conditionally render Navbar */}
          {children}
          {!isSpecialRoute && <Footer />} {/* Conditionally render Footer */}
        </AppContextProvider>
      </body>
    </html>
  );
}
