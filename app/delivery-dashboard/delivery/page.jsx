"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_CONFIG, apiUrl } from "@/configs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveryAssignmentsPage = () => {
  const { userData, authLoading } = useAppContext();
  const router = useRouter();
  const [deliveryTasks, setDeliveryTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryTasks = async () => {
      if (authLoading) return;

      if (!userData) {
        router.push("/signin");
        return;
      }

      try {
        // Fetch pending delivery tasks
        const response = await axios.get(
          apiUrl(API_CONFIG.ENDPOINTS.ORDER.GET_SELLER_ORDERS)
        );
        // Show tasks that are either 'pending' for acceptance or 'assigned' to the current rider
        const pendingTasks = response.data.filter((task) =>
          ["pending", "assigned"].includes(task.status)
        );
        setDeliveryTasks(pendingTasks);
      } catch (error) {
        toast.error("Failed to fetch delivery tasks");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryTasks();
  }, [userData, authLoading, router]);

  const handleTaskAction = async (taskId, action) => {
    try {
      await axios.put(apiUrl(API_CONFIG.ENDPOINTS.ORDER.UPDATE_STATUS), {
        orderId: taskId,
        status: action,
      });

      // Update the task in the list to reflect the new status
      setDeliveryTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: action } : task
        )
      );

      toast.success(`Task status updated to ${action}`);
    } catch (error) {
      toast.error(`Failed to ${action} delivery`);
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <ToastContainer />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Tasks</h1>
        <p className="mt-2 text-gray-600">
          Review and manage your assigned deliveries
        </p>
      </div>

      {/* Delivery Tasks List */}
      {deliveryTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">
            No pending delivery tasks available
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {deliveryTasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-sm p-6">
              {/* Task Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      #{task._id.slice(-6)}
                    </h2>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        task.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {task.pickupAddress.state === task.dropoffAddress.state
                      ? "INTRA-STATE"
                      : "INTER-STATE"}{" "}
                    Delivery
                  </p>
                  <p className="mt-2 text-lg font-bold text-green-600">
                    ₦{task.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  {task.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleTaskAction(task._id, "assigned")}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleTaskAction(task._id, "rejected")}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {task.status === "assigned" && (
                    <>
                      <button
                        onClick={() =>
                          handleTaskAction(task._id, "pending_completion")
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => handleTaskAction(task._id, "cancelled")}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel Task
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Locations */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pickup Location */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Pickup Location
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">
                        {task.pickupAddress.state}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">LGA:</span>
                      <span className="font-medium">
                        {task.pickupAddress.lga}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">
                        {task.pickupAddress.address}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Notable Location:</span>
                      <span className="font-medium">
                        {task.pickupAddress.notableLocation}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Drop-off Location
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">
                        {task.dropoffAddress.state}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">LGA:</span>
                      <span className="font-medium">
                        {task.dropoffAddress.lga}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">
                        {task.dropoffAddress.address}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Notable Location:</span>
                      <span className="font-medium">
                        {task.dropoffAddress.notableLocation}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Contact Details - Visible only when assigned */}
              {task.status === "assigned" && task.buyer && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Customer Contact Information
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">
                        {task.buyer.name}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">
                        {task.buyer.phone}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryAssignmentsPage;
