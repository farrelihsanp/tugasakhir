'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// DONE
type Voucher = {
  id: number;
  code: string;
  voucherImage: string;
  name: string;
};

export default function VouchersStore() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/v1/all-vouchers', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        setVouchers(Array.isArray(json.data) ? json.data : []);
      } catch (err: unknown) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 text-xl">Loading vouchers...</p>
    );
  if (error)
    return <p className="text-center text-red-500 text-xl">Error: {error}</p>;

  return (
    <section className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-semibold">Vouchers Store</h2>
          <p className="mt-2 text-lg ">Browse and grab your vouchers now!</p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vouchers.length > 0 &&
            vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative">
                  <Link href={`/vouchers-store/${voucher.id}`}>
                    {voucher.voucherImage && (
                      <Image
                        src={voucher.voucherImage}
                        alt={voucher.name}
                        width={1000}
                        height={1000}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                    )}
                  </Link>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-medium text-gray-800">
                    {voucher.name}
                  </h3>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
