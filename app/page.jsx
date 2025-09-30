"use client";
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import CategorySidebar from "@/components/CategorySidebar";
import FeaturedProduct from "@/components/FeaturedProduct";
import VendorSection from "@/components/VendorSection";

const Home = () => {
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
