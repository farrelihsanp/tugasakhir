'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/types';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useStoreContext } from '@/utility/StoreContext';
import Link from 'next/link';

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { categories } = useStoreContext();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/all-products`,
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

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.CategoryProduct.some(
          (categoryProduct) =>
            categoryProduct.Category.id.toString() === selectedCategory,
        )
      : true;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center bg-quaternary">
      <h1 className="text-4xl font-bold mb-8 text-center text-tertiary">
        Products in all stores
      </h1>

      <div className="mb-6 w-full max-w-xl">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mb-8 w-full max-w-xl">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Semua Kategori</option>
          {categories.map((category, index: number) => (
            <option key={index} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Links for Create and Update Product */}
      <div className="mb-6 space-x-4">
        <Link
          href="/create-product"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Create Product
        </Link>
        <Link
          href="/update-product-global"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Update Product
        </Link>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition relative bg-white"
              >
                {product.ProductImages?.[0]?.imageUrl && (
                  <div className="relative w-full h-52">
                    <Image
                      src={product.ProductImages[0].imageUrl}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-base font-semibold truncate mb-1 text-tertiary">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {product.excerpt}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    Weight: {product.weight} kg
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-10 gap-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-2 bg-tertiary text-white rounded-full disabled:opacity-50 hover:bg-yellow-600 transition"
            >
              <FaChevronLeft size={18} />
            </button>

            <span className="text-tertiary text-sm font-semibold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-2 bg-tertiary text-white rounded-full disabled:opacity-50 hover:bg-yellow-600 transition"
            >
              <FaChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
