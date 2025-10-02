"use client";
import React, { useState, useEffect } from "react";
import Logo from "@/assets/logo/logo.png";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { decryptData } from "@/lib/encryption";
import { apiUrl, API_CONFIG } from "@/configs/api";
import axios from "axios";
import { categoriesData } from "@/components/CategorySidebar";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const {
    isSeller,
    router,
    getCartCount,
    getWishlistCount,
    userData,
    isLoggedIn,
    logout,
    products,
    cartItems,
  } = useAppContext();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const encryptedUser = localStorage.getItem("user");
        if (encryptedUser) {
          const userData = decryptData(encryptedUser);
          const walletResponse = await axios.get(
            apiUrl(
              API_CONFIG.ENDPOINTS.ACCOUNT.walletBalance +
                userData.id +
                "/balance"
            )
          );
          setWalletBalance(walletResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchWalletBalance();
  }, []);

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

  const handleSearchIconClick = () => {
    setIsSearchOpen(true);
    // Focus the input when the modal opens
    setTimeout(() => document.getElementById("search-modal-input")?.focus(), 0);
  };

  return (
    <nav className=" border-b border-gray-300 text-gray-700 relative bg-white shadow-md z-10">
      <div className="max-w-[1440px] mx-auto flex items-center  justify-between px-6 md:px-4 lg:px-4 py-3">
        <Image
          className="cursor-pointer w-[170px] md:w-[250px]"
          onClick={() => router.push("/")}
          src={Logo}
          alt="logo"
        />
        <div className="flex items-center gap-4 lg:gap-4 max-md:hidden">
          <Link
            href="/"
            className={`transition text-[18px] ${
              pathname === "/"
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Home
          </Link>
          <Link
            href="/all-products"
            className={`transition text-[18px] ${
              pathname === "/all-products"
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Shop
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setIsCategoryMenuOpen(true)}
            onMouseLeave={() => setIsCategoryMenuOpen(false)}
          >
            <button className="hover:text-gray-900 transition flex items-center gap-1 text-[18px]">
              Categories
              <Image
                src={assets.arrow_icon}
                alt="arrow"
                className={`w-2 h-2 transform transition-transform ${
                  isCategoryMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            <div
              className={`absolute top-full mt-3 left-0 w-64 bg-white border rounded-lg shadow-lg z-20 transform transition-all duration-200 ease-in-out origin-top ${
                isCategoryMenuOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <div className="p-2 max-h-96 overflow-y-auto">
                {categoriesData.map((category) => (
                  <Link
                    key={category.name}
                    href={`/category/${category.name
                      .toLowerCase()
                      .replace(/ & /g, "-")
                      .replace(/ /g, "-")}`}
                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    {category.icon}
                    <span className="text-sm">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            <button className="hover:text-gray-900 transition flex items-center gap-1 text-[18px]">
              Pages
              <Image
                src={assets.arrow_icon}
                alt="arrow"
                className={`w-2 h-2 transform transition-transform ${
                  pagesOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            <div
              className={`absolute top-full mt-3 left-0 w-40 bg-white border rounded-lg shadow-lg z-20 transform transition-all duration-200 ease-in-out origin-top ${
                pagesOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <Link
                href="/about"
                className={`block px-4 py-2 ${
                  pathname === "/about"
                    ? "bg-gray-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className={`block px-4 py-2 ${
                  pathname === "/contact"
                    ? "bg-gray-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                Contact
              </Link>
              <Link
                href="/all-vendors"
                className={`block px-4 py-2 ${
                  pathname === "/all-vendors"
                    ? "bg-gray-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                All Vendors
              </Link>
            </div>
          </div>

          {isLoggedIn && userData?.role === "vendor" ? (
            <Link
              href="/seller"
              className={`transition text-[18px] ${
                pathname.startsWith("/seller")
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Add Products
            </Link>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setVendorOpen(true)}
              onMouseLeave={() => setVendorOpen(false)}
            >
              <button className="hover:text-gray-900 transition flex items-center gap-1 text-[18px]">
                Vendor
                <Image
                  src={assets.arrow_icon}
                  alt="arrow"
                  className={`w-2 h-2 transform transition-transform ${
                    vendorOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              <div
                className={`absolute top-full mt-3 left-0 w-48 bg-white border rounded-lg shadow-lg z-20 transform transition-all duration-200 ease-in-out origin-top ${
                  vendorOpen
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
              >
                <Link
                  href="/vendor-signup"
                  className={`block px-4 py-2 ${
                    pathname === "/vendor/signup"
                      ? "bg-gray-100 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Become a Vendor
                </Link>
                <Link
                  href="/vendor-signin"
                  className={`block px-4 py-2 ${
                    pathname === "/vendor-signin"
                      ? "bg-gray-100 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Vendor Login
                </Link>
              </div>
            </div>
          )}
          <div
            className="relative"
            onMouseEnter={() => setDeliveryOpen(true)}
            onMouseLeave={() => setDeliveryOpen(false)}
          >
            <button className="hover:text-gray-900 transition flex items-center gap-1 text-[18px]">
              Delivery Man
              <Image
                src={assets.arrow_icon}
                alt="arrow"
                className={`w-2 h-2 transform transition-transform ${
                  deliveryOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            <div
              className={`absolute top-full mt-3 left-0 w-56 bg-white border rounded-lg shadow-lg z-20 transform transition-all duration-200 ease-in-out origin-top ${
                deliveryOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <Link
                href="/delivery-signup"
                className={`block px-4 py-2 ${
                  pathname === "/delivery-signup"
                    ? "bg-gray-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                Become a Delivery Man
              </Link>
              <Link
                href="/delivery-signin"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        <ul className="hidden md:flex items-center gap-6 relative">
          <Image
            className="w-5 cursor-pointer"
            src={assets.search_icon}
            alt="search icon"
            onClick={handleSearchIconClick}
          />
          <Link href="/wishlist" className="flex relative">
            <Image className="w-6" src={assets.heart_icon} alt="" />
            <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
              <p>{getWishlistCount()}</p>
            </div>
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <Link href="/cart" className="flex relative">
              <Image className="w-6" src={assets.cart_icon} alt="" />
              <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
                <p>{getCartCount()}</p>
              </div>
            </Link>
            <div
              className={`absolute top-full mt-4 right-0 w-72 bg-white border rounded-lg shadow-lg z-20 transform transition-all duration-200 ease-in-out origin-top-right ${
                isCartOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              {getCartCount() > 0 ? (
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Your Cart</h3>
                  {Object.keys(cartItems).map((itemId) => {
                    const product = products.find((p) => p._id === itemId);
                    if (!product) return null;
                    return (
                      <div
                        key={itemId}
                        className="flex items-center gap-3 py-2 border-b last:border-b-0"
                      >
                        <Image
                          src={product.images?.[0]?.url || ""}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {cartItems[itemId]} x ₦{product.price}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <Link href="/cart">
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                      View Cart
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Your cart is empty.
                </div>
              )}
            </div>
          </div>
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <p className="text-2xl  text-gray-600">
                ₦{walletBalance?.balance?.toFixed(2)}
              </p>
            </div>
          )}
          <div
            className="relative"
            onMouseEnter={() => setAccountOpen(true)}
            onMouseLeave={() => setAccountOpen(false)}
          >
            <Image
              src={assets.user_icon}
              alt="user"
              className="w-6 h-6  md:w-10 md:h-10 cursor-pointer md:mt-[-5px] md:ml-[-10px] "
            />
            <div
              className={`absolute top-full mt-3 right-0 w-48 bg-white border rounded-lg shadow-lg z-20 transform transition-all duration-200 ease-in-out origin-top-right ${
                accountOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`block px-4 py-2 ${
                      pathname === "/dashboard"
                        ? "bg-gray-100 text-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/my-orders"
                    className={`block px-4 py-2 ${
                      pathname === "/my-orders"
                        ? "bg-gray-100 text-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setAccountOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </ul>
        <div className="flex items-center md:hidden gap-4">
          <Image
            className="w-5 cursor-pointer"
            src={assets.search_icon}
            alt="search icon"
            onClick={handleSearchIconClick}
          />
          <Link href="/wishlist" className="flex relative">
            <Image className="w-6" src={assets.heart_icon} alt="" />
            <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
              <p>{getWishlistCount()}</p>
            </div>
          </Link>
          <Link href="/cart" className="flex relative">
            <Image className="w-6" src={assets.cart_icon} alt="" />
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <div
              className="relative w-11/12 md:w-1/2 lg:w-1/3"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-modal-input"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className={`absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto ${
                  searchQuery.trim() !== "" ? "block" : "hidden"
                }`}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                    >
                      <Image
                        src={product.images?.[0]?.url || ""}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          ₦{product.offerPrice}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    No products found
                  </div>
                )}
              </div>
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
                  href="/all-vendors"
                  className="hover:text-gray-400 transition"
                  onClick={handleCloseMenu}
                >
                  Vendors
                </Link>
                <Link
                  href="/categories"
                  className="hover:text-gray-400 transition"
                  onClick={handleCloseMenu}
                >
                  Categories
                </Link>
                <Link
                  href="/about"
                  className="hover:text-gray-400 transition"
                  onClick={handleCloseMenu}
                >
                  About Us
                </Link>{" "}
                <Link
                  href="/contact"
                  className="hover:text-gray-400 transition"
                  onClick={handleCloseMenu}
                >
                  Contact
                </Link>
                <Link
                  href="/seller/signup"
                  className="hover:text-gray-400 transition"
                  onClick={handleCloseMenu}
                >
                  Become a Vendor
                </Link>
                <Link
                  href="/seller/login"
                  className="hover:text-gray-400 transition"
                  onClick={handleCloseMenu}
                >
                  Vendor Login
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
      </div>
    </nav>
  );
};

export default Navbar;
