"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { decryptData } from "@/lib/encryption";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { useAppContext } from "@/context/AppContext";
import {
  FaHome,
  FaCommentDots,
  FaTruck,
  FaBoxOpen,
  FaUser,
  FaPlus,
  FaWallet,
  FaCreditCard,
  FaUniversity as FaBank,
  FaUserCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardHome = () => {
  const { userData: contextUserData, authLoading } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    userName: "",
    totalOrders: 0,
    pendingOrders: 0,
    recentOrders: [],
    totalProducts: 0,
  });
  const [walletBalance, setWalletBalance] = useState({ balance: 0 });
  const [userData, setUserData] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [showFundModal, setShowFundModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [nin, setNin] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const fetchAccountDetails = async () => {
    setLoading(true);
    try {
      const encryptedUser = localStorage.getItem("user");
      if (encryptedUser) {
        const decryptedUserData = decryptData(encryptedUser);
        const response = await axios.get(
          apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.GET + decryptedUserData.id)
        );
        console.log("Account Details", response.data);
        setAccountDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      toast.error("Failed to fetch account details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, []); // Fixed: Added dependency array

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const encryptedUser = localStorage.getItem("user");
        if (encryptedUser) {
          const decryptedUserData = decryptData(encryptedUser);
          setUserData(decryptedUserData);
          setDashboardData((prev) => ({
            ...prev,
            userName: decryptedUserData.firstName,
          }));

          // Fetch seller-specific data
          const [ordersResponse, productsResponse] = await Promise.all([
            axios.get(
              apiUrl(
                API_CONFIG.ENDPOINTS.ORDER.GET_SELLER_ORDERS +
                  "/" +
                  decryptedUserData.id
              )
            ),
            axios.get(
              apiUrl(
                API_CONFIG.ENDPOINTS.PRODUCT.GET_SELLER_PRODUCTS +
                  decryptedUserData.id
              )
            ),
          ]);

          if (ordersResponse.data.orders) {
            const orders = ordersResponse.data.orders;
            setDashboardData((prev) => ({
              ...prev,
              totalOrders: orders.length,
              pendingOrders: orders.filter(
                (order) => order.status === "pending"
              ).length,
              recentOrders: orders.slice(0, 5), // Get last 5 orders
            }));
          }

          if (productsResponse.data) {
            setDashboardData((prev) => ({
              ...prev,
              totalProducts: productsResponse.data.length,
            }));
          }

          // Fetch account details
          await fetchAccountDetails();
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const encryptedUser = localStorage.getItem("user");
        if (encryptedUser) {
          const decryptedUserData = decryptData(encryptedUser);
          const walletResponse = await axios.get(
            apiUrl(
              API_CONFIG.ENDPOINTS.ACCOUNT.walletBalance +
                decryptedUserData.id +
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

  const handlePayment = async () => {
    if (!amount || amount < 100) {
      toast.error("Please enter an amount of at least ₦100");
      return;
    }

    const PaystackPop = (await import("@paystack/inline-js")).default;
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: userData?.email,
      amount: amount * 100, // Convert to kobo
      ref: new Date().getTime().toString(),
      onSuccess: (transaction) => {
        onSuccess(transaction);
      },
      onCancel: () => {
        onClose();
      },
    });
  };

  const onSuccess = async (transaction) => {
    setLoading(true);
    try {
      await axios.post(
        apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.FUND + userData.id),
        {
          amount: amount,
          reference: transaction.reference,
        }
      );

      toast.success("Wallet funded successfully!");
      setAmount("");
      setShowFundModal(false);

      // Refresh wallet balance
      const walletResponse = await axios.get(
        apiUrl(
          API_CONFIG.ENDPOINTS.ACCOUNT.walletBalance + userData.id + "/balance"
        )
      );
      setWalletBalance(walletResponse.data.data);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    toast.info("Payment cancelled");
    setShowFundModal(false);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { nin };

    try {
      await axios.post(
        apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.CREATE + userData.id),
        payload
      );
      toast.success("Account created successfully!");
      setShowCreateAccount(false);

      // Refresh account details
      await fetchAccountDetails();
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 md:pb-0">
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {dashboardData.userName}!
            </h1>
            <p className="mt-2 text-gray-600">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Wallet & Account Section - Full Width */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full opacity-20 -ml-24 -mb-24"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaWallet className="w-6 h-6" />
                      Your Wallet
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Manage your funds and account details
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFundModal(true)}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition mt-4 md:mt-0"
                  >
                    Fund Wallet
                  </button>
                </div>

                {/* Balance Section */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Current Balance</p>
                      <h1 className="text-4xl font-bold mt-1">
                        ₦{walletBalance?.balance?.toFixed(2) || "0.00"}
                      </h1>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                      <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition">
                        Withdraw
                      </button>
                      <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition">
                        Transaction History
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Details Section */}
                {accountDetails ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaCreditCard className="w-5 h-5" />
                      Virtual Account Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <FaUserCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-100 text-sm">Account Name</p>
                          <p className="text-white font-semibold">
                            {accountDetails.accountName || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <FaCreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-100 text-sm">
                            Account Number
                          </p>
                          <p className="text-white font-semibold">
                            {accountDetails.accountNumber || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <FaBank className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-100 text-sm">Bank Name</p>
                          <p className="text-white font-semibold">
                            {accountDetails.bankName || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <FaCreditCard className="w-12 h-12 text-white/60 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Virtual Account
                    </h3>
                    <p className="text-blue-100 mb-4">
                      Create a virtual account to easily receive payments and
                      fund your wallet
                    </p>
                    <button
                      onClick={() => setShowCreateAccount(true)}
                      className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition inline-flex items-center gap-2"
                    >
                      <FaPlus className="w-4 h-4" />
                      Create Virtual Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Products Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.totalProducts}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/vendor-dashboard/products-list"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View all products →
                </Link>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.totalOrders}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/vendor-dashboard/orders"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View all orders →
                </Link>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.pendingOrders}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/vendor-dashboard/orders"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View pending orders →
                </Link>
              </div>
            </div>
          </div>

          {/* Refer and Earn */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Refer & Earn
                </p>
                <p className="text-lg text-gray-500 mt-1">
                  Invite friends and earn rewards!
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/vendor-dashboard/referrals"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Get referral link →
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Orders
            </h2>
            {dashboardData.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₦{order.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent orders found
              </p>
            )}
            <div className="mt-4">
              <Link
                href="/vendor-dashboard/orders"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View all orders →
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Fund Your Wallet</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-600">Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border p-2 rounded-md"
                  placeholder="Enter amount"
                  min="100"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePayment}
                  disabled={!amount || loading || !userData?.email}
                  className="bg-blue-600 text-white p-3 rounded-md flex-1 hover:bg-blue-700 transition disabled:bg-blue-300"
                >
                  {loading ? "Processing..." : "Pay with Paystack"}
                </button>
                <button
                  onClick={() => setShowFundModal(false)}
                  className="bg-gray-300 text-gray-700 p-3 rounded-md flex-1 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Virtual Account Modal */}
      {showCreateAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Create Virtual Account
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Create a virtual account to easily fund your wallet and receive
              payments.
            </p>
            <form onSubmit={handleCreateAccount}>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-gray-600">
                  NIN (National Identification Number)
                </label>
                <input
                  onChange={(e) => setNin(e.target.value)}
                  value={nin}
                  className="border p-2 rounded-md"
                  type="text"
                  placeholder="Enter your NIN"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-800 text-white p-2 rounded-md flex items-center justify-center flex-1 hover:bg-gray-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-md flex-1 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/vendor-dashboard"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600"
          >
            <FaHome className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="/vendor-dashboard/inbox"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600"
          >
            <FaCommentDots className="w-6 h-6 mb-1" />
            <span className="text-xs">Chat</span>
          </Link>
          <Link
            href="/vendor-dashboard/add-products"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600"
          >
            <FaTruck className="w-6 h-6 mb-1" />
            <span className="text-xs">Add Product</span>
          </Link>
          <Link
            href="/vendor-dashboard/orders"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600"
          >
            <FaBoxOpen className="w-6 h-6 mb-1" />
            <span className="text-xs">Orders</span>
          </Link>
          <Link
            href="/vendor-dashboard/settings"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600"
          >
            <FaUser className="w-6 h-6 mb-1" />
            <span className="text-xs">Me</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
