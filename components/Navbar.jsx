"use client";
import React, { useState } from "react"; // Import useState
import Logo from "@/assets/logo/logo.png";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative bg-white shadow-md z-10">
      {" "}
      {/* Added relative for absolute positioning of mobile menu */}
      <Image
        className="cursor-pointer w-[100px] md:w-32"
        onClick={() => router.push("/")}
        src={Logo}
        alt="logo"
      />
      {/* Desktop Navigation Links */}
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

        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Dashboard
          </Link>
        ) : (
          <div className=""></div>
        )}
      </div>
      {/* Desktop Icons and Buttons */}
      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        <Link href={"/wishlist"} className="flex relative">
          <Image className="w-5" src={assets.heart_icon} alt="" />
          <div className="absolute -top-2 -right-2 text-xs bg-red-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
            <p>{getWishlistCount()}</p>
          </div>
        </Link>
        <Link href={"/cart"} className="flex relative">
          <Image className="w-5" src={assets.cart_icon} alt="" />
          <div className="absolute -top-2 -right-2 text-xs bg-red-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
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
            <Link href={"/signin"}>
              <button className="border border-gray-800 text-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-800 hover:text-white transition">
                Sign in
              </button>
            </Link>
            <Link href={"/signup"}>
              <button className="bg-gray-800 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition">
                Sign up
              </button>
            </Link>
          </div>
        )}
      </ul>
      {/* Mobile Icons and Hamburger */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        <Link href={"/wishlist"} className="flex relative">
          <Image className="w-5" src={assets.heart_icon} alt="" />
          <div className="absolute -top-2 -right-2 text-xs bg-red-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
            <p>{getWishlistCount()}</p>
          </div>
        </Link>
        <Link href={"/cart"} className="flex relative">
          <Image className="w-5" src={assets.cart_icon} alt="" />
          <div className="absolute -top-2 -right-2 text-xs bg-red-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
            <p>{getCartCount()}</p>
          </div>
        </Link>
        {/* Hamburger Icon */}
        <Image
          className="w-6 h-6 cursor-pointer"
          src={assets.menu_icon}
          alt="menu icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center md:hidden">
          <Image
            className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
            src={assets.menu_icon} // Using menu_icon for closing as cross_icon is not available
            alt="close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="flex flex-col items-center gap-6 text-lg">
            <Link
              href="/"
              className="hover:text-gray-900 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/all-products"
              className="hover:text-gray-900 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="hover:text-gray-900 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/"
              className="hover:text-gray-900 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isLoggedIn && (
              <Link
                href="/wallet"
                className="hover:text-gray-900 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Add Funds
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-gray-800 text-white px-6 py-2 rounded-full w-40 hover:bg-gray-700 transition"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4 mt-4">
                {" "}
                {/* Sign-in/Sign-up buttons inside mobile menu */}
                <Link href={"/signin"}>
                  <button className="border border-gray-800 text-gray-800 px-6 py-2 rounded-full w-40 hover:bg-gray-800 hover:text-white transition">
                    Sign in
                  </button>
                </Link>
                <Link href={"/signup"}>
                  <button className="bg-gray-800 text-white px-6 py-2 rounded-full w-40 hover:bg-gray-700 transition">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
