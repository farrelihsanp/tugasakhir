'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStoreContext } from '@/utility/StoreContext';
import {
  FaStore,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
} from 'react-icons/fa';
import { JSX } from 'react';

export default function DashboardPage() {
  const { user, storeStoreAdmin } = useStoreContext();

  const roleComponents: { [key: string]: JSX.Element } = {
    CUSTOMERS: (
      <div className="bg-gradient-to-r min-h-screen flex flex-col items-center justify-start py-16 px-10">
        <h1 className="text-4xl font-bold text-black mb-6 text-center">
          Welcome, {user?.name}!
        </h1>
        <div className="mb-12 relative w-60 h-60">
          {user?.profileImage && (
            <Image
              src={user.profileImage}
              alt="Profile Photo"
              fill
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          <Link
            href={`/dashboard/${user?.username}/my-cart`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">My Cart</div>
              <p className="text-white text-sm mb-4">
                View items you’ve added to your shopping cart.
              </p>
              <FaShoppingCart className="text-3xl" />
            </div>
          </Link>

          <Link
            href={`/dashboard/${user?.username}/my-orders`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">My Orders</div>
              <p className="text-white text-sm mb-4">
                Track your orders and view purchase history.
              </p>
              <FaBoxOpen className="text-3xl" />
            </div>
          </Link>

          <Link
            href={`/dashboard/${user?.username}/my-vouchers`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">My Vouchers</div>
              <p className="text-white text-sm mb-4">
                View and claim your available vouchers.
              </p>
              <FaStore className="text-3xl" />
            </div>
          </Link>
        </div>
      </div>
    ),

    STOREADMIN: (
      <div className=" min-h-screen flex flex-col items-center justify-start py-16 px-10">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-tertiar text-center">
            Welcome Admin, {user?.name}!
          </h1>
          <p className="text-tertiary text-center text-lg mt-10">
            responsibility in store
          </p>
          <p className="mb-20 text-2xl font-bold">{storeStoreAdmin?.name}</p>
        </div>

        <div className="mb-12 relative w-60 h-60">
          {user?.profileImage && (
            <Image
              src={user.profileImage}
              alt="Profile Photo"
              fill
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          <Link
            href={`/dashboard/${user?.username}/view-orders`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">View Orders</div>
              <p className="text-sm mb-4">Monitor all customer orders here.</p>
              <FaStore className="text-3xl" />
            </div>
          </Link>
          <Link
            href={`/${storeStoreAdmin?.slug}/product`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">View Products</div>
              <p className="text-sm mb-4">Manage your product listings.</p>
              <FaBoxOpen className="text-3xl" />
            </div>
          </Link>
          <Link
            href={`/reports-stock/${storeStoreAdmin?.slug}`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">Report Analysis</div>
              <p className="text-sm mb-4">Analyze sales and trends.</p>
              <FaChartLine className="text-3xl" />
            </div>
          </Link>
          <Link
            href={`/dashboard/${user?.username}/vouchers`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">Voucher</div>
              <p className="text-sm mb-4">Manage discount vouchers.</p>
              <FaShoppingCart className="text-3xl" />
            </div>
          </Link>
        </div>
      </div>
    ),

    SUPERADMIN: (
      <div className=" min-h-screen flex flex-col items-center justify-start py-16 px-10">
        <h1 className="text-4xl font-bold text-black mb-6 text-center">
          Welcome! {user?.name}
        </h1>
        <div className="mb-12 relative w-60 h-60">
          {user?.profileImage && (
            <Image
              src={user.profileImage}
              alt="Profile Photo"
              fill
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          <Link
            href={`/dashboard/${user?.username}/manage-store-admin`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">Store Admin</div>
              <p className="text-sm mb-4">Add or update store admins.</p>
              <FaUsers className="text-3xl" />
            </div>
          </Link>
          <Link
            href={`/dashboard/${user?.username}/view-user`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="text-2xl font-bold mb-2">Users</div>
              <p className="text-sm mb-4">Monitor all user accounts.</p>
              <FaUsers className="text-3xl" />
            </div>
          </Link>
          <Link
            href={`/dashboard/${user?.username}/manage-store`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="text-2xl font-bold mb-2">Stores</div>
            <p className="text-sm mb-4">Create or manage store data.</p>
            <FaStore className="text-3xl" />
          </Link>
          <Link
            href={`/dashboard/${user?.username}/manage-products`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="text-2xl font-bold mb-2">Products</div>
            <p className="text-sm mb-4">
              Full access to all product management.
            </p>
            <FaBoxOpen className="text-3xl" />
          </Link>
          <Link
            href={`/reports-stock`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="text-2xl font-bold mb-2">Reports</div>
            <p className="text-sm mb-4">Review data trends and performance.</p>
            <FaChartLine className="text-3xl" />
          </Link>
          <Link
            href={`/dashboard/${user?.username}/discount-manager`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="text-2xl font-bold mb-2">Discount Manager</div>
            <p className="text-sm mb-4">
              Control active discounts and campaigns.
            </p>
            <FaChartLine className="text-3xl" />
          </Link>
          <Link
            href={`/dashboard/${user?.username}/view-orders-costumers`}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            <div className="text-2xl font-bold mb-2">View Orders</div>
            <p className="text-sm mb-4">View order status all stores.</p>
            <FaStore className="text-3xl" />
          </Link>
        </div>
      </div>
    ),

    UNSET: (
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 min-h-screen flex flex-col items-center justify-center py-10">
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
