'use client';

import React, { useState, useEffect } from 'react';
import { useStoreContext } from '@/utility/StoreContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Product } from '@/types/types';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { products, loading, error, nearestStore, categories, user } =
    useStoreContext();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    // If additional logic is required to fetch products, implement it here
  }, [selectedCategory, searchQuery]);

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

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/cart/add/${nearestStore.slug}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast.success('Product added to cart successfully!');
      } else {
        toast.error(data.error || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('error:' + error);
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center items-center bg-quaternary">
      <h1 className="text-4xl font-bold mb-8 text-center text-tertiary">
        All Products <br />
        <span className="text-primary text-5xl">{nearestStore.name}</span>
      </h1>

      <div className="mb-6 w-full max-w-xl">
        <input
          type="text"
          placeholder="Cari produk..."
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

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          Tidak ada produk yang ditemukan.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
            {currentProducts.map((map) => (
              <div
                key={map.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition relative bg-white"
              >
                {map.storeProducts[0].priceAfterDiscount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Sale
                  </div>
                )}

                <Link
                  href={`/${nearestStore.slug}/product/${map.slug}`}
                  className="block"
                >
                  <div className="relative w-full h-52">
                    <Image
                      src={
                        map.ProductImages?.[0]?.imageUrl ||
                        'https://dummyimage.com/600x400/90ee90/fff&text=Product'
                      }
                      alt={map.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      {map.CategoryProduct[0]?.Category.name || 'Kategori'}
                    </p>
                    <h2 className="text-base font-semibold truncate mb-1 text-tertiary">
                      {map.name}
                    </h2>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                      {map.excerpt}
                    </p>
                    <div className="text-sm mb-2">
                      {map.storeProducts[0].priceAfterDiscount > 0 ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">
                            Rp {map.storeProducts[0].price}
                          </span>
                          <span className="text-primary font-semibold">
                            Rp {map.storeProducts[0].priceAfterDiscount}
                          </span>
                        </>
                      ) : (
                        <span className="text-primary font-semibold">
                          Rp {map.storeProducts[0].price}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      {map.storeProducts[0].stock > 0
                        ? `Stok: ${map.storeProducts[0].stock}`
                        : 'Out of stock'}
                    </div>
                    <div className="mt-3">
                      <div className="mt-3">
                        {user?.role === 'CUSTOMERS' && (
                          <button
                            className="bg-primary text-quaternary w-full text-sm font-medium py-2 px-4 rounded hover:bg-green-700 transition"
                            onClick={() => handleAddToCart(map)}
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-10 gap-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-tertiary text-white rounded-full disabled:opacity-50 hover:bg-yellow-600 transition"
            >
              <FaChevronLeft size={18} />
            </button>

            <span className="text-tertiary text-sm font-semibold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 bg-tertiary text-white rounded-full disabled:opacity-50 hover:bg-yellow-600 transition"
            >
              <FaChevronRight size={18} />
            </button>
          </div>
        </>
      )}

      <div className="text-center mt-6">
        <Link
          href={`/dashboard/${user?.username}/manage-products/${nearestStore.slug}/update-product`}
          className="px-6 py-2 bg-primary text-white rounded-md"
        >
          Update Product Data
        </Link>
      </div>
    </div>
  );
};

export default ProductPage;
