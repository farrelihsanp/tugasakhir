'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStoreContext } from '@/utility/StoreContext';
import { User } from '@/types/types';
import { toast } from 'react-toastify';

const ManageStoreAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useStoreContext();

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/admins/getAllAdmins`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/admins/delete/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.ok) {
      setAdmins(admins.filter((admin) => admin.id !== id));
      toast.success('Admin deleted successfully');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.error('Failed to delete admin');
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-[75vh] py-12">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">
          Manage Store Admin
        </h1>
        {error && (
          <div className="text-red-500 mb-4 p-4 rounded-md bg-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin border-t-4 border-primary w-16 h-16 border-solid rounded-full border-t-transparent"></div>
            <span className="ml-4 text-lg text-gray-600">Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Username</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Store</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(admins) && admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b hover:bg-gray-50 transition duration-300"
                    >
                      <td className="py-3 px-6">{admin.name}</td>
                      <td className="py-3 px-6">{admin.username}</td>
                      <td className="py-3 px-6">{admin.email}</td>
                      <td className="py-3 px-6">
                        {admin.StoreUser?.[0]?.store?.name}
                      </td>
                      <td className="py-3 px-6">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 space-x-2">
                        <Link
                          href={`${process.env.NEXT_PUBLIC_WEB_DOMAIN}/dashboard/${user?.username}/edit-admin/${admin.id}`}
                          className="bg-primary text-white py-2 px-4 rounded-md"
                        >
                          Edit
                        </Link>
                        <button
                          className="bg-primary text-white py-2 px-4 rounded-md"
                          onClick={() => handleDelete(admin.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-3 px-4">
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-6">
          <Link
            href={`/dashboard/${user?.username}/assign-store-admin`}
            className="bg-primary text-white py-3 px-6 rounded-lg shadow-md hover:scale-105 transition duration-300 text-lg font-semibold text-center"
          >
            Assign Store Admin
          </Link>
          <Link
            href={`/dashboard/${user?.username}/create-admin`}
            className="bg-primary text-white py-3 px-6 rounded-lg shadow-md hover:scale-105 transition duration-300 text-lg font-semibold text-center"
          >
            Create Admin
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ManageStoreAdmin;
