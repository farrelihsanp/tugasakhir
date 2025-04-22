'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Discount } from '@/types/types';

const DiscountDetailPage = () => {
  const { discountId } = useParams();

  const [discount, setDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiscount = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/get-discount/${discountId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();

        if (data.ok) {
          setDiscount(data.data);
          toast.success('Discount fetched successfully');
        } else {
          toast.error('Discount not found');
        }
      } catch (error: unknown) {
        console.error('Error fetching discount:', error);
        toast.error('An error occurred while fetching the discount');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscount();
  }, [discountId]);

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="text-center p-4 text-xl text-white">Loading...</div>
        ) : discount ? (
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-center text-gray-800">
              {discount.name}
            </h2>
            <div className="flex justify-between items-center mt-4">
              <span className="text-2xl font-bold text-gray-900">
                {discount.type === 'PERCENTAGE'
                  ? `Discount Value: ${discount.value}%`
                  : `Discount Value: Rp.${discount.value}`}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-lg text-gray-700">
                <strong>Max Discount:</strong> ${discount.maxDiscount}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Product:</strong>{' '}
                {discount.DiscountProduct[0].Product.name}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Type:</strong> {discount.type}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Min Purchase:</strong> ${discount.minPurchase}
              </p>
              <span className="text-lg text-gray-500">
                Expires on: {new Date(discount.expiredAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-xl text-gray-600 p-6">
            No discount found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountDetailPage;
