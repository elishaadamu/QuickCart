"use client";
import React, { useState, useEffect } from "react";
import { FaUniversity, FaMoneyCheckAlt, FaUser, FaSave, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { useAppContext } from "@/context/AppContext";

const SettlementDetailsPage = () => {
  const { userData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  useEffect(() => {
    const fetchSettlementDetails = async () => {
      if (!userData?.id) return;
      try {
        const response = await axios.get(
          `${apiUrl(API_CONFIG.ENDPOINTS.PROFILE.GET)}/${userData.id}`
        );
        if (response.data && response.data.data) {
          const { bankName, accountNumber, accountName } = response.data.data;
          setFormData({
            bankName: bankName || "",
            accountNumber: accountNumber || "",
            accountName: accountName || "",
          });
        }
      } catch (error) {
        console.log("Error fetching settlement details:", error);
      }
    };

    fetchSettlementDetails();
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.accountName
    ) {
      toast.error("Please fill in all settlement details");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl(API_CONFIG.ENDPOINTS.PROFILE.UPDATE_USER)}/${userData.id}`,
        formData
      );
      toast.success(
        response.data.message || "Settlement details updated successfully"
      );
    } catch (error) {
      console.error("Error updating settlement details:", error);
      toast.error(
        error.response?.data?.message || "Failed to update settlement details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-0 px-4 pt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaUniversity className="text-blue-600" />
          Settlement Details
        </h1>
        <p className="mt-2 text-gray-600">
          Update your bank account information for receiving payments.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          
          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUniversity />
              </div>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g. Access Bank which you use"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaMoneyCheckAlt />
              </div>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="e.g. 0123456789"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUser />
              </div>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Ensure this name matches your bank account name to avoid payment delays.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Details
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SettlementDetailsPage;
