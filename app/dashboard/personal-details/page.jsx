"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { decryptData, encryptData } from "@/lib/encryption";
import { ToastContainer, toast } from "react-toastify";
import { apiUrl, API_CONFIG } from "@/configs/api";
import "react-toastify/dist/ReactToastify.css";

const PersonalDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = () => {
      const encryptedUser = localStorage.getItem("user");
      if (encryptedUser) {
        const userData = decryptData(encryptedUser);
        setProfile({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        });
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const encryptedUser = localStorage.getItem("user");
      const userData = decryptData(encryptedUser);

      const response = await axios.patch(
        apiUrl(API_CONFIG.ENDPOINTS.PROFILE.UPDATE),
        {
          userId: userData.id,
          ...profile,
        }
      );

      if (response.data) {
        // Update the stored user data
        const updatedUser = {
          ...userData,
          ...profile,
        };
        localStorage.setItem("user", encryptData(updatedUser));

        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToastContainer />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Personal Details</h1>
            <p className="text-gray-600">Update your personal information</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{profile.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{profile.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-gray-900">{profile.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">
                  {profile.phone || "Not provided"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">
                  {profile.address || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
