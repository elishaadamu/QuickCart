"use client";
import React, { useState } from 'react';
import Script from 'next/script'; // Import Script from next/script

const Wallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');

  // Replace with your actual Paystack Public Key
  const PAYSTACK_PUBLIC_KEY = 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY'; // IMPORTANT: Replace with your actual public key

  const handlePaystackPayment = () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (typeof window.PaystackPop === 'undefined') {
      alert('Paystack script not loaded. Please try again.');
      return;
    }

    window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: 'user@example.com', // Replace with actual user email
      amount: amount * 100, // Amount in kobo (Naira) or cents (USD)
      currency: 'NGN', // Or 'GHS', 'USD', 'ZAR'
      ref: new Date().getTime().toString(), // Unique reference for the transaction
      callback: (response) => {
        // This is called after the transaction is completed
        alert('Payment successful! Ref: ' + response.reference);
        console.log(response);
        // You should verify the transaction on your backend here
        // For example: fetch('/api/verify-paystack-transaction', { method: 'POST', body: JSON.stringify({ reference: response.reference }) });
      },
      onClose: () => {
        alert('Payment window closed.');
      },
    }).openIframe();

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
      />

      <h1 className="text-4xl font-bold mb-4">Wallet Page</h1>
      <p className="text-lg mb-8">This is your wallet. You can add funds here.</p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Funds
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Choose Funding Method</h2>

            <div className="mb-4">
              <button
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
                onClick={() => {
                  alert('Virtual Account funding is not yet implemented.');
                  setIsModalOpen(false);
                }}
              >
                Add funds with Virtual Account
              </button>
              <button
                className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  // This button now just reveals the Paystack input
                }}
              >
                Use Paystack
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Paystack Payment</h3>
              <input
                type="number"
                placeholder="Enter amount"
                className="border p-2 w-full mb-4 rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                onClick={handlePaystackPayment}
                className="w-full bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
              >
                Pay with Paystack
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
