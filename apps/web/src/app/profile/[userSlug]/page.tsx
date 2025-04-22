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
    <section className=" min-h-screen flex flex-col items-center justify-center py-10">
      <div
        id="container"
        className="mx-auto w-full sm:w-96 p-8 bg-white rounded-2xl shadow-xl border-1 max-w-2xl"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-60 h-60 mb-4">
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {user?.name}
          </h1>
        </div>
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <div className="flex items-center">
            <Image
              src="/username.svg"
              alt="Username Icon"
              width={20}
              height={20}
              className="mr-4"
            />
            <span className="text-gray-700">{user?.username}</span>
          </div>
          <div className="flex items-center">
            <Image
              src="/mail.svg"
              alt="Email Icon"
              width={20}
              height={20}
              className="mr-4"
            />
            <span className="text-gray-700">{user?.email}</span>
          </div>
          <div className="flex items-center">
            <Image
              src="/date.svg"
              alt="Date Icon"
              width={20}
              height={20}
              className="mr-4"
            />
            <span className="text-gray-700">
              {user?.createdAt && (
                <span className="text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center">
            <Image
              src="/role.svg"
              alt="Role Icon"
              width={20}
              height={20}
              className="mr-4"
            />
            <span className="text-gray-700">{user?.role}</span>
          </div>
        </div>
      </div>
      <div id="container-2" className="mt-8 flex justify-center space-x-6">
        <div>
          <Link href={`/profile/${user?.username}/edit-profile`}>
            <button className="text-blue-600 border-2 border-blue-600 py-2 px-6 rounded-lg transition-colors duration-300 hover:bg-blue-600 hover:text-white">
              Edit Profile
            </button>
          </Link>
        </div>
        {user?.role === 'CUSTOMERS' && (
          <div>
            <Link href={`/profile/${user?.username}/my-addresses`}>
              <button className="text-green-600 border-2 border-green-600 py-2 px-6 rounded-lg transition-colors duration-300 hover:bg-green-600 hover:text-white">
                My Addresses
              </button>
            </Link>
          </div>
        )}
        <div>
          <button
            onClick={handleLogoutClick}
            className="text-red-600 border-2 border-red-600 py-2 px-6 rounded-lg transition-colors duration-300 hover:bg-red-600 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
