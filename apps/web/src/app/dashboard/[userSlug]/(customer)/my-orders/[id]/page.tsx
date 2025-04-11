'use client';

import Head from 'next/head';
import Navbar from '../../../components/common/navbar';
import Footer from '../../../components/common/footer';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// Define the OrderDetail component
const OrderDetail = () => {
  const { id } = useParams(); // Use useParams to get the route parameter
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching order data based on ID
    const fetchOrder = async () => {
      try {
        // Replace the following URL with your actual API endpoint
        const response = await fetch(`https://api.example.com/orders/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data) {
          setOrder(data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]); // Dependency array includes id to refetch when id changes

  // Render loading state
  if (loading) return <p>Loading...</p>;
  // Render error state
  if (error) return <p>{error}</p>;

  // Render the order details
  return (
    <>
      <Head>
        <title>Order Detail - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Order Detail
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">Order #{order.id}</h3>
            <p className="mt-2 text-gray-600">Date: {order.date}</p>
            <p className="mt-2 text-gray-600">Status: {order.status}</p>
            <h4 className="mt-4 text-md font-bold">Items:</h4>
            <ul className="list-disc pl-6">
              {order.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderDetail;
