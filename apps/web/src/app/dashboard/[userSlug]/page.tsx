'use client';

import Link from 'next/link';
import { useStoreContext } from '@/utility/StoreContext';
import {
  FaStore,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
} from 'react-icons/fa';

export default function DashboardPage() {
  const { user, storeStoreAdmin } = useStoreContext();

  const roleComponents = {
    CUSTOMERS: (
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-10">
          Customer Dashboard
        </h1>
        <div className="space-y-6 w-full max-w-lg">
          <div>
            <Link
              href={`/dashboard/${user?.username}/my-cart`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaShoppingCart className="mr-4" />
              <span>My Cart</span>
            </Link>
          </div>
          <div>
            <Link
              href={`/dashboard/${user?.username}/my-orders`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaBoxOpen className="mr-4" />
              <span>My Orders</span>
            </Link>
          </div>
          <div>
            <Link
              href={`/dashboard/${user?.username}/my-vouchers`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaStore className="mr-4" />
              <span>My Vouchers</span>
            </Link>
          </div>
        </div>
      </div>
    ),
    STOREADMIN: (
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-10">
          Store Admin Dashboard
        </h1>
        <div className="space-y-6 w-full max-w-lg">
          <div>
            <Link
              href={`/dashboard/${user?.username}/view-orders`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaStore className="mr-4" />
              <span>View Orders</span>
            </Link>
          </div>
          <div>
            <Link
              href={`/${storeStoreAdmin?.slug}/product`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaBoxOpen className="mr-4" />
              <span>View Products</span>
            </Link>
          </div>
          <div>
            <Link
              href={`/dashboard/${user?.username}/reports-analysis`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaShoppingCart className="mr-4" />
              <span>Report Analysis</span>
            </Link>
          </div>
          <div>
            <Link
              href={`/dashboard/${user?.username}/vouchers`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaShoppingCart className="mr-4" />
              <span>Voucher</span>
            </Link>
          </div>
        </div>
      </div>
    ),
    SUPERADMIN: (
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-10">
          Super Admin Dashboard
        </h1>
        <div className="space-y-6 w-full max-w-lg">
          <div>
            <Link
              href={`/dashboard/superadmin/${user?.username}/manage-store-admin`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaStore className="mr-4" />
              <span>Manage Store Admin</span>
            </Link>
          </div>
          <div>
            <Link
              href={`/dashboard/superadmin/${user?.username}/view-user`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaUsers className="mr-4" />
              <span>View Users</span>
            </Link>
          </div>
          <div>
            <Link
              href={`/dashboard/superadmin/${user?.username}/manage-store`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaStore className="mr-4" />
              <span>Manage Store</span>
            </Link>
          </div>
          <div>
            <Link
              href={`/dashboard/superadmin/${user?.username}/report-analysis`}
              className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition duration-300 text-lg font-semibold"
            >
              <FaChartLine className="mr-4" />
              <span>Reports & Analysis</span>
            </Link>
          </div>
        </div>
      </div>
    ),
    UNSET: (
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-10">Unknown Role</h1>
        <p className="text-lg text-white">
          It looks like your role is not defined yet.
        </p>
      </div>
    ),
  };

  if (user?.role && roleComponents[user.role]) {
    return roleComponents[user.role];
  } else {
    return <div>Unknown Role</div>;
  }
}
