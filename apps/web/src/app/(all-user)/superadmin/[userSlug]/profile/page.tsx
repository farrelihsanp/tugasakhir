'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStoreContext } from '@/utility/StoreContext';

export default function Profile() {
  const { user, handleLogout } = useStoreContext();

  const handleLogoutClick = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogout();
  };

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div
        id="container"
        className="mx-auto w-120 mt-10 p-6 bg-white rounded-xl shadow-md px-10 max-w-3xl"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-60 h-60 mb-5">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user?.name}
          </h1>
        </div>
        <div className="border-t border-gray-200 pt-5">
          <div className="flex items-center mb-4">
            <Image
              src="/username.svg"
              alt="Username Icon"
              width={20}
              height={20}
              className="mr-5"
            />
            <div className="flex flex-col">
              <span className="text-gray-600">{user?.username}</span>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <Image
              src="/mail.svg"
              alt="Email Icon"
              width={20}
              height={20}
              className="mr-5"
            />
            <div className="flex flex-col">
              <span className="text-gray-600">{user?.email}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Image
              src="/date.svg"
              alt="Date Icon"
              width={20}
              height={20}
              className="mr-5"
            />
            <div className="flex flex-col">
              <span className="text-gray-600">1 Januari 2025</span>{' '}
            </div>
          </div>
        </div>
      </div>
      <div id="container-2" className="mt-10 flex justify-center space-x-4">
        <div>
          <Link href={`/superadmin/${user?.username}/edit-profile`}>
            <button className="text-blue-600 border border-blue-600 py-2 px-4 rounded-md hover:bg-blue-600 hover:text-white">
              Edit Profile
            </button>
          </Link>
        </div>
        {/* <div>
          <Link href={`/customer/${user?.username}/my-addresses`}>
            <button className="text-green-600 border border-green-600 py-2 px-4 rounded-md hover:bg-green-600 hover:text-white">
              My Addresses
            </button>
          </Link>
        </div> */}
        <div>
          <button
            onClick={handleLogoutClick}
            className="text-red-600 border border-red-600 py-2 px-4 rounded-md hover:bg-red-600 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
