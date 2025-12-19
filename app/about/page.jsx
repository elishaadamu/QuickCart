"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaHandshake,
  FaGlobeAfrica,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-blue-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Revolutionizing Commerce in Nigeria
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Kasuwar Zamani is more than just a marketplace; it's a bridge
            connecting modern digital convenience with our rich heritage of
            trade and enterprise.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500">
              <Image
                src={assets.my_location_image}
                alt="Our Journey"
                width={600}
                height={400} // Added width and height for optimization if boy_with_laptop_image is a static import, else next/image handles it.
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kasuwar Zamani was founded with a simple yet ambitious goal: to
              empower local businesses and provide consumers with a seamless,
              secure online shopping experience.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We recognized the immense potential of our local artisans,
              traders, and entrepreneurs. By providing a digital platform
              tailored to our unique market needs, we are not just selling
              products; we are building a community where commerce thrives on
              trust and innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-blue-600 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FaRocket className="text-blue-600" /> Our Mission
            </h3>
            <p className="text-gray-600">
              To provide a reliable, accessible, and user-friendly platform that
              empowers vendors to reach wider markets and offers customers a
              diverse range of high-quality products with simplified logistics.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-green-600 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FaGlobeAfrica className="text-green-600" /> Our Vision
            </h3>
            <p className="text-gray-600">
              To become the leading e-commerce ecosystem in the region,
              fostering digital literacy and economic growth by seamlessly
              integrating traditional values with modern technology.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Kasuwar Zamani?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We are committed to excellence in every transaction. Here is what
            sets us apart.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FaShieldAlt,
              title: "Trust & Security",
              desc: "Your safety is our priority. We implement top-tier security measures for all transactions and data.",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: FaHandshake,
              title: "Community First",
              desc: "We believe in growing together. We support local vendors and prioritize customer satisfaction above all.",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              icon: FaRocket,
              title: "Innovation",
              desc: "We constantly evolve, adopting new technologies to make your shopping and selling experience smoother.",
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={`p-4 rounded-full ${item.bg} ${item.color} mb-6`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience the Future of Trade?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of satisfied customers and vendors on Kasuwar Zamani
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              href="/vendor-signup"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
