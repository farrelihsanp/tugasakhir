'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import { useStoreContext } from '@/utility/StoreContext';

export interface Order {
  id: number;
  status: string;
  slug: string;
}

const OrderStatusPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrderStatus = OrderStatus;
  const orderStatus = Object.keys(fetchOrderStatus);

  const { user } = useStoreContext();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/order-customer',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error: unknown) {
        console.error('Error fetching orders:', error);
        toast.error('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/cancel-order',
        {
          method: 'POST',
          body: JSON.stringify({ orderId }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      toast.success('Order cancelled successfully');
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: OrderStatus.CANCELLED }
            : order,
        ),
      );
    } catch (error: unknown) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling the order');
    }
  };

  const handleConfirmOrder = async (orderId: number) => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/order-confirmed',
        {
          method: 'POST',
          body: JSON.stringify({ orderId }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to confirm order');
      }

      toast.success('Order confirmed successfully');
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: OrderStatus.COMPLETED }
            : order,
        ),
      );
    } catch (error: unknown) {
      console.error('Error confirming order:', error);
      toast.error('Error confirming the order');
    }
  };

  // Menambahkan warna sesuai status yang aktif
  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.WAITING_FOR_PAYMENT:
        return 'bg-green-500';
      case OrderStatus.PENDING_PAYMENT:
        return 'bg-green-500';
      case OrderStatus.PAYMENT_DECLINED:
        return 'bg-green-500';
      case OrderStatus.PAID:
        return 'bg-green-500';
      case OrderStatus.PROCESSING:
        return 'bg-green-500';
      case OrderStatus.SHIPPED:
        return 'bg-green-500';
      case OrderStatus.DELIVERED:
        return 'bg-green-500';
      case OrderStatus.COMPLETED:
        return 'bg-green-500';
      case OrderStatus.CANCELLED:
        return 'bg-green-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="mx-auto min-h-screen p-8 max-w-7xl bg-gradient-to-b from-gray-100 to-white shadow-lg rounded-lg">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-lg mb-6 shadow-lg hover:shadow-2xl transition duration-300"
          >
            <h1 className="text-4xl font-semibold text-center mb-4 text-gray-800 tracking-wide">
              Order Status
            </h1>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Order ID:</span>{' '}
              {order.id}
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Status:</span>{' '}
              {order.status}
            </div>

            <div className="flex justify-between gap-4">
              {(order.status === OrderStatus.WAITING_FOR_PAYMENT ||
                order.status === OrderStatus.PAYMENT_DECLINED) && (
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none transition duration-300"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              )}
              {order.status === OrderStatus.DELIVERED && (
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none transition duration-300"
                  onClick={() => handleConfirmOrder(order.id)}
                >
                  Confirm Order
                </button>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Timeline
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {orderStatus.map((statusData, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center w-full h-full"
                  >
                    <div
                      className={`flex flex-col items-center mb-4 p-4 rounded-full w-20 h-20 ${
                        statusData === order.status
                          ? `${getStatusColor(statusData)} text-white`
                          : 'bg-gray-200'
                      }`}
                    >
                      {' '}
                    </div>
                    <div className="text-sm text-center">{statusData}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10">
              <Link
                href={`/dashboard/${user?.username}/my-orders/${order.slug}`}
                className="text-blue-600"
              >
                View Order Detail
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-lg mb-6 text-center">
          <h1 className="text-4xl font-semibold text-gray-800">
            No orders found
          </h1>
        </div>
      )}
    </div>
  );
};

export default OrderStatusPage;
