"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import VendorCard from "./VendorCard";
import axios from "axios";
import Slider from "react-slick";
import { apiUrl, API_CONFIG } from "@/configs/api";
import Loading from "./Loading";

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VendorSection = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    dots: false, // Dots can be cluttered with partial slides, setting to false
    infinite: false,
    speed: 500,
    slidesToShow: 3.15, // Default for > 1024px
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2.15, // For screens < 1280px
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.15, // For screens < 1024px and > 768px
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1.15, // For screens < 768px
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

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
    // my-16 was a bit large for mobile, reducing it on smaller screens
    <div className="my-16">
      <style jsx global>{`
        @media screen and (max-width: 360px) {
          .home-products {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          .button-see_more {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: baseline;
            gap: 10px;
          }
        }
        /* Custom styles for slick-dots */
        .slick-dots li button:before {
          font-size: 10px;
          color: #9ca3af; /* gray-400 */
        }
        .slick-dots li.slick-active button:before {
          color: #3b82f6; /* blue-500 */
        }
        /* Custom styles for slick arrows */
        .slick-prev:before,
        .slick-next:before {
          color: #3b82f6; /* blue-500 */
        }
      `}</style>
      <div className="flex  button-see_more justify-between items-center mb-8">
        <div className="">
          <h2 className=" text-xl md:text-2xl font-bold text-gray-800">
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
        <Slider {...sliderSettings}>
          {vendors.slice(0, 4).map((vendor) => (
            <div key={vendor._id} className="px-2 py-2">
              <VendorCard {...vendor} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default VendorSection;
