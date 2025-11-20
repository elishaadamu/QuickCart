"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import VendorCard from "./VendorCard";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";
import Loading from "./Loading";

const VendorSection = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          apiUrl(API_CONFIG.ENDPOINTS.VENDOR.GET_ALL)
        );
        const sortedVendors = (response.data || []).sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
        setVendors(sortedVendors);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);
  return (
    <div className="my-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Our Top Vendors
          </h2>
          <p className="text-gray-500 text-sm text-[18px] mt-2">
            Discover products from our most trusted sellers.
          </p>
        </div>
        <Link
          href="/all-vendors"
          className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-sm whitespace-nowrap"
        >
          View All Vendors
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4 sm:px-0">
          {vendors.slice(0, 4).map((vendor) => (
            <VendorCard key={vendor._id} {...vendor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorSection;
