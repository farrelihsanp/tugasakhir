'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/types/types';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useStoreContext } from '@/utility/StoreContext';

const StoreAdminActionPage = () => {
  const { orderId } = useParams();
  const { user } = useStoreContext();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/order-detail/${orderId}`,
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

  const handleSeeProof = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/see-payment-proof/${orderId}`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to see payment proof');
      setPaymentProofUrl(data.data);
      setIsModalOpen(true);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const handleAction = async (endpoint: string, successMessage: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/${endpoint}/${orderId}`,
        {
          method: 'PUT',
          credentials: 'include',
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      toast.success(successMessage);
      setTimeout(() => location.reload(), 1500);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;
  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <section className="flex justify-center items-center min-h-screen my-20">
      <div className="w-full max-w-xl mx-auto py-10 px-6 bg-white shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
          Order Detail Customers
        </h1>
        <p className="text-lg font-semibold text-gray-800">
          Total Pembayaran:{' '}
          <span className="font-bold text-green-600">
            Rp{order.totalAmount.toLocaleString()}
          </span>
        </p>

        {/* Status Display */}
        <p className="mt-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 inline-block rounded-md shadow">
          Status: {order.status.toUpperCase()}
        </p>

        {/* Produk Dipesan */}
        <div className="mt-6">
          <h2 className="font-semibold text-2xl text-gray-800 mb-2">
            Produk Dipesan:
          </h2>
          <ul className="space-y-4">
            {order.orderItems.map((item, idx) => (
              <li
                key={idx}
                className="border p-4 rounded-md shadow-sm bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={
                      item.storeProduct.product.ProductImages?.[0]?.imageUrl ||
                      ''
                    }
                    width={100}
                    height={100}
                    alt={item.storeProduct.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-700">
                      {item.storeProduct.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
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

        {/* Shipping Information */}
        <div className="mt-6">
          <h2 className="font-semibold text-2xl text-gray-800 mb-2">
            Kurir yang digunakan
          </h2>
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

        {/* ACTION CONTAINER */}
        <div>
          {user?.role === 'STOREADMIN' && (
            <div className="mt-6">
              <h2 className="font-semibold text-xl text-gray-800 mb-4">
                ACTION
              </h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleSeeProof}
                  className="bg-gradient-to-r bg-primary text-white py-3 rounded-lg font-semibold transition hover:opacity-90"
                >
                  LIHAT BUKTI TRANSFER
                </button>
                <button
                  onClick={() =>
                    handleAction('reject-payment-proof', 'Pembayaran ditolak')
                  }
                  className={`bg-gradient-to-r bg-primary text-white py-3 rounded-lg font-semibold transition hover:opacity-90 ${
                    order.status === 'PROCESSING' ||
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'COMPLETED'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={
                    order.status === 'PROCESSING' ||
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'COMPLETED'
                  }
                >
                  TOLAK PEMBAYARAN
                </button>
                <button
                  onClick={() =>
                    handleAction('accept-payment-proof', 'Pembayaran diterima')
                  }
                  className={`bg-gradient-to-r bg-primary text-white py-3 rounded-lg font-semibold transition hover:opacity-90 ${
                    order.status === 'PROCESSING' ||
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'COMPLETED'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={
                    order.status === 'PROCESSING' ||
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'COMPLETED'
                  }
                >
                  TERIMA PEMBAYARAN
                </button>
                <button
                  onClick={() =>
                    handleAction('process-order', 'Order sedang diproses')
                  }
                  className={`bg-gradient-to-r bg-primary text-white py-3 rounded-lg font-semibold transition hover:opacity-90 ${
                    order.status === 'PROCESSING' ||
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'COMPLETED'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={
                    order.status === 'PROCESSING' ||
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'COMPLETED'
                  }
                >
                  PROSES ORDERAN
                </button>
                <button
                  onClick={() =>
                    handleAction('sent-order', 'Order telah dikirim')
                  }
                  className={`bg-gradient-to-r bg-primary text-white py-3 rounded-lg font-semibold transition hover:opacity-90 ${
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'COMPLETED'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED' ||
                    order.status === 'COMPLETED'
                  }
                >
                  KIRIM ORDERAN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL POPUP */}
        {isModalOpen && paymentProofUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 relative max-w-xl w-full">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center text-gray-900">
                Bukti Transfer
              </h2>
              <Image
                src={paymentProofUrl}
                alt="Bukti Transfer"
                width={600}
                height={600}
                className="rounded-md w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreAdminActionPage;
