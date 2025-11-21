import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FiFolder } from "react-icons/fi";

const VendorCard = ({
  _id,
  businessName,
  avatar,
  banner,
  productCount,
  averageRating,
  totalReviews,
  isClosed,
  category, // Added category prop
  followers,
}) => {
  return (
    <Link
      href={`/vendor/${_id}`}
      className="block relative group bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Banner */}
      <div className="relative w-full h-28">
        <Image
          src={banner?.url || "https://picsum.photos/seed/1/400/200"}
          alt="banner"
          fill
          className="object-cover"
        />

        {/* CLOSED badge */}
        {isClosed && (
          <div className="absolute top-3 right-3 bg-[#696000] text-white text-sm font-semibold py-1 px-3 rounded-full">
            Closed Now
          </div>
        )}

        {/* Avatar */}
        <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden">
          <Image
            src={avatar?.url || "https://i.pravatar.cc/150"}
            alt="avatar"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 px-4 pb-4">
        <div className="flex flex-row justify-between items-baseline">
          <h3 className="text-lg sm:text-xl font-semibold">{businessName}</h3>
          <div className="text-blue-800 bg-gray-100 rounded-lg flex flex-row gap-2 items-center px-3 py-2">
            <p className="text-lg sm:text-xl font-semibold">{followers || 0}</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0">Followers</p>
          </div>
        </div>

        {/* Category */}
        {category && (
          <div className="flex items-center mt-2 text-gray-500">
            <FiFolder className="mr-2 text-sm" />
            <p className="text-sm">{category}</p>
          </div>
        )}

        {/* Rating Row */}
        <div className="flex items-center mt-1">
          <FaStar className="text-yellow-400 mr-1 text-sm" />
          <span className="font-medium text-sm">
            {(averageRating || 0).toFixed(1)}
          </span>
          <span className="ml-1 text-gray-500 text-sm">Rating</span>
        </div>

        {/* Reviews + Products Row */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 text-center">
          <div className="text-blue-800 bg-gray-100 rounded-lg flex flex-row gap-2 items-center px-3 py-2">
            <p className="text-lg sm:text-xl font-semibold">
              {totalReviews || 0}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0">Reviews</p>
          </div>

          <div className="text-blue-800 bg-gray-100 rounded-lg flex flex-row gap-2 items-center px-3 py-2">
            <p className="text-lg sm:text-xl font-semibold">
              {productCount || 0}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0">Products</p>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-white text-lg font-bold border-2 border-white rounded-md px-4 py-2">
          View Store
        </span>
      </div>
    </Link>
  );
};

export default VendorCard;
