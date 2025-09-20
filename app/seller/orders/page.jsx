"use client";
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { API_CONFIG, apiUrl } from "@/configs/api";

import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {
  const { currency } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchSellerOrders = async () => {
    try {
      const response = await fetch(
        apiUrl(API_CONFIG.ENDPOINTS.ORDER.GET_SELLER_ORDERS),
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const response = await fetch(
        apiUrl(API_CONFIG.ENDPOINTS.ORDER.UPDATE_STATUS),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, status: newStatus }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh orders after status update
      await fetchSellerOrders();
    } catch (err) {
      setError(
        err.message || "Failed to update order status. Please try again."
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="md:p-10 p-4">
          <div className="p-4 text-sm text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        </div>
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
              >
                <div className="flex-1 flex gap-5 max-w-80">
                  <Image
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                  />
                  <p className="flex flex-col gap-3">
                    <span className="font-medium">
                      {order.items
                        .map(
                          (item) => item.product.name + ` x ${item.quantity}`
                        )
                        .join(", ")}
                    </span>
                    <span>Items : {order.items.length}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">
                      {order.address.fullName}
                    </span>
                    <br />
                    <span>{order.address.area}</span>
                    <br />
                    <span>{`${order.address.city}, ${order.address.state}`}</span>
                    <br />
                    <span>{order.address.phoneNumber}</span>
                  </p>
                </div>
                <p className="font-medium my-auto">
                  {currency}
                  {order.amount}
                </p>
                <div>
                  <p className="flex flex-col gap-2">
                    <span>Method : {order.paymentMethod || "COD"}</span>
                    <span>
                      Date : {new Date(order.date).toLocaleDateString()}
                    </span>
                    <span>Payment : {order.paymentStatus}</span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      disabled={updatingStatus === order._id}
                      className="mt-2 px-2 py-1 text-sm border rounded-md outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingStatus === order._id && (
                      <span className="text-xs text-blue-500">Updating...</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No orders found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
