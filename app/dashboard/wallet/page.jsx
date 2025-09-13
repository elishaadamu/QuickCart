"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { decryptData } from "@/lib/encryption";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wallet = () => {
  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const encryptedUser = localStorage.getItem("user");
    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser);
      setUser(decryptedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAccountDetails();
    }
  }, [user]);

  const fetchAccountDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.GET + user.id)
      );
      setAccountDetails(response.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { nin };
    console.log(payload);
    try {
      await axios.post(
        apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.CREATE + user.id),
        payload
      );
      toast.success("Account created successfully!");
      fetchAccountDetails();
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-4">Wallet</h1>

      {loading && <p>Loading...</p>}

      {!loading && accountDetails && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Account Details</h2>
          <p>
            <strong>Account Name:</strong> {accountDetails.accountName}
          </p>
          <p>
            <strong>Account Number:</strong> {accountDetails.accountNumber}
          </p>
          <p>
            <strong>Bank Name:</strong> {accountDetails.bankName}
          </p>
        </div>
      )}

      {!loading && !accountDetails && user && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Create Virtual Account</h2>
          <p className="mb-4">
            You do not have a virtual account yet. Create one to easily fund
            your wallet.
          </p>
          <form onSubmit={handleCreateAccount}>
            <div className="flex flex-col gap-1 mb-4">
              <label>NIN (National Identification Number)</label>
              <input
                onChange={(e) => setNin(e.target.value)}
                value={nin}
                className="border p-2 rounded-md"
                type="text"
                placeholder="Enter your NIN"
              />
            </div>
            <button
              disabled={loading}
              className="bg-gray-800 text-white p-2 rounded-md flex items-center justify-center w-full"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Wallet;
