"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "./ProductCard";
import { FaTags } from "react-icons/fa";

const CategoryProducts = () => {
  const { products, router } = useAppContext();
  const [featuredCategory, setFeaturedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          apiUrl(API_CONFIG.ENDPOINTS.CATEGORY.GET_ALL)
        );
        console.log("Categories", response.data.categories);
        const categories = response.data.categories || [];

        // You can make this dynamic, e.g., random or based on popularity.
        // For now, let's feature "Electronics" if it exists, otherwise the first one.
        const electronics = categories.find((cat) => cat.name === "Fashion");
        if (electronics) {
          setFeaturedCategory(electronics);
        } else if (categories.length > 0) {
          setFeaturedCategory(categories[0]);
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const categoryProducts = useMemo(() => {
    if (!featuredCategory || !products) return [];
    return products
      .filter((p) => p.category === featuredCategory.name)
      .slice(0, 4); // Show up to 4 products
  }, [featuredCategory, products]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!featuredCategory || categoryProducts.length === 0) {
    return null; // Don't render anything if no category or products found
  }

  return (
    <section className="py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <FaTags className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {featuredCategory.name}
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Check out our latest arrivals in the {featuredCategory.name} category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() =>
            router.push(
              `/category/${featuredCategory.name
                .toLowerCase()
                .replace(/ & /g, "-")
                .replace(/ /g, "-")}`
            )
          }
          className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          View All in {featuredCategory.name}
        </button>
      </div>
    </section>
  );
};

export default CategoryProducts;
