"use client";
import React, { useState, useEffect } from "react";
import VendorCard from "@/components/VendorCard";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";

import Loading from "@/components/Loading";

const AllVendorsPage = () => {
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-32 py-12">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">All Vendors</h1>
        <p className="text-gray-500 mt-2">
          Browse our complete list of trusted sellers.
        </p>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {vendors.map((vendor) => (
            <VendorCard key={vendor._id} {...vendor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllVendorsPage;
