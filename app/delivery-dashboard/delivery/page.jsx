"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_CONFIG, apiUrl } from "@/configs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveryAssignmentsPage = () => {
  const { userData, authLoading } = useAppContext();
  const router = useRouter();
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Support two possible shapes: either userData is the user object or it has a `user` property
  const currentUser = userData?.user ?? userData;

  // Dropdown component for actions
  const DropdownMenu = ({ request, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          className="inline-flex justify-center rounded-2xl border border-gray-200 shadow-sm p-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-gray-100">
            <div className="py-1" role="none">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchDeliveryRequests = async () => {
      if (authLoading) return;

      if (!userData) {
        router.push("/delivery-signin");
        return;
      }

      try {
        const response = await axios.get(
          apiUrl(API_CONFIG.ENDPOINTS.DELIVERY.GET_DELIVERY + currentUser._id)
        );
        console.log("Fetched Delivery Requests:", response.data);
        setDeliveryRequests(response.data.requests || response.data);
      } catch (error) {
        toast.error("Failed to fetch delivery requests");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryRequests();
  }, [currentUser, userData, authLoading, router]);

  const handleAccept = async (requestId) => {
    try {
      await axios.put(
        apiUrl(
          API_CONFIG.ENDPOINTS.DELIVERY.ACCEPT_DELIVERY +
            currentUser?._id +
            "/" +
            requestId
        ),
        {}
      );

      setDeliveryRequests((prev) =>
        prev.map((request) =>
          request._id === requestId
            ? { ...request, deliveryManStatus: "accepted", status: "accepted" }
            : request
        )
      );

      toast.success("Delivery request accepted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(
        apiUrl(
          API_CONFIG.ENDPOINTS.DELIVERY.REJECT_DELIVERY +
            currentUser?._id +
            "/" +
            requestId
        ),
        {}
      );

      setDeliveryRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );

      toast.success("Delivery request rejected");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error:", error);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-100 text-amber-800 border border-amber-200",
        label: "Pending",
        icon: "⏳",
      },
      assigned: {
        color: "bg-blue-100 text-blue-800 border border-blue-200",
        label: "Assigned",
        icon: "📦",
      },
      accepted: {
        color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        label: "Accepted",
        icon: "✅",
      },
      rejected: {
        color: "bg-rose-100 text-rose-800 border border-rose-200",
        label: "Rejected",
        icon: "❌",
      },
      completed: {
        color: "bg-gray-100 text-gray-800 border border-gray-200",
        label: "Completed",
        icon: "🎉",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium ${config.color}`}
      >
        <span className="text-xs">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getRequestTypeBadge = (type) => {
    const typeConfig = {
      "inter-state": {
        color: "bg-violet-100 text-violet-800 border border-violet-200",
        label: "INTER-STATE",
        icon: "🛣️",
      },
      "intra-state": {
        color: "bg-indigo-100 text-indigo-800 border border-indigo-200",
        label: "INTRA-STATE",
        icon: "📍",
      },
    };

    const config = typeConfig[type] || typeConfig["intra-state"];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium ${config.color}`}
      >
        <span className="text-xs">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <ToastContainer />

      {/* Enhanced Header with Ellipse Background */}
      <div className="relative mb-8">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-green-100 rounded-full opacity-50 blur-xl"></div>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Delivery Assignments
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your delivery requests and assignments
          </p>

          {/* Stats Overview */}
          {deliveryRequests.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-blue-50 rounded-2xl px-4 py-3 border border-blue-100">
                <span className="text-blue-600 font-semibold">
                  {deliveryRequests.length} Total
                </span>
              </div>
              <div className="bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100">
                <span className="text-amber-600 font-semibold">
                  {
                    deliveryRequests.filter(
                      (req) =>
                        req.deliveryManStatus === "pending" ||
                        req.status === "assigned"
                    ).length
                  }{" "}
                  Pending
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Requests Table */}
      {deliveryRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No delivery requests
            </h3>
            <p className="text-gray-500 mb-6">
              You don't have any delivery requests at the moment.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-colors duration-200 shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Request Details
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Route
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50/80 transition-all duration-200 group"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {request.description || "Package Delivery"}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {request.receipientName}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700">
                            {request.senderState}
                          </span>
                          <svg
                            className="mx-3 h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                          <span className="font-semibold text-gray-700">
                            {request.receipientState}
                          </span>
                        </div>
                        <div className="mt-2">
                          {getRequestTypeBadge(request.requestType)}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">
                        ₦{(request.approvedPrice || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {getStatusBadge(
                        request.deliveryManStatus || request.status
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                      <DropdownMenu request={request}>
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          role="menuitem"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Details
                        </button>
                        {(request.deliveryManStatus === "pending" ||
                          request.status === "assigned") && (
                          <>
                            <button
                              onClick={() => handleAccept(request._id)}
                              className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 hover:text-emerald-900 transition-colors duration-150"
                              role="menuitem"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(request._id)}
                              className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-900 transition-colors duration-150"
                              role="menuitem"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Reject
                            </button>
                          </>
                        )}
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enhanced Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 animate-scaleIn">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Delivery Request Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-2xl"
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
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                {/* Package Information */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Package Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <span className="text-sm text-gray-600 block mb-1">
                        Description
                      </span>
                      <p className="font-medium text-gray-900">
                        {selectedRequest.description}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <span className="text-sm text-gray-600 block mb-1">
                        Delivery Type
                      </span>
                      <p>{getRequestTypeBadge(selectedRequest.requestType)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <span className="text-sm text-gray-600 block mb-1">
                        Duration
                      </span>
                      <p className="font-medium text-gray-900 capitalize">
                        {selectedRequest.deliveryDuration}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <span className="text-sm text-gray-600 block mb-1">
                        Price
                      </span>
                      <p className="font-bold text-green-600 text-lg">
                        ₦{(selectedRequest.approvedPrice || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sender Information */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Sender Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Name", value: selectedRequest.senderName },
                      { label: "Phone", value: selectedRequest.senderPhone },
                      {
                        label: "Address",
                        value: selectedRequest.senderAddress,
                      },
                      { label: "LGA", value: selectedRequest.senderLGA },
                      { label: "State", value: selectedRequest.senderState },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/80 rounded-xl p-3 border border-blue-100"
                      >
                        <span className="text-xs text-gray-600 block mb-1">
                          {item.label}
                        </span>
                        <p className="font-medium text-gray-900 text-sm">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recipient Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Recipient Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Name", value: selectedRequest.receipientName },
                      {
                        label: "Phone",
                        value: selectedRequest.receipientPhone,
                      },
                      {
                        label: "Alt Phone",
                        value: selectedRequest.receipientAltPhone,
                      },
                      {
                        label: "Address",
                        value: selectedRequest.receipientAddress,
                      },
                      { label: "LGA", value: selectedRequest.receipientLGA },
                      {
                        label: "State",
                        value: selectedRequest.receipientState,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/80 rounded-xl p-3 border border-emerald-100"
                      >
                        <span className="text-xs text-gray-600 block mb-1">
                          {item.label}
                        </span>
                        <p className="font-medium text-gray-900 text-sm">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Information */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Status Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
                      <span className="text-sm text-gray-600 block mb-2">
                        Current Status
                      </span>
                      {getStatusBadge(
                        selectedRequest.deliveryManStatus ||
                          selectedRequest.status
                      )}
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
                      <span className="text-sm text-gray-600 block mb-1">
                        Assigned At
                      </span>
                      <p className="font-medium text-gray-900 text-sm">
                        {new Date(selectedRequest.assignedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
                      <span className="text-sm text-gray-600 block mb-1">
                        Created At
                      </span>
                      <p className="font-medium text-gray-900 text-sm">
                        {new Date(selectedRequest.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
                      <span className="text-sm text-gray-600 block mb-1">
                        Payment Status
                      </span>
                      <p
                        className={`font-semibold text-sm ${
                          selectedRequest.isPaid
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {selectedRequest.isPaid ? "✅ Paid" : "❌ Unpaid"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-200 shadow-sm"
                >
                  Close
                </button>
                {(selectedRequest.deliveryManStatus === "pending" ||
                  selectedRequest.status === "assigned") && (
                  <>
                    <button
                      onClick={() => {
                        handleAccept(selectedRequest._id);
                        setShowModal(false);
                      }}
                      className="px-6 py-3 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl transition-all duration-200 shadow-sm flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Accept Delivery
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedRequest._id);
                        setShowModal(false);
                      }}
                      className="px-6 py-3 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-2xl transition-all duration-200 shadow-sm flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Reject Delivery
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAssignmentsPage;
