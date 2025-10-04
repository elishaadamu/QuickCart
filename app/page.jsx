"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import CategorySidebar from "@/components/CategorySidebar";
import FeaturedProduct from "@/components/FeaturedProduct";
import VendorSection from "@/components/VendorSection";

const useIdleTimeout = (onIdle, idleTimeInSeconds = 120) => {
  const timeoutId = useRef();
  const router = useRouter();

  const startTimer = () => {
    timeoutId.current = setTimeout(onIdle, idleTimeInSeconds * 1000);
  };

  const resetTimer = () => {
    clearTimeout(timeoutId.current);
    startTimer();
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const handleActivity = () => {
      resetTimer();
    };

    // Set up event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    startTimer();

    // Cleanup
    return () => {
      clearTimeout(timeoutId.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [onIdle, idleTimeInSeconds, router]); // Dependencies for the effect
};

const Home = () => {
  const router = useRouter();

  const handleIdle = () => {
    console.log("User is idle. Logging out.");
    // You can add your actual logout logic here (e.g., clearing tokens, session).
    router.push("/");
  };

  // Set timeout for 2 minutes (120 seconds)
  useIdleTimeout(handleIdle, 120);

  return (
    <>
      <div className="flex justify-center max-w-[1280px] mx-auto gap-10">
        <CategorySidebar />
        <HeaderSlider />
      </div>
      <div className="px-6  max-w-[1280px] mx-auto lg:px-32">
        <VendorSection />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
    </>
  );
};

export default Home;
