'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Voucher } from '@/types/types';
import { toast } from 'react-toastify';

// PERTANYAAN - KENAPA SETELAH DI SUBMIT KOSONG
export default function MyVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimVoucher, setClaimVoucher] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  const claimVoucherByUser = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/claim-voucher`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimVoucher }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      setVouchers(Array.isArray(json.data) ? json.data : []);
      toast.success('Voucher claimed successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      setError(String(err));
      toast.error('Error claiming voucher. Please try again.');
    } finally {
      setIsClaiming(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/v1/my-voucher', {
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
    return <p className="text-center text-gray-500">Loading vouchers...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <section className="min-h-screen text-white py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center mb-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-bold text-black">
              Claim Your Voucher
            </h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={claimVoucher !== null ? claimVoucher : ''}
                onChange={(e) => setClaimVoucher(e.target.value)}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Voucher Code"
              />
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-6 rounded-lg transition duration-300"
                onClick={claimVoucherByUser}
                disabled={isClaiming}
              >
                {isClaiming ? 'Claiming...' : 'Claim'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {vouchers.length > 0 &&
            vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
              >
                {voucher.voucherImage && (
                  <Image
                    src={voucher.voucherImage}
                    alt={voucher.name}
                    width={2000}
                    height={2000}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    {voucher.name}
                  </h2>
                  <p className="text-gray-800 text-sm">{voucher.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Code:</strong>{' '}
                      <span className="font-mono text-gray-800">
                        {voucher.code}
                      </span>
                    </p>
                    <p>
                      <strong>Type:</strong>{' '}
                      <span className="text-blue-500">
                        {voucher.voucherType}
                      </span>
                    </p>
                    <p>
                      <strong>Value:</strong> {voucher.value}
                    </p>
                    <p>
                      <strong>Stock:</strong>{' '}
                      {voucher.VoucherUser[0].stockCustomer}
                    </p>
                    <p>
                      <strong>Valid:</strong>{' '}
                      {new Date(voucher.startDate).toLocaleDateString()} -{' '}
                      {new Date(voucher.endDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span
                        className={
                          voucher.isActive ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {voucher.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
