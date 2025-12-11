"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import Link from "next/link";

const faqData = [
  {
    category: "Orders & Shipping",
    items: [
      {
        question: "How do I track my order?",
        answer:
          "Once your order has shipped, you will receive an email with a tracking number and a link to track your package. You can also view the status of your order in your account dashboard under 'Track Order'.",
      },
      {
        question: "What are the shipping options?",
        answer:
          "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Shipping costs vary based on your location and the size of your order.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we only ship within the country. We are working on expanding our shipping destinations in the near future.",
      },
      {
        question: "Can I change my delivery address after placing an order?",
        answer:
          "If your order hasn't been shipped yet, we can help you update the address. Please contact our support team immediately. Once shipped, we cannot change the delivery address.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We accept returns within 30 days of purchase for most items, provided they are unused and in their original packaging. Some items like perishables or personal care products may not be returnable.",
      },
      {
        question: "How do I request a refund?",
        answer:
          "To request a refund, go to your 'Orders' page, select the order, and click on 'Return/Refund'. Follow the instructions to submit your request. Refunds are processed within 5-7 business days after we receive the returned item.",
      },
      {
        question: "Are there any return fees?",
        answer:
          "Return shipping is free for defective or incorrect items. For other returns, a small shipping fee may be deducted from your refund amount.",
      },
    ],
  },
  {
    category: "Payments & Account",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept major credit/debit cards, bank transfers, and payments via our secure wallet system. All transactions are encrypted and secure.",
      },
      {
        question: "How do I fund my wallet?",
        answer:
          "You can fund your wallet by clicking on the 'Fund Wallet' button in your dashboard. You can use your card or make a bank transfer to your dedicated virtual account.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "If you've forgotten your password, click on 'Forgot Password' on the login page. We will send a reset link to your registered email address.",
      },
    ],
  },
  {
    category: "Becoming a Vendor",
    items: [
      {
        question: "How can I sell on Kasuwar Zamani?",
        answer:
          "To become a vendor, sign up for a regular account and then apply to become a seller from your profile settings. Our team will review your application within 48 hours.",
      },
      {
        question: "What are the fees for selling?",
        answer:
          "Listing items is free. We charge a small commission fee on each successful sale. Detailed fee structures are available in the Vendor Agreement.",
      },
    ],
  },
];

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState({ category: 0, item: 0 });

  const toggleAccordion = (catIndex, itemIndex) => {
    if (openIndex.category === catIndex && openIndex.item === itemIndex) {
      setOpenIndex({ category: -1, item: -1 }); // Close if already open
    } else {
      setOpenIndex({ category: catIndex, item: itemIndex });
    }
  };

  const filteredFAQs = faqData
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Have questions? We're here to help. Find answers to common questions
            about our services.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a question..."
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((section, catIndex) => (
              <div
                key={catIndex}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {section.category}
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {section.items.map((item, itemIndex) => {
                    const isOpen =
                      openIndex.category === catIndex &&
                      openIndex.item === itemIndex;
                    return (
                      <div key={itemIndex} className="bg-white">
                        <button
                          onClick={() => toggleAccordion(catIndex, itemIndex)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                        >
                          <span
                            className={`font-medium ${
                              isOpen ? "text-blue-600" : "text-gray-700"
                            }`}
                          >
                            {item.question}
                          </span>
                          <span
                            className={`ml-4 flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            {isOpen ? (
                              <FaChevronUp className="text-blue-500" />
                            ) : (
                              <FaChevronDown className="text-gray-400" />
                            )}
                          </span>
                        </button>
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No results found for "{searchTerm}".
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-blue-600 font-medium hover:text-blue-800"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8 sm:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Please chat to our friendly
            team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/dashboard/inbox"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Chat with Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
