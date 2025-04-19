'use client';

// GAGAL DI FILTER CATEGORY

import React, { useState } from 'react';
import { useStoreContext } from '@/utility/StoreContext';
import Image from 'next/image';
import Link from 'next/link';

const AllProductsPage = () => {
  const { products, loading, error, nearestStore, categories } =
    useStoreContext();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading)
    return <p className="text-center text-gray-600">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!nearestStore)
    return (
      <p className="text-center text-yellow-500">
        Tidak ada toko yang tersedia di lokasi kamu saat ini.
      </p>
    );

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Semua Produk di{' '}
        <span className="text-blue-600">{nearestStore.name}</span>
      </h1>

      <div className="mb-8 w-full max-w-xl">
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-8 w-full max-w-xl">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Kategori</option>
          {categories.map((category, index: number) => (
            <option key={index} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          Tidak ada produk yang ditemukan.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-7xl">
            {currentProducts.map((map) => (
              <Link
                key={map.id}
                href={`/${nearestStore.slug}/product/${map.slug}`}
                className="block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                {map.ProductImages?.[0]?.imageUrl && (
                  <div className="relative w-full h-64">
                    <Image
                      src={map.ProductImages[0].imageUrl}
                      alt={map.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 truncate text-gray-900">
                    {map.name}
                  </h2>
                  <p className="text-base text-gray-500 line-clamp-2 mb-3">
                    {map.excerpt}
                  </p>
                  <p className="text-sm text-gray-700">
                    Stok: {map.storeProducts[0].stock}
                  </p>
                  <p className="text-green-600 font-bold text-xl mt-3">
                    {map.storeProducts[0].priceAfterDiscount > 0 ? (
                      <>
                        <span className="line-through text-gray-600">
                          Rp {map.storeProducts[0].price}
                        </span>{' '}
                        <span className="text-green-600">
                          Rp {map.storeProducts[0].priceAfterDiscount}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-green-600">
                          Rp {map.storeProducts[0].price}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center mt-10 gap-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
            >
              &larr; Sebelumnya
            </button>
            <span className="text-gray-700 text-lg">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
            >
              Selanjutnya &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllProductsPage;
