"use client";
import React, { useEffect, useMemo } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";

import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const Cart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    isLoggedIn,
    currency,
  } = useAppContext();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please sign in to view your cart.");
      router.push("/signin");
    }
  }, [isLoggedIn, router]);

  console.log(products);
  const cartProductList = useMemo(() => {
    return Object.keys(cartItems)
      .map((itemId) => {
        const product = products.find((p) => p._id === itemId);
        if (product && cartItems[itemId] > 0) {
          return { ...product, quantity: cartItems[itemId] };
        }
        return null;
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const allRelatedProducts = useMemo(() => {
    if (cartProductList.length === 0 || products.length === 0) {
      return [];
    }

    const cartCategories = new Set(cartProductList.map((p) => p.category));
    const cartItemIds = new Set(cartProductList.map((p) => p._id));
    return products.filter(
      (p) => cartCategories.has(p.category) && !cartItemIds.has(p._id)
    );
  }, [cartProductList, products]);

  const relatedProductsToShow = useMemo(
    () => allRelatedProducts.slice(0, 4),
    [allRelatedProducts]
  );

  if (!isLoggedIn) {
    // Render nothing or a loader while redirecting
    return null;
  }

  if (cartProductList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6">
        <FaShoppingCart className="text-6xl text-slate-300 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-slate-500 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          onClick={() => router.push("/all-products")}
          className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 px-6 md:px-16 lg:px-32 pt-14 mb-20">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-semibold text-slate-800">Your Cart</h1>
          <p className="text-lg text-slate-500">{getCartCount()} Items</p>
        </div>

        {/* Cart Items List */}
        <div className="space-y-6">
          {cartProductList.map((product) => (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-slate-200 rounded-lg"
            >
              {/* Product Image & Info */}
              <div className="flex items-center gap-4 flex-grow">
                <div className="w-20 h-20 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center">
                  <Image
                    src={product.images?.[0]?.url || ""}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply p-1"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-slate-800">{product.name}</p>
                  <p className="text-sm text-slate-500 sm:hidden">
                    {currency}
                    {product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Price (Desktop) */}
              <div className="hidden sm:block w-24 text-center text-slate-600">
                {currency}
                {product.price.toFixed(2)}
              </div>

              {/* Quantity Selector */}
              <div className="w-32 flex-shrink-0">
                <div className="flex items-center border border-slate-300 rounded-md w-fit">
                  <button
                    onClick={() =>
                      updateCartQuantity(product._id, product.quantity - 1)
                    }
                    className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-l-md"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    readOnly
                    type="number"
                    value={product.quantity}
                    className="w-12 border-l border-r text-center appearance-none outline-none bg-transparent cursor-default"
                    aria-label="Product quantity"
                  />
                  <button
                    onClick={() => addToCart(product._id)}
                    className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-r-md"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="w-24 text-right font-semibold text-slate-800">
                {currency}
                {(product.price * product.quantity).toFixed(2)}
              </div>

              {/* Remove Button */}
              <div className="w-10 text-right">
                <button
                  onClick={() => updateCartQuantity(product._id, 0)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/all-products")}
          className="group flex items-center mt-8 gap-2 text-blue-600 font-medium"
        >
          <Image
            className="group-hover:-translate-x-1 transition-transform"
            src={assets.arrow_right_icon_colored}
            alt="arrow_right_icon_colored"
          />
          Continue Shopping
        </button>

        {/* Related Products Section (Desktop Only) */}
        {relatedProductsToShow.length > 0 && (
          <div className="hidden lg:block mt-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                You Might Also Like
              </h2>
              {allRelatedProducts.length > 4 && (
                <button
                  onClick={() => router.push("/all-products")}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
                >
                  View all
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-2 gap-6">
              {relatedProductsToShow.map((product) => (
                <div key={product._id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <OrderSummary />
    </div>
  );
};

export default Cart;
