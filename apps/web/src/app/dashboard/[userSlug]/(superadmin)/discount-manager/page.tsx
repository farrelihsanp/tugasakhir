'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Discount } from '@/types/types';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/all-discounts`,
        {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await res.json();
      if (json.ok) {
        setDiscounts(json.data);
      } else {
        toast.error(json.message);
      }
    } catch (error: unknown) {
      console.error('Error fetching discounts:', error);
      toast.error('Gagal mengambil data diskon.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/${isActive ? 'deactivate' : 'activate'}/${id}`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      );
      const json = await res.json();
      if (json.ok) {
        toast.success(json.message);
        fetchDiscounts();
      } else {
        toast.error(json.message);
      }
    } catch (error: unknown) {
      console.error('Error toggling discount:', error);
      toast.error('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Daftar Diskon</h1>
        <div className="flex gap-2">
          <Link
            href="discount-reports"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Discount Reports
          </Link>
          <Link
            href="create-discount"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create Discount
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Tipe</th>
                <th className="px-4 py-2">Nilai</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{discount.id}</td>
                  <td className="px-4 py-2">{discount.name}</td>
                  <td className="px-4 py-2">{discount.type}</td>
                  <td className="px-4 py-2">{discount.value}</td>
                  <td className="px-4 py-2">
                    {discount.isActive ? (
                      <span className="text-green-600 font-medium">Aktif</span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Tidak Aktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        router.push(`discount-manager/${discount.id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() =>
                        handleToggleActive(discount.id, discount.isActive)
                      }
                      className={`px-2 py-1 rounded text-white ${discount.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {discount.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
