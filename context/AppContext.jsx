"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { decryptData } from "@/lib/encryption";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(true);
  // Load cartItems from localStorage on initial render
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems_storage");
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          if (
            parsedCart.timestamp &&
            Date.now() - parsedCart.timestamp < 24 * 60 * 60 * 1000
          ) {
            return parsedCart.data;
          } else {
            localStorage.removeItem("cartItems_storage"); // Data expired
          }
        } catch (e) {
          console.error("Error parsing cart data from localStorage", e);
          localStorage.removeItem("cartItems_storage");
        }
      }
    }
    return {};
  });

  // Load wishlistItems from localStorage on initial render
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("wishlistItems_storage");
      if (storedWishlist) {
        try {
          const parsedWishlist = JSON.parse(storedWishlist);
          if (
            parsedWishlist.timestamp &&
            Date.now() - parsedWishlist.timestamp < 24 * 60 * 60 * 1000
          ) {
            return parsedWishlist.data;
          } else {
            localStorage.removeItem("wishlistItems_storage"); // Data expired
          }
        } catch (e) {
          console.error("Error parsing wishlist data from localStorage", e);
          localStorage.removeItem("wishlistItems_storage");
        }
      }
    }
    return [];
  });

  const fetchProductData = async () => {
    setProducts(productsDummyData);
  };

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data from localStorage...");
      const encryptedUser = localStorage.getItem("user");
      console.log("Raw data from localStorage:", {
        exists: !!encryptedUser,
        value: encryptedUser,
        length: encryptedUser?.length,
      });

      if (!encryptedUser) {
        console.log("No encrypted data found in localStorage");
        setUserData(null);
        return;
      }

      const decryptedUser = decryptData(encryptedUser);
      console.log("Decryption result:", {
        success: !!decryptedUser,
        decryptedData: decryptedUser,
        dataType: typeof decryptedUser,
      });

      if (decryptedUser) {
        console.log("Setting user data in context:", decryptedUser);
        setUserData(decryptedUser);
      } else {
        console.log("Decryption returned null, clearing storage");
        localStorage.removeItem("user");
        setUserData(null);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", {
        message: error.message,
        stack: error.stack,
      });
      localStorage.removeItem("user");
      setUserData(null);
    }
  };
  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const addToWishlist = (itemId) => {
    let wishlistData = structuredClone(wishlistItems);
    if (wishlistData.includes(itemId)) {
      wishlistData = wishlistData.filter((id) => id !== itemId);
    } else {
      wishlistData.push(itemId);
    }
    setWishlistItems(wishlistData);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "cartItems_storage",
        JSON.stringify({ data: cartItems, timestamp: Date.now() })
      );
    }
  }, [cartItems]);

  // Save wishlistItems to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "wishlistItems_storage",
        JSON.stringify({ data: wishlistItems, timestamp: Date.now() })
      );
    }
  }, [wishlistItems]);

  const value = {
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    wishlistItems,
    addToWishlist,
    getWishlistCount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
