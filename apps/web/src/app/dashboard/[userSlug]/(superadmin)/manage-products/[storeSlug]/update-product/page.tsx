'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Product } from '@/types/types';

const UpdateProductForm: React.FC = () => {
  const { storeSlug } = useParams();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [stock, setStock] = useState<number>(100);
  const [price, setPrice] = useState<number>(50000);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
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
        setProductList(data.data);
      } catch (error: unknown) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      }
    };

    fetchProducts();
  }, [storeSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/update-product-in-store/${storeSlug}`,
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
    } catch (error: unknown) {
      setError(`Error updating product: ${error}`);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Update Product in {storeSlug}
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product" className="block text-lg font-medium">
            Select Product
          </label>
          <select
            id="product"
            name="product"
            value={selectedProductId ?? ''}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
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
          <label htmlFor="stock" className="block text-lg font-medium">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
            min={1}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-lg font-medium">
            Price (Rp)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
            min={0}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md"
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
