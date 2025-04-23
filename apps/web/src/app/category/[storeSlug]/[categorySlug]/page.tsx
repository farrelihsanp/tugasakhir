'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { StoreProduct, Store } from '@/types/types';

export default function ProdukPage() {
  const params = useParams();

  const storeSlug = params.storeSlug;
  const categorySlug = params.categorySlug;

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/productsBycategories/${storeSlug}/${categorySlug}`,
          {
            credentials: 'include',
            method: 'GET',
          },
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch products');
        }

        const data = await res.json();
        setProducts(data.data);
        setStore(data.store);
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (storeSlug && categorySlug) {
      fetchProducts();
    }
  }, [storeSlug, categorySlug]);

  if (isLoading)
    return <p className="text-center text-gray-600">Loading products...</p>;
  if (fetchError)
    return <p className="text-center text-red-500">Error: {fetchError}</p>;

  return (
    <section className="min-h-screen p-6 flex flex-col items-center justify-center mt-20">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
        Produk
        <br />
      </h2>
      <p className="text-5xl font-extrabold text-center text-primary mb-2">
        {store?.name}
      </p>
      <div className="flex justify-center items-center text-lg text-gray-600">
        <p className="font-semibold text-primary text-5xl mb-10">
          {categorySlug}
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {products.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 bg-white relative"
            >
              {item.priceAfterDiscount > 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
                  Sale
                </div>
              )}
              <Link
                href={`${process.env.NEXT_PUBLIC_WEB_DOMAIN}/${storeSlug}/product/${item.product.slug}`}
                className="block"
              >
                <div className="relative w-full h-52">
                  <Image
                    src={
                      item.product.ProductImages?.[0]?.imageUrl ||
                      'https://dummyimage.com/600x400/90ee90/fff&text=Product'
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {item.product.CategoryProduct[0].Category.name ||
                      'No Category'}
                  </p>
                  <h2 className="text-base font-semibold truncate mb-1 text-tertiary">
                    {item.product.name}
                  </h2>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                    <FaStar />
                    <span>4.5</span>
                    <span className="text-gray-400 text-xs">(100)</span>
                  </div>
                  <div className="text-sm mb-2">
                    {item.priceAfterDiscount > 0 ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">
                          Rp {item.price}
                        </span>
                        <span className="text-primary font-semibold">
                          Rp {item.priceAfterDiscount}
                        </span>
                      </>
                    ) : (
                      <span className="text-primary font-semibold">
                        Rp {item.price}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    Stok: {item.stock}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
