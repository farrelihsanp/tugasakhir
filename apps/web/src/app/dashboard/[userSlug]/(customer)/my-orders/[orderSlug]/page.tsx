'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/types/types';
import Image from 'next/image';

// DONE
const OrderDetail = () => {
  const { orderSlug } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/order-detail/${orderSlug}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data?.data) {
          setOrder(data.data);
        } else {
          setError('Order not found.');
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderSlug]);

  if (loading)
    return <p className="text-center text-lg text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;
  if (!order)
    return (
      <p className="text-center text-lg text-gray-700">Order not found.</p>
    );

  return (
    <>
      <Head>
        <title>Order Detail - Grocery Store</title>
      </Head>
      <main className="py-12 min-h-screen">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Order Detail
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-semibold text-gray-900">
                Order #{order.id}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Status:</strong> {order.status}
              </div>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Payment Method:</strong>{' '}
                {order.paymentMethodType}
              </div>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Total Amount:</strong> Rp
                {order.totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Information
              </h4>
              <div className="text-sm text-gray-700 mb-2">
                <strong className="font-medium">Courier:</strong>{' '}
                {order.shippingInformation?.courierName ?? 'N/A'}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                <strong className="font-medium">Shipping Code:</strong>{' '}
                {order.shippingInformation?.code ?? 'N/A'}
              </div>
              <div className="text-sm text-gray-700 mb-4">
                <strong className="font-medium">Estimated Time:</strong>{' '}
                {order.shippingInformation?.estimatedTime ?? 'N/A'} days
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Items
              </h4>
              {order.orderItems && order.orderItems.length > 0 ? (
                <ul className="space-y-6">
                  {order.orderItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out"
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={
                            item.storeProduct?.product?.ProductImages[0]
                              .imageUrl ?? '/default-image.png'
                          }
                          alt={
                            item.storeProduct?.product?.name ?? 'Product Image'
                          }
                          width={180}
                          height={180}
                          className="rounded-lg shadow-md object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800">
                          {item.storeProduct?.product?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: Rp{item.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: Rp{item.total.toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">
                  No items found in this order.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetail;
