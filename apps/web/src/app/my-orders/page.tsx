'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export enum OrderStatus {
  WAITING_FOR_PAYMENT = 'Waiting for Payment',
  PENDING_PAYMENT = 'Pending Payment',
  PAYMENT_DECLINED = 'Payment Declined',
  PAID = 'Paid',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface Order {
  id: number;
  status: OrderStatus;
  slug: string;
}

const OrderStatusPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  console.log('orders isinya :', orders);

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

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition duration-300"
          >
            <h1 className="text-4xl font-semibold text-center mb-4 text-gray-800">
              Order Status
            </h1>
            <div className="mb-6">
              <span className="font-semibold text-gray-700">Order ID:</span>{' '}
              {order.id}
            </div>
            <div className="mb-6">
              <span className="font-semibold text-gray-700">Status:</span>{' '}
              {order.status}
            </div>

            <div className="flex justify-between space-x-4 mb-6">
              {order.status === OrderStatus.WAITING_FOR_PAYMENT && (
                <>
                  <button
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                  <button
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
                    onClick={() => handleConfirmOrder(order.id)}
                  >
                    Confirm Order
                  </button>
                </>
              )}
              <button
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                onClick={() =>
                  (window.location.href = `/orders/detail/${order.slug}`)
                }
              >
                Order Detail
              </button>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Timeline
              </h2>
              <div className="flex space-x-6">
                {Object.values(OrderStatus).map((status) => (
                  <div
                    key={status}
                    className={`flex items-center space-x-2 ${
                      order.status === status
                        ? status === OrderStatus.PROCESSING
                          ? 'text-yellow-500'
                          : 'text-green-500'
                        : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full border-2 ${
                        order.status === status
                          ? status === OrderStatus.PROCESSING
                            ? 'border-yellow-500'
                            : 'border-green-500'
                          : 'border-gray-500'
                      }`}
                    ></div>
                    <span className="text-lg">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-xl text-gray-600">Loading...</div>
      )}
    </div>
  );
};

export default OrderStatusPage;
