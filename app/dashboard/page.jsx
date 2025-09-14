"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { decryptData } from "@/lib/encryption";
import { apiUrl, API_CONFIG } from "@/configs/api";

const DashboardHome = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    userName: "",
    totalOrders: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [walletBalance, setWalletBalance] = useState(2);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const encryptedUser = localStorage.getItem("user");
        if (encryptedUser) {
          const userData = decryptData(encryptedUser);
          setDashboardData((prev) => ({
            ...prev,
            userName: userData.firstName,
          }));

          // Fetch orders count
          const ordersResponse = await axios.get(
            apiUrl(API_CONFIG.ENDPOINTS.ORDER.GET_ALL)
          );

          if (ordersResponse.data) {
            const orders = ordersResponse.data;
            setDashboardData((prev) => ({
              ...prev,
              totalOrders: orders.length,
              pendingOrders: orders.filter(
                (order) => order.status === "pending"
              ).length,
              recentOrders: orders.slice(0, 5), // Get last 5 orders
            }));
          }
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
          const userData = decryptData(encryptedUser);
          const walletResponse = await axios.get(
            apiUrl(
              API_CONFIG.ENDPOINTS.ACCOUNT.walletBalance +
                userData.id +
                "/balance"
            )
          );
          console.log(walletResponse.data.data);
          setWalletBalance(walletResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchWalletBalance();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Orders Stats */}
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
                  href="/dashboard/orders/all"
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
                  href="/dashboard/orders/pending"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View pending orders →
                </Link>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Wallet Balance
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{walletBalance.balance}
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
                  href="/dashboard/wallet"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View wallet →
                </Link>
              </div>
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
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
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
                          ₦{order.total.toLocaleString()}
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
                href="/dashboard/orders/all"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View all orders →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Link
              href="/dashboard/wallet"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Fund Wallet</h3>
              <p className="text-gray-600 mt-2">Add money to your wallet</p>
            </Link>
            <Link
              href="/dashboard/personal-details"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">
                Update Profile
              </h3>
              <p className="text-gray-600 mt-2">Manage your personal details</p>
            </Link>
            <Link
              href="/dashboard/support-ticket"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Get Support</h3>
              <p className="text-gray-600 mt-2">Create a support ticket</p>
            </Link>
            <Link
              href="/dashboard/refer-earn"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">
                Refer & Earn
              </h3>
              <p className="text-gray-600 mt-2">Invite friends and earn</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
