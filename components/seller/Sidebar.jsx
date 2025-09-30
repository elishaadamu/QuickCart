import React from "react";
import Link from "next/link";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  return (
    <div
      className={`border-r min-h-screen text-base border-gray-300 py-2 flex flex-col relative transition-width duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full p-1 z-10"
      >
        {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
      </button>
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-500/90"
                  : "hover:bg-gray-100/90 border-white"
              }`}
            >
              <Image
                src={item.icon}
                alt={`${item.name.toLowerCase()}_icon`}
                className="w-7 h-7"
              />
              {!isCollapsed && <p className="text-center">{item.name}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
