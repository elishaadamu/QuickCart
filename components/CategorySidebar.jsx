"use client";
import React, { useState } from "react";
import {
  HiOutlineCpuChip,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlineTruck,
  HiOutlineBuildingOffice2,
  HiOutlineArchiveBox,
  HiOutlineWrenchScrewdriver,
  HiOutlineComputerDesktop,
} from "react-icons/hi2";
import Link from "next/link"; // This was the line I added in the previous turn, but it seems it was missing from your file.

export const categoriesData = [
  {
    name: "Electronics",
    icon: <HiOutlineCpuChip className="w-5 h-5 mr-2 text-gray-500" />,
    items: [
      "Laptops & Computers",
      "Phones & Tablets",
      "TVs & Home Theater",
      "Cameras & Drones",
      "Headphones & Audio",
    ],
  },
  {
    name: "Fashion",
    icon: <HiOutlineShoppingBag className="w-5 h-5 mr-2 text-gray-500" />,
    items: [
      "Men's Clothing",
      "Women's Clothing",
      "Shoes & Footwear",
      "Bags & Accessories",
      "Watches & Jewelry",
    ],
  },
  {
    name: "Foods and Drinks",
    icon: <HiOutlineSparkles className="w-5 h-5 mr-2 text-gray-500" />,
    items: ["Fresh Produce", "Packaged Foods", "Beverages", "Snacks", "Bakery"],
  },
  {
    name: "Furnitures",
    icon: <HiOutlineHome className="w-5 h-5 mr-2 text-gray-500" />,
    items: [
      "Living Room Furniture",
      "Bedroom Furniture",
      "Office Furniture",
      "Kitchen & Dining",
      "Outdoor Furniture",
    ],
  },
  {
    name: "Beauty & Health",
    icon: <HiOutlineHeart className="w-5 h-5 mr-2 text-gray-500" />,
    items: [
      "Skincare",
      "Makeup",
      "Haircare",
      "Fragrances",
      "Health & Wellness",
    ],
  },
  {
    name: "Automobiles",
    icon: <HiOutlineTruck className="w-5 h-5 mr-2 text-gray-500" />,
    items: [
      "Cars & Trucks",
      "Motorcycles",
      "Car Parts & Accessories",
      "Tires & Wheels",
      "Automotive Tools",
    ],
  },
  {
    name: "Property",
    icon: <HiOutlineBuildingOffice2 className="w-5 h-5 mr-2 text-gray-500" />,
    items: [
      "For Sale: Houses & Apartments",
      "For Rent: Houses & Apartments",
      "Land & Plots",
      "Commercial Property",
    ],
  },
  {
    name: "Kitchen Utensils",
    icon: <HiOutlineArchiveBox className="w-5 h-5 mr-2 text-gray-500" />,
    items: [
      "Cookware",
      "Bakeware",
      "Cutlery & Knives",
      "Small Appliances",
      "Kitchen Storage",
    ],
  },
  {
    name: "Home appliance",
    icon: <HiOutlineHome className="w-5 h-5 mr-2 text-gray-500" />,
    items: [
      "Refrigerators & Freezers",
      "Washers & Dryers",
      "Vacuums & Floor Care",
      "Air Conditioners & Heaters",
    ],
  },
  {
    name: "Agriculture",
    icon: <HiOutlineSparkles className="w-5 h-5 mr-2 text-gray-500" />,
    items: ["Farm Machinery", "Seeds & Plants", "Fertilizers", "Livestock"],
  },
  {
    name: "Industrial equipment",
    icon: <HiOutlineWrenchScrewdriver className="w-5 h-5 mr-2 text-gray-500" />,
    items: ["Heavy Machinery", "Power Tools", "Safety Equipment", "Generators"],
  },
  {
    name: "Digital products",
    icon: <HiOutlineComputerDesktop className="w-5 h-5 mr-2 text-gray-500" />,
    items: ["Software", "E-books", "Online Courses", "Digital Art"],
  },
];

const CategorySidebar = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="w-full h-[400px] overflow-y-auto mt-6 md:flex-[20%] bg-white hidden md:block shadow-lg rounded-lg z-10 p-4  border border-gray-200 top-20 ">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
      <ul className="space-y-2">
        {categoriesData.map((category) => (
          <li
            key={category.name}
            className="relative"
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link
              href={`/category/${category.name
                .toLowerCase()
                .replace(/ & /g, "-")
                .replace(/ /g, "-")}`}
              className="flex items-center p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            >
              {category.icon}
              {category.name}
            </Link>
            {hoveredCategory === category.name && (
              <div className="absolute left-full top-0 ml-2 w-60 bg-white shadow-xl rounded-lg p-3 z-10 border border-gray-200">
                <h4 className="font-medium text-blue-600 mb-2 border-b pb-1 border-gray-200">
                  {category.name}
                </h4>
                <ul className="space-y-1 text-sm">
                  {category.items.map((item) => (
                    <li key={item}>
                      <Link
                        href={`/category/${category.name
                          .toLowerCase()
                          .replace(/ & /g, "-")
                          .replace(/ /g, "-")}/${item
                          .toLowerCase()
                          .replace(/ & /g, "-")
                          .replace(/ /g, "-")}`}
                        className="block p-1 rounded text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;
