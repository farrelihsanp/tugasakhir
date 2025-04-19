'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types/types';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface SnapWindow extends Window {
  snap?: { embed: (token: string, options: { embedId: string }) => void };
}

const OrderPaymentPage = () => {
  const router = useRouter();
  const { orderId, userSlug } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const myMidtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', myMidtransClientKey as string);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/order-detail/${orderId}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch order');
        setOrder(data.data);
      } catch (error: unknown) {
        setError((error as Error).message);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleManualTransfer = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/manual-transfer/${orderId}`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || 'Failed to update payment method');
      toast.success('Payment method updated successfully');
      router.push(
        `http://localhost:3000/dashboard/${userSlug}/${orderId}/manual-transfer`,
      );
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const handleMidTransPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/create-order-midtrans/${orderId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      const data = await res.json();

      (window as SnapWindow).snap!.embed(data.data.transaction.token, {
        embedId: 'snap-container',
      });

      if (!res.ok) throw new Error(data.error || 'Failed to initiate payment');
      window.location.href = data.data.transaction.redirect_url;
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;
  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-4">Pembayaran</h1>
      <p className="text-gray-700">
        Total Pembayaran:{' '}
        <span className="font-semibold">
          Rp{order.totalAmount.toLocaleString()}
        </span>
      </p>
      <p className="text-gray-700">Status: {order.status}</p>
      <div className="mt-4">
        <h2 className="font-semibold mb-2">Produk Dipesan:</h2>
        <ul className="space-y-2">
          {order.orderItems.map((item, idx) => (
            <li key={idx} className="border p-4 rounded-md shadow-sm">
              <div className="flex items-center gap-4">
                <Image
                  src={
                    item.storeProduct.product.ProductImages?.[0]?.imageUrl || ''
                  }
                  width={100}
                  height={100}
                  alt={item.storeProduct.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">
                    {item.storeProduct.product.name}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    Harga: Rp{item.price.toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    Total: Rp{item.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Alamat Pengiriman</h2>
        <p className="text-gray-600">
          Kurir: {order.shippingInformation?.courierName} (
          {order.shippingInformation?.code})
        </p>
        <p className="text-gray-600">
          Layanan: {order.shippingInformation?.serviceType}
        </p>
        <p className="text-gray-600">
          Estimasi: {order.shippingInformation?.estimatedTime} hari
        </p>
        <p className="text-gray-600">
          Ongkir: Rp{order.shippingInformation?.shippingCost.toLocaleString()}
        </p>
      </div>
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Metode Pembayaran</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleManualTransfer}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Pembayaran Transfer
          </button>
          <button
            onClick={handleMidTransPayment}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Payment Gateway (MidTrans)
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentPage;
