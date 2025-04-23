'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStoreContext } from '@/utility/StoreContext';
import {
  FaMapMarkerAlt,
  // FaSearch,
  FaShoppingCart,
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaTicketAlt,
  FaThList,
  FaStore,
} from 'react-icons/fa';

interface LocationResult {
  formatted: string;
}

import { convertCoordinatesToAddress } from '@/utility/geocode';

export default function Navbar() {
  const { user } = useStoreContext();

  const [locationUser, setLocationUser] = useState<{
    results: LocationResult[];
  } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { nearestStore } = useStoreContext();

  const currentLocationUser = locationUser?.results[0].formatted;

  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingUser(true);
      window.navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const address = await convertCoordinatesToAddress(
              latitude,
              longitude,
            );
            setLocationUser(address);
            setLoadingUser(false);
          } catch (error) {
            console.error('Error fetching location:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        },
      );
    };
    fetchLocation();
  }, []);

  const LogoWebsite = () => (
    <Link href="/">
      <Image
        src="https://res.cloudinary.com/dm1cnsldc/image/upload/v1745037127/QUICKMART_cd0cpb.png"
        width={150}
        height={75}
        alt="Landing Page Logo"
      />
    </Link>
  );

  // const SearchBar = () => (
  //   <div className="flex items-center w-full max-w-md border rounded px-3 py-1">
  //     <FaSearch className="text-gray-400 mr-2" />
  //     <input
  //       type="text"
  //       placeholder="Search for products"
  //       className="w-full focus:outline-none"
  //     />
  //   </div>
  // );

  const LocationButton = () => (
    <button className="flex items-center border px-3 py-1 rounded hover:bg-gray-100 cursor-pointer transition-all duration-200 group relative">
      <FaMapMarkerAlt className=" text-gray-600" />
      <span className="text-sm text-center">
        <span className="group-hover:opacity-100 opacity-0 group-hover:visible invisible transition-all duration-300 absolute -top-0.5 left-1/2 transform translate-x-7 bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
          {currentLocationUser}
        </span>
      </span>
    </button>
  );

  const UserSection = () => (
    <div className="flex items-center gap-3 ml-4">
      <p className="text-sm text-gray-700">Hi, {user?.name}</p>
      <Link href={`/profile/${user?.username}`} className="relative w-10 h-10">
        {user?.profileImage && (
          <Image
            src={user.profileImage}
            alt="profile"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        )}
      </Link>
    </div>
  );

  const RoleDropdown = () => (
    <div className="relative group ml-4">
      <button className="text-white bg-tertiary px-2 py-1 rounded hover:opacity-120 transition all duration-200">
        Menu
      </button>
      <div className="absolute top-full left-0 z-10 hidden group-hover:block bg-white shadow-lg rounded p-3 space-y-2 w-52">
        <Link
          href={`/dashboard/${user?.username}`}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-700"
        >
          <FaTachometerAlt /> Dashboard
        </Link>

        {user?.role === 'CUSTOMERS' && (
          <>
            <Link
              href={`/dashboard/${user.username}/my-cart`}
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaShoppingCart /> My Cart
            </Link>
            <Link
              href={`/dashboard/${user.username}/my-orders`}
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaClipboardList /> My Orders
            </Link>
            <Link
              href={`/dashboard/${user.username}/my-vouchers`}
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaTicketAlt /> My Vouchers
            </Link>
            <Link
              href={`/${nearestStore?.slug}/product`}
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaBoxOpen /> Product
            </Link>
            <Link
              href="/category"
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaThList /> Category
            </Link>
            <Link
              href="/vouchers-store"
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaStore /> Vouchers Store
            </Link>
          </>
        )}

        {user?.role === 'STOREADMIN' && (
          <>
            <Link
              href={`/${nearestStore?.slug}/product`}
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaBoxOpen /> Products
            </Link>
          </>
        )}

        {user?.role === 'SUPERADMIN' && (
          <>
            <Link
              href={`/${nearestStore?.slug}/product`}
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaBoxOpen /> Product
            </Link>
            <Link
              href="/category"
              className="flex items-center gap-2 text-sm hover:text-green-700"
            >
              <FaThList /> Category
            </Link>
          </>
        )}
      </div>
    </div>
  );

  if (loadingUser) {
    return (
      <nav className="bg-white border-b shadow-sm py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoWebsite />
        </div>
        <div className="flex items-center">Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b shadow-sm py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LogoWebsite />
        {/* <SearchBar /> */}
        <LocationButton />
      </div>

      <div className="flex items-center">
        {user?.role === 'SUPERADMIN' ||
        user?.role === 'STOREADMIN' ||
        user?.role === 'CUSTOMERS' ? (
          <div className="flex items-center">
            <RoleDropdown />
            <UserSection />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="category"
              className="text-sm text-gray-700 hover:text-green-700"
            >
              Category
            </Link>
            <Link
              href={`/${nearestStore?.slug}/product`}
              className="text-sm text-gray-700 hover:text-green-700"
            >
              Products
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-gray-700 hover:text-green-700"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-gray-700 hover:text-green-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
