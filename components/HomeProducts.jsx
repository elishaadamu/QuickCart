import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <div className="flex flex-col w-full">
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
      <div className="flex button-see_more sm:flex-co justify-between items-center w-full">
        <p className="text-2xl font-medium">Popular products</p>
        <button
          onClick={() => {
            router.push("/all-products");
          }}
          className="px-4 md:px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
        >
          See more
        </button>
      </div>
      <div className="home-products grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-6 mt-6 pb-14 w-full">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;
