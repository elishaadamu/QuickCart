"use client";

import React, { createContext, useState, useContext } from "react";

// 1. Create the context
const CartContext = createContext();

// 2. Create a custom hook for easy consumption
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// 3. Create the Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item already exists
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        // Increase quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new item with quantity 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => [...prevItems, product]);
    // Here you would also make an API call to your endpoint
    // fetch('/api/wishlist', { method: 'POST', body: JSON.stringify(product) });
  };

  const value = {
    cartItems,
    addToCart,
    isCartOpen,
    toggleCart,
    wishlistItems,
    addToWishlist,
    cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
