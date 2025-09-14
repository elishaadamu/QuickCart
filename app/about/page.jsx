"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center gap-8 my-16 px-4 md:px-16 lg:px-32">
      <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <Image
            src={assets.boy_with_laptop_image}
            alt="about us"
            className="rounded-lg"
          />
        </div>
        <div className="md:w-1/2 flex flex-col gap-4 text-gray-700">
          <p>
            Welcome to Kasuwar Zamani, your number one source for all things
            [product, e.g., electronics, fashion, home goods]. We're dedicated
            to giving you the very best of products, with a focus on three
            characteristics: dependability, customer service, and uniqueness.
          </p>
          <p>
            Founded in [year] by [founder's name], Kasuwar Zamani has come a
            long way from its beginnings in a [starting location, e.g., home
            office, garage]. When [founder's name] first started out, their
            passion for [passion related to the business, e.g., eco-friendly
            products, providing the best equipment for his fellow musicians]
            drove them to start their own business.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to
            you. If you have any questions or comments, please don't hesitate to
            contact us.
          </p>
          <p>
            Sincerely,
            <br />
            [Founder's Name], Founder
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
