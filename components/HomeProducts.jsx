import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-2xl font-medium">Popular products</p>
        <button
          onClick={() => {
            router.push("/all-products");
          }}
          className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
        >
          See more
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-6 mt-6 pb-14 w-full">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;
