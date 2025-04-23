'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { User } from '@/types/types';

const UserDetailPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/users/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
        } else {
          setError('User not found');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error fetching user: ${err.message}`);
        }
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col md:flex-row">
        <div className="flex-shrink-0 md:w-1/3 mb-6 md:mb-0">
          <Image
            src={user.profileImage || '/default-avatar.jpg'}
            alt={user.name}
            width={200}
            height={200}
            className="rounded-lg border-4 object-cover"
          />
        </div>

        {/* User Data Section */}
        <div className="md:w-2/3 ml-0 md:ml-6 space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-xl text-teal-500">
              {user.role || 'Product Designer'}
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-center mb-4 p-2 bg-red-100 rounded-lg">
              {error}
            </p>
          )}

          {/* User Info */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-lg text-gray-700 font-semibold">Email:</p>
              <p className="text-lg text-gray-700">
                {user.email || 'example@example.com'}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg text-gray-700 font-semibold">Username:</p>
              <p className="text-lg text-gray-700">
                {user.username || 'jeremyrose92'}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg text-gray-700 font-semibold">
                Referral Number:
              </p>
              <p className="text-lg text-gray-700">
                {user.referralNumber || 'N/A'}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg text-gray-700 font-semibold">Created At:</p>
              <p className="text-lg text-gray-700">
                {user.createdAt
                  ? format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm:ss')
                  : '2025-01-01 00:00:00'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDetailPage;
