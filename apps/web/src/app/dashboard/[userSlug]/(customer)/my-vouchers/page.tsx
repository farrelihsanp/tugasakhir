'use client';

import { useEffect, useState } from 'react';
import { Voucher } from '@/types/types';
import { toast } from 'react-toastify';

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
    <section className="h-[75vh] flex flex-col items-center justify-center py-10 ">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center mb-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-bold text-tertiary">
              Claim Your Voucher
            </h2>
            <div className="flex space-x-2 w-full max-w-md">
              <input
                type="text"
                value={claimVoucher ?? ''}
                onChange={(e) => setClaimVoucher(e.target.value)}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Enter Voucher Code"
              />
              <button
                className="bg-primary hover:bg-green-700 text-white py-2 px-6 rounded-lg transition duration-300"
                onClick={claimVoucherByUser}
                disabled={isClaiming}
              >
                {isClaiming ? 'Claiming...' : 'Claim'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 w-full">
          {vouchers.length > 0 &&
            vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="flex w-full border border-gray-300 rounded-md overflow-hidden shadow-md"
              >
                {/* LEFT - IMAGE + INFO */}
                <div className="w-2/3 p-6 text-quaternary relative overflow-hidden bg-tertiary">
                  {/* Gambar latar dengan opacity yang bisa diatur */}
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `url(${voucher.voucherImage.trim()})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.5, // atur nilai opacity di sini (0.0 - 1.0)
                    }}
                  ></div>

                  {/* Konten tulisan */}
                  <div className="relative z-20">
                    <h1 className="text-2xl font-bold mb-2">{voucher.name}</h1>
                    {/* <h2 className="text-3xl font-bold mb-1">
                      {voucher.maxPriceReduction}
                    </h2> */}
                    <p className="text-sm">{voucher.description}</p>
                  </div>
                </div>

                {/* RIGHT - DETAILS */}
                <div className="w-1/3 bg-quaternary text-tertiary px-4 py-6 flex flex-col justify-between border-l border-dashed border-gray-400">
                  <div>
                    <p className="text-xs mb-2">Use by:</p>
                    <p className="font-bold text-sm mb-4">
                      {new Date(voucher.endDate).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-700 transition">
                      {voucher.code}
                    </button>
                  </div>
                  <p className="text-[10px] mt-4 italic">
                    Excludes Sporting items and golf equipment.
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
