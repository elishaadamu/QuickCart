"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { FaTags } from "react-icons/fa";
import Link from "next/link";
import Loading from "@/components/Loading";

const AllProducts = () => {
  const { products, productsLoading } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          apiUrl(API_CONFIG.ENDPOINTS.CATEGORY.GET_ALL)
        );
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategory();
  }, []);

  // Filter categories that have at least one product
  const validCategories = useMemo(() => {
    return categories.filter((category) =>
      products.some((p) => p.category === category.name)
    );
  }, [categories, products]);

  // If we're loading or have no data yet, we might want to show a loading state or nothing
  // But to match the behavior of validCategories being essential:
  if (!products || productsLoading || categoriesLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 pt-12">
        <style jsx global>{`
          @media screen and (max-width: 360px) {
            .home-products {
              grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            }
          }
        `}</style>

        <div className="flex flex-col items-start w-full mb-8">
          <div className="flex flex-col items-end w-full">
            <p className="text-2xl font-medium">All products</p>
            <div className="w-16 h-0.5 bg-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* If categories are loaded and valid, show categorized view */}
        {validCategories.length > 0 ? (
          validCategories.map((category) => {
            const categoryProducts = products.filter(
              (p) => p.category === category.name
            );

            return (
              <React.Fragment key={category._id}>
                <section className="py-1 w-full">
                  <div className="flex flex-col text-left mb-8">
                    <div className="inline-flex gap-3 mb-4">
                      <FaTags className="w-6 h-6 text-blue-600" />
                      <Link
                        href={`/category/${encodeURIComponent(category?.name)}`}
                      >
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                          {category.name}
                        </h2>
                      </Link>
                    </div>
                    {/* Optional description if needed, similar to reference */}
                    <p className="text-lg text-gray-600 text-left max-w-2xl">
                      Check out our latest arrivals in the {category.name}{" "}
                      category.
                    </p>
                  </div>

                  <div className="home-products grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-6 mt-6 pb-14 w-full">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </section>
                {/* Only show separator if it's not the last category, or just show it for distinct sections */}
                <hr className="mb-12 border-gray-200 w-full" />
              </React.Fragment>
            );
          })
        ) : (
          /* Fallback if no categories found or matched, show all products in one grid (original behavior) or empty state? 
             The user requested "To categories all the products", so sticking to that. 
             But if validCategories is empty (e.g. data fetching fail), we might still want to show products un-categorized or just wait.
             Let's just show products uncategorized if validCategories is empty but we have products.
             Actually, let's assume if categories specifically fail, we fall back to uncategorized.
          */
          <div className="w-full">
            {/* Fallback View */}
            <div className="grid home-products grid-cols-2 sm:grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-6 mt-6 pb-14 w-full">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllProducts;
