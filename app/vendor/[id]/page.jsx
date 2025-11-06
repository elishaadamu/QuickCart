"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import { apiUrl, API_CONFIG } from "@/configs/api";
import ProductCard from "@/components/ProductCard";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <FaStar
              className="cursor-pointer"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={24}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

const VendorPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn, products, userData } = useAppContext();
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [vendorProducts, setVendorProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchVendor = async () => {
        try {
          // Fetch all vendors and find the one with the matching ID
          const response = await axios.get(
            apiUrl(API_CONFIG.ENDPOINTS.VENDOR.GET_ALL)
          );
          console.log(response.data);
          const allVendors = response.data || [];
          const foundVendor = allVendors.find((v) => v._id === id);
          if (foundVendor) {
            setVendor(foundVendor);
            // Fetch reviews for the vendor
            const reviewsResponse = await axios.get(
              apiUrl(
                API_CONFIG.ENDPOINTS.RATING.GET_BY_VENDOR + foundVendor._id
              )
            );
            setReviews(reviewsResponse.data.ratings || []);
          } else {
            router.push("/404");
          }
        } catch (error) {
          console.error("Error fetching vendor:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVendor();
    }
  }, [id, router]);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      if (vendor?._id) {
        try {
          const response = await axios.get(
            apiUrl(
              API_CONFIG.ENDPOINTS.PRODUCT.GET_SELLER_PRODUCTS + vendor._id
            )
          );
          console.log(response.data);
          setVendorProducts(response.data || []);
        } catch (error) {
          console.error("Error fetching vendor products:", error);
        }
      }
    };
    fetchVendorProducts();
  }, [vendor]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please log in to submit a review.");
      router.push("/signin");
      return;
    }

    if (userData?.role !== "user") {
      toast.error("Only users can submit reviews.");
      return;
    }

    // Check if the user has already submitted a review
    const userHasReviewed = reviews.some(
      (review) => review.userId?._id === userData?.id
    );
    if (userHasReviewed) {
      toast.error("You have already submitted a review for this vendor.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        vendorId: vendor._id,
        rating,
        comment,
        userId: userData.id,
      };
      console.log(reviewData);
      const response = await axios.post(
        apiUrl(API_CONFIG.ENDPOINTS.RATING.ADD),
        reviewData
      );
      console.log(response.data);
      if (response.data) {
        toast.success("Review submitted successfully!");
        // Optimistically add the review to the UI
        setReviews((prevReviews) =>
          [response.data.review, ...prevReviews].filter(Boolean)
        );
        setRating(0);
        setComment("");
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isLoggedIn) {
      toast.error("Please log in to delete a review.");
      return;
    }
    try {
      await axios.delete(
        apiUrl(
          `${API_CONFIG.ENDPOINTS.RATING.DELETE}${vendor._id}/${userData._id}`
        )
      );
      toast.success("Review deleted successfully!");
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-32 py-12">
      <div className="bg-white rounded-lg shadow-md mb-12 overflow-hidden">
        <div className="relative">
          <Image
            src={vendor?.banner?.url || "https://picsum.photos/seed/1/1200/300"}
            alt={`${vendor.businessName} banner`}
            width={1200}
            height={300}
            className="w-full h-48 object-cover"
            priority
          />
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <Image
              src={vendor?.avatar?.url || "https://i.pravatar.cc/150"}
              alt={`${vendor.businessName} logo`}
              width={150}
              height={150}
              className="rounded-full object-cover border-4 border-white bg-gray-200"
            />
          </div>
        </div>
        <div className="pt-24 pb-8 px-8 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800">
            {vendor.businessName}
          </h1>
          <div className="flex items-center justify-center md:justify-start mt-2 space-x-6">
            <div className="flex items-center text-lg text-gray-600">
              <FaStar className="text-yellow-400 mr-2" />
              <span>
                {(vendor.averageRating || 0).toFixed(1)} ({vendor.totalReviews}{" "}
                reviews)
              </span>
            </div>
            <p className="text-gray-500 text-lg">
              <b>{vendor.productCount}</b> Products Listed
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Products from {vendor.businessName}
        </h2>
        {vendorProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {vendorProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found for this vendor.</p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Customer Reviews
          </h2>
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews
                .filter(Boolean) // Add a filter to remove any potential null/undefined reviews
                .map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 p-4 rounded-lg border"
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} color="#ffc107" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <FaStar key={i} color="#e4e5e9" />
                        ))}
                      </div>
                      <div className="ml-auto flex items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {userData?.id === review.userId?._id && (
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="ml-4 text-red-500 hover:text-red-700 text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      -{" "}
                      {review.user?.firstName
                        ? `${review.user.firstName} ${review.user.lastName}`
                        : "Anonymous"}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Add Review Form */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Leave a Review
          </h2>
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Your Rating
              </label>
              <StarRating rating={rating} setRating={setRating} />
            </div>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Share your experience with this vendor..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorPage;
