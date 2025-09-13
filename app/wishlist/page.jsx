"use client";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const page = () => {
  const { products, wishlistItems } = useAppContext();

  const wishlistProducts = products.filter((product) =>
    wishlistItems.includes(product._id)
  );

  return (
    <div className="flex flex-col items-center gap-8 my-16 px-4 md:px-16 lg:px-32">
      <h1 className="text-3xl font-bold text-gray-800">Your Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlistProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {wishlistProducts.length === 0 && (
        <p className="text-gray-700">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default page;
