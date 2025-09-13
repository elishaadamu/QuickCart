"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { encryptData } from '../../lib/encryption';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [openOrders, setOpenOrders] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  // Authentication check
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/signin"); // Redirect to signin if not logged in
    } else {
      const encryptedData = encryptData(user);
      console.log(encryptedData);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    router.push("/signin"); // Redirect to signin page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6 fixed h-screen overflow-y-auto"> {/* Added fixed, h-screen, overflow-y-auto */}
        <h2 className="text-2xl font-bold mb-6">Customer Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard/wallet" className="block py-2 px-4 rounded hover:bg-gray-700">
                Wallet
              </Link>
            </li>
            <li>
              <div className="cursor-pointer py-2 px-4 rounded hover:bg-gray-700" onClick={() => setOpenOrders(!openOrders)}>
                Orders
                {/* Dropdown arrow */}
                <span className="float-right">{openOrders ? '▲' : '▼'}</span>
              </div>
              {openOrders && (
                <ul className="ml-4 space-y-1">
                  <li>
                    <Link href="/dashboard/orders/pending" className="block py-2 px-4 rounded hover:bg-gray-600">
                      Pending
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/orders/approved" className="block py-2 px-4 rounded hover:bg-gray-600">
                      Approved
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/orders/on-delivery" className="block py-2 px-4 rounded hover:bg-gray-600">
                      On delivery
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/orders/delivered" className="block py-2 px-4 rounded hover:bg-gray-600">
                      Delivered
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <div className="cursor-pointer py-2 px-4 rounded hover:bg-gray-700" onClick={() => setOpenMenu(!openMenu)}>
                Menu
                {/* Dropdown arrow */}
                <span className="float-right">{openMenu ? '▲' : '▼'}</span>
              </div>
              {openMenu && (
                <ul className="ml-4 space-y-1">
                  <li>
                    <Link href="/dashboard/personal-details" className="block py-2 px-4 rounded hover:bg-gray-600">
                      Personal details
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/address" className="block py-2 px-4 rounded hover:bg-gray-600">
                      Address
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/dashboard/inbox" className="block py-2 px-4 rounded hover:bg-gray-700">
                Inbox
              </Link>
            </li>
            <li>
              <Link href="/dashboard/coupons" className="block py-2 px-4 rounded hover:bg-gray-700">
                Coupons
              </Link>
            </li>
            <li>
              <Link href="/dashboard/support-ticket" className="block py-2 px-4 rounded hover:bg-gray-700">
                Support Ticket
              </Link>
            </li>
            <li>
              <Link href="/dashboard/refer-earn" className="block py-2 px-4 rounded hover:bg-gray-700">
                Refer and Earn
              </Link>
            </li>
            <li>
              <Link href="/dashboard/request-delivery" className="block py-2 px-4 rounded hover:bg-gray-700">
                Request Delivery
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-4 rounded bg-red-600 hover:bg-red-700 mt-4"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64"> {/* Added ml-64 to offset for fixed sidebar */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
