"use client";
import React, { useState, useEffect } from "react";
import Logo from "@/assets/logo/logo.png";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { products } from "@/assets/productData";

const Navbar = () => {
  const {
    isSeller,
    router,
    getCartCount,
    getWishlistCount,
    userData,
    isLoggedIn,
    logout,
  } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        setAnimate(true);
      });
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleCloseMenu = () => {
    setAnimate(false);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 300);
  };

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative bg-white shadow-md z-10">
      <Image
        className="cursor-pointer w-[170px] md:w-[250px]"
        onClick={() => router.push("/")}
        src={Logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/about" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>
        {isLoggedIn && (
          <Link
            href="/dashboard"
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Dashboard
          </Link>
        )}
      </div>
      <ul className="hidden md:flex items-center gap-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-1.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-20">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="p-4 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
                  >
                    <Image
                      src={product.imgSrc}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>
        <Link href="/wishlist" className="flex relative">
          <Image className="w-5" src={assets.heart_icon} alt="" />
          <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
            <p>{getWishlistCount()}</p>
          </div>
        </Link>
        <Link href="/cart" className="flex relative">
          <Image className="w-5" src={assets.cart_icon} alt="" />
          <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
            <p>{getCartCount()}</p>
          </div>
        </Link>
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="bg-gray-800 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition"
          >
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/signin">
              <button className="border border-gray-800 text-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-800 hover:text-white transition">
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-gray-800 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition">
                Sign up
              </button>
            </Link>
          </div>
        )}
      </ul>
      <div className="flex items-center md:hidden gap-4">
        <Image
          className="w-5 cursor-pointer"
          src={assets.search_icon}
          alt="search icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        />
        <Link href="/wishlist" className="flex relative">
          <Image className="w-5" src={assets.heart_icon} alt="" />
          <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
            <p>{getWishlistCount()}</p>
          </div>
        </Link>
        <Link href="/cart" className="flex relative">
          <Image className="w-5" src={assets.cart_icon} alt="" />
          <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
            <p>{getCartCount()}</p>
          </div>
        </Link>
        <Image
          className="w-6 h-6 cursor-pointer"
          src={assets.menu_icon}
          alt="menu icon"
          onClick={() => setIsMobileMenuOpen(true)}
        />
      </div>
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white z-20 p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="p-4 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
                    >
                      <Image
                        src={product.imgSrc}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              animate ? "bg-opacity-50" : "bg-opacity-0"
            }`}
            onClick={handleCloseMenu}
          ></div>

          {/* Menu panel */}
          <div
            className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gray-900 text-white p-6 transform transition-transform duration-300 ease-in-out ${
              animate ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-end">
              <button onClick={handleCloseMenu} className="text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center gap-6 text-lg mt-8">
              <Link
                href="/"
                className="hover:text-gray-400 transition"
                onClick={handleCloseMenu}
              >
                Home
              </Link>
              <Link
                href="/all-products"
                className="hover:text-gray-400 transition"
                onClick={handleCloseMenu}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="hover:text-gray-400 transition"
                onClick={handleCloseMenu}
              >
                About Us
              </Link>
              <Link
                href="/"
                className="hover:text-gray-400 transition"
                onClick={handleCloseMenu}
              >
                Contact
              </Link>
              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className="hover:text-gray-400 transition"
                  onClick={handleCloseMenu}
                >
                  Dashboard
                </Link>
              )}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    handleCloseMenu();
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-full w-40 hover:bg-red-500 transition"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col items-center gap-4 mt-4">
                  <Link href="/signin" onClick={handleCloseMenu}>
                    <button className="border border-white text-white px-6 py-2 rounded-full w-40 hover:bg-white hover:text-gray-900 transition">
                      Sign in
                    </button>
                  </Link>
                  <Link href="/signup" onClick={handleCloseMenu}>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full w-40 hover:bg-blue-500 transition">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
