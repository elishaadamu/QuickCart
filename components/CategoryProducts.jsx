"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "./ProductCard";
import { FaTags } from "react-icons/fa";

const CategoryProducts = ({ category }) => {
  const { products, router } = useAppContext();

  const categoryProducts = useMemo(() => {
    if (!category || !products) return [];
    return products.filter((p) => p.category === category.name).slice(0, 4); // Show up to 4 products
  }, [category, products]);

  if (!category || categoryProducts.length === 0) {
    return null; // Don't render anything if no category or products found
  }

  return (
    <section className="py-1">
      <style jsx global>{`
        @media screen and (max-width: 360px) {
          .home-products {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          .button-see_more {
            flex-direction: column;
            justify-content: start;
            align-items: baseline;
            gap: 10px;
          }
        }
      `}</style>
      <div className="flex flex-col items-center text-left mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <FaTags className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl md:text-3xl font-bold text-gray-900">
            {category.name}
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Check out our latest arrivals in the {category.name} category.
        </p>
      </div>

      <div className="home-products grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-6 mt-6  w-full">
        {categoryProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* <div className="text-center mt-12">
        <button
          onClick={() =>
            router.push(
              `/category/${category.name
                .toLowerCase()
                .replace(/ & /g, "-")
                .replace(/ /g, "-")}`
            )
          }
          className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          View All in {category.name}
        </button>
      </div> */}
    </section>
  );
};

export default CategoryProducts;
