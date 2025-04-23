'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Voucher } from '@/types/types';

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
    <section className="h-[75vh] flex flex-col items-center justify-center py-12">
      <div className=" mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-semibold text-tertiary">
            Vouchers Store
          </h2>
          <p className="mt-2 text-lg text-tertiary">
            Browse and grab your vouchers now!
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vouchers.length > 0 &&
            vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 bg-primary relative overflow-hidden"
              >
                <Link href={`/vouchers-store/${voucher.id}`}>
                  <div className="relative h-48 w-full">
                    {voucher.voucherImage && (
                      <Image
                        src={voucher.voucherImage.trim()}
                        alt={voucher.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </Link>
                <div className="p-6 text-center text-quaternary relative z-10">
                  <p className="text-xs tracking-widest font-bold text-quaternary mb-2 break-words whitespace-normal">
                    GIFT FOR YOU
                  </p>
                  <h3
                    className="text-3xl font-extrabold text-quaternary mb-1 truncate"
                    title={voucher.code}
                  >
                    {voucher.code}
                  </h3>
                  <h4 className="text-xl font-semibold text-quaternary break-words whitespace-normal">
                    VOUCHER
                  </h4>
                </div>

                {/* Strip putih & barcode di kanan */}
                <div className="absolute right-0 top-0 h-full w-6 bg-quaternary flex items-center justify-center">
                  <div className="rotate-90 text-[8px] tracking-widest text-tertiary">
                    0123456789010
                  </div>
                </div>

                {/* Half-circle cutout kiri dan kanan */}
                <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full z-10" />
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full z-10" />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
