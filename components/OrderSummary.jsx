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
    products, // All products
    states, // All states from context
  } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState("");
  const [pin, setPin] = useState("");

  // New states for delivery logic
  const [deliveryState, setDeliveryState] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingPercentage, setShippingPercentage] = useState(0);
  const [isInterState, setIsInterState] = useState(false);
  const [interStateAddress, setInterStateAddress] = useState("");

  const createOrder = async () => {
    if (!pin || pin.length !== 4) {
      toast.error("Please enter your 4-digit transaction PIN.");
      return;
    }
    setLoading(true);

    if (!deliveryState) {
      toast.error("Please select a delivery state.");
      setLoading(false);
      return;
    }

    if (isInterState && !interStateAddress) {
      toast.error("Please enter the inter-state delivery address.");
      setLoading(false);
      return;
    }
    const orderProducts = Object.keys(cartItems)
      .map((itemId) => {
        const product = products.find((p) => p._id === itemId);
        if (product && cartItems[itemId] > 0) {
          return {
            productId: product._id,
            name: product.name,
            quantity: cartItems[itemId],
            price: product.price,
            vendorId: product.vendor?._id,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (orderProducts.length === 0) {
      toast.error("Your cart is empty.");
      setLoading(false);
      return;
    }

    const vendorId = orderProducts[0]?.vendorId;
    const payload = {
      userId: userData?.id,
      vendorId: vendorId,
      products: orderProducts,
      deliveryAddress: isInterState
        ? interStateAddress
        : addresses.shippingAddress,
      state: deliveryState,
      zipcode: addresses.zipCode,
      shippingFee: shippingFee,
      tax: Math.floor(getCartAmount() * 0.02), // You might want to tax the total amount including shipping
      phone: userData?.phone,
      pin,
    };

    if (!payload.vendorId) {
      toast.error("Could not determine vendor for this order.");
      setLoading(false);
      return;
    }
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

  // Effect to calculate shipping fee based on delivery state
  useEffect(() => {
    const cartAmount = getCartAmount();
    if (deliveryState && addresses.shippingState) {
      if (deliveryState === addresses.shippingState) {
        // Intra-state: 5% shipping fee
        setShippingPercentage(5);
        setShippingFee(Math.floor(cartAmount * 0.05));
        setIsInterState(false);
      } else {
        // Inter-state: 10% shipping fee
        setShippingPercentage(10);
        setShippingFee(Math.floor(cartAmount * 0.1));
        setIsInterState(true);
      }
    } else {
      setShippingFee(0);
      setShippingPercentage(0);
      setIsInterState(false);
    }
  }, [deliveryState, addresses.shippingState, getCartAmount]);

  return (
    <div className="w-full md:w-full bg-slate-50 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-slate-800">Order Summary</h2>
      <hr className="border-slate-200 my-6" />

      {/* Shipping Information Section */}
      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-800 mb-4">
          Shipping
        </legend>
        <div className="space-y-4">
          <div>
            <label className="text-base font-medium uppercase text-gray-600 block">
              Shipping From
            </label>
            <div className="relative inline-block w-full text-sm border rounded-md">
              <div
                className="peer w-full text-left px-4 pr-2 py-2.5 bg-white text-gray-700 rounded-md flex justify-between items-center cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{addresses.shippingAddress || "Select Address"}</span>
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
              </div>

              {isDropdownOpen && (
                <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 rounded-md">
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
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center border-t"
                  >
                    Edit Shipping Address
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Delivery State Selection */}
          <div>
            <label
              htmlFor="delivery-state"
              className="text-base font-medium uppercase text-gray-600 block mb-2"
            >
              Delivery To <span className="text-red-500">*</span>
            </label>
            <select
              id="delivery-state"
              value={deliveryState}
              onChange={(e) => setDeliveryState(e.target.value)}
              className="w-full outline-none p-2.5 text-gray-600 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select delivery state
              </option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Inter-state Address Form */}
          {isInterState && (
            <div>
              <label className="text-base font-medium uppercase text-gray-600 block mb-2">
                Inter-State Delivery Address{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={interStateAddress}
                onChange={(e) => setInterStateAddress(e.target.value)}
                placeholder="Enter the full delivery address for the selected state"
                className="w-full outline-none p-2.5 text-gray-600 border resize-none rounded-md focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          )}
        </div>
      </fieldset>

      <hr className="border-slate-200 my-6" />

      {/* Cost Breakdown Section */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 mb-2">
          Summary
        </legend>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <p className="text-slate-500">Items ({getCartCount()})</p>
            <p className="font-medium text-slate-700">
              {currency}
              {getCartAmount().toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-slate-500">
              Shipping Fee
              {shippingPercentage > 0 && ` (${shippingPercentage}%)`}
            </p>
            <p className="font-medium text-slate-700">
              {currency}
              {shippingFee.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-slate-500">Tax (2%)</p>
            <p className="font-medium text-slate-700">
              {currency}
              {Math.floor(getCartAmount() * 0.02).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex justify-between text-lg font-bold text-slate-800 border-t border-slate-200 pt-4 mt-4">
          <p>Order Total</p>
          <p className="text-blue-600">
            {currency}
            {(
              getCartAmount() +
              shippingFee +
              Math.floor(getCartAmount() * 0.02)
            ).toFixed(2)}
          </p>
        </div>
      </fieldset>

      <hr className="border-slate-200 my-6" />

      {/* Payment Section */}
      <fieldset>
        <label
          htmlFor="pin"
          className="text-base font-medium uppercase text-gray-600 block mb-2"
        >
          Transaction PIN <span className="text-red-500">*</span>
        </label>
        <PinInput length={4} onChange={setPin} />
      </fieldset>

      <button
        onClick={createOrder}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 mt-6 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;
