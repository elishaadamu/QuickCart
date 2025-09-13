'use client'
import { assets } from "@/assets/assets";
import Image from "next/image";
import React from 'react'

const page = () => {
    return (
        <div className="flex flex-col items-center gap-8 my-16 px-4 md:px-16 lg:px-32">
            <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                    <Image src={assets.boy_with_laptop_image} alt="about us" className="rounded-lg" />
                </div>
                <div className="md:w-1/2 flex flex-col gap-4 text-gray-700">
                    <p>Welcome to QuickCart, your one-stop shop for all the latest and greatest gadgets. We are passionate about technology and believe that everyone should have access to the best products on the market.</p>
                    <p>Our mission is to provide our customers with a seamless shopping experience, from browsing our extensive catalog to receiving their orders at their doorstep. We are committed to offering competitive prices, fast shipping, and excellent customer service.</p>
                    <p>At QuickCart, we are more than just a retailer. We are a community of tech enthusiasts who are always on the lookout for the next big thing. We love to share our knowledge and passion with our customers, and we are always happy to help you find the perfect product for your needs.</p>
                </div>
            </div>
        </div>
    )
}

export default page