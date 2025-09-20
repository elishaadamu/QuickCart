'use client';
import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import Logo from '@/assets/logo/logo.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { router, getCartCount, getWishlistCount, isLoggedIn, authLoading } =
    useAppContext();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/vendor-signin');
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setAnimate(true);
      });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleCloseMenu = () => {
    setAnimate(false);
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  };

  if (authLoading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b">
        <Image
          onClick={() => router.push('/')}
          className="w-28 md:w-56 cursor-pointer"
          src={Logo}
          alt=""
        />
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link
            href="/"
            className={`transition text-xl ${
              pathname === '/'
                ? 'text-blue-600 font-medium'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`transition text-xl ${
              pathname === '/dashboard'
                ? 'text-blue-600 font-medium'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/all-products"
            className={`transition text-xl ${
              pathname === '/all-products'
                ? 'text-blue-600 font-medium'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Shop
          </Link>
          <Link href="/cart" className="flex relative">
            <Image className="w-6" src={assets.cart_icon} alt="" />
            <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
              <p>{getCartCount()}</p>
            </div>
          </Link>
          <Link href="/wishlist" className="flex relative">
            <Image className="w-6" src={assets.heart_icon} alt="" />
            <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
              <p>{getWishlistCount()}</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="flex relative">
            <Image className="w-6" src={assets.cart_icon} alt="" />
            <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
              <p>{getCartCount()}</p>
            </div>
          </Link>
          <Link href="/wishlist" className="flex relative">
            <Image className="w-6" src={assets.heart_icon} alt="" />
            <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white h-4 w-4 flex justify-center items-center rounded-full">
              <p>{getWishlistCount()}</p>
            </div>
          </Link>
          <Image
            src={assets.menu_icon}
            alt="menu"
            className="w-6 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              animate ? 'bg-opacity-50' : 'bg-opacity-0'
            }`}
            onClick={handleCloseMenu}
          ></div>

          {/* Menu panel */}
          <div
            className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white p-6 transform transition-transform duration-300 ease-in-out ${
              animate ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex justify-end">
              <button onClick={handleCloseMenu}>
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
            <div className="flex flex-col items-start gap-6 text-lg mt-8">
              <Link
                href="/"
                className={`transition text-xl ${
                  pathname === '/'
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={handleCloseMenu}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`transition text-xl ${
                  pathname === '/dashboard'
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={handleCloseMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/all-products"
                className={`transition text-xl ${
                  pathname === '/all-products'
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={handleCloseMenu}
              >
                Shop
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
