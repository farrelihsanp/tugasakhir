'use client';
// DONE

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order, Store } from '@/types/types';

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [store, setStore] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/orders-customers`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data.data);
        setFilteredOrders(data.data);
      } catch (error: unknown) {
        setError((error as Error).message);
      }
    };

    const fetchStore = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/stores`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch store');
        const data = await res.json();
        setStore(data.data);
      } catch (error: unknown) {
        setError((error as Error).message);
      }
    };

    fetchStore();
    fetchOrders();
  }, []);

  const handleStoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = event.target.value;
    setSelectedStore(storeId);
    if (storeId) {
      setFilteredOrders(
        orders.filter((order) => order.store.id === Number(storeId)),
      );
    } else {
      setFilteredOrders(orders);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          All Orders
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Dropdown for filtering by store */}
        <div className="mb-4">
          <label
            htmlFor="storeFilter"
            className="block text-sm font-medium text-gray-600 mb-2"
          >
            Filter by Store
          </label>
          <select
            id="storeFilter"
            value={selectedStore}
            onChange={handleStoreChange}
            className="w-full p-2 border rounded-lg shadow-sm"
          >
            <option value="">All Stores</option>
            {store?.map((storeItem: Store) => (
              <option key={storeItem.id} value={storeItem.id}>
                {storeItem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {filteredOrders.length === 0 && !error && (
            <p className="text-center text-gray-600">No orders found.</p>
          )}
          {filteredOrders.map((order) => (
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
                  <p className="text-sm text-gray-500 mt-1">
                    Store: {order.store.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-primary">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </p>
                  <Link
                    href={`view-orders/${order.id}`}
                    className="text-sm text-white bg-primary px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 mt-3 inline-block"
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
