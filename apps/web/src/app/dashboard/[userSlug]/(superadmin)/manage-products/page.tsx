'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store } from '@/types/types';

const ManageStoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/stores`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (response.ok) {
          const data = await response.json();
          setStores(data.data);
        } else {
          setError('Failed to fetch stores');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error fetching stores: ${err.message}`);
        }
      }
    };

    fetchStores();
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Manage Product
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <table className="min-w-full table-auto border-separate border-spacing-0 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Store Name</th>
              <th className="px-6 py-3 text-left">City</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 text-gray-800">
            {stores.map((store) => (
              <tr
                key={store.id}
                className="hover:bg-gray-100 transition-colors duration-300"
              >
                <td className="px-6 py-4">{store.id}</td>
                <td className="px-6 py-4">{store.name}</td>
                <td className="px-6 py-4">{store.city}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-4">
                    <div>
                      <Link
                        href={`manage-products/${store.slug}`}
                        className="text-quaternary bg-primary py-2 px-4 rounded hover:scale-105 transition-all duration-300"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-3 gap-4">
          <div className="mt-6 text-center">
            <Link
              href="manage-products/all-products"
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Product
            </Link>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="manage-products/category"
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Category
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageStoresPage;
