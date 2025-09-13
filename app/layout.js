"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar"; // Import Navbar
import Footer from "@/components/Footer"; // Import Footer
import { usePathname } from "next/navigation";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard');

  return (
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            {!isDashboardRoute && <Navbar />} {/* Conditionally render Navbar */}
            {children}
            {!isDashboardRoute && <Footer />} {/* Conditionally render Footer */}
          </AppContextProvider>
        </body>
      </html>
  );
}

