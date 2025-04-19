'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

// DONE
type Voucher = {
  id: number;
  code: string;
  voucherImage: string;
  name: string;
  description: string;
  voucherCategory: string;
  voucherType: string;
  value: number;
  minPurchase: number;
  maxPriceReduction: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  stockVoucherAdmin: number;
};

export default function VouchersStore() {
  const [voucher, setVoucher] = useState<Voucher | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { voucherId } = useParams();

  useEffect(() => {
    const fetchVoucher = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/my-voucher/${voucherId}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        setVoucher(json.data);
      } catch (err: unknown) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    if (voucherId) {
      fetchVoucher();
    }
  }, [voucherId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading vouchers...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {voucher ? (
          <>
            <h1 className="text-center text-4xl font-semibold text-gray-800">
              {voucher.name}
            </h1>
            <p className="text-center text-lg text-gray-500 mt-2">
              {voucher.description}
            </p>
            <div className="flex justify-center mt-6">
              <Image
                src={voucher.voucherImage}
                alt={voucher.name}
                width={350}
                height={350}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="mt-6 space-y-4 text-center">
              <p className="text-xl text-gray-700">
                <strong>Voucher Code:</strong> {voucher.code}
              </p>
              <p className="text-xl text-gray-700">
                <strong>Discount:</strong> {voucher.value}% off
              </p>
              <p className="text-lg text-gray-600 mt-2">
                Valid from {new Date(voucher.startDate).toLocaleDateString()} to{' '}
                {new Date(voucher.endDate).toLocaleDateString()}
              </p>
              <p className="text-lg text-gray-600">
                <strong>Minimum Purchase:</strong> Rp{' '}
                {voucher.minPurchase.toLocaleString()}
              </p>
              <p className="text-lg text-gray-600">
                <strong>Max Price Reduction:</strong> Rp{' '}
                {voucher.maxPriceReduction.toLocaleString()}
              </p>
              <p className="text-lg text-gray-600">
                <strong>Remaining Stock:</strong> {voucher.stockVoucherAdmin}
              </p>
              <p className="text-lg mt-4">
                {voucher.isActive ? (
                  <span className="text-green-500 font-medium">Active</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactive</span>
                )}
              </p>
            </div>
          </>
        ) : (
          <p className="text-center text-red-500 text-xl">Voucher not found</p>
        )}
      </div>
    </section>
  );
}
