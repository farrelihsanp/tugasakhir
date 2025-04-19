'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStoreContext } from '@/utility/StoreContext';
import { User } from '@prisma/client';

interface Admin extends User {
  StoreUser?: { store: { name: string } }[];
}

const ManageStoreAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useStoreContext();

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/admins/getAllAdmins',
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
      `http://localhost:8000/api/v1/admins/delete/${id}`,
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
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Store Admin
        </h1>
        <div className="flex gap-4 p-2">
          <div>
            <Link
              href={`/dashboard/${user?.username}/assign-store-admin`}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-6"
            >
              Assign Store Admin
            </Link>
          </div>
          <div>
            <Link
              href={`/dashboard/${user?.username}/create-admin`}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-6"
            >
              Create Admin
            </Link>
          </div>
        </div>

        {error && (
          <div className="text-red-500 mb-4 p-4 rounded-md bg-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">Memuat data admin...</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Toko</th>
                  <th className="py-3 px-4 text-left">Dibuat Pada</th>
                  <th className="py-3 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {/* Ensure admins is always an array before mapping */}
                {Array.isArray(admins) && admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{admin.name}</td>
                      <td className="py-3 px-4">{admin.username}</td>
                      <td className="py-3 px-4">{admin.email}</td>
                      <td className="py-3 px-4">
                        {admin.StoreUser?.[0]?.store?.name}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 space-x-2 flex justify-start gap-2">
                        <button
                          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                          onClick={() => handleDelete(admin.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-3 px-4">
                      Tidak ada admin ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageStoreAdmin;
