'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product, Store } from '@/types/types';
import Link from 'next/link';
import Image from 'next/image';
import { useStoreContext } from '@/utility/StoreContext';

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStoreContext();
  const { storeSlug } = useParams();

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/products-store-slug/${storeSlug}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.data);
      } catch (error: unknown) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const fetchStore = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/stores/store-slug/${storeSlug}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!res.ok) throw new Error('Failed to fetch store');
        const data = await res.json();
        setStore(data.data);
      } catch (error: unknown) {
        console.error('Error fetching store:', error);
        setError('Failed to load store');
      }
    };

    fetchStore();
    fetchProducts();
  }, [storeSlug]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Products in {store?.name}
        </h1>
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all p-4"
                >
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mt-2">{product.excerpt}</p>
                  <Link href={`/${storeSlug}/product/${product.slug}`}>
                    <Image
                      src={product.ProductImages[0].imageUrl}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="mt-4 rounded-md"
                    />
                  </Link>
                  <div className="mt-4">
                    <p className="text-gray-700">
                      Stock: {product.storeProducts[0].stock}
                    </p>
                    <p className="text-gray-800 font-semibold mt-1">
                      Rp {product.storeProducts[0].price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center mt-10 gap-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
              >
                &larr; Previous
              </button>
              <span className="text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
              >
                Next &rarr;
              </button>
            </div>
          </>
        )}
      </div>

      <div className="text-center mt-6">
        <Link
          href={`/dashboard/${user?.username}/manage-products/${storeSlug}/update-product`}
          className="px-6 py-2 bg-blue-600 text-white rounded-md"
        >
          Update Product Data
        </Link>
      </div>
    </section>
  );
};

export default ProductPage;
