'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Voucher = {
  id: number;
  name: string;
  description: string;
  code: string;
  voucherType: 'PERCENTAGE' | 'AMOUNT';
  value: number;
  startDate: string;
  endDate: string;
  stock: number;
  isActive: boolean;
  voucherImage: string;
};

export default function MyVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/my-voucher', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        setVouchers(json.data || []);
      } catch (err: unknown) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  if (loading) return <p>Loading vouchers...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!vouchers.length) return <p>No vouchers found.</p>;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Vouchers</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <Image
              src={voucher.voucherImage}
              alt={voucher.name}
              width={500}
              height={500}
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <h2 className="text-xl font-semibold">{voucher.name}</h2>
            <p className="text-gray-600 text-sm">{voucher.description}</p>
            <p className="mt-2 text-sm">
              Code: <span className="font-mono">{voucher.code}</span>
            </p>
            <p className="text-sm">
              Type: <strong>{voucher.voucherType}</strong>
            </p>
            <p className="text-sm">Value: {voucher.value}</p>
            <p className="text-sm">Stock: {voucher.stock}</p>
            <p className="text-sm">
              Valid: {new Date(voucher.startDate).toLocaleDateString()} -{' '}
              {new Date(voucher.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm">
              Status:{' '}
              <span
                className={voucher.isActive ? 'text-green-600' : 'text-red-600'}
              >
                {voucher.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
