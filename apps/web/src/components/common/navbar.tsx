'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutModal from './logout';
import { useStoreContext } from '../../utility/StoreContext';

interface UserInfo {
  id: number;
  name: string;
  username: string;
  role: 'CUSTOMERS' | 'STOREADMIN' | 'SUPERADMIN' | null;
  profileImage?: string;
}

export default function Navbar() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { nearestStore } = useStoreContext();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        setLoadingUser(false);
        return;
      }
      const data = await res.json();
      setUser({
        id: data.id,
        name: data.name,
        username: data.username,
        role: data.role,
        profileImage: data.profileImage,
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoadingUser(false);
    }
  }

  function handleLogoutSuccess() {
    setUser(null);
    router.refresh();
  }

  function handleLogoutClick() {
    setShowLogoutModal(true);
  }

  function handleCloseModal() {
    setShowLogoutModal(false);
  }

  if (loadingUser) {
    return (
      <section>
        <div className="RightContainer flex justify-center items-center mx-5 gap-3">
          <p className="text-white">Checking user...</p>
        </div>
      </section>
    );
  }

  function LogoWebsite() {
    return (
      <div className="mx-3">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dm1cnsldc/image/upload/v1739627004/automobile_gm4zkr.jpg"
            width={200}
            height={200}
            alt="Landing Page Photo"
            className="w-20 h-auto"
          />
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <section>
        <div className=" bg-primary py-3 flex items-center justify-between ">
          <LogoWebsite />
          <div className="RightContainer flex justify-center items-center mx-5 gap-3">
            <div className="mr-5">
              <Link href="#">
                <Image src="/cart2.svg" alt="cart" width={20} height={20} />
              </Link>
            </div>
            <div>
              <Link href="/auth/login" className="text-white">
                Login
              </Link>
            </div>
            <div>
              <Link href="/auth/register" className="text-white">
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const roleComponents = {
    CUSTOMERS: (
      <section>
        <div className=" bg-blue-600 py-3 flex items-center justify-between ">
          <LogoWebsite />
          <div className="RightContainer flex justify-center items-center mx-5 gap-3">
            <div>
              <Link
                href={`/dashboard/${user?.username}/my-cart`}
                className="text-white"
              >
                Cart
              </Link>
            </div>
            <div>
              <Link
                href={`/dashboard/${user?.username}`}
                className="text-white"
              >
                Dashboard
              </Link>
            </div>
            <div>
              <Link
                href={`/dashboard/${user?.username}/my-vouchers`}
                className="text-white"
              >
                My Voucher
              </Link>
            </div>
            <div>
              <Link
                href={`/dashboard/${user?.username}/my-orders`}
                className="text-white"
              >
                Order
              </Link>
            </div>
            <div>
              <Link
                href={`/${nearestStore?.slug}/product`}
                className="text-white"
              >
                Product
              </Link>
            </div>
            <div>
              <Link href="/category" className="text-white">
                Category
              </Link>
            </div>
            <div className="relative w-10 h-10">
              <Link href={`/${user.username}/my-profile`}>
                {user.profileImage && (
                  <Image
                    src={user.profileImage}
                    alt="photo profile"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                )}
              </Link>
            </div>

            <div>
              <p>Hi! {user.name}</p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="bg-white text-red-900 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    ),
    STOREADMIN: (
      <section>
        <div className=" bg-blue-600 py-3 flex items-center justify-between ">
          <LogoWebsite />
          <div className="RightContainer flex justify-center items-center mx-5 gap-3">
            <div className="relative w-10 h-10">
              <Link href="#">
                {user.profileImage && (
                  <Image
                    src={user.profileImage}
                    alt="photo profile"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                )}
              </Link>
            </div>
            <div>
              <p>Hi! {user.name}</p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="bg-white text-red-900 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    ),
    SUPERADMIN: (
      <section>
        <div className=" bg-blue-600 py-3 flex items-center justify-between ">
          <LogoWebsite />
          <div className="RightContainer flex justify-center items-center mx-5 gap-3">
            <div>
              <Link
                href={`/dashboard/superadmin/${user?.username}`}
                className="text-white"
              >
                Dashboard
              </Link>
            </div>
            <div className="relative w-10 h-10">
              <Link href={`/${user?.username}/my-profile`}>
                {user.profileImage && (
                  <Image
                    src={user.profileImage}
                    alt="photo profile"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                )}
              </Link>
            </div>
            <div>
              <p>Hi! {user.name}</p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="bg-white text-red-900 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <>
      {roleComponents[user.role!]}
      {showLogoutModal && (
        <LogoutModal
          onClose={handleCloseModal}
          onLogoutSuccess={handleLogoutSuccess}
        />
      )}
    </>
  );
}
