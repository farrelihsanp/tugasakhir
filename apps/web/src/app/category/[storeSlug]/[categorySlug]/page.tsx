'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface ProductImage {
  id: string;
  imageUrl: string;
}

interface Product {
  id: string;
  name: string;
  ProductImages: ProductImage[];
}

interface StoreProduct {
  id: string;
  product: Product;
}

export default function ProdukPage() {
  const params = useParams();

  const storeSlug = params.storeSlug;
  const categorySlug = params.categorySlug;

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/productsBycategories/${storeSlug}/${categorySlug}`,
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

  if (isLoading) return <p>Loading products...</p>;
  if (fetchError) return <p>Error: {fetchError}</p>;

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4">Produk</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="border p-2 rounded shadow hover:shadow-md transition"
            >
              <Image
                src={
                  item.product.ProductImages?.[0]?.imageUrl || '/no-image.jpg'
                }
                alt={item.product.name}
                width={300}
                height={160}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <p className="font-medium">{item.product.name}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
