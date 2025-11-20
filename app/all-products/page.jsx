"use client";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {
  const { products } = useAppContext();

  return (
    <>
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
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
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-blue-600 rounded-full"></div>
        </div>
        <div className="grid home-products grid-cols-2 sm:grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-6 mt-6 pb-14 w-full">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
