"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { decryptData } from "../../lib/encryption";
import Logo from "@/assets/logo/logo.png";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/vendor-dashboard/Sidebar";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [openOrders, setOpenOrders] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasWallet, setHasWallet] = useState(true);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/signin");
    } else {
      const decryptedData = decryptData(user);
      setUserData(decryptedData);
    }
  }, [router]);

  useEffect(() => {
    if (userData) {
      const fetchAccountDetails = async () => {
        try {
          await axios.get(
            apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.GET + userData.id)
          );
          setHasWallet(true);
          setShowCreateAccount(false);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setHasWallet(false);
            setShowCreateAccount(true);
          }
        }
      };
      fetchAccountDetails();
    }
  }, [userData]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.CREATE), {
        userId: userData.id,
        nin,
      });
      toast.success("Virtual account created successfully!");
      setShowCreateAccount(false);
      setHasWallet(true);
      setNin("");
    } catch (error) {
      console.error("Failed to create virtual account:", error);
      toast.error(
        error.response?.data?.message || "Failed to create virtual account."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      {/* Create Virtual Account Modal - Compact */}
      {showCreateAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-sm">
            <h3 className="font-semibold mb-3">Create Virtual Account</h3>
            <p className="mb-3 text-gray-600 text-sm">
              Create a virtual account to easily fund your wallet and receive
              payments.
            </p>
            <form onSubmit={handleCreateAccount}>
              <div className="flex flex-col gap-1 mb-3">
                <label className="text-gray-600 text-sm">NIN</label>
                <input
                  onChange={(e) => setNin(e.target.value)}
                  value={nin}
                  className="border p-2 rounded text-sm"
                  type="text"
                  placeholder="Enter your NIN"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-800 text-white p-2 rounded flex-1 text-sm hover:bg-gray-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded flex-1 text-sm hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        openOrders={openOrders}
        setOpenOrders={setOpenOrders}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        openDelivery={openDelivery}
        setOpenDelivery={setOpenDelivery}
        openProducts={openProducts}
        setOpenProducts={setOpenProducts}
      />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white md:hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link href={"/"}>
              <Image className="w-[12rem] mx-auto" src={Logo} alt="logo" />
            </Link>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
