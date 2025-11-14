"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import CategorySidebar from "@/components/CategorySidebar";
import FeaturedProduct from "@/components/FeaturedProduct";
import VendorSection from "@/components/VendorSection";
import { FaArrowUp } from "react-icons/fa";
import { useAppContext } from "@/context/AppContext";
import SubscriptionPlans from "@/components/SubscriptionSection";

const useIdleTimeout = (
  onIdle,
  idleTimeInSeconds = 72000000,
  enabled = true
) => {
  const timeoutId = useRef();
  const channel = useRef(null);

  const startTimer = () => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(onIdle, idleTimeInSeconds * 1000);
  };

  const resetTimer = () => {
    startTimer();
  };

  const handleBroadcastMessage = useCallback((event) => {
    if (event.data === "user-activity") {
      console.log("Activity in another tab, resetting idle timer.");
      resetTimer();
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearTimeout(timeoutId.current);
      return;
    }

    // Create a BroadcastChannel to communicate across tabs
    channel.current = new BroadcastChannel("idle-timeout");
    channel.current.onmessage = handleBroadcastMessage;

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const handleActivity = () => {
      // Notify other tabs about the activity
      channel.current.postMessage("user-activity");
      resetTimer();
    };

    // Set up event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, {
        passive: true,
        capture: true,
      });
    });

    startTimer();

    // Cleanup
    return () => {
      console.log("Cleaning up idle timer.");
      clearTimeout(timeoutId.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity, { capture: true });
      });
      if (channel.current) {
        channel.current.close();
      }
    };
  }, [onIdle, idleTimeInSeconds, handleBroadcastMessage, enabled]); // Dependencies for the effect
};

const HomeClient = () => {
  const router = useRouter();
  const { logout, isLoggedIn, userData } = useAppContext();

  const handleIdle = useCallback(() => {
    console.log("User is idle. Logging out and redirecting.");
    logout();
    // Use userData from context, which is available in this scope
    const role = userData?.user?.role || userData?.role;
    if (role === "user") {
      router.push("/signin"); // Redirect to sign-in page after logout
    } else if (role === "admin") {
      router.push("/admin/signin"); // Redirect to admin sign-in page after logout
    } else if (role === "vendor") {
      router.push("/vendor-signin"); // Redirect to vendor sign-in page after logout
    } else if (role === "delivery") {
      router.push("/delivery-signin"); // Redirect to delivery sign-in page after logout
    }
  }, [logout, router, userData]);

  // Set timeout for 2 minutes (120 seconds)
  // The idle timer is only enabled if the user is logged in.
  useIdleTimeout(handleIdle, 120, isLoggedIn);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showBackToTop && window.pageYOffset > 400) {
        setShowBackToTop(true);
      } else if (showBackToTop && window.pageYOffset <= 400) {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showBackToTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="flex justify-center max-w-[1280px] mx-auto gap-10">
        <CategorySidebar />
        <HeaderSlider />
      </div>
      <div className="px-6  max-w-[1280px] mx-auto lg:px-32">
        <VendorSection />
        <HomeProducts />
        <SubscriptionPlans />
        <FeaturedProduct />

        <Banner />
        <NewsLetter />
      </div>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
          aria-label="Go to top"
          title="Go to top"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default HomeClient;
