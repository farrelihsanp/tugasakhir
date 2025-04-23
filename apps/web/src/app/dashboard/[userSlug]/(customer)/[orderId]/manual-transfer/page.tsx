'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Order, BankAccount } from '@/types/types';

const dummyBankAccounts: BankAccount[] = [
  { name: 'BANK BCA', number: '5271484456' },
  { name: 'BANK BSI', number: '5271484456' },
  { name: 'BANK BNI', number: '5271484456' },
  { name: 'BANK MANDIRI', number: '5271484456' },
];

export default function PaymentPage() {
  const { orderId, userSlug } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/order-detail/${orderId}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const json = await res.json();
        if (json.ok) setOrder(json.data);
      } catch (err) {
        console.error('Error fetching order detail:', err);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('paymentProof', file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/upload-payment-proof/${orderId}`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        },
      );
      const json = await res.json();
      if (json.ok) {
        alert('Bukti pembayaran berhasil diupload.');
        router.push(
          `${process.env.NEXT_PUBLIC_WEB_DOMAIN}/dashboard/${userSlug}/my-orders`,
        );
      } else {
        alert(json.error || 'Gagal upload');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat upload.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl mt-10">
        <h1 className="text-2xl font-semibold mb-2 text-center">PEMBAYARAN</h1>
        <p className="text-center text-lg mb-6">
          Total:{' '}
          <span className="font-bold">
            Rp.{order?.totalAmount?.toLocaleString('id-ID')}
          </span>
        </p>

        <p className="text-center font-medium mb-4">VIA PEMBAYARAN TRANSFER</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {dummyBankAccounts.map((bank, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 text-center shadow-sm"
            >
              <p className="font-semibold text-sm">{bank.name}</p>
              <p className="text-xs text-gray-600">{bank.number}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm mb-4">
          Jika Sudah Membayar, Silakan Upload Bukti Pembayaran
        </p>

        <div className="flex justify-center items-center mb-4">
          <input
            type="file"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition duration-300 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'UPLOAD'}
        </button>
      </div>
    </section>
  );
}
