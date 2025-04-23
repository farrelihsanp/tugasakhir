'use client';

import { useStoreContext } from '@/utility/StoreContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const ProductsPage = () => {
  const { cheapProducts, loading, error, nearestStore, storeStoreAdmin, user } =
    useStoreContext();

  const storeSlugStoreAdmin = storeStoreAdmin?.slug;
  const storeSlugToUse =
    user?.role === 'STOREADMIN' ? storeSlugStoreAdmin : nearestStore?.slug;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const totalPages = Math.ceil((cheapProducts?.length || 0) / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = cheapProducts?.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  const handleAddToCart = async (productId: number) => {
    if (!storeSlugToUse) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/cart/add/${storeSlugToUse}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to add product');
        return;
      }

      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <section>
      <div className="px-4 md:px-8 mx-auto mt-16">
        <h1 className="text-2xl font-bold mb-10 text-left">Cheap Products</h1>

        {error ? (
          <p className="text-red-500 text-left">Error: {error}</p>
        ) : loading ? (
          <p className="text-left">Loading products...</p>
        ) : currentProducts && currentProducts.length > 0 ? (
          <>
            {/* Produk Grid */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                {currentProducts.map((map) => (
                  <div
                    key={map.id}
                    className="w-[200px] border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-300 relative"
                  >
                    {map.priceAfterDiscount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                    <Link
                      href={`/${storeSlugToUse}/product/${map.product.slug}`}
                    >
                      <div className="relative w-full h-40">
                        <Image
                          src={
                            map.product.ProductImages[0]?.imageUrl ||
                            'https://dummyimage.com/600x400/90ee90/fff&text=DUMMY-PHOTO'
                          }
                          alt={map.product.name}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1 text-left">
                        {map.product.CategoryProduct[0]?.Category.name ||
                          'Product Category'}
                      </p>
                      <h2 className="text-base font-semibold text-left mb-2">
                        {map.product.name}
                      </h2>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                        <FaStar />
                        <span>4.5</span>
                        <span className="text-gray-400 text-xs">(100)</span>
                      </div>
                      <div className="text-left mb-2">
                        {map.priceAfterDiscount > 0 ? (
                          <>
                            <span className="line-through text-sm text-gray-400 mr-2">
                              Rp. {map.price.toLocaleString()}
                            </span>
                            <span className="text-red-600 font-semibold">
                              Rp. {map.priceAfterDiscount.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold">
                            Rp. {map.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-500 text-xs text-left mb-3">
                          {map.stock > 0
                            ? `Stock: ${map.stock}`
                            : 'Out of stock'}
                        </p>
                        {user?.role === 'CUSTOMERS' && map.stock > 0 ? (
                          <div className="flex justify-start">
                            <button
                              onClick={() => handleAddToCart(map.product.id)}
                              className="bg-primary text-white text-sm font-medium py-1.5 px-4 rounded hover:bg-green-700 transition"
                            >
                              + Add
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="self-center text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-left">No cheap products found.</p>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
