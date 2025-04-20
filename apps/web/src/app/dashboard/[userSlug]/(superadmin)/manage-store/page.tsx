'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store } from '@prisma/client';

type StoreData = Store;

const ManageStoresPage: React.FC = () => {
  const [stores, setStores] = useState<StoreData[]>([]);
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
          const data: StoreData[] = await response.json();
          setStores(data);
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

  const deleteStore = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/stores/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (response.ok) {
          setStores(stores.filter((store) => store.id !== id));
        } else {
          setError('Failed to delete store');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error deleting store: ${err.message}`);
        }
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center  py-8">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Manage Stores
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
                        href={`manage-store/${store.id}`}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                    <div>
                      <Link
                        href={`manage-store/edit-store/${store.id}`}
                        className="text-green-500 hover:text-green-700 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={() => deleteStore(store.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
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
