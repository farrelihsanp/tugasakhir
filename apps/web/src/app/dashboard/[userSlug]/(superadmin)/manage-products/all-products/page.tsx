'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/types';
import Link from 'next/link';
import Image from 'next/image';

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/all-products',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        if (data.ok) {
          setProducts(data.data);
        } else {
          setError('Failed to load products');
        }
      } catch (error: unknown) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="py-10 px-5 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-semibold">All Products in All Stores</h1>
        <div className="space-x-4">
          <Link
            href="create-product"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Create Product
          </Link>
          <Link
            href="update-product-global"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Update Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition duration-200"
          >
            <Image
              src={product?.ProductImages?.[0]?.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              height={200}
              width={200}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600 mt-2">{product.excerpt}</p>
            <Link
              href={`/product/${product.slug}`}
              className="text-blue-500 hover:underline mt-4 block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center mt-10 gap-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
        >
          &larr; Previous
        </button>
        <span className="text-gray-700 text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
        >
          Next &rarr;
        </button>
      </div>
    </section>
  );
}
