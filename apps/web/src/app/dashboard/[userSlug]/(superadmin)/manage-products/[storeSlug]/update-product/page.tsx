'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Product, Store } from '@/types/types';
import { useRouter } from 'next/navigation';

const UpdateProductForm: React.FC = () => {
  const router = useRouter();
  const { storeSlug } = useParams();

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [stock, setStock] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [store, setStore] = useState<Store | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/products-store-slug/${storeSlug}`,
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
        setProductList(data.data);
      } catch (error: unknown) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      }
    };

    const fetchStore = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/stores/store-slug/${storeSlug}`,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/update-product-in-store/${storeSlug}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stock, price, productId: selectedProductId }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      toast.success('Product updated successfully');
      router.back();
    } catch (error: unknown) {
      setError(`Error updating product: ${error}`);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Update Product in <span className="text-primary">{store?.name}</span>
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="product"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Select Product
          </label>
          <select
            id="product"
            name="product"
            value={selectedProductId ?? ''}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select a product</option>
            {productList.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            min={1}
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Price (Rp)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            min={0}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading || !selectedProductId}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
