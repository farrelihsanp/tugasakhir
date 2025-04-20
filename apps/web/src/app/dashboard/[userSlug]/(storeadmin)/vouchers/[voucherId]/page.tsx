'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Voucher } from '@/types/types';

export default function VoucherDetailPage() {
  const { voucherId } = useParams();
  const [voucher, setVoucher] = useState<Voucher | undefined>(undefined);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/my-voucher/${voucherId}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setVoucher(data.data);
      } catch (error) {
        console.error('Error fetching voucher:', error);
      }
    };

    fetchVoucher();
  }, [voucherId]);

  return (
    <section className="min-h-screen flex justify-center items-center p-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {voucher ? (
          <div className="p-6">
            <div className="flex justify-center mb-4">
              {voucher.voucherImage.trim() && (
                <Image
                  src={voucher.voucherImage.trim()}
                  width={1000}
                  height={1000}
                  alt={voucher.name}
                  className="object-cover w-64 h-64 rounded-full"
                />
              )}
            </div>
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
              {voucher.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4 text-center">
              {voucher.description}
            </p>
            <div className="flex justify-between items-center border-t pt-4">
              <h2 className="text-xl font-medium text-gray-800">
                Voucher Code:
              </h2>
              <p className="text-lg text-gray-700">{voucher.code}</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-800">
                  Max Price Reduction:
                </h2>
                <p className="text-lg text-gray-700">
                  {voucher.maxPriceReduction}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-xl font-medium text-gray-800">
                  Min Purchase:
                </h2>
                <p className="text-lg text-gray-700">{voucher.minPurchase}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-xl font-medium text-gray-800">
                  Start Date:
                </h2>
                <p className="text-lg text-gray-700">{voucher.startDate}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-xl font-medium text-gray-800">End Date:</h2>
                <p className="text-lg text-gray-700">{voucher.endDate}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-xl font-medium text-gray-800">
                  Voucher Value:
                </h2>
                <p className="text-lg text-gray-700">{voucher.value}%</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600">
            Loading voucher details...
          </p>
        )}
      </div>
    </section>
  );
}
