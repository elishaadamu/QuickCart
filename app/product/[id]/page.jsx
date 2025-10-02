"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import ImageMagnify from "@/components/ImageMagnify/ImageMagnify.jsx";

import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";

const Product = () => {
  const { id } = useParams();

  const { products, router, addToCart, isLoggedIn, currency } = useAppContext();
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const response = await axios.get(
          apiUrl(API_CONFIG.ENDPOINTS.PRODUCT.GET_PRODUCT)
        );
        const foundProduct = response.data.find((item) => item._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          console.log(foundProduct);
        }
      } catch (error) {
        console.error("Error fetching vendor products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorProducts();
  }, [id]);

  if (loading || !product) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div
              className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 relative"
              style={{ zIndex: 1 }}
            >
              {/* Magnifier effect */}
              <ImageMagnify
                smallImage={{
                  alt: product.name,
                  src: mainImage || product.images[0]?.url,
                }}
                largeImage={{
                  src: mainImage || product.images[0]?.url,
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image.url)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={image.url}
                    alt="alt"
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <Image
                    key={i}
                    className="h-4 w-4"
                    src={assets.star_icon}
                    alt="star_icon"
                  />
                ))}
                <Image
                  className="h-4 w-4"
                  src={assets.star_dull_icon}
                  alt="star_dull_icon"
                />
              </div>
              <p>(4.5)</p>
            </div>
            <p className="text-gray-600 mt-3">{product.description}</p>
            <div className="text-3xl font-medium mt-6">
              {product.offerPrice ? (
                <>
                  {currency}
                  {product.offerPrice}
                  <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                    {currency}
                    {product.price}
                  </span>
                </>
              ) : (
                <>
                  {currency}
                  {product.price}
                </>
              )}
            </div>
            <hr className="bg-gray-600 my-6" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">
                      Stocks Available
                    </td>
                    <td className="text-gray-800/50 ">{product.stock}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Condition</td>
                    <td className="text-gray-800/50 ">{product.condition}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Category</td>
                    <td className="text-gray-800/50">{product.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Buttons */}
            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.error("Please sign in to add items to cart");
                    router.push("/signin");
                    return;
                  }
                  addToCart(product._id);
                  toast.success(`${product.name} has been added to your cart!`);
                }}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.error("Please sign in to add items to cart");
                    router.push("/signin");
                    return;
                  }
                  addToCart(product._id);
                  toast.success(`${product.name} has been added to your cart!`);
                  router.push("/cart");
                }}
                className="w-full py-3.5 bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>

        {/* Featured products */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured{" "}
              <span className="font-medium text-blue-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-blue-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
            See more
          </button>
        </div>
      </div>
    </>
  );
};
export default Product;
