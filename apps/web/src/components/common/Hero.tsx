'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Voucher } from '@prisma/client';
import Link from 'next/link';

// DONE
export default function Hero() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/all-vouchers',
        );
        if (!response.ok) {
          throw new Error('Failed to fetch vouchers');
        }
        const data = await response.json();
        setVouchers(data.data);
        setLoading(false);
      } catch (error: unknown) {
        console.error('Error fetching vouchers:', error);
        setLoading(false);
        setError('Error fetching vouchers');
        toast.error('Error fetching vouchers');
      }
    };

    fetchVouchers();
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Next button functionality
  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % vouchers.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (current) => (current - 1 + vouchers.length) % vouchers.length,
    );
  };

  return (
    <section className="max-w-7xl mx-auto py-8">
      <div className="relative flex items-center justify-center">
        {vouchers.length > 0 && (
          <div className="relative w-full h-[400px] md:w-[600px] mx-auto">
            <div className="flex overflow-hidden rounded-xl">
              <div className="flex-none w-full h-full relative">
                {/* Previous Button */}
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out z-10"
                  onClick={handlePrev}
                >
                  &lt;
                </button>
                <Link href={`/vouchers-store/${vouchers[currentIndex].code}`}>
                  {vouchers[currentIndex].voucherImage && (
                    <Image
                      src={vouchers[currentIndex].voucherImage}
                      width={2000}
                      height={2000}
                      alt={vouchers[currentIndex].name}
                      className="object-cover w-full h-full rounded-xl transition-transform duration-500 transform hover:scale-105"
                    />
                  )}
                </Link>

                {/* Next Button */}
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-opacity-90 hover:scale-110 transition duration-300 ease-in-out z-10"
                  onClick={handleNext}
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* Voucher Info */}
            <div className="mt-4 text-center text-xl font-semibold">
              {vouchers[currentIndex].name}
            </div>
            <div className="text-center text-lg text-gray-600">
              {vouchers[currentIndex].code}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
