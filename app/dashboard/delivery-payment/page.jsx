"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { decryptData } from "@/lib/encryption";
import { toast } from "react-toastify";
import { apiUrl, API_CONFIG } from "@/configs/api";

const DeliveryPaymentPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paying, setPaying] = useState(false);

  const getUserId = () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return null;
      const data = decryptData(user);
      return data?.id || null;
    } catch (err) {
      return null;
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    setFetchError(null);
    const userId = getUserId();
    if (!userId) {
      setFetchError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        apiUrl(API_CONFIG.ENDPOINTS.DELIVERY.GET_USER_REQUESTS + userId)
      );
      setRequests(res.data || []);
    } catch (error) {
      console.error("Failed to fetch delivery requests", error);
      setFetchError(
        error?.response?.data?.message || error.message || "Failed to fetch"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPayModal = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => setSelectedRequest(null);

  const handlePay = async () => {
    if (!selectedRequest) return;
    const userId = getUserId();
    if (!userId) {
      toast.error("You must be signed in to pay.");
      return;
    }

    if (!selectedRequest.price) {
      toast.error("This request has no price set yet.");
      return;
    }

    setPaying(true);
    try {
      const payload = { price: selectedRequest.price, userId };
      await axios.put(
        apiUrl(API_CONFIG.ENDPOINTS.DELIVERY.PAY_DELIVERY + selectedRequest.id),
        payload
      );
      toast.success("Payment successful");
      closeModal();
      fetchRequests();
    } catch (error) {
      console.error("Payment failed", error);
      toast.error(error?.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Delivery Requests / Payments
      </h1>

      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : fetchError ? (
        <div className="p-4 text-red-600">{fetchError}</div>
      ) : requests.length === 0 ? (
        <div className="p-4">No delivery requests found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Request ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Pickup
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Delivery Address
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.pickup_location || r.pickup || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.delivery_address || r.dropoff || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.price ? `₦${r.price}` : "Not set"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.status || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => openPayModal(r)}
                      disabled={!r.price}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        r.price
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Confirm Payment</h2>
            <p className="mb-2">
              Request ID:{" "}
              <span className="font-medium">{selectedRequest.id}</span>
            </p>
            <p className="mb-4">
              Amount:{" "}
              <span className="font-medium">₦{selectedRequest.price}</span>
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={paying}
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                disabled={paying}
              >
                {paying ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPaymentPage;
