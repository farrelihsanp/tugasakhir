'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading voucher...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <section className="h-[75vh] flex items-center justify-center py-10 px-4">
      {voucher ? (
        <div className="flex max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-lg">
          {/* LEFT: DISKON BESAR */}
          <div className="w-1/4 bg-white border-r border-dashed border-gray-300 flex flex-col items-center justify-center px-4 py-10">
            <h2 className="text-3xl font-bold text-black mb-2">
              {voucher.code}
            </h2>
            <p className="text-[10px] text-center text-gray-500 italic mt-4">
              {voucher.description}
            </p>
          </div>

          {/* MIDDLE: DETAIL VOUCHER */}
          <div className="w-1/2 bg-primary text-quaternary px-6 py-8 relative">
            <h3 className="text-3xl font-bold mb-1">{voucher.name}</h3>
            <div className="h-1 w-14 bg-quaternary mb-4"></div>
            <p className="text-sm mb-6">{voucher.description}</p>
            <p className="text-xs mb-1">
              Valid from: {new Date(voucher.startDate).toLocaleDateString()}
            </p>
            <p className="text-xs mb-1">
              Until: {new Date(voucher.endDate).toLocaleDateString()}
            </p>
            <p className="text-xs mb-1">
              Min Purchase: Rp {voucher.minPurchase.toLocaleString()}
            </p>
            <p className="text-xs mb-1">
              Max Reduction: Rp {voucher.maxPriceReduction.toLocaleString()}
            </p>
            <p className="text-xs mb-1">
              Stock Left: {voucher.stockVoucherAdmin}
            </p>
            <p className="text-xs mt-3">
              Status:{' '}
              <span
                className={`font-semibold ${
                  voucher.isActive ? 'text-quaternary' : 'text-red-500'
                }`}
              >
                {voucher.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>

          {/* RIGHT: GAMBAR */}
          <div className="w-1/4 relative">
            <Image
              src={voucher.voucherImage.trim()}
              alt={voucher.name}
              layout="fill"
              objectFit="cover"
              className="h-full w-full"
            />
            <div className="absolute top-0 right-0 bg-tertiary text-quaternary px-2 py-1 text-[10px] font-semibold tracking-widest rounded-bl">
              NO. {voucher.id.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500 text-xl">Voucher not found</p>
      )}
    </section>
  );
}
