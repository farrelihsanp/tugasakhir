'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store } from '@prisma/client';
import { useStoreContext } from '@/utility/StoreContext';
import { useRouter } from 'next/navigation';

const ManageStoresPage: React.FC = () => {
  const { user } = useStoreContext();
  const router = useRouter();

  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/stores', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

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
  }, [router, user?.role]);

  return (
    <section className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Stocks Report
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
            {Array.isArray(stores) && stores.length > 0 ? (
              stores.map((store) => (
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
                          href={`/reports-stock/${store.slug}`}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No stores available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-6 text-center">
          <Link href="manage-store/create-store">
            <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Create Store
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ManageStoresPage;
