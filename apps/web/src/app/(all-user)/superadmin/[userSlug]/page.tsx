'use client';

import Link from 'next/link';
import React from 'react';
import { useStoreContext } from '@/utility/StoreContext';
import {
  FaStore,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
} from 'react-icons/fa';

export default function SuperAdminPage() {
  const { user } = useStoreContext();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-10">
        Super Admin Dashboard
      </h1>

      <div className="space-y-6 w-full max-w-lg">
        <div>
          <Link
            href={`/superadmin/${user?.username}/manage-store-admin`}
            className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
          >
            <FaStore className="mr-4" />
            <span>Manage Store Admin</span>
          </Link>
        </div>

        <div>
          <Link
            href={`/superadmin/${user?.username}/view-user`}
            className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
          >
            <FaUsers className="mr-4" />
            <span>View User</span>
          </Link>
        </div>

        <div>
          <Link
            href={`/superadmin/${user?.username}/manage-store`}
            className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
          >
            <FaStore className="mr-4" />
            <span>Manage Store</span>
          </Link>
        </div>

        <div>
          <Link
            href={`/superadmin/${user?.username}/manage-products`}
            className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
          >
            <FaBoxOpen className="mr-4" />
            <span>Manage Product</span>
          </Link>
        </div>

        <div>
          <Link
            href={`/superadmin/${user?.username}/view-order`}
            className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
          >
            <FaShoppingCart className="mr-4" />
            <span>View Order</span>
          </Link>
        </div>

        <div>
          <Link
            href={`/superadmin/${user?.username}/report-analysis`}
            className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
          >
            <FaChartLine className="mr-4" />
            <span>Report & Analysis</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
