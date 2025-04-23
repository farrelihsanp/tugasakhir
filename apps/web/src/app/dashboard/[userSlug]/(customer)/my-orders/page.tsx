'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import { useStoreContext } from '@/utility/StoreContext';
import { Order } from '@/types/types';

const OrderStatusPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const { user } = useStoreContext();
  const fetchOrderStatus = OrderStatus;
  const orderStatus = Object.keys(fetchOrderStatus);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/orders-customer',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error fetching orders');
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/cancel-order/${orderId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) throw new Error('Failed to cancel order');

      toast.success('Order cancelled successfully');
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: OrderStatus.CANCELLED }
            : order,
        ),
      );
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling the order');
    }
  };

  // const handleProcessOrder = async (orderId: number) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/api/v1/confirm-process-order/${orderId}`,
  //       {
  //         method: 'PUT',
  //         credentials: 'include',
  //         headers: { 'Content-Type': 'application/json' },
  //       },
  //     );
  //     if (response.ok) {
  //       toast.success('Order processed successfully');
  //     } else {
  //       toast.error('Error processing the order');
  //     }
  //   } catch (error) {
  //     console.error('Error processing order:', error);
  //     toast.error('Error processing the order');
  //   }
  // };

  const handleConfirmOrder = async (orderId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/order-confirmed/${orderId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) throw new Error('Failed to confirm order');

      toast.success('Order confirmed successfully');
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: OrderStatus.COMPLETED }
            : order,
        ),
      );
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Error confirming the order');
    }
  };

  const getStatusIndex = (status: string) => orderStatus.indexOf(status);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleMonthFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const filteredOrders = orders
    .filter((order) => order.id.toString().includes(searchTerm))
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      const selectedDateObj = new Date(selectedDate);
      const selectedMonthObj = new Date(selectedMonth);
      const selectedYearObj = new Date(selectedYear);

      return (
        (!selectedDate ||
          orderDate.toLocaleDateString() ===
            selectedDateObj.toLocaleDateString()) &&
        (!selectedMonth ||
          orderDate.getMonth() === selectedMonthObj.getMonth()) &&
        (!selectedYear ||
          orderDate.getFullYear() === selectedYearObj.getFullYear())
      );
    });

  return (
    <div className="mx-auto min-h-screen p-8 max-w-7xl">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Order ID"
          className="p-2 border rounded"
          onChange={handleSearch}
        />
        <div className="flex gap-4 mt-4">
          <select
            className="p-2 border rounded"
            value={selectedDate}
            onChange={handleDateFilter}
          >
            <option value="">Filter by Date</option>
            {orders.map((order) => (
              <option
                key={order.id}
                value={new Date(order.createdAt).toLocaleDateString()}
              >
                {new Date(order.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={selectedMonth}
            onChange={handleMonthFilter}
          >
            <option value="">Filter by Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={`${i + 1}`}>
                {new Date(2020, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={selectedYear}
            onChange={handleYearFilter}
          >
            <option value="">Filter by Year</option>
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={`${2025 - i}`}>
                {2025 - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => {
          const currentStep = getStatusIndex(order.status);
          return (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg mb-6 shadow-md"
            >
              <div className="flex justify-between mb-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">ORDER</span>{' '}
                  <span className="text-primary font-bold">#{order.id}</span>
                </div>
                <div className="text-right">
                  <div>
                    <span className="font-medium">Created At:</span>{' '}
                    <span className="font-bold">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* TRACKER */}
              <div className="flex items-center overflow-x-auto scroll-smooth mt-6 mb-6 px-2 h-40 justify-center">
                {orderStatus.map((statusKey, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div key={statusKey} className="flex items-center relative">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold z-10 ${
                          isCompleted
                            ? 'bg-primary text-white'
                            : 'bg-gray-300 text-white'
                        }`}
                      >
                        ✓
                      </div>

                      <div
                        className={`absolute top-10 left-4 transform -translate-x-1/2 w-28 text-center text-[12px] md:text-sm font-medium ${
                          isCurrent
                            ? 'text-primary font-semibold'
                            : 'text-gray-700'
                        }`}
                      >
                        {statusKey.replace(/_/g, ' ')}
                      </div>

                      {index !== orderStatus.length - 1 && (
                        <div
                          className={`h-1 w-12 md:w-20 ${
                            index < currentStep ? 'bg-primary' : 'bg-gray-300'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-4 gap-4">
                {(order.status === OrderStatus.WAITING_FOR_PAYMENT ||
                  order.status === OrderStatus.PAYMENT_DECLINED) && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === OrderStatus.DELIVERED && (
                  <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    onClick={() => handleConfirmOrder(order.id)}
                  >
                    Confirm Order
                  </button>
                )}
              </div>

              <div className="mt-6 text-right">
                <Link
                  href={`/dashboard/${user?.username}/my-orders/${order.id}`}
                  className="text-primary text-sm underline"
                >
                  View Order Detail
                </Link>
              </div>
              <div className="text-right">
                {order.status === OrderStatus.PAYMENT_DECLINED && (
                  <p className="text-red-500">
                    Payment rejected, please make payment again
                  </p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-white p-6 rounded-lg mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Loading...</h1>
        </div>
      )}
    </div>
  );
};

export default OrderStatusPage;
