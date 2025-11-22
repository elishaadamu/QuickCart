"use client";
import React, { useState, useRef, useCallback, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import {
  FaShoppingCart,
  FaEye,
  FaStar,
  FaArrowRight,
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const FeaturedProduct = () => {
  const { products, router } = useAppContext();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const sliderRef = useRef(null);

  // Memoize featured products to prevent unnecessary re-renders
  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);

  const toggleFavorite = useCallback((productId, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(productId)
        ? newFavorites.delete(productId)
        : newFavorites.add(productId);
      return newFavorites;
    });
  }, []);

  const truncateDescription = useCallback((description, wordLimit = 8) => {
    if (!description) return "";
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  }, []);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(price);
  }, []);

  const sliderSettings = useMemo(
    () => ({
      dots: false,
      infinite: featuredProducts.length > 3,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      swipeToSlide: true,
      touchThreshold: 10,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: featuredProducts.length > 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "0px",
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "30px",
          },
        },
      ],
    }),
    [featuredProducts.length]
  );

  const next = useCallback(() => sliderRef.current?.slickNext(), []);
  const previous = useCallback(() => sliderRef.current?.slickPrev(), []);

  const handleProductClick = useCallback(
    (productId) => {
      router.push(`/product/${productId}`);
    },
    [router]
  );

  const handleQuickView = useCallback((productId, e) => {
    e.stopPropagation();
    // Add your quick view logic here
    console.log("Quick view:", productId);
  }, []);

  if (!featuredProducts.length) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Featured Collection
            </span>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our handpicked selection of premium products
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <Slider
            ref={sliderRef}
            {...sliderSettings}
            className="featured-products-slider"
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isFavorite={favorites.has(product._id)}
                isHovered={hoveredProduct === product._id}
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product._id)}
                onQuickView={handleQuickView}
                onToggleFavorite={toggleFavorite}
                truncateDescription={truncateDescription}
                formatPrice={formatPrice}
              />
            ))}
          </Slider>
        </div>

        {/* Custom Navigation */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={previous}
            className="p-4 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 group"
            aria-label="Previous products"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-blue-200 rounded-full"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <div className="w-8 h-1 bg-purple-200 rounded-full"></div>
          </div>

          <button
            onClick={next}
            className="p-4 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 group"
            aria-label="Next products"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/products")}
            className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-3 mx-auto hover:shadow-lg hover:scale-105 group"
          >
            View All Products
            <FaArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Separate Product Card Component for Better Performance
const ProductCard = React.memo(
  ({
    product,
    isFavorite,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onQuickView,
    onToggleFavorite,
    truncateDescription,
    formatPrice,
  }) => (
    <div
      className="group relative pb-10 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden !flex flex-col h-full mx-3 cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <Image
          src={product.images?.[0]?.url || "/placeholder-product.jpg"}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          priority={false}
          loading="lazy"
        />

        {/* Overlay Actions */}
        <div
          className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          <button
            onClick={(e) => onToggleFavorite(product._id, e)}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart className="w-4 h-4 text-red-500" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={(e) => onQuickView(product._id, e)}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            aria-label="Quick view"
          >
            <FaEye className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={(e) => onQuickView(product._id, e)}
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100 hover:scale-105"
          >
            <FaEye className="w-4 h-4" />
            Quick View
          </button>
        </div>

        {/* Product Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            Featured
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 pr-2">
            {product.name}
          </h3>
          <button
            onClick={(e) => onToggleFavorite(product._id, e)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart className="w-5 h-5 text-red-500" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-gray-400 hover:text-red-400" />
            )}
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px] flex-grow">
          {truncateDescription(product.description, 12)}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`w-4 h-4 ${
                  star <= (product.rating || 4)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviewCount || 24})
          </span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price || 99.99)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200 group/btn min-w-[120px]"
          >
            <FaShoppingCart className="w-4 h-4" />
            <span className="text-sm">Buy Now</span>
          </button>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 pointer-events-none"></div>
    </div>
  )
);

ProductCard.displayName = "ProductCard";

export default FeaturedProduct;
