"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  FaShoppingCart,
  FaUniversity as FaBank,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { startOfWeek, startOfMonth, format, subMonths } from "date-fns";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale
);

const DashboardHome = () => {
  const { userData: contextUserData, authLoading } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    userName: "",
    totalOrders: 0,
    orders: [],
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
  const [timePeriod, setTimePeriod] = useState("monthly"); // 'monthly' or 'weekly'

  const orderStatusCounts = useMemo(() => {
    return dashboardData.orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      }
    );
  }, [dashboardData.orders]);

  const chartData = useMemo(() => {
    const hasOrders = dashboardData.orders.length > 0;
    const data = hasOrders
      ? [
          orderStatusCounts.pending + orderStatusCounts.confirmed,
          orderStatusCounts.processing + orderStatusCounts.shipped,
          orderStatusCounts.delivered,
          orderStatusCounts.cancelled,
        ]
      : [5, 2, 8, 1]; // Demo data

    return {
      labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
      datasets: [
        {
          label: "Order Status",
          data: data,
          backgroundColor: ["#FBBF24", "#3B82F6", "#10B981", "#EF4444"],
          borderColor: ["#F59E0B", "#2563EB", "#059669", "#DC2626"],
          borderWidth: 1,
        },
      ],
    };
  }, [orderStatusCounts, dashboardData.orders]);

  const lineChartData = useMemo(() => {
    const hasOrders = dashboardData.orders.length > 0;
    const now = new Date();
    let labels = [];
    let dataPoints = [];

    if (timePeriod === "monthly") {
      labels = Array.from({ length: 12 }, (_, i) =>
        format(subMonths(now, 11 - i), "MMM yyyy")
      );
      if (hasOrders) {
        const monthlyData = new Map(labels.map((label) => [label, 0]));
        dashboardData.orders.forEach((order) => {
          const orderMonth = format(new Date(order.createdAt), "MMM yyyy");
          if (monthlyData.has(orderMonth)) {
            monthlyData.set(orderMonth, monthlyData.get(orderMonth) + 1);
          }
        });
        dataPoints = Array.from(monthlyData.values());
      } else {
        // Demo data for monthly view
        dataPoints = [2, 5, 3, 6, 4, 8, 5, 9, 6, 10, 7, 12];
      }
    } else {
      // Weekly
      labels = Array.from({ length: 12 }, (_, i) =>
        startOfWeek(subMonths(now, (11 - i) / 4))
      ).map((date) => `W/C ${format(date, "MMM d")}`);
      if (hasOrders) {
        const weeklyData = new Map(labels.map((label) => [label, 0]));
        dashboardData.orders.forEach((order) => {
          const weekLabel = `W/C ${format(
            startOfWeek(new Date(order.createdAt)),
            "MMM d"
          )}`;
          if (weeklyData.has(weekLabel)) {
            weeklyData.set(weekLabel, weeklyData.get(weekLabel) + 1);
          }
        });
        dataPoints = Array.from(weeklyData.values());
      } else {
        // Demo data for weekly view
        dataPoints = [1, 2, 1, 3, 2, 4, 2, 5, 3, 5, 4, 6];
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Number of Orders",
          data: dataPoints,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.3,
        },
      ],
    };
  }, [dashboardData.orders, timePeriod]);

  const fetchAccountDetails = async () => {
    setLoading(true);
    try {
      const encryptedUser = localStorage.getItem("user");
      if (encryptedUser) {
        const decryptedUserData = decryptData(encryptedUser);
        const response = await axios.get(
          apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.GET + decryptedUserData.id)
        );
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
  }, []);

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

          const [ordersResponse, productsResponse] = await Promise.all([
            axios.get(
              apiUrl(
                API_CONFIG.ENDPOINTS.ORDER.GET_CUSTOMER_ORDERS +
                  "/" +
                  decryptedUserData.id
              )
            ),
            // For customers, we don't need to fetch products.
            // If you need other customer-specific data, add the call here.
            Promise.resolve({ data: [] }), // Resolves immediately
          ]);

          if (ordersResponse.data.orders) {
            const orders = ordersResponse.data.orders;
            setDashboardData((prev) => ({
              ...prev,
              orders: orders,
              recentOrders: orders.slice(0, 5),
            }));
          }

          if (productsResponse.data) {
            setDashboardData((prev) => ({
              ...prev,
              totalProducts: productsResponse.data.length,
            }));
          }

          await fetchAccountDetails();
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      amount: amount * 100,
      ref: new Date().getTime().toString(),
      metadata: {
        userId: userData?.id,
      },
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
      toast.success("Wallet funded successfully!");
      setAmount("");
      setShowFundModal(false);

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
      await fetchAccountDetails();
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-0 px-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Welcome Section - Compact */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {dashboardData.userName}!
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link
                href="/"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
              >
                <FaShoppingCart className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Shop Now
                </span>
              </Link>
              <Link
                href="/dashboard/track-order"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
              >
                <FaTruck className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Track Order
                </span>
              </Link>
              <Link
                href="/dashboard/request-delivery"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
              >
                <FaBoxOpen className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Delivery
                </span>
              </Link>
              <Link
                href="/dashboard/inbox"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
              >
                <FaCommentDots className="w-6 h-6 text-yellow-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Chat</span>
              </Link>
              <Link
                href="/dashboard/personal-details"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
              >
                <FaUser className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Me</span>
              </Link>
            </div>
          </div>

          {/* Wallet & Account Section - Compact */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full opacity-20 -mr-20 -mt-20"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="mb-3 sm:mb-0">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <FaWallet className="w-5 h-5" />
                      Your Wallet
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Manage your funds and account details
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFundModal(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                  >
                    Fund Wallet
                  </button>
                </div>

                {/* Balance Section */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs">Current Balance</p>
                      <h1 className="text-2xl font-bold mt-1">
                        ₦{walletBalance?.balance?.toFixed(2) || "0.00"}
                      </h1>
                    </div>
                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <button className="bg-white/20 text-white px-3 py-1.5 rounded text-xs hover:bg-white/30 transition">
                        Transaction History
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Details Section */}
                {accountDetails ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <FaCreditCard className="w-4 h-4" />
                      Virtual Account Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded">
                          <FaUserCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-100 text-xs">Account Name</p>
                          <p className="text-white font-medium text-sm">
                            {accountDetails.accountName || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded">
                          <FaCreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-100 text-xs">
                            Account Number
                          </p>
                          <p className="text-white font-medium text-sm">
                            {accountDetails.accountNumber || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded">
                          <FaBank className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-100 text-xs">Bank Name</p>
                          <p className="text-white font-medium text-sm">
                            {accountDetails.bankName || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <FaCreditCard className="w-8 h-8 text-white/60 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1 text-sm">
                      No Virtual Account
                    </h3>
                    <p className="text-blue-100 text-xs mb-3">
                      Create a virtual account to receive payments
                    </p>
                    <button
                      onClick={() => setShowCreateAccount(true)}
                      className="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition inline-flex items-center gap-1"
                    >
                      <FaPlus className="w-3 h-3" />
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Overview */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Orders Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stats */}
              <div className="md:col-span-1 bg-white p-4 rounded-lg shadow space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.orders.length}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {orderStatusCounts.pending + orderStatusCounts.confirmed}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-green-600">
                    Delivered
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {orderStatusCounts.delivered}
                  </p>
                </div>
              </div>
              {/* Chart */}
              <div className="md:col-span-2 bg-white p-4 rounded-lg shadow flex justify-center items-center">
                <div className="w-full h-56">
                  <Pie
                    data={chartData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Trend Chart */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold text-gray-800">
                Order Trend
              </h2>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="block px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="h-64">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Refer and Earn - Compact */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Refer & Earn
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Invite friends and earn rewards!
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <svg
                  className="w-4 h-4 text-green-600"
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
            <div className="mt-3">
              <Link
                href="/dashboard/referrals"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Get referral link →
              </Link>
            </div>
          </div>

          {/* Recent Orders - Compact */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-medium text-gray-900 mb-3 text-sm">
              Recent Orders
            </h2>
            {dashboardData.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs text-left">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-4 font-semibold rounded-full 
                            ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                          ₦{order.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-3 text-sm">
                No recent orders found
              </p>
            )}
            <div className="mt-3">
              <Link
                href="/dashboard/orders"
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                View all orders →
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Fund Wallet Modal - Compact */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-sm">
            <h3 className="font-semibold mb-3">Fund Your Wallet</h3>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-sm">Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border p-2 rounded text-sm"
                  placeholder="Enter amount"
                  min="100"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePayment}
                  disabled={!amount || loading || !userData?.email}
                  className="bg-blue-600 text-white p-2 rounded flex-1 text-sm hover:bg-blue-700 transition disabled:bg-blue-300"
                >
                  {loading ? "Processing..." : "Pay with Paystack"}
                </button>
                <button
                  onClick={() => setShowFundModal(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded flex-1 text-sm hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Bottom Navigation for Mobile - Compact */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around items-center h-14">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 text-xs"
          >
            <FaHome className="w-5 h-5 mb-1" />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard/inbox"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 text-xs"
          >
            <FaCommentDots className="w-5 h-5 mb-1" />
            <span>Chat</span>
          </Link>
          <Link
            href="/dashboard/request-delivery"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 text-xs"
          >
            <FaTruck className="w-5 h-5 mb-1" />
            <span>Delivery</span>
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 text-xs"
          >
            <FaBoxOpen className="w-5 h-5 mb-1" />
            <span>Orders</span>
          </Link>
          <Link
            href="/dashboard/personal-details"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 text-xs"
          >
            <FaUser className="w-5 h-5 mb-1" />
            <span>Me</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
