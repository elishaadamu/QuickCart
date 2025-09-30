"use client";
import Navbar from "@/components/seller/Navbar";
import Sidebar from "@/components/seller/Sidebar";
import React, { useState } from "react";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="flex w-full">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "w-[calc(100%-4rem)]" : "w-[calc(100%-16rem)]"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;