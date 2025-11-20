"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { FiHeart } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import Image from "next/image";

const ProductCard = ({ product }) => {
  const { currency, router, addToWishlist, wishlistItems, isLoggedIn } =
    useAppContext();

  // Fallback image handling
  const productImage =
    (product?.image && product.image.length > 0 ? product.image[0] : null) ||
    (product?.images && product.images.length > 0
      ? product.images[0]?.url
      : null) ||
    "https://picsum.photos/seed/fallback/400/400";

  const hasOffer = product.offerPrice && product.offerPrice < product.price;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please sign in to add items to your wishlist.");
      router.push("/signin");
      return;
    }
    addToWishlist(product._id);
    toast.success(
      wishlistItems.includes(product._id)
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  return (
    <div
      onClick={() => {
        router.push(`/product/${product._id}`);
        window.scrollTo(0, 0);
      }}
      className="group relative w-full max-w-xs cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gray-50">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105 scale-90"
        />

        {/* Discount Badge */}
        {hasOffer && (
          <span className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
            -
            {Math.round(
              ((product.price - product.offerPrice) / product.price) * 100
            )}
            % OFF
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md transition hover:bg-white"
        >
          {wishlistItems?.includes(product._id) ? (
            <FaHeart className="h-5 w-5 text-red-500" />
          ) : (
            <FiHeart className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Bottom Section – Name & Price */}
      <div className="p-4 bg-white">
        <h3 className="truncate text-base font-medium text-gray-800">
          {product.name}
        </h3>

        <div className="mt-2 flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {currency}
              {hasOffer
                ? product.offerPrice.toLocaleString()
                : product.price.toLocaleString()}
            </span>
            {hasOffer && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {currency}
                {product.price.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm">
            <FaStar className="mr-1 h-3 w-3 text-yellow-400" />
            <span className="font-medium text-gray-700">
              {product.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
