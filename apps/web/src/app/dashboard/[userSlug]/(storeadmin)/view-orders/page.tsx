'use client';
// DONE

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStoreContext } from '@/utility/StoreContext';
import { Order, Store } from '@/types/types';
import { OrderStatus } from '@prisma/client';

type FetchError = {
  error: string;
};

export default function PendingOrdersPage() {
  const { user } = useStoreContext();
  const storeId = user?.StoreUser[0].storeId;

  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/orders-store/${storeId}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!res.ok) {
          const errorData: FetchError = await res.json();
          throw new Error(errorData.error || 'Failed to fetch orders');
        }

        const data = await res.json();
        setOrders(data);
      } catch (error: unknown) {
        setError((error as Error).message);
      }
    };

    const fetchStore = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/stores/someStore/${storeId}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!res.ok) {
          const errorData: FetchError = await res.json();
          throw new Error(errorData.error || 'Failed to fetch store');
        }

        const data = await res.json();
        setStore(data.data);
      } catch (error: unknown) {
        setError((error as Error).message);
      }
    };

    if (storeId) {
      fetchPendingOrders();
      fetchStore();
    }
  }, [storeId]);

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Pending Orders
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-4">
          Store: {store?.name}
        </p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="space-y-6">
          {orders.length === 0 && !error && (
            <p className="text-center text-gray-600">
              No pending orders found.
            </p>
          )}
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col p-5 bg-white border rounded-lg shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xl font-semibold text-gray-800">
                    Order ID: {order.id}
                  </p>
                  <p className="text-gray-600">Customer: {order.user.name}</p>
                  <p className="text-gray-500 text-sm">
                    Date: {new Date(order.createdAt).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Payment Status: {order.status}
                  </p>
                  <p className="text-red-500 text-xs mt-2">
                    {order.status === OrderStatus.PENDING_PAYMENT &&
                      'Payment confirmation required'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-blue-600">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </p>
                  <Link
                    href={`view-orders/${order.id}`}
                    className="text-sm text-white bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 mt-3 inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
