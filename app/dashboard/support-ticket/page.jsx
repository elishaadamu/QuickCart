"use client";
import React from "react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const SupportTicket = () => {
  const whatsappNumber = "2348140950947";
  const supportEmail = "support@kasuwarzamani.com.ng";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Support Center
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Need help? Contact us through one of the channels below. We're here to
          assist you!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <FaWhatsapp className="text-5xl text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Chat on WhatsApp
            </h2>
            <p className="text-gray-600 mb-4">
              For quick questions and real-time support, chat with us directly
              on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <FaWhatsapp />
              Start Chat
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <FaEnvelope className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Send us an Email
            </h2>
            <p className="text-gray-600 mb-4">
              For detailed inquiries or issues, send us an email. We'll get back
              to you as soon as possible.
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <FaEnvelope />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;
