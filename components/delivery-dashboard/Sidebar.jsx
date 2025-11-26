"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/assets/logo/logo.png";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
  openSettings,
  setOpenSettings,
}) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[2000] w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link href={"/"}>
            <Image className="w-50 mx-auto" src={Logo} alt="logo" />
          </Link>
          <button
            className="p-2 rounded-md hover:bg-gray-700 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
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

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            <Link
              href="/delivery-dashboard"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors ${
                pathname === "/delivery-dashboard" ? "bg-gray-700" : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/delivery-dashboard/withdraw"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors ${
                pathname.startsWith("/delivery-dashboard/withdraw") &&
                !pathname.startsWith("/delivery-dashboard/withdrawal-history")
                  ? "bg-gray-700"
                  : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5l-3-3-3 3"
                />
              </svg>
              <span>Withdraw</span>
            </Link>

            <Link
              href="/delivery-dashboard/withdrawal-history"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors ${
                pathname === "/delivery-dashboard/withdrawal-history"
                  ? "bg-gray-700"
                  : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Withdrawal History</span>
            </Link>

            <Link
              href="/delivery-dashboard/commission"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors ${
                pathname === "/delivery-dashboard/commission"
                  ? "bg-gray-700"
                  : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Commission</span>
            </Link>

            <Link
              href="/delivery-dashboard/delivery"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors ${
                pathname === "/delivery-dashboard/delivery" ? "bg-gray-700" : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Delivery Tasks</span>
            </Link>

            <Link
              href="/delivery-dashboard/state-dropping"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors ${
                pathname === "/delivery-dashboard/state-dropping"
                  ? "bg-gray-700"
                  : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>State Dropping</span>
            </Link>

            <Link
              href="/delivery-dashboard/settlement-accounts"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors ${
                pathname === "/delivery-dashboard/settlement-accounts"
                  ? "bg-gray-700"
                  : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span>Settlement Account</span>
            </Link>

            <div className="space-y-1">
              <button
                onClick={() => setOpenSettings(!openSettings)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Settings</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSettings ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className={`space-y-1 ${openSettings ? "block" : "hidden"}`}>
                <Link
                  href="/delivery-dashboard/personal-details"
                  className={`block pl-11 pr-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ${
                    pathname === "/delivery-dashboard/personal-details"
                      ? "bg-gray-700"
                      : ""
                  }`}
                >
                  Personal Details
                </Link>
                <Link
                  href="/delivery-dashboard/update-images"
                  className={`block pl-11 pr-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ${
                    pathname === "/delivery-dashboard/update-images"
                      ? "bg-gray-700"
                      : ""
                  }`}
                >
                  Update Image
                </Link>
                <Link
                  href="/delivery-dashboard/pin-management"
                  className={`block pl-11 pr-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ${
                    pathname === "/delivery-dashboard/pin-management"
                      ? "bg-gray-700"
                      : ""
                  }`}
                >
                  PIN Management
                </Link>
                <Link
                  href="/delivery-dashboard/change-password"
                  className={`block pl-11 pr-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ${
                    pathname === "/delivery-dashboard/change-password"
                      ? "bg-gray-700"
                      : ""
                  }`}
                >
                  Change Password
                </Link>
                <div className="border-t border-gray-700 my-1"></div>
                <Link
                  href="/delivery-dashboard/delete-account"
                  className={`block pl-11 pr-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-red-500`}
                >
                  Delete Account
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
