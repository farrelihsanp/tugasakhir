'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Voucher } from '@prisma/client';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface HeroProps {
  heightClass?: string;
}

export default function Hero({ heightClass = 'h-[50vh]' }: HeroProps) {
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
      } catch (error) {
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

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % vouchers.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (current) => (current - 1 + vouchers.length) % vouchers.length,
    );
  };

  return (
    <section className={`relative w-full ${heightClass} overflow-hidden mt-20`}>
      {vouchers.length > 0 && (
        <div className="relative w-full h-full">
          {vouchers[currentIndex].voucherImage && (
            <Image
              src={vouchers[currentIndex].voucherImage}
              fill
              alt={vouchers[currentIndex].name}
              className="object-cover w-full h-full cursor-pointer"
              priority
            />
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[150px] md:text-[80px] text-white font-bold text-stroke-2 text-stroke-gray-900">
              Quickmart
            </p>
          </div>

          <div className="absolute bottom-4 left-4 md:left-10 p-5 rounded-md max-w-md bg-white/20 backdrop-blur-xl">
            <h2 className="text-9xl md:text-3xl font-bold mb-2 text-black">
              {vouchers[currentIndex].name}
            </h2>
            <p className="text-black text-sm mb-4">
              {vouchers[currentIndex].description}
            </p>
            <div className="inline-block bg-yellow-400 text-sm font-medium text-gray-900 px-2 py-1 rounded mb-2">
              Expired At:{' '}
              {new Date(vouchers[currentIndex].endDate).toLocaleDateString(
                'id-ID',
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                },
              )}
            </div>
            <div>
              <Link
                href={`/vouchers-store`}
                className="bg-primary text-sm font-medium text-quaternary px-2 py-1 rounded"
              >
                Detail Voucher
              </Link>
            </div>
          </div>

          {/* Tombol navigasi bawah tengah */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="bg-white p-3 rounded-full shadow hover:scale-110 transition"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className="bg-white p-3 rounded-full shadow hover:scale-110 transition"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
