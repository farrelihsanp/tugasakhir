'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User } from '@prisma/client';
import Image from 'next/image';
import { format } from 'date-fns';

const UserDetailPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/users/${id}`,
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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 py-16 px-4">
      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-1/3 p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-xl text-teal-500">{user.role}</p>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 p-2 bg-red-100 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex justify-center mb-6">
          <Image
            src={user.profileImage || '/default-avatar.jpg'}
            alt={user.name}
            width={160}
            height={160}
            className="rounded-full border-4 border-teal-500"
          />
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-lg text-gray-700">
            <strong className="text-teal-600">Email:</strong> {user.email}
          </p>
          <p className="text-lg text-gray-700">
            <strong className="text-teal-600">username:</strong> {user.username}
          </p>
          <p className="text-lg text-gray-700">
            <strong className="text-teal-600">Referral Number:</strong>{' '}
            {user.referralNumber}
          </p>
          <p className="text-lg text-gray-700">
            <strong className="text-teal-600">Created At:</strong>{' '}
            {format(user.createdAt, 'yyyy-MM-dd HH:mm:ss')}
          </p>
        </div>

        <div className="text-center">
          <button className="px-6 py-3 bg-teal-500 text-white rounded-lg text-lg font-semibold transition-transform duration-200 hover:scale-105">
            Contact User
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserDetailPage;
