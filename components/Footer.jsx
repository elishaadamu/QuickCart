import React from "react";
import Image from "next/image";
import Logo from "@/assets/logo/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 text-gray-300">
        <div className="w-4/5">
          <Image
            className="cursor-pointer w-[170px] md:w-[250px]"
            src={Logo}
            alt="logo"
          />
          <p className="mt-6 text-sm">
            Kasuwar Zamani is your go-to online marketplace for a wide range of
            products. We are committed to providing a seamless shopping
            experience with quality items at competitive prices. Whether you're
            looking for electronics, fashion, home goods, or more, Kasuwar
            Zamani has you covered. Shop with us today and discover the
            convenience of online shopping!
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-white mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="/">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="/about">
                  About us
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="/">
                  Contact us
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="/">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-white mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>123, Some Street, Some City, Nigeria</p>
              <p>
                <a href="tel:+2348140950947">+2348140950947</a>
              </p>
              <p>
                <a href="mailto:support@kasuwarzamani.com.ng">
                  support@kasuwarzamani.com.ng
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-gray-400 border-t border-gray-700">
        Copyright 2025 © kasuwarzamani.com.ng. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
