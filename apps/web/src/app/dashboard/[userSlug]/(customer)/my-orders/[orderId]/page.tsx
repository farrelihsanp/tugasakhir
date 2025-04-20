'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/types/types';
import Image from 'next/image';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/order-detail/${orderId}`,
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
  }, [orderId]);

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
      <main className="py-12 min-h-screen bg-quaternary">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-primary mb-8">
            Order Detail
          </h2>
          <div className="flex justify-between items-start bg-white p-10 rounded-xl shadow-xl max-w-5xl mx-auto">
            {/* Left Section: Product List */}
            <div className="w-full space-y-8 mr-10">
              <div className="flex justify-between items-center">
                <h3 className="text-4xl font-semibold text-tertiary">
                  Order #{order.id}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-700">
                  <strong className="font-medium">Status:</strong>{' '}
                  {order.status}
                </div>
                <div className="text-sm text-gray-700">
                  <strong className="font-medium">Payment Method:</strong>{' '}
                  {order.paymentMethodType}
                </div>
                <span className="text-sm text-gray-500">
                  Order Created:{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-tertiary mb-4">
                  Items
                </h4>
                {order.orderItems && order.orderItems.length > 0 ? (
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                          Product
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                          Quantity
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                          Price
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b transition duration-300 ease-in-out hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Image
                                src={
                                  item.storeProduct?.product?.ProductImages[0]
                                    .imageUrl ?? '/default-image.png'
                                }
                                alt={
                                  item.storeProduct?.product?.name ??
                                  'Product Image'
                                }
                                width={50}
                                height={50}
                                className="rounded-lg shadow-md object-cover"
                              />
                              <span className="ml-4 text-sm text-gray-800">
                                {item.storeProduct?.product?.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            Rp{item.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            Rp{item.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-600">
                    No items found in this order.
                  </p>
                )}
              </div>
            </div>

            {/* Right Section: Order Summary */}
            <div className="w-1/3 space-y-4">
              {/* <h4 className="text-xl font-semibold text-tertiary mb-4">
                Order Summary
              </h4>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Sub Total:</strong> Rp farrel
              </div>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Discount:</strong> Rp farrel
              </div>
              <p>--------------------</p> */}
              <h4 className="text-xl font-semibold text-tertiary mb-4">
                Shipping Information
              </h4>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Delivery Fee:</strong>{' '}
                {order.shippingInformation?.shippingCost}
              </div>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Courier Name:</strong>{' '}
                {order.shippingInformation?.courierName}
              </div>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Code Delivery:</strong>{' '}
                {order.shippingInformation?.code}
              </div>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Service Type:</strong>{' '}
                {order.shippingInformation?.serviceType}
              </div>
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Estimated Delivery:</strong>{' '}
                {order.shippingInformation?.estimatedTime} days
              </div>
              <div className="text-xl font-semibold text-gray-900 mt-65">
                <strong>Total Order:</strong> <br />
                <p className="text-4xl text-primary">
                  Rp.{order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetail;
