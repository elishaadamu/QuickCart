"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Logo from "@/assets/logo/logo.png";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { encryptData } from "@/lib/encryption";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "@/context/AppContext";

const VendorSigninPage = () => {
  const router = useRouter();
  const { fetchUserData } = useAppContext();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { phone, password }; // Added role: "vendor"
    console.log(payload);
    try {
      const response = await axios.post(
        apiUrl(API_CONFIG.ENDPOINTS.VENDOR.SIGNIN),
        payload
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      const encryptedUser = encryptData(response.data);

      if (!encryptedUser) {
        throw new Error("Failed to encrypt user data");
      }

      localStorage.setItem("user", encryptedUser);
      fetchUserData(); // Call fetchUserData to update global state
      toast.success("Vendor signin successful!"); // Changed toast message
      router.push("/seller"); // Redirect to seller dashboard after signin
    } catch (error) {
      console.error("Error signing in as vendor:", error); // Changed error message
      toast.error(
        error.response?.data?.message ||
          "An error occurred during vendor signin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-16">
      <ToastContainer />
      <form
        onSubmit={handleSignin}
        className="flex flex-col gap-4 w-[90%] md:w-[450px] text-gray-700"
      >
        <Link href={"/"}>
          <Image
            className="cursor-pointer w-[170px] md:w-[250px] mx-auto"
            src={Logo}
            alt=""
          />
        </Link>
        <p className="text-center font-semibold text-xl">Vendor Login</p>{" "}
        {/* Changed title */}
        <div className="flex flex-col gap-1">
          <label>Phone Number</label>
          <input
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            className="border p-2 rounded-md"
            type="tel"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="flex flex-col gap-1 relative">
          <label>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border p-2 rounded-md pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
          />
          <Image
            onClick={() => setShowPassword(!showPassword)}
            className="w-5 cursor-pointer absolute right-3 top-9"
            src={showPassword ? assets.eye_close_icon : assets.eye_open_icon}
            alt="Toggle password visibility"
          />
        </div>
        <button
          disabled={loading}
          className="bg-gray-800 text-white p-2 rounded-md flex items-center justify-center"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Sign in as Vendor" // Changed button text
          )}
        </button>
        <p className="text-sm text-center">
          Don't have a vendor account?{" "}
          <Link className="text-blue-500" href={"/vendor-signup"}>
            {" "}
            {/* Changed signup link */}
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default VendorSigninPage;
