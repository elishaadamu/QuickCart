"use client";
import React, { useState, useEffect } from "react";
import {
  FaCopy,
  FaShareAlt,
  FaWhatsapp,
  FaEnvelope,
  FaLink,
  FaUsers,
  FaCoins,
  FaGift,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { decryptData } from "@/lib/encryption";
import { apiUrl, API_CONFIG } from "@/configs/api";

const ReferralPage = () => {
  const [userData, setUserData] = useState(null);
  const [referralData, setReferralData] = useState({
    referralCode: "",
    referralLink: "",
    totalReferrals: 0,
    earnedAmount: 0,
    pendingAmount: 0,
    referralStats: {
      total: 0,
      completed: 0,
      pending: 0,
    },
  });
  const [userProfile, setUserProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const encryptedUser = localStorage.getItem("user");
        if (!encryptedUser) {
          toast.error("User not found. Please log in again.");
          setLoading(false);
          return;
        }

        const decryptedUserData = decryptData(encryptedUser);
        setUserData(decryptedUserData);

        // Fetch profile to get the referral code
        const response = await axios.get(
          `${apiUrl(API_CONFIG.ENDPOINTS.PROFILE.GET)}/${decryptedUserData.id}`
        );

        const userProfile = response?.data?.user;

        setUserProfile(userProfile);
      } catch (error) {
        console.error("Error fetching referral data:", error);
        toast.error("Failed to load referral data. Using defaults.");
        // Fallback to generating a code if APIs fail
        generateFallbackReferralData();
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []); // This effect runs only on the client

  const generateFallbackReferralData = () => {
    // This function is now a fallback for API errors.
    const referralCode = generateReferralCode();
    if (referralCode) {
      const referralLink = `${origin}/signup?ref=${referralCode}`;
      setReferralData({
        referralCode,
        referralLink,
        totalReferrals: 0,
        earnedAmount: 0,
        pendingAmount: 0,
        referralStats: {
          total: 0,
          completed: 0,
          pending: 0,
        },
      });
    }
  };

  const copyToClipboard = (text) => {
    if (!text) {
      toast.warn("Nothing to copy.");
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      },
      (err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy.");
      }
    );
  };

  const shareOnWhatsApp = () => {
    const referralCode = userProfile?.referralCode;
    if (!referralCode) {
      toast.error("Referral code not available.");
      return;
    }
    const referralLink = `${origin}/signup?ref=${referralCode}`;
    const message = `Join me on Kasuwar Zamani! Use my referral code: ${referralCode}\n\nSign up here: ${referralLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const shareViaSocialMedia = () => {
    const referralCode = userProfile?.referralCode;
    if (!referralCode) {
      toast.error("Referral code not available.");
      return;
    }
    const referralLink = `${origin}/signup?ref=${referralCode}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Join me on this amazing platform!",
          text: `Use my referral code: ${referralCode}`,
          url: referralLink,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch(() => toast.error("Error sharing"));
    } else {
      copyToClipboard(referralLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Refer & Earn
          </h1>
          <p className="text-lg text-gray-600">
            Invite your friends and earn amazing rewards!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                  <FaUsers className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {referralData.totalReferrals}
                </h3>
                <p className="text-gray-600">Total Referrals</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                  <FaCoins className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  ₦{referralData.earnedAmount.toLocaleString()}
                </h3>
                <p className="text-gray-600">Total Earned</p>
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Referral Code
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <code className="text-2xl font-mono font-bold text-gray-900">
                      {userProfile.referralCode}
                    </code>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(userProfile.referralCode)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <FaCopy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>

            {/* Referral Link Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Referral Link
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-gray-900 break-all">
                      {origin}/signup?ref={userProfile?.referralCode}
                    </code>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const link = `${origin}/signup?ref=${userProfile?.referralCode}`;
                    copyToClipboard(link);
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
                >
                  <FaLink className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Share Your Referral
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={shareOnWhatsApp}
                  className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp
                </button>

                <button
                  onClick={shareViaSocialMedia}
                  className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2"
                >
                  <FaShareAlt className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Share Your Link
                  </h3>
                  <p className="text-gray-600">
                    Share your unique referral link with friends and family
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    They Sign Up
                  </h3>
                  <p className="text-gray-600">
                    Your friends sign up using your referral link or code
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-yellow-600 font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    You Earn Rewards
                  </h3>
                  <p className="text-gray-600">
                    Earn a 5% commission on every wallet funding your referral
                    makes.
                  </p>
                </div>
              </div>
            </div>

            {/* Referral Terms */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Referral Program Terms
              </h3>
              <ul className="text-yellow-700 list-disc list-inside space-y-1">
                <li>
                  You earn a 5% commission every time your referral funds their
                  wallet.
                </li>
                <li>
                  Each referral is valid for 200 days from the signup date.
                </li>
                <li>There's no limit to how many people you can refer.</li>
                <li>Fraudulent referrals will result in account suspension.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;
