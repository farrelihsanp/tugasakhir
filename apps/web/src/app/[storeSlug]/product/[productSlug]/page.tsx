'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Store, Category, ProductImage } from '@/types/types';
import { useStoreContext } from '@/utility/StoreContext';
import { Role } from '@prisma/client';

type Product = {
  id: number;
  name: string;
  excerpt: string;
  description: string;
  slug: string;
  weight: number;
  ProductImages: ProductImage[];
  CategoryProduct: {
    Category: Category;
  }[];
};

type StoreProduct = {
  id: number;
  price: number;
  stock: number;
  isCheap: boolean;
  store: Store;
  product: Product;
};

export default function ProductDetailPage() {
  const { storeSlug, productSlug } = useParams() as {
    storeSlug: string;
    productSlug: string;
  };

  const { user } = useStoreContext();

  const [productData, setProductData] = useState<StoreProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/detail-product/${storeSlug}/${productSlug}`,
          {
            credentials: 'include',
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch product');
        }

        setProductData(data.data);
      } catch (err: unknown) {
        setError(String(err));
      }
    };

    if (storeSlug && productSlug) {
      fetchProduct();
    }
  }, [storeSlug, productSlug]);

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">
        Error: {error}
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="p-6 text-center font-medium">
        Loading product details...
      </div>
    );
  }

  const { product, price, stock } = productData;
  const total = Number(price) * qty;

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-4">DETAIL PRODUCT</h1>
      <h2 className="text-2xl font-semibold mb-6">{product.name}</h2>

      {/* Images */}
      <div className="flex flex-col items-center gap-4">
        {product.ProductImages[0] && (
          <Image
            src={product.ProductImages[0].imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-md object-cover"
          />
        )}

        <div className="grid grid-cols-3 gap-4">
          {product.ProductImages.slice(1, 4).map((img) => (
            <Image
              key={img.id}
              src={img.imageUrl}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="mt-6 text-sm text-gray-600 leading-relaxed">
        {product.description}
      </p>

      {/* Product Info */}
      <div className="text-left mt-6 space-y-1">
        <p>
          <span className="font-medium">Produk</span> : {product.name}
        </p>
        <p>
          <span className="font-medium">Harga</span> : Rp.
          {Number(price).toLocaleString('id-ID')}
        </p>
        <p>
          <span className="font-medium">Stock</span> : {stock} items
        </p>
        <p>
          <span className="font-medium">Berat</span> : {product.weight} gram
        </p>
      </div>

      {/* Quantity Selector & Total */}
      {user?.role === Role.CUSTOMERS && (
        <div className="flex items-center justify-center mt-6 gap-8">
          <div className="flex items-center gap-4 text-lg font-semibold">
            <button
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="w-10 h-10 rounded-full border text-xl"
            >
              -
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty((prev) => prev + 1)}
              className="w-10 h-10 rounded-full border text-xl"
            >
              +
            </button>
          </div>

          <div className="text-xl font-bold">
            Rp. {total.toLocaleString('id-ID')}
          </div>
        </div>
      )}

      {/* Add to Cart */}
      {user?.role === Role.CUSTOMERS && (
        <button className="mt-6 border border-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition">
          MASUKAN KE KERANJANG
        </button>
      )}

      {/* Category Info */}
      <div className="mt-10 text-left">
        <h3 className="text-lg font-semibold mb-2">Kategori Produk</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.CategoryProduct.map((cp) => (
            <div
              key={cp.Category.id}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <p className="font-bold">{cp.Category.name}</p>
              <p className="text-sm text-gray-700">{cp.Category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
