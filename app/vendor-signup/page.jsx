"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Logo from "@/assets/logo/logo.png";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { encryptData } from "@/lib/encryption";
import { apiUrl, API_CONFIG } from "@/configs/api";
import { useAppContext } from "@/context/AppContext";

const VendorSignupPage = () => {
  const router = useRouter();
  const { fetchUserData } = useAppContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    if (firstName.trim() && phone.length >= 3) {
      const generatedCode = `${firstName.toUpperCase().trim()}${phone.slice(
        -3
      )}`;
      setReferralCode(generatedCode);
    } else {
      setReferralCode("");
    }
  }, [firstName, phone]);
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      password,
      referralCode,
      role: "vendor",
    };
    console.log("Vendor signup payload with referral code:", payload);

    try {
      const response = await axios.post(
        apiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP),
        payload
      );
      const { user } = response.data;
      console.log("Signup response:", response.data);
      // Encrypt and store user data
      const encryptedUser = encryptData(user);
      localStorage.setItem("user", encryptedUser);

      fetchUserData();
      toast.success("Vendor signup successful!");
      router.push("/seller"); // Redirect to seller dashboard after signup
    } catch (error) {
      console.error("Error signing up as vendor:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during vendor signup."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-16">
      <ToastContainer />
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-4 w-[90%] md:w-[450px] text-gray-700"
      >
        <Link href={"/"}>
          <Image
            className="cursor-pointer w-[170px] md:w-[250px] mx-auto"
            src={Logo}
            alt=""
          />
        </Link>
        <p className="text-center font-semibold text-xl">
          Create a Vendor Account
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label>First Name</label>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="border p-2 rounded-md"
                type="text"
                placeholder="Enter your first name"
              />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label>Last Name</label>
              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="border p-2 rounded-md"
                type="text"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label>Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border p-2 rounded-md"
              type="email"
              placeholder="Enter your email"
            />
          </div>
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
          <div className="flex flex-col gap-1">
            <label>Your Referral Code (auto-generated)</label>
            <input
              value={referralCode}
              className="border p-2 rounded-md bg-gray-100 cursor-not-allowed"
              type="text"
              placeholder="Generated referral code"
              disabled
              readOnly
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 text-white p-2 rounded-md flex items-center justify-center w-full mt-4"
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
            "Sign up as Vendor"
          )}
        </button>

        <p className="text-sm text-center">
          Already have a vendor account?{" "}
          <Link className="text-blue-500" href={"/vendor-signin"}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default VendorSignupPage;
