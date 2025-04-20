'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Voucher } from '@/types/types';
import Link from 'next/link';
import { useStoreContext } from '@/utility/StoreContext';

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useStoreContext();
  const router = useRouter();

  const fetchVouchers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/all-vouchers',
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
        setVouchers(data.data);
      } else {
        toast.error('Failed to fetch vouchers');
      }
    } catch (error: unknown) {
      console.error('Error fetching vouchers:', error);
      toast.error('Error fetching vouchers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleUpdateVoucher = async (voucherCode: string) => {
    router.push(`/dashboard/${user?.username}/vouchers/update/${voucherCode}`);
  };

  const handleGetVoucherById = async (voucherId: number) => {
    router.push(`/dashboard/${user?.username}/vouchers/${voucherId}`);
  };

  const handleDeleteVoucher = async (voucherId: number) => {
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/delete-voucher',
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ voucherId }),
        },
      );
      const data = await response.json();
      if (data) {
        toast.success('Voucher deleted successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Failed to delete voucher');
      }
    } catch (error: unknown) {
      setError((error as Error).message);
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading vouchers...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <section className="h-[75vh] flex flex-col items-center justify-center py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center mb-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-bold text-tertiary">
              Manage Vouchers
            </h2>
            <div className="flex space-x-2 w-full max-w-md">
              <Link
                href={`/dashboard/${user?.username}/vouchers/create`}
                className="bg-primary hover:bg-green-700 text-white py-2 px-6 rounded-lg transition duration-300 text-center w-full"
              >
                Create New Voucher
              </Link>
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
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `url(${voucher.voucherImage.trim()})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.5,
                    }}
                  ></div>

                  <div className="relative z-20">
                    <h1 className="text-2xl font-bold mb-2">{voucher.name}</h1>
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
                    <button
                      onClick={() => handleUpdateVoucher(voucher.code)}
                      className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:bg-green-700 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteVoucher(voucher.id)}
                      className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-700 transition mt-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleGetVoucherById(voucher.id)}
                      className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:bg-yellow-700 transition mt-2"
                    >
                      View Details
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
};

export default VoucherPage;
