import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl, API_CONFIG } from "@/configs/api";
import PinInput from "./PinInput";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    userData,
    cartItems,
    products,
  } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState("");
  const [pin, setPin] = useState("");

  const createOrder = async () => {
    if (!pin || pin.length !== 4) {
      toast.error("Please enter your 4-digit transaction PIN.");
      return;
    }
    setLoading(true);

    const totalAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02);
    const orderProducts = Object.keys(cartItems)
      .map((itemId) => {
        const product = products.find((p) => p._id === itemId);
        if (product && cartItems[itemId] > 0) {
          return {
            productId: product._id,
            name: product.name,
            quantity: cartItems[itemId],
            price: product.price,
          };
        }
        return null;
      })
      .filter(Boolean);

    const payload = {
      userId: userData.id,
      products: orderProducts,
      deliveryAddress: addresses.shippingAddress,
      state: addresses.shippingState,
      zipcode: addresses.zipCode,
      phone: userData.phone, // Assuming phone is available on the user object
      pin,
      totalAmount,
    };
    console.log("Order payload:", payload);
    try {
      const response = await axios.post(
        apiUrl(API_CONFIG.ENDPOINTS.ORDER.CREATE),
        payload
      );
      toast.success("Order placed successfully!");
      router.push("dashboard/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    setPageLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl(API_CONFIG.ENDPOINTS.PROFILE.GET)}/${userData.id}`
      );
      console.log("response", response.data.user);
      setAddresses(response.data.user || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch shipping addresses.");
    } finally {
      setPageLoading(false);
    }
  };
  useEffect(() => {
    if (userData) {
      fetchAddresses();
    }
  }, []);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{addresses.shippingAddress}</span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                <li className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
                  <span className="text-xs text-gray-500">
                    First Name: {userData.firstName}
                  </span>
                  <br />
                  {addresses.shippingAddress}
                  <br />
                  {addresses.shippingState} {"State"}
                  <br />
                  {addresses.zipCode}
                  <br />
                </li>

                <li
                  onClick={() => router.push("/dashboard/shipping")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  Edit Shipping Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-blue-600 text-white px-9 py-2 hover:bg-blue-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">
              {currency}
              {Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {getCartAmount() + Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="pin"
          className="text-base font-medium uppercase text-gray-600 block mb-2"
        >
          Transaction PIN
        </label>
        <PinInput length={4} onChange={setPin} />
      </div>

      <button
        onClick={createOrder}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 mt-5 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;
